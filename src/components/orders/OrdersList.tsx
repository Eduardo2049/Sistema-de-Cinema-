import { Card, Table, Badge, Button, Alert, Dropdown } from 'react-bootstrap';
import { Order } from '../../types';
import { OrderService } from '../../services/order.service';

interface OrdersListProps {
    orders: Order[];
    onRefresh?: () => void;
    onUpdateStatus?: (orderId: string, newStatus: string) => void;
}

export const OrdersList = ({ orders, onRefresh, onUpdateStatus }: OrdersListProps) => {
    const getStatusBadge = (status: string) => {
        const variants: Record<string, string> = {
            pendente: 'warning',
            confirmado: 'success',
            cancelado: 'danger'
        };
        return <Badge bg={variants[status] || 'secondary'}>{status.toUpperCase()}</Badge>;
    };

    const getPaymentIcon = (method?: string) => {
        const icons: Record<string, string> = {
            dinheiro: '💵',
            credito: '💳',
            debito: '💳',
            pix: '📱'
        };
        return icons[method || 'dinheiro'] || '💰';
    };

    if (orders.length === 0) {
        return (
            <Alert variant="info">
                <strong>ℹ️ Nenhum pedido realizado</strong>
                <p className="mb-0">Os pedidos aparecerão aqui após serem criados.</p>
            </Alert>
        );
    }

    return (
        <Card>
            <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <Card.Title className="mb-0">📦 Lista de Pedidos</Card.Title>
                    {onRefresh && (
                        <Button variant="outline-primary" size="sm" onClick={onRefresh}>
                            🔄 Atualizar
                        </Button>
                    )}
                </div>
                
                <Table responsive hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Cliente</th>
                            <th>Sessão</th>
                            <th>Ingressos</th>
                            <th>Lanches</th>
                            <th>Total</th>
                            <th>Pagamento</th>
                            <th>Status</th>
                            <th>Data</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td>
                                    <code className="small">{order.id?.substring(0, 8)}...</code>
                                </td>
                                <td>
                                    <div>
                                        <strong>{order.customerName}</strong>
                                        <div className="small text-muted">{order.customerEmail}</div>
                                    </div>
                                </td>
                                <td>
                                    <div className="small">
                                        <strong>{order.sessionInfo || 'N/A'}</strong>
                                    </div>
                                </td>
                                <td>
                                    <div className="small">
                                        {order.tickets && order.tickets.length > 0 ? (
                                            <>
                                                {order.tickets.filter(t => t.ticketType === 'inteira').length > 0 && (
                                                    <div>🎫 {order.tickets.filter(t => t.ticketType === 'inteira').length} Inteira</div>
                                                )}
                                                {order.tickets.filter(t => t.ticketType === 'meia').length > 0 && (
                                                    <div>🎫 {order.tickets.filter(t => t.ticketType === 'meia').length} Meia</div>
                                                )}
                                                {order.tickets.some(t => t.seatNumber) && (
                                                    <div className="text-primary">
                                                        🪑 {order.tickets.filter(t => t.seatNumber).map(t => t.seatNumber).join(', ')}
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <span className="text-muted">-</span>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    <div className="small">
                                        {order.snacks && order.snacks.length > 0 ? (
                                            order.snacks.map((snack, idx) => (
                                                <div key={idx}>
                                                    🍿 {snack.quantity}x {snack.snackComboName || 'Lanche'}
                                                </div>
                                            ))
                                        ) : (
                                            <span className="text-muted">-</span>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <strong>{OrderService.formatPrice(order.totalAmount)}</strong>
                                        {order.totalTickets > 0 && (
                                            <div className="small text-muted">
                                                Ing: {OrderService.formatPrice(order.totalTickets)}
                                            </div>
                                        )}
                                        {order.totalSnacks > 0 && (
                                            <div className="small text-muted">
                                                Lanc: {OrderService.formatPrice(order.totalSnacks)}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="text-center">
                                    <div className="fs-5">{getPaymentIcon(order.paymentMethod)}</div>
                                    <div className="small text-muted">{order.paymentMethod || 'N/A'}</div>
                                </td>
                                <td>{getStatusBadge(order.status)}</td>
                                <td className="small text-muted">
                                    {order.created_at && new Date(order.created_at).toLocaleString('pt-BR', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </td>
                                <td>
                                    {onUpdateStatus && order.id && (
                                        <Dropdown>
                                            <Dropdown.Toggle variant="outline-secondary" size="sm" id={`dropdown-${order.id}`}>
                                                ⚙️
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <Dropdown.Item 
                                                    onClick={() => onUpdateStatus(order.id!, 'pendente')}
                                                    disabled={order.status === 'pendente'}
                                                >
                                                    ⏳ Marcar como Pendente
                                                </Dropdown.Item>
                                                <Dropdown.Item 
                                                    onClick={() => onUpdateStatus(order.id!, 'confirmado')}
                                                    disabled={order.status === 'confirmado'}
                                                >
                                                    ✅ Confirmar Pedido
                                                </Dropdown.Item>
                                                <Dropdown.Divider />
                                                <Dropdown.Item 
                                                    onClick={() => onUpdateStatus(order.id!, 'cancelado')}
                                                    disabled={order.status === 'cancelado'}
                                                    className="text-danger"
                                                >
                                                    ❌ Cancelar Pedido
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    );
};
