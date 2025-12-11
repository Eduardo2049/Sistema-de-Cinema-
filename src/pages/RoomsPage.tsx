import { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { RoomForm } from '../components/rooms/RoomForm';
import { RoomList } from '../components/rooms/RoomList';
import { useRooms } from '../hooks/useRooms';
import { Room } from '../types';

export const RoomsPage = () => {
    const { rooms, addRoom, updateRoom, removeRoom } = useRooms();
    const [editingRoom, setEditingRoom] = useState<Room | null>(null);

    const handleAddOrUpdateRoom = (room: Room) => {
        if (editingRoom && editingRoom.id) {
            updateRoom(editingRoom.id, room);
            setEditingRoom(null);
        } else {
            addRoom(room);
            alert('Sala cadastrada com sucesso!');
        }
    };

    const handleEditRoom = (room: Room) => {
        setEditingRoom(room);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingRoom(null);
    };

    return (
        <Container fluid className="py-4">
            <Row>
                <Col lg={10} className="offset-lg-1">
                    <h1 className="mb-4">🎭 Salas</h1>
                    <RoomForm 
                        onSubmit={handleAddOrUpdateRoom}
                        editingRoom={editingRoom}
                        onCancelEdit={handleCancelEdit}
                    />
                    <RoomList 
                        rooms={rooms} 
                        onRemove={removeRoom}
                        onEdit={handleEditRoom}
                    />
                </Col>
            </Row>
        </Container>
    );
};
