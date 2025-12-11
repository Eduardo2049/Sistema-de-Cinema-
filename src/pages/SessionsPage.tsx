import { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { SessionForm } from '../components/sessions/SessionForm';
import { SessionList } from '../components/sessions/SessionList';
import { useSessions } from '../hooks/useSessions';
import { useFilms } from '../hooks/useFilms';
import { useRooms } from '../hooks/useRooms';
import { Session } from '../types';

export const SessionsPage = () => {
    const { sessions, addSession, updateSession, removeSession } = useSessions();
    const { films } = useFilms();
    const { rooms } = useRooms();
    const [editingSession, setEditingSession] = useState<Session | null>(null);

    const handleAddOrUpdateSession = (session: Session) => {
        if (editingSession && editingSession.id) {
            updateSession(editingSession.id, session);
            alert('Sessão atualizada com sucesso!');
            setEditingSession(null);
        } else {
            addSession(session);
            alert('Sessão cadastrada com sucesso!');
        }
    };

    const handleEditSession = (session: Session) => {
        setEditingSession(session);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingSession(null);
    };

    return (
        <Container fluid className="py-4">
            <Row>
                <Col lg={10} className="offset-lg-1">
                    <h1 className="mb-4">⏰ Sessões</h1>
                    <SessionForm 
                        onSubmit={handleAddOrUpdateSession} 
                        films={films} 
                        rooms={rooms}
                        editingSession={editingSession}
                        onCancelEdit={handleCancelEdit}
                    />
                    <SessionList 
                        sessions={sessions} 
                        onRemove={removeSession}
                        onEdit={handleEditSession}
                    />
                </Col>
            </Row>
        </Container>
    );
};
