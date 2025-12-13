import { Card, ListGroup, Badge, Button } from 'react-bootstrap';
import { Film } from '../../types';

interface FilmListProps {
    films: Film[];
    onRemove: (id: string) => void;
    onEdit?: (film: Film) => void;
}

export const FilmList = ({ films, onRemove, onEdit }: FilmListProps) => {
    if (films.length === 0) {
        return (
            <Card>
                <Card.Body>
                    <Card.Title>Lista de Filmes</Card.Title>
                    <p className="text-muted">Nenhum filme cadastrado.</p>
                </Card.Body>
            </Card>
        );
    }

    const handleRemove = (id: string, title: string) => {
        if (window.confirm(`Deseja realmente remover o filme "${title}"?`)) {
            onRemove(id);
        }
    };

    return (
        <Card>
            <Card.Body>
                <Card.Title>Lista de Filmes</Card.Title>
                <ListGroup>
                    {films.map((film, index) => (
                        <ListGroup.Item key={index}>
                            <div className="d-flex justify-content-between align-items-start">
                                <div className="flex-grow-1">
                                    <h6 className="mb-1"><strong>{film.title}</strong></h6>
                                    <p className="mb-1 small">{film.description}</p>
                                    <div className="small text-muted">
                                        <Badge bg="secondary" className="me-1">{film.genre}</Badge>
                                        <Badge bg="info" className="me-1">Classificação: {film.rating}</Badge>
                                        <Badge bg="dark" className="me-1">{film.duration} min</Badge>
                                        <Badge bg="primary">Estreia: {film.releaseDate}</Badge>
                                    </div>
                                </div>
                                {film.id && (
                                    <div className="d-flex flex-column gap-1 ms-2">
                                        {onEdit && (
                                            <Button
                                                variant="warning"
                                                size="sm"
                                                onClick={() => onEdit(film)}
                                            >
                                                ✏️ Editar
                                            </Button>
                                        )}
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleRemove(film.id!, film.title)}
                                        >
                                            🗑️ Remover
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Card.Body>
        </Card>
    );
};
