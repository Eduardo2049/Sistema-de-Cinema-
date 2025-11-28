import { Container, Row, Col } from 'react-bootstrap';
import { SalesForm } from '../components/sales/SalesForm';
import { SalesList } from '../components/sales/SalesList';
import { useSales } from '../hooks/useSales';
import { useSessions } from '../hooks/useSessions';
import { Sale } from '../types';

export const SalesPage = () => {
    const { sales, addSale } = useSales();
    const { sessions } = useSessions();

    const handleAddSale = (sale: Sale) => {
        addSale(sale);
        alert('Venda realizada com sucesso!');
    };

    return (
        <Container fluid className="py-4">
            <Row>
                <Col lg={10} className="offset-lg-1">
                    <h1 className="mb-4">🎫 Vendas</h1>
                    <SalesForm onSubmit={handleAddSale} sessions={sessions} />
                    <SalesList sales={sales} />
                </Col>
            </Row>
        </Container>
    );
};
