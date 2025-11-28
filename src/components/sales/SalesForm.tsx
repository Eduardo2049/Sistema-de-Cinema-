import { useState, FormEvent, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { Sale, Session } from '../../types';

interface SalesFormProps {
    onSubmit: (sale: Sale) => void;
    sessions: Session[];
}

export const SalesForm = ({ onSubmit, sessions }: SalesFormProps) => {
    const [searchParams] = useSearchParams();
    const preselectedSession = searchParams.get('sessao');

    const [formData, setFormData] = useState({
        sessionId: preselectedSession ? parseInt(preselectedSession) : -1,
        customerName: '',
        customerEmail: '',
        ticketQuantity: 1
    });

    useEffect(() => {
        if (preselectedSession) {
            setFormData(prev => ({ ...prev, sessionId: parseInt(preselectedSession) }));
        }
    }, [preselectedSession]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (formData.sessionId === -1 || !formData.customerName ||
            !formData.customerEmail || !formData.ticketQuantity) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        const session = sessions[formData.sessionId];
        if (!session) {
            alert('Sessão inválida.');
            return;
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
            sessionId: -1,
            customerName: '',
            customerEmail: '',
            ticketQuantity: 1
        });
    };

    return (
        <Card className="mb-4">
            <Card.Body>
                <Card.Title>Vender Ingressos</Card.Title>
                <Form onSubmit={handleSubmit}>
                    <Row className="g-3">
                        <Col md={12}>
                            <Form.Group>
                                <Form.Label>Sessão *</Form.Label>
                                <Form.Select
                                    value={formData.sessionId}
                                    onChange={(e) => setFormData({ ...formData, sessionId: parseInt(e.target.value) })}
                                    required
                                >
                                    <option value="-1">Selecione uma sessão</option>
                                    {sessions.map((session, index) => (
                                        <option key={index} value={index}>
                                            {session.movieTitle} - {session.datetime} - Sala {session.roomName} - R$ {session.price.toFixed(2)}
                                        </option>
                                    ))}
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
                                    value={formData.sessionId >= 0 && sessions[formData.sessionId]
                                        ? `R$ ${(sessions[formData.sessionId].price * formData.ticketQuantity).toFixed(2)}`
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
