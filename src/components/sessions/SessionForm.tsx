import { useState, FormEvent, useEffect } from 'react';
import { Form, Button, Row, Col, Card, Alert } from 'react-bootstrap';
import { Session, Film, Room } from '../../types';

interface SessionFormProps {
    onSubmit: (session: Session) => void;
    films: Film[];
    rooms: Room[];
    editingSession?: Session | null;
    onCancelEdit?: () => void;
}

export const SessionForm = ({ onSubmit, films, rooms, editingSession, onCancelEdit }: SessionFormProps) => {
    const [formData, setFormData] = useState({
        movieId: '',
        roomId: '',
        datetime: '',
        price: 0,
        language: '',
        format: ''
    });

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        if (editingSession) {
            setFormData({
                movieId: editingSession.movieId,
                roomId: editingSession.roomId,
                datetime: editingSession.datetime,
                price: editingSession.price,
                language: editingSession.language,
                format: editingSession.format
            });
        }
    }, [editingSession]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setErrorMessage(null); // Limpar erro anterior

        if (!formData.movieId || !formData.roomId ||
            !formData.datetime || !formData.price || !formData.language || !formData.format) {
            setErrorMessage('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        const selectedFilm = films.find(f => f.id === formData.movieId);
        const selectedRoom = rooms.find(r => r.id === formData.roomId);

        if (!selectedFilm || !selectedRoom) {
            setErrorMessage('Filme ou sala não encontrados.');
            return;
        }

        // Validar se a sessão não é anterior à data atual
        const sessionDate = new Date(formData.datetime);
        const now = new Date();

        if (sessionDate <= now) {
            setErrorMessage('A sessão não pode ser agendada para uma data/hora no passado.');
            return;
        }

        const movieTitle = selectedFilm.title;
        const roomName = selectedRoom.name;

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
        if (!editingSession) {
            setFormData({
                movieId: '',
                roomId: '',
                datetime: '',
                price: 0,
                language: '',
                format: ''
            });
        }
    };

    const handleCancel = () => {
        setFormData({
            movieId: '',
            roomId: '',
            datetime: '',
            price: 0,
            language: '',
            format: ''
        });
        setErrorMessage(null);
        if (onCancelEdit) {
            onCancelEdit();
        }
    };

    return (
        <Card className="mb-4">
            <Card.Body>
                <Card.Title>{editingSession ? '✏️ Editar Sessão' : '➕ Adicionar Nova Sessão'}</Card.Title>

                {errorMessage && (
                    <Alert variant="danger" dismissible onClose={() => setErrorMessage(null)} className="mt-3">
                        <Alert.Heading>❌ Erro ao criar sessão</Alert.Heading>
                        <p style={{ whiteSpace: 'pre-line' }} className="mb-0">{errorMessage}</p>
                    </Alert>
                )}

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
                                <Form.Text className="text-muted">
                                    💡 A sessão deve ser agendada para uma <strong>data/hora futura</strong>
                                </Form.Text>
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

                        <Col md={editingSession ? 6 : 12}>
                            <Button type="submit" variant={editingSession ? "warning" : "success"} className="w-100">
                                {editingSession ? '✏️ Atualizar Sessão' : '💾 Salvar Sessão'}
                            </Button>
                        </Col>
                        {editingSession && (
                            <Col md={6}>
                                <Button type="button" variant="secondary" className="w-100" onClick={handleCancel}>
                                    ❌ Cancelar
                                </Button>
                            </Col>
                        )}
                    </Row>
                </Form>
            </Card.Body>
        </Card>
    );
};
