import { Container, Row, Col } from 'react-bootstrap';
import { SessionForm } from '../components/sessions/SessionForm';
import { SessionList } from '../components/sessions/SessionList';
import { useSessions } from '../hooks/useSessions';
import { useFilms } from '../hooks/useFilms';
import { useRooms } from '../hooks/useRooms';
import { Session } from '../types';

export const SessionsPage = () => {
    const { sessions, addSession, removeSession } = useSessions();
    const { films } = useFilms();
    const { rooms } = useRooms();

    const handleAddSession = (session: Session) => {
        addSession(session);
        alert('Sessão cadastrada com sucesso!');
    };

    return (
        <Container fluid className="py-4">
            <Row>
                <Col lg={10} className="offset-lg-1">
                    <h1 className="mb-4">⏰ Sessões</h1>
                    <SessionForm onSubmit={handleAddSession} films={films} rooms={rooms} />
                    <SessionList sessions={sessions} onRemove={removeSession} />
                </Col>
            </Row>
        </Container>
    );
};
