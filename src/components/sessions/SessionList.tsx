import { Card, ListGroup, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Session } from '../../types';

interface SessionListProps {
    sessions: Session[];
    onRemove: (index: number) => void;
}

export const SessionList = ({ sessions, onRemove }: SessionListProps) => {
    if (sessions.length === 0) {
        return (
            <Card>
                <Card.Body>
                    <Card.Title>Lista de Sessões</Card.Title>
                    <p className="text-muted">Nenhuma sessão cadastrada.</p>
                </Card.Body>
            </Card>
        );
    }

    const handleRemove = (index: number) => {
        if (window.confirm('Deseja realmente remover esta sessão?')) {
            onRemove(index);
        }
    };

    return (
        <Card>
            <Card.Body>
                <Card.Title>Lista de Sessões</Card.Title>
                <ListGroup>
                    {sessions.map((session, index) => (
                        <ListGroup.Item key={index}>
                            <div className="d-flex justify-content-between align-items-start">
                                <div className="flex-grow-1">
                                    <h6 className="mb-1"><strong>{session.movieTitle || 'Filme desconhecido'}</strong></h6>
                                    <p className="mb-1 small">Sala: {session.roomName || session.roomId}</p>
                                    <div className="small text-muted">
                                        <Badge bg="primary" className="me-1">📅 {session.datetime}</Badge>
                                        <Badge bg="success" className="me-1">💰 R$ {session.price.toFixed(2)}</Badge>
                                        <Badge bg="info" className="me-1">{session.language}</Badge>
                                        <Badge bg="secondary">{session.format}</Badge>
                                    </div>
                                </div>
                                <div className="d-flex flex-column gap-1 ms-2">
                                    <Link to={`/vendas?sessao=${index}`} className="btn btn-sm btn-primary">
                                        Comprar Ingresso
                                    </Link>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleRemove(index)}
                                    >
                                        Remover
                                    </Button>
                                </div>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Card.Body>
        </Card>
    );
};
