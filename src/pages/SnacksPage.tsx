import { Container, Row, Col } from 'react-bootstrap';
import { SnackComboManager } from '../components/snacks/SnackComboManager';

export const SnacksPage = () => {
    return (
        <Container fluid className="py-4">
            <Row>
                <Col lg={10} className="offset-lg-1">
                    <SnackComboManager />
                </Col>
            </Row>
        </Container>
    );
};
