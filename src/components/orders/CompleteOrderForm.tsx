import { useState, FormEvent, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Form, Button, Row, Col, Card, Alert } from 'react-bootstrap';
import { Session, TicketQuantities, Room } from '../../types';
import { CinemaValidationService } from '../../services/cinema-validation.service';
import { TicketPricingService } from '../../services/ticket-pricing.service';
import { OrderService } from '../../services/order.service';
import { SeatMap } from '../seats/SeatMap';
import { SnackSelector } from '../snacks/SnackSelector';
import { useOccupiedSeats } from '../../hooks/useOccupiedSeats';

interface CompleteOrderFormProps {
    sessions: Session[];
    rooms: Room[];
    onOrderCreated?: () => void;
}

export const CompleteOrderForm = ({ sessions, rooms, onOrderCreated }: CompleteOrderFormProps) => {
    const [searchParams] = useSearchParams();
    const preselectedSession = searchParams.get('sessao');

    const [formData, setFormData] = useState({
        sessionId: preselectedSession || '',
        customerName: '',
        customerEmail: '',
        ticketQuantities: {
            inteira: 1,
            meia: 0
        } as TicketQuantities,
        paymentMethod: 'dinheiro'
    });

    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const [selectedSnacks, setSelectedSnacks] = useState<Array<{
        snackComboId: string;
        quantity: number;
        unitPrice: number;
        name: string;
    }>>([]);
    const [submitting, setSubmitting] = useState(false);
    const [lastSubmitTime, setLastSubmitTime] = useState<number>(0);

    const { occupiedSeats, loading: loadingSeats } = useOccupiedSeats(formData.sessionId || null);

    const availableSessions = useMemo(() => {
        return CinemaValidationService.filterAvailableSessions(sessions);
    }, [sessions]);

    const isSessionAvailable = (sessionId: string) => {
        return availableSessions.some(s => s.id === sessionId);
    };

    const currentSession = useMemo(() => {
        return sessions.find(s => s.id === formData.sessionId);
    }, [formData.sessionId, sessions]);

    const currentRoom = useMemo(() => {
        if (!currentSession) return null;
        return rooms.find(r => r.id === currentSession.roomId);
    }, [currentSession, rooms]);

    const totalTickets = useMemo(() => {
        return TicketPricingService.getTotalTickets(formData.ticketQuantities);
    }, [formData.ticketQuantities]);

    const ticketTotal = useMemo(() => {
        if (!currentSession) return 0;
        return TicketPricingService.calculateTotalPrice(
            currentSession.price,
            formData.ticketQuantities
        ).total;
    }, [currentSession, formData.ticketQuantities]);

    const snackTotal = useMemo(() => {
        return selectedSnacks.reduce((total, snack) => {
            return total + (snack.unitPrice * snack.quantity);
        }, 0);
    }, [selectedSnacks]);

    const grandTotal = ticketTotal + snackTotal;

    useEffect(() => {
        if (preselectedSession) {
            setFormData(prev => ({ ...prev, sessionId: preselectedSession }));
        }
    }, [preselectedSession]);

    useEffect(() => {
        setSelectedSeats([]);
        setSelectedSnacks([]);
    }, [formData.sessionId]);

    useEffect(() => {
        if (selectedSeats.length > totalTickets) {
            setSelectedSeats(prev => prev.slice(0, totalTickets));
        }
    }, [totalTickets]);

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

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // Prevenir duplo submit (verificar se já foi enviado nos últimos 3 segundos)
        const now = Date.now();
        if (submitting || (now - lastSubmitTime < 3000)) {
            console.log('Submit já em andamento ou muito recente, ignorando...');
            return;
        }
        
        setLastSubmitTime(now);

        if (!formData.sessionId || !formData.customerName || !formData.customerEmail) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        if (!isSessionAvailable(formData.sessionId)) {
            alert('A sessão selecionada não está mais disponível.');
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

        // Validar seleção de poltronas (se sala tiver layout)
        if (currentRoom?.seatLayout && selectedSeats.length !== totalTickets) {
            alert(`Por favor, selecione ${totalTickets} poltrona(s) no mapa.`);
            return;
        }

        try {
            setSubmitting(true);
            console.log('Criando pedido...');

            const order = await OrderService.createOrder({
                customerName: formData.customerName,
                customerEmail: formData.customerEmail,
                sessionId: formData.sessionId,
                sessionPrice: session.price,
                ticketQuantities: formData.ticketQuantities,
                selectedSeats: currentRoom?.seatLayout ? selectedSeats : undefined,
                snacks: selectedSnacks.map(s => ({
                    snackComboId: s.snackComboId,
                    quantity: s.quantity,
                    unitPrice: s.unitPrice
                })),
                paymentMethod: formData.paymentMethod
            });

            console.log('Pedido criado com sucesso:', order.id);
            alert(`✅ Pedido criado com sucesso!\n\nPedido #${order.id?.substring(0, 8)}\nTotal: ${OrderService.formatPrice(order.totalAmount)}`);

            // Reset form
            setFormData({
                sessionId: '',
                customerName: '',
                customerEmail: '',
                ticketQuantities: { inteira: 1, meia: 0 },
                paymentMethod: 'dinheiro'
            });
            setSelectedSeats([]);
            setSelectedSnacks([]);

            // Aguardar um pouco antes de notificar (evitar race condition)
            setTimeout(() => {
                if (onOrderCreated) {
                    console.log('Notificando atualização da lista...');
                    onOrderCreated();
                }
            }, 500);

        } catch (error) {
            console.error('Erro ao criar pedido:', error);
            alert('Erro ao criar pedido. Tente novamente.');
        } finally {
            setSubmitting(false);
            console.log('Submit finalizado');
        }
    };

    return (
        <Card className="mb-4">
            <Card.Body>
                <Card.Title>🎫 Novo Pedido Completo</Card.Title>

                {sessions.length === 0 && (
                    <Alert variant="warning">
                        <strong>⚠️ Nenhuma sessão cadastrada</strong>
                        <p className="mb-0">Não há sessões cadastradas no sistema.</p>
                    </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                    <Row className="g-3">
                        {/* Seleção de Sessão */}
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
                                            <option key={session.id} value={session.id}>
                                                {isAvailable ? '🟣' : '⚪'} {session.movieTitle} - {date} às {time} - Sala {session.roomName} - R$ {session.price.toFixed(2)}
                                            </option>
                                        );
                                    })}
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        {/* Dados do Cliente */}
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

                        {/* Ingressos */}
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
                                {currentSession && (
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
                                {currentSession && (
                                    <Form.Text className="text-muted">
                                        {TicketPricingService.formatPrice(currentSession.price * 0.5)} cada (50%)
                                    </Form.Text>
                                )}
                            </Form.Group>
                        </Col>

                        {/* Mapa de Poltronas */}
                        {formData.sessionId && currentRoom?.seatLayout && (
                            <Col md={12}>
                                <Card className="mt-3">
                                    <Card.Header><strong>🪑 Seleção de Poltronas</strong></Card.Header>
                                    <Card.Body>
                                        {loadingSeats ? (
                                            <div className="text-center py-4">
                                                <div className="spinner-border text-primary" role="status">
                                                    <span className="visually-hidden">Carregando...</span>
                                                </div>
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

                        {/* Seletor de Lanches */}
                        {formData.sessionId && (
                            <Col md={12}>
                                <SnackSelector
                                    selectedSnacks={selectedSnacks}
                                    onSnacksChange={setSelectedSnacks}
                                />
                            </Col>
                        )}

                        {/* Forma de Pagamento */}
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Forma de Pagamento</Form.Label>
                                <Form.Select
                                    value={formData.paymentMethod}
                                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                >
                                    <option value="dinheiro">💵 Dinheiro</option>
                                    <option value="credito">💳 Cartão de Crédito</option>
                                    <option value="debito">💳 Cartão de Débito</option>
                                    <option value="pix">📱 PIX</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        {/* Resumo Final */}
                        {formData.sessionId && currentSession && (
                            <Col md={12}>
                                <Alert variant="info" className="mb-0">
                                    <strong>📊 Resumo do Pedido:</strong>
                                    <hr />

                                    {/* Ingressos */}
                                    <div className="mb-2">
                                        <strong>🎫 Ingressos:</strong>
                                        <ul className="mb-0">
                                            {formData.ticketQuantities.inteira > 0 && (
                                                <li>{formData.ticketQuantities.inteira}x Inteira - {TicketPricingService.formatPrice(currentSession.price * formData.ticketQuantities.inteira)}</li>
                                            )}
                                            {formData.ticketQuantities.meia > 0 && (
                                                <li>{formData.ticketQuantities.meia}x Meia - {TicketPricingService.formatPrice(currentSession.price * 0.5 * formData.ticketQuantities.meia)}</li>
                                            )}
                                            {selectedSeats.length > 0 && (
                                                <li className="text-primary">Poltronas: {selectedSeats.join(', ')}</li>
                                            )}
                                        </ul>
                                        <strong>Subtotal Ingressos: {TicketPricingService.formatPrice(ticketTotal)}</strong>
                                    </div>

                                    {/* Lanches */}
                                    {selectedSnacks.length > 0 && (
                                        <div className="mb-2">
                                            <strong>🍿 Lanches:</strong>
                                            <ul className="mb-0">
                                                {selectedSnacks.map(snack => (
                                                    <li key={snack.snackComboId}>
                                                        {snack.quantity}x {snack.name} - {TicketPricingService.formatPrice(snack.unitPrice * snack.quantity)}
                                                    </li>
                                                ))}
                                            </ul>
                                            <strong>Subtotal Lanches: {TicketPricingService.formatPrice(snackTotal)}</strong>
                                        </div>
                                    )}

                                    <hr />
                                    <div className="fs-4 fw-bold text-success">
                                        💰 TOTAL: {TicketPricingService.formatPrice(grandTotal)}
                                    </div>
                                </Alert>
                            </Col>
                        )}

                        <Col md={12}>
                            <Button
                                type="submit"
                                variant="success"
                                className="w-100"
                                size="lg"
                                disabled={submitting || !formData.sessionId}
                            >
                                {submitting ? '⏳ Processando...' : '💳 Confirmar Pedido'}
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card.Body>
        </Card>
    );
};
