import { useState, useEffect } from 'react';
import { Session } from '../types';
import { SupabaseService } from '../services/supabase.service';

export const useSessions = () => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadSessions();
    }, []);

    const loadSessions = async () => {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await SupabaseService.getSessionsWithDetails();

        if (fetchError) {
            setError('Erro ao carregar sessões: ' + fetchError.message);
            console.error(fetchError);
        } else {
            // Converter campos snake_case para camelCase
            const sessionsFormatted = (data || []).map((session: any) => ({
                id: session.id,
                movieId: session.film_id,
                movieTitle: session.films?.title || 'Filme desconhecido',
                roomId: session.room_id,
                roomName: session.rooms?.name || 'Sala desconhecida',
                datetime: session.datetime,
                price: session.price,
                language: session.language,
                format: session.format,
                created_at: session.created_at
            }));
            setSessions(sessionsFormatted);
        }

        setLoading(false);
    };

    const addSession = async (session: Omit<Session, 'id' | 'created_at'>) => {
        setLoading(true);
        setError(null);

        // Converter camelCase para snake_case
        const { movieId, roomId, movieTitle, roomName, ...sessionRest } = session;
        const sessionData = {
            film_id: movieId,
            room_id: roomId,
            ...sessionRest
        };

        const { error: createError } = await SupabaseService.create<any>('sessions', sessionData);

        if (createError) {
            setError('Erro ao adicionar sessão: ' + createError.message);
            console.error(createError);
        } else {
            await loadSessions();
        }

        setLoading(false);
    };

    const updateSession = async (id: string, session: Partial<Session>) => {
        setLoading(true);
        setError(null);

        // Converter camelCase para snake_case
        const sessionData: any = {};
        
        if (session.movieId) sessionData.film_id = session.movieId;
        if (session.roomId) sessionData.room_id = session.roomId;
        if (session.datetime) sessionData.datetime = session.datetime;
        if (session.price !== undefined) sessionData.price = session.price;
        if (session.language) sessionData.language = session.language;
        if (session.format) sessionData.format = session.format;

        const { error: updateError } = await SupabaseService.update('sessions', id, sessionData);

        if (updateError) {
            setError('Erro ao atualizar sessão: ' + updateError.message);
            console.error(updateError);
        } else {
            await loadSessions();
        }

        setLoading(false);
    };

    const removeSession = async (id: string) => {
        setLoading(true);
        setError(null);

        const { error: deleteError } = await SupabaseService.delete('sessions', id);

        if (deleteError) {
            setError('Erro ao remover sessão: ' + deleteError.message);
            console.error(deleteError);
        } else {
            await loadSessions();
        }

        setLoading(false);
    };

    return {
        sessions,
        loading,
        error,
        addSession,
        updateSession,
        removeSession,
        refreshSessions: loadSessions
    };
};
