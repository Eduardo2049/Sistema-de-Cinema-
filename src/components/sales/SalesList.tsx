import { Card, ListGroup, Badge } from 'react-bootstrap';
import { Sale } from '../../types';
import { TicketPricingService } from '../../services/ticket-pricing.service';

interface SalesListProps {
    sales: Sale[];
}

export const SalesList = ({ sales }: SalesListProps) => {
    if (sales.length === 0) {
        return (
            <Card>
                <Card.Body>
                    <Card.Title>Lista de Vendas</Card.Title>
                    <p className="text-muted">Nenhuma venda realizada.</p>
                </Card.Body>
            </Card>
        );
    }

    return (
        <Card>
            <Card.Body>
                <Card.Title>Lista de Vendas</Card.Title>
                <ListGroup>
                    {sales.map((sale) => (
                        <ListGroup.Item key={sale.id}>
                            <div className="d-flex justify-content-between align-items-start">
                                <div className="flex-grow-1">
                                    <h6 className="mb-1"><strong>{sale.sessionInfo}</strong></h6>
                                    <p className="mb-1 small">
                                        Cliente: {sale.customerName} ({sale.customerEmail})
                                    </p>
                                    <div className="small text-muted">
                                        {/* Exibir detalhes dos tipos de ingresso se disponível */}
                                        {sale.ticketInteiraQty !== undefined && sale.ticketMeiaQty !== undefined ? (
                                            <>
                                                {sale.ticketInteiraQty > 0 && (
                                                    <Badge bg="primary" className="me-1">
                                                        🎫 {sale.ticketInteiraQty} Inteira(s)
                                                    </Badge>
                                                )}
                                                {sale.ticketMeiaQty > 0 && (
                                                    <Badge bg="info" className="me-1">
                                                        🎫 {sale.ticketMeiaQty} Meia(s)
                                                    </Badge>
                                                )}
                                            </>
                                        ) : (
                                            <Badge bg="primary" className="me-1">
                                                🎫 {sale.ticketQuantity} ingresso(s)
                                            </Badge>
                                        )}
                                        <Badge bg="success" className="me-1">
                                            💰 {TicketPricingService.formatPrice(sale.totalPrice)}
                                        </Badge>
                                        <Badge bg="secondary">
                                            📅 {new Date(sale.purchaseDate).toLocaleString('pt-BR')}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Card.Body>
        </Card>
    );
};
