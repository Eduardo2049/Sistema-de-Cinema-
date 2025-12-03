import { Card, ListGroup, Badge, Button } from 'react-bootstrap';
import { Room } from '../../types';

interface RoomListProps {
    rooms: Room[];
    onRemove: (id: string) => void;
}

export const RoomList = ({ rooms, onRemove }: RoomListProps) => {
    if (rooms.length === 0) {
        return (
            <Card>
                <Card.Body>
                    <Card.Title>Lista de Salas</Card.Title>
                    <p className="text-muted">Nenhuma sala cadastrada.</p>
                </Card.Body>
            </Card>
        );
    }

    const handleRemove = (id: string | undefined, name: string) => {
        if (!id) {
            alert('Erro: ID da sala não encontrado');
            return;
        }
        if (window.confirm(`Deseja realmente remover a sala "${name}"?`)) {
            onRemove(id);
        }
    };

    return (
        <Card>
            <Card.Body>
                <Card.Title>Lista de Salas</Card.Title>
                <ListGroup>
                    {rooms.map((room, index) => (
                        <ListGroup.Item key={index}>
                            <div className="d-flex justify-content-between align-items-start">
                                <div className="flex-grow-1">
                                    <h6 className="mb-1"><strong>Sala {room.name}</strong></h6>
                                    <div className="small text-muted">
                                        <Badge bg="primary" className="me-1">Tipo: {room.type}</Badge>
                                        <Badge bg="success">Capacidade: {room.capacity} lugares</Badge>
                                    </div>
                                </div>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    className="ms-2"
                                    onClick={() => handleRemove(room.id, room.name)}
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
