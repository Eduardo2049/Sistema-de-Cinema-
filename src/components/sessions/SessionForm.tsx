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
        movieId: '',
        roomId: '',
        datetime: '',
        price: 0,
        language: '',
        format: ''
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (!formData.movieId || !formData.roomId ||
            !formData.datetime || !formData.price || !formData.language || !formData.format) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        const selectedFilm = films.find(f => f.id === formData.movieId);
        const selectedRoom = rooms.find(r => r.id === formData.roomId);
        const movieTitle = selectedFilm?.title || '';
        const roomName = selectedRoom?.name || '';

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
            movieId: '',
            roomId: '',
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
                                    onChange={(e) => setFormData({ ...formData, movieId: e.target.value })}
                                    required
                                >
                                    <option value="">Selecione um filme</option>
                                    {films.map((film) => (
                                        <option key={film.id} value={film.id}>
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
                                    onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                                    required
                                >
                                    <option value="">Selecione uma sala</option>
                                    {rooms.map((room) => (
                                        <option key={room.id} value={room.id}>
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
