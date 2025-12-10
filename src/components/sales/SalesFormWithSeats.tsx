import { useState, FormEvent, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Form, Button, Row, Col, Card, Alert } from 'react-bootstrap';
import { Sale, Session, TicketQuantities, Room } from '../../types';
import { CinemaValidationService } from '../../services/cinema-validation.service';
import { TicketPricingService } from '../../services/ticket-pricing.service';
import { SeatMap } from '../seats/SeatMap';
import { useOccupiedSeats } from '../../hooks/useOccupiedSeats';

interface SalesFormWithSeatsProps {
    onSubmit: (sale: Sale, selectedSeats?: string[]) => void;
    sessions: Session[];
    rooms: Room[];
}

export const SalesFormWithSeats = ({ onSubmit, sessions, rooms }: SalesFormWithSeatsProps) => {
    const [searchParams] = useSearchParams();
    const preselectedSession = searchParams.get('sessao');

    const [formData, setFormData] = useState({
        sessionId: preselectedSession || '',
        customerName: '',
        customerEmail: '',
        ticketQuantities: {
            inteira: 1,
            meia: 0
        } as TicketQuantities
    });

    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

    // Buscar poltronas ocupadas
    const { occupiedSeats, loading: loadingSeats } = useOccupiedSeats(formData.sessionId || null);

    // Filtrar apenas sessões disponíveis
    const availableSessions = useMemo(() => {
        return CinemaValidationService.filterAvailableSessions(sessions);
    }, [sessions]);

    // Verificar se uma sessão está disponível
    const isSessionAvailable = (sessionId: string) => {
        return availableSessions.some(s => s.id === sessionId);
    };

    // Obter sala da sessão selecionada
    const currentSession = useMemo(() => {
        return sessions.find(s => s.id === formData.sessionId);
    }, [formData.sessionId, sessions]);

    const currentRoom = useMemo(() => {
        if (!currentSession) return null;
        return rooms.find(r => r.id === currentSession.roomId);
    }, [currentSession, rooms]);

    // Total de ingressos
    const totalTickets = useMemo(() => {
        return TicketPricingService.getTotalTickets(formData.ticketQuantities);
    }, [formData.ticketQuantities]);

    useEffect(() => {
        if (preselectedSession) {
            setFormData(prev => ({ ...prev, sessionId: preselectedSession }));
        }
    }, [preselectedSession]);

    // Resetar poltronas selecionadas quando mudar sessão
    useEffect(() => {
        setSelectedSeats([]);
    }, [formData.sessionId]);

    // Sincronizar poltronas selecionadas com quantidade de ingressos
    useEffect(() => {
        if (selectedSeats.length > totalTickets) {
            setSelectedSeats(prev => prev.slice(0, totalTickets));
        }
    }, [totalTickets, selectedSeats.length]);

    const handleSeatSelect = (seatId: string) => {
        setSelectedSeats(prev => {
            if (prev.includes(seatId)) {
                return prev.filter(id => id !== seatId);
            }
            if (prev.length >= totalTickets) {
                return prev;
            }
            return [...prev, seatId];
        });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (!formData.sessionId || !formData.customerName || !formData.customerEmail) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        // Validar se a sessão selecionada está disponível
        if (!isSessionAvailable(formData.sessionId)) {
            alert('A sessão selecionada não está mais disponível. Por favor, escolha uma sessão futura.');
            return;
        }

        const session = sessions.find(s => s.id === formData.sessionId);
        if (!session) {
            alert('Sessão inválida.');
            return;
        }

        // Validar ingressos
        const ticketValidation = TicketPricingService.validateTicketSale(
            session.price,
            formData.ticketQuantities
        );

        if (!ticketValidation.isValid) {
            alert('Erro na validação dos ingressos:\n\n' + ticketValidation.errors.join('\n'));
            return;
        }

        // Validar seleção de poltronas (se habilitado)
        if (currentRoom?.seatLayout) {
            if (selectedSeats.length !== totalTickets) {
                alert(`Por favor, selecione ${totalTickets} poltrona(s) no mapa.`);
                return;
            }
        }

        // Calcular preços
        const pricing = TicketPricingService.calculateTotalPrice(
            session.price,
            formData.ticketQuantities
        );

        const sessionInfo = `${session.movieTitle} - ${session.datetime}`;

        const sale: Sale = {
            sessionId: formData.sessionId,
            sessionInfo,
            customerName: formData.customerName,
            customerEmail: formData.customerEmail,
            ticketQuantity: totalTickets,
            ticketInteiraQty: formData.ticketQuantities.inteira,
            ticketMeiaQty: formData.ticketQuantities.meia,
            ticketDetails: formData.ticketQuantities,
            totalPrice: pricing.total,
            purchaseDate: new Date().toISOString()
        };

        onSubmit(sale, selectedSeats.length > 0 ? selectedSeats : undefined);

        // Reset form
        setFormData({
            sessionId: '',
            customerName: '',
            customerEmail: '',
            ticketQuantities: {
                inteira: 1,
                meia: 0
            }
        });
        setSelectedSeats([]);
    };

    return (
        <Card className="mb-4">
            <Card.Body>
                <Card.Title>🎫 Vender Ingressos</Card.Title>

                {sessions.length === 0 && (
                    <Alert variant="warning">
                        <strong>⚠️ Nenhuma sessão cadastrada</strong>
                        <p className="mb-0">Não há sessões cadastradas no sistema. Cadastre sessões primeiro.</p>
                    </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                    <Row className="g-3">
                        <Col md={12}>
                            <Form.Group>
                                <Form.Label>Sessão *</Form.Label>
                                <Form.Select
                                    value={formData.sessionId}
                                    onChange={(e) => setFormData({ ...formData, sessionId: e.target.value })}
                                    required
                                    disabled={sessions.length === 0}
                                >
                                    <option value="">Selecione uma sessão</option>
                                    {sessions.map((session) => {
                                        const time = CinemaValidationService.formatSessionTime(session.datetime);
                                        const date = new Date(session.datetime).toLocaleDateString('pt-BR');
                                        const isAvailable = isSessionAvailable(session.id || '');
                                        return (
                                            <option
                                                key={session.id}
                                                value={session.id}
                                            >
                                                {isAvailable ? '🟣' : '⚪'} {session.movieTitle} - {date} às {time} - Sala {session.roomName} - R$ {session.price.toFixed(2)}
                                            </option>
                                        );
                                    })}
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Nome do Cliente *</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Digite o nome completo"
                                    value={formData.customerName}
                                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                    required
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>E-mail do Cliente *</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Digite o e-mail"
                                    value={formData.customerEmail}
                                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                                    required
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Ingressos Inteiros *</Form.Label>
                                <Form.Control
                                    type="number"
                                    min="0"
                                    value={formData.ticketQuantities.inteira}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        ticketQuantities: {
                                            ...formData.ticketQuantities,
                                            inteira: parseInt(e.target.value) || 0
                                        }
                                    })}
                                />
                                {formData.sessionId && currentSession && (
                                    <Form.Text className="text-muted">
                                        {TicketPricingService.formatPrice(currentSession.price)} cada
                                    </Form.Text>
                                )}
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Meias-Entradas</Form.Label>
                                <Form.Control
                                    type="number"
                                    min="0"
                                    value={formData.ticketQuantities.meia}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        ticketQuantities: {
                                            ...formData.ticketQuantities,
                                            meia: parseInt(e.target.value) || 0
                                        }
                                    })}
                                />
                                {formData.sessionId && currentSession && (
                                    <Form.Text className="text-muted">
                                        {TicketPricingService.formatPrice(currentSession.price * 0.5)} cada (50% de desconto)
                                    </Form.Text>
                                )}
                            </Form.Group>
                        </Col>

                        {/* Mapa de Poltronas */}
                        {formData.sessionId && currentRoom?.seatLayout && (
                            <Col md={12}>
                                <Card className="mt-3">
                                    <Card.Header>
                                        <strong>🪑 Seleção de Poltronas</strong>
                                    </Card.Header>
                                    <Card.Body>
                                        {loadingSeats ? (
                                            <div className="text-center py-4">
                                                <div className="spinner-border text-primary" role="status">
                                                    <span className="visually-hidden">Carregando...</span>
                                                </div>
                                                <p className="mt-2 text-muted">Carregando mapa de poltronas...</p>
                                            </div>
                                        ) : (
                                            <SeatMap
                                                roomLayout={currentRoom.seatLayout}
                                                occupiedSeats={occupiedSeats}
                                                selectedSeats={selectedSeats}
                                                onSeatSelect={handleSeatSelect}
                                                maxSeats={totalTickets}
                                            />
                                        )}
                                    </Card.Body>
                                </Card>
                            </Col>
                        )}

                        {/* Resumo da Compra */}
                        {formData.sessionId && currentSession && (
                            <Col md={12}>
                                <Alert variant="info" className="mb-0">
                                    <strong>📊 Resumo da Compra:</strong>
                                    <ul className="mb-0 mt-2">
                                        {formData.ticketQuantities.inteira > 0 && (
                                            <li>
                                                {formData.ticketQuantities.inteira} ingresso(s) inteiro(s): {' '}
                                                {TicketPricingService.formatPrice(
                                                    currentSession.price * formData.ticketQuantities.inteira
                                                )}
                                            </li>
                                        )}
                                        {formData.ticketQuantities.meia > 0 && (
                                            <li>
                                                {formData.ticketQuantities.meia} meia(s)-entrada(s): {' '}
                                                {TicketPricingService.formatPrice(
                                                    currentSession.price * 0.5 * formData.ticketQuantities.meia
                                                )}
                                            </li>
                                        )}
                                        {(formData.ticketQuantities.inteira > 0 || formData.ticketQuantities.meia > 0) && (
                                            <>
                                                <li className="fw-bold mt-2 text-primary">
                                                    Total de Ingressos: {totalTickets}
                                                </li>
                                                {selectedSeats.length > 0 && (
                                                    <li className="text-primary">
                                                        Poltronas: {selectedSeats.join(', ')}
                                                    </li>
                                                )}
                                                <li className="fw-bold text-success">
                                                    Valor Total: {' '}
                                                    {TicketPricingService.formatPrice(
                                                        TicketPricingService.calculateTotalPrice(
                                                            currentSession.price,
                                                            formData.ticketQuantities
                                                        ).total
                                                    )}
                                                </li>
                                                {formData.ticketQuantities.meia > 0 && (
                                                    <li className="text-muted small">
                                                        💰 Economia com meia-entrada: {' '}
                                                        {TicketPricingService.formatPrice(
                                                            TicketPricingService.calculateTotalDiscount(
                                                                currentSession.price,
                                                                formData.ticketQuantities
                                                            )
                                                        )}
                                                    </li>
                                                )}
                                            </>
                                        )}
                                    </ul>
                                </Alert>
                            </Col>
                        )}

                        <Col md={12}>
                            <Button type="submit" variant="success" className="w-100">
                                💳 Confirmar Venda
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card.Body>
        </Card>
    );
};
