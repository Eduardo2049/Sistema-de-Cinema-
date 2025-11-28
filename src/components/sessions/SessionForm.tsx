import { useState, FormEvent } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { Session, Film, Room } from '../../types';

interface SessionFormProps {
    onSubmit: (session: Session) => void;
    films: Film[];
    rooms: Room[];
}

export const SessionForm = ({ onSubmit, films, rooms }: SessionFormProps) => {
    const [formData, setFormData] = useState({
        movieId: -1,
        roomId: -1,
        datetime: '',
        price: 0,
        language: '',
        format: ''
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (formData.movieId === -1 || formData.roomId === -1 ||
            !formData.datetime || !formData.price || !formData.language || !formData.format) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        const movieTitle = films[formData.movieId]?.title || '';
        const roomName = rooms[formData.roomId]?.name || '';

        const session: Session = {
            movieId: formData.movieId,
            movieTitle,
            roomId: formData.roomId,
            roomName,
            datetime: formData.datetime,
            price: formData.price,
            language: formData.language,
            format: formData.format
        };

        onSubmit(session);

        // Reset form
        setFormData({
            movieId: -1,
            roomId: -1,
            datetime: '',
            price: 0,
            language: '',
            format: ''
        });
    };

    return (
        <Card className="mb-4">
            <Card.Body>
                <Card.Title>Adicionar Nova Sessão</Card.Title>
                <Form onSubmit={handleSubmit}>
                    <Row className="g-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Filme *</Form.Label>
                                <Form.Select
                                    value={formData.movieId}
                                    onChange={(e) => setFormData({ ...formData, movieId: parseInt(e.target.value) })}
                                    required
                                >
                                    <option value="-1">Selecione um filme</option>
                                    {films.map((film, index) => (
                                        <option key={index} value={index}>
                                            {film.title} - {film.genre} ({film.duration} min)
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Sala *</Form.Label>
                                <Form.Select
                                    value={formData.roomId}
                                    onChange={(e) => setFormData({ ...formData, roomId: parseInt(e.target.value) })}
                                    required
                                >
                                    <option value="-1">Selecione uma sala</option>
                                    {rooms.map((room, index) => (
                                        <option key={index} value={index}>
                                            Sala {room.name} - {room.type} ({room.capacity} lugares)
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Data e Hora *</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    value={formData.datetime}
                                    onChange={(e) => setFormData({ ...formData, datetime: e.target.value })}
                                    required
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Preço (R$) *</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="Ex: 25.00"
                                    value={formData.price || ''}
                                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                                    required
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Idioma *</Form.Label>
                                <Form.Select
                                    value={formData.language}
                                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                                    required
                                >
                                    <option value="">Selecione</option>
                                    <option value="Dublado">Dublado</option>
                                    <option value="Legendado">Legendado</option>
                                    <option value="Original">Original</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Formato *</Form.Label>
                                <Form.Select
                                    value={formData.format}
                                    onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                                    required
                                >
                                    <option value="">Selecione</option>
                                    <option value="2D">2D</option>
                                    <option value="3D">3D</option>
                                    <option value="IMAX">IMAX</option>
                                    <option value="4DX">4DX</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col md={12}>
                            <Button type="submit" variant="success" className="w-100">
                                Salvar Sessão
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card.Body>
        </Card>
    );
};
