import { Container, Row, Col } from 'react-bootstrap';
import { RoomForm } from '../components/rooms/RoomForm';
import { RoomList } from '../components/rooms/RoomList';
import { useRooms } from '../hooks/useRooms';
import { Room } from '../types';

export const RoomsPage = () => {
    const { rooms, addRoom, removeRoom } = useRooms();

    const handleAddRoom = (room: Room) => {
        addRoom(room);
        alert('Sala cadastrada com sucesso!');
    };

    return (
        <Container fluid className="py-4">
            <Row>
                <Col lg={10} className="offset-lg-1">
                    <h1 className="mb-4">🎭 Salas</h1>
                    <RoomForm onSubmit={handleAddRoom} />
                    <RoomList rooms={rooms} onRemove={removeRoom} />
                </Col>
            </Row>
        </Container>
    );
};
