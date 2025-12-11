import { Session } from '../types';

/**
 * Serviço de validações de negócio do cinema
 */
export class CinemaValidationService {

    /**
     * Filtra apenas sessões futuras (sem validação de horário específico)
     */
    static filterAvailableSessions(sessions: Session[]): Session[] {
        const now = new Date();

        return sessions.filter(session => {
            const sessionDate = new Date(session.datetime);
            const isFuture = sessionDate > now;

            // Retorna apenas sessões futuras
            return isFuture;
        });
    }

    /**
     * Calcula o horário de término de uma sessão
     * @param startTime - Horário de início da sessão
     * @param filmDuration - Duração do filme em minutos
     * @param cleaningTime - Tempo de limpeza/intervalo em minutos (padrão: 45min)
     */
    static calculateSessionEndTime(
        startTime: string,
        filmDuration: number,
        cleaningTime: number = 45
    ): Date {
        const start = new Date(startTime);
        const totalMinutes = filmDuration + cleaningTime;

        return new Date(start.getTime() + totalMinutes * 60000);
    }

    /**
     * Verifica se há conflito de horário entre duas sessões na mesma sala
     */
    static hasTimeConflict(
        newSession: { datetime: string; roomId: string },
        existingSessions: Session[],
        filmDuration: number
    ): { hasConflict: boolean; conflictingSession?: Session } {
        const newStart = new Date(newSession.datetime);
        const newEnd = this.calculateSessionEndTime(newSession.datetime, filmDuration);

        // Filtra apenas sessões da mesma sala
        const samRoomSessions = existingSessions.filter(
            s => s.roomId === newSession.roomId
        );

        for (const session of samRoomSessions) {
            const existingStart = new Date(session.datetime);

            // Precisamos da duração do filme da sessão existente
            // Por enquanto, vamos assumir um tempo padrão de 120min + 45min = 165min
            const existingEnd = new Date(existingStart.getTime() + 165 * 60000);

            // Verifica sobreposição de horários
            if (
                (newStart >= existingStart && newStart < existingEnd) ||
                (newEnd > existingStart && newEnd <= existingEnd) ||
                (newStart <= existingStart && newEnd >= existingEnd)
            ) {
                return { hasConflict: true, conflictingSession: session };
            }
        }

        return { hasConflict: false };
    }

    /**
     * Calcula quantos ingressos já foram vendidos para uma sessão
     */
    static async getSessionOccupancy(
        sessionId: string,
        sales: Array<{ sessionId: string; ticketQuantity: number }>
    ): Promise<number> {
        return sales
            .filter(sale => sale.sessionId === sessionId)
            .reduce((total, sale) => total + sale.ticketQuantity, 0);
    }

    /**
     * Valida se ainda há capacidade disponível na sala
     */
    static async validateRoomCapacity(
        sessionId: string,
        requestedTickets: number,
        roomCapacity: number,
        sales: Array<{ sessionId: string; ticketQuantity: number }>
    ): Promise<{ isValid: boolean; available: number; message?: string }> {
        const occupied = await this.getSessionOccupancy(sessionId, sales);
        const available = roomCapacity - occupied;

        if (requestedTickets > available) {
            return {
                isValid: false,
                available,
                message: `Apenas ${available} ingresso(s) disponível(is). Sala tem capacidade de ${roomCapacity} lugares e ${occupied} já foram vendidos.`
            };
        }

        return { isValid: true, available };
    }

    /**
     * Formata horário para exibição (apenas hora:minuto)
     */
    static formatSessionTime(datetime: string): string {
        const date = new Date(datetime);
        return date.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    /**
     * Formata data completa para exibição
     */
    static formatSessionDateTime(datetime: string): string {
        const date = new Date(datetime);
        return date.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    /**
     * Agrupa sessões por data
     */
    static groupSessionsByDate(sessions: Session[]): Map<string, Session[]> {
        const grouped = new Map<string, Session[]>();

        sessions.forEach(session => {
            const date = new Date(session.datetime);
            const dateKey = date.toLocaleDateString('pt-BR');

            if (!grouped.has(dateKey)) {
                grouped.set(dateKey, []);
            }

            grouped.get(dateKey)!.push(session);
        });

        return grouped;
    }

    /**
     * Valida se a sessão pode ser criada
     */
    static validateNewSession(
        sessionData: { datetime: string; roomId: string },
        existingSessions: Session[],
        filmDuration: number
    ): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        // Validar se é futura
        const sessionDate = new Date(sessionData.datetime);
        if (sessionDate <= new Date()) {
            errors.push('A sessão deve ser agendada para uma data/hora futura');
        }

        // Validar conflito de horários
        const conflict = this.hasTimeConflict(
            sessionData,
            existingSessions,
            filmDuration
        );

        if (conflict.hasConflict && conflict.conflictingSession) {
            const conflictTime = this.formatSessionDateTime(conflict.conflictingSession.datetime);
            errors.push(
                `Conflito de horário com sessão existente: ${conflict.conflictingSession.movieTitle} às ${conflictTime}`
            );
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Valida se a data da sessão está dentro do período válido:
     * - Não pode ser ANTES do lançamento do filme
     * - Não pode ser DEPOIS de 1 ano do lançamento
     */
    static validateSessionReleaseDate(
        sessionDatetime: string,
        filmReleaseDate: string
    ): { isValid: boolean; message?: string } {
        const sessionDate = new Date(sessionDatetime);
        const releaseDate = new Date(filmReleaseDate);

        // Zera as horas para comparar apenas as datas
        sessionDate.setHours(0, 0, 0, 0);
        releaseDate.setHours(0, 0, 0, 0);

        // Verifica se é ANTES do lançamento
        if (sessionDate < releaseDate) {
            const releaseDateFormatted = releaseDate.toLocaleDateString('pt-BR');
            return {
                isValid: false,
                message: `A sessão não pode ser antes da data de lançamento do filme (${releaseDateFormatted})`
            };
        }

        // Calcula 1 ano após o lançamento
        const oneYearAfterRelease = new Date(releaseDate);
        oneYearAfterRelease.setFullYear(oneYearAfterRelease.getFullYear() + 1);

        // Verifica se passou de 1 ano do lançamento
        if (sessionDate > oneYearAfterRelease) {
            const expirationDate = oneYearAfterRelease.toLocaleDateString('pt-BR');
            return {
                isValid: false,
                message: `O filme não está mais em cartaz. Período válido: até ${expirationDate} (1 ano após lançamento)`
            };
        }

        return { isValid: true };
    }
}
