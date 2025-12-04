import { useState, FormEvent, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Form, Button, Row, Col, Card, Alert } from 'react-bootstrap';
import { Sale, Session } from '../../types';
import { CinemaValidationService } from '../../services/cinema-validation.service';

interface SalesFormProps {
    onSubmit: (sale: Sale) => void;
    sessions: Session[];
}

export const SalesForm = ({ onSubmit, sessions }: SalesFormProps) => {
    const [searchParams] = useSearchParams();
    const preselectedSession = searchParams.get('sessao');

    const [formData, setFormData] = useState({
        sessionId: preselectedSession || '',
        customerName: '',
        customerEmail: '',
        ticketQuantity: 1
    });

    // Filtrar apenas sessões disponíveis (futuras e no horário de funcionamento)
    const availableSessions = useMemo(() => {
        return CinemaValidationService.filterAvailableSessions(sessions);
    }, [sessions]);

    // Verificar se uma sessão está disponível
    const isSessionAvailable = (sessionId: string) => {
        return availableSessions.some(s => s.id === sessionId);
    };

    useEffect(() => {
        if (preselectedSession) {
            setFormData(prev => ({ ...prev, sessionId: preselectedSession }));
        }
    }, [preselectedSession]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (!formData.sessionId || !formData.customerName ||
            !formData.customerEmail || !formData.ticketQuantity) {
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

        // TODO: Validar capacidade da sala
        // Por enquanto, vamos apenas avisar se a quantidade for muito alta
        if (formData.ticketQuantity > 100) {
            const confirmacao = window.confirm(
                `Atenção! Você está tentando comprar ${formData.ticketQuantity} ingressos.\n\n` +
                `Isso parece ser uma quantidade muito alta.\n\n` +
                `Deseja continuar mesmo assim?`
            );
            if (!confirmacao) {
                return;
            }
        }

        const totalPrice = session.price * formData.ticketQuantity;
        const sessionInfo = `${session.movieTitle} - ${session.datetime}`;

        const sale: Sale = {
            sessionId: formData.sessionId,
            sessionInfo,
            customerName: formData.customerName,
            customerEmail: formData.customerEmail,
            ticketQuantity: formData.ticketQuantity,
            totalPrice,
            purchaseDate: new Date().toISOString()
        };

        onSubmit(sale);

        // Reset form
        setFormData({
            sessionId: '',
            customerName: '',
            customerEmail: '',
            ticketQuantity: 1
        });
    };

    return (
        <Card className="mb-4">
            <Card.Body>
                <Card.Title>Vender Ingressos</Card.Title>

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
                                    style={{ color: formData.sessionId && !isSessionAvailable(formData.sessionId || '') ? '#6c757d' : 'inherit' }}
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
                                                style={{
                                                    color: isAvailable ? '#6f42c1' : '#6c757d',
                                                    fontWeight: isAvailable ? 'bold' : 'normal'
                                                }}
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
                                <Form.Label>Quantidade de Ingressos *</Form.Label>
                                <Form.Control
                                    type="number"
                                    min="1"
                                    value={formData.ticketQuantity}
                                    onChange={(e) => setFormData({ ...formData, ticketQuantity: parseInt(e.target.value) || 1 })}
                                    required
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Total</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.sessionId && sessions.find(s => s.id === formData.sessionId)
                                        ? `R$ ${(sessions.find(s => s.id === formData.sessionId)!.price * formData.ticketQuantity).toFixed(2)}`
                                        : 'R$ 0.00'}
                                    readOnly
                                />
                            </Form.Group>
                        </Col>

                        <Col md={12}>
                            <Button type="submit" variant="success" className="w-100">
                                Confirmar Venda
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card.Body>
        </Card>
    );
};
