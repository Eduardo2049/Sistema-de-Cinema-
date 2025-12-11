import { useState, FormEvent, useEffect } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { Film } from '../../types';

interface FilmFormProps {
    onSubmit: (film: Film) => void;
    editingFilm?: Film | null;
    onCancelEdit?: () => void;
}

export const FilmForm = ({ onSubmit, editingFilm, onCancelEdit }: FilmFormProps) => {
    const [formData, setFormData] = useState<Film>({
        title: '',
        description: '',
        genre: '',
        rating: '',
        duration: 0,
        releaseDate: ''
    });

    useEffect(() => {
        if (editingFilm) {
            setFormData(editingFilm);
        }
    }, [editingFilm]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.description || !formData.genre ||
            !formData.rating || !formData.duration || !formData.releaseDate) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        onSubmit(formData);

        // Reset form
        if (!editingFilm) {
            setFormData({
                title: '',
                description: '',
                genre: '',
                rating: '',
                duration: 0,
                releaseDate: ''
            });
        }
    };

    const handleCancel = () => {
        setFormData({
            title: '',
            description: '',
            genre: '',
            rating: '',
            duration: 0,
            releaseDate: ''
        });
        if (onCancelEdit) {
            onCancelEdit();
        }
    };

    return (
        <Card className="mb-4">
            <Card.Body>
                <Card.Title>{editingFilm ? '✏️ Editar Filme' : '➕ Adicionar Novo Filme'}</Card.Title>
                <Form onSubmit={handleSubmit}>
                    <Row className="g-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Título *</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Digite o título do filme"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </Form.Group>
                        </Col>

                        <Col md={3}>
                            <Form.Group>
                                <Form.Label>Gênero *</Form.Label>
                                <Form.Select
                                    value={formData.genre}
                                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                                    required
                                >
                                    <option value="">Selecione</option>
                                    <option value="Ação">Ação</option>
                                    <option value="Aventura">Aventura</option>
                                    <option value="Comédia">Comédia</option>
                                    <option value="Drama">Drama</option>
                                    <option value="Terror">Terror</option>
                                    <option value="Suspense">Suspense</option>
                                    <option value="Ficção Científica">Ficção Científica</option>
                                    <option value="Romance">Romance</option>
                                    <option value="Animação">Animação</option>
                                    <option value="Documentário">Documentário</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col md={3}>
                            <Form.Group>
                                <Form.Label>Classificação *</Form.Label>
                                <Form.Select
                                    value={formData.rating}
                                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                                    required
                                >
                                    <option value="">Selecione</option>
                                    <option value="L">Livre</option>
                                    <option value="10">10 anos</option>
                                    <option value="12">12 anos</option>
                                    <option value="14">14 anos</option>
                                    <option value="16">16 anos</option>
                                    <option value="18">18 anos</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col md={12}>
                            <Form.Group>
                                <Form.Label>Descrição *</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Digite a sinopse do filme"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </Form.Group>
                        </Col>

                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Duração (minutos) *</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Ex: 120"
                                    min="1"
                                    value={formData.duration || ''}
                                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                                    required
                                />
                            </Form.Group>
                        </Col>

                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Data de Estreia *</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={formData.releaseDate}
                                    onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                                    required
                                />
                            </Form.Group>
                        </Col>

                        <Col md={editingFilm ? 6 : 12}>
                            <Form.Label className="d-block">&nbsp;</Form.Label>
                            <Button type="submit" variant={editingFilm ? "warning" : "success"} className="w-100">
                                {editingFilm ? '✏️ Atualizar Filme' : '➕ Salvar Filme'}
                            </Button>
                        </Col>
                        {editingFilm && (
                            <Col md={6}>
                                <Form.Label className="d-block">&nbsp;</Form.Label>
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
