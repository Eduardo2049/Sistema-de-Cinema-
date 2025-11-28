import { Card, ListGroup, Badge, Button } from 'react-bootstrap';
import { Film } from '../../types';

interface FilmListProps {
    films: Film[];
    onRemove: (index: number) => void;
}

export const FilmList = ({ films, onRemove }: FilmListProps) => {
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

    const handleRemove = (index: number, title: string) => {
        if (window.confirm(`Deseja realmente remover o filme "${title}"?`)) {
            onRemove(index);
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
                                <Button
                                    variant="danger"
                                    size="sm"
                                    className="ms-2"
                                    onClick={() => handleRemove(index, film.title)}
                                >
                                    Remover
                                </Button>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Card.Body>
        </Card>
    );
};
