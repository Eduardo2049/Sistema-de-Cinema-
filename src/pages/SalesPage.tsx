import { Container, Row, Col } from 'react-bootstrap';
import { CompleteOrderForm } from '../components/orders/CompleteOrderForm';
import { OrdersList } from '../components/orders/OrdersList';
import { useOrders } from '../hooks/useOrders';
import { useSessions } from '../hooks/useSessions';
import { useRooms } from '../hooks/useRooms';

export const SalesPage = () => {
    const { orders, updateOrderStatus, refreshOrders } = useOrders();
    const { sessions } = useSessions();
    const { rooms } = useRooms();

    const handleOrderCreated = () => {
        console.log('Pedido criado, atualizando lista...');
        refreshOrders();
    };

    const handleUpdateStatus = async (orderId: string, newStatus: string) => {
        if (window.confirm(`Deseja realmente alterar o status do pedido para "${newStatus.toUpperCase()}"?`)) {
            await updateOrderStatus(orderId, newStatus as 'pendente' | 'confirmado' | 'cancelado');
            alert(`Status do pedido alterado para "${newStatus.toUpperCase()}" com sucesso!`);
        }
    };

    return (
        <Container fluid className="py-4">
            <Row>
                <Col lg={10} className="offset-lg-1">
                    <h1 className="mb-4">🎫 Vendas e Pedidos</h1>
                    <CompleteOrderForm 
                        sessions={sessions} 
                        rooms={rooms}
                        onOrderCreated={handleOrderCreated}
                    />
                    
                    <div className="mt-4">
                        <OrdersList 
                            orders={orders} 
                            onRefresh={refreshOrders}
                            onUpdateStatus={handleUpdateStatus}
                        />
                    </div>
                </Col>
            </Row>
        </Container>
    );
};
