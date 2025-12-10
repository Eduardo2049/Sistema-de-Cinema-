import { Container, Row, Col } from 'react-bootstrap';
import { CompleteOrderForm } from '../components/orders/CompleteOrderForm';
import { SalesList } from '../components/sales/SalesList';
import { useSales } from '../hooks/useSales';
import { useSessions } from '../hooks/useSessions';
import { useRooms } from '../hooks/useRooms';

export const SalesPage = () => {
    const { sales } = useSales();
    const { sessions } = useSessions();
    const { rooms } = useRooms();

    return (
        <Container fluid className="py-4">
            <Row>
                <Col lg={10} className="offset-lg-1">
                    <h1 className="mb-4">🎫 Vendas e Pedidos</h1>
                    <CompleteOrderForm sessions={sessions} rooms={rooms} />
                    <SalesList sales={sales} />
                </Col>
            </Row>
        </Container>
    );
};
