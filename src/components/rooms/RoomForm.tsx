import { useState, FormEvent } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { Room } from '../../types';

interface RoomFormProps {
    onSubmit: (room: Room) => void;
}

export const RoomForm = ({ onSubmit }: RoomFormProps) => {
    const [formData, setFormData] = useState<Room>({
        name: '',
        type: '',
        capacity: 0
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.type || !formData.capacity) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        onSubmit(formData);

        // Reset form
        setFormData({
            name: '',
            type: '',
            capacity: 0
        });
    };

    return (
        <Card className="mb-4">
            <Card.Body>
                <Card.Title>Adicionar Nova Sala</Card.Title>
                <Form onSubmit={handleSubmit}>
                    <Row className="g-3">
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Nome/Número da Sala *</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ex: Sala 1, Sala VIP"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </Form.Group>
                        </Col>

                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Tipo *</Form.Label>
                                <Form.Select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    required
                                >
                                    <option value="">Selecione</option>
                                    <option value="2D">2D</option>
                                    <option value="3D">3D</option>
                                    <option value="IMAX">IMAX</option>
                                    <option value="4DX">4DX</option>
                                    <option value="VIP">VIP</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Capacidade (lugares) *</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Ex: 100"
                                    min="1"
                                    value={formData.capacity || ''}
                                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                                    required
                                />
                            </Form.Group>
                        </Col>

                        <Col md={12}>
                            <Button type="submit" variant="success" className="w-100">
                                Salvar Sala
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card.Body>
        </Card>
    );
};
