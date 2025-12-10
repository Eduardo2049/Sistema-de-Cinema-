import { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Badge, ListGroup, Alert } from 'react-bootstrap';
import { SnackCombo } from '../../types';
import { SnackComboService } from '../../services/snack-combo.service';

interface SnackSelectorProps {
    selectedSnacks: Array<{ snackComboId: string; quantity: number; unitPrice: number; name: string }>;
    onSnacksChange: (snacks: Array<{ snackComboId: string; quantity: number; unitPrice: number; name: string }>) => void;
}

export const SnackSelector = ({ selectedSnacks, onSnacksChange }: SnackSelectorProps) => {
    const [availableSnacks, setAvailableSnacks] = useState<SnackCombo[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    useEffect(() => {
        loadSnacks();
    }, []);

    const loadSnacks = async () => {
        try {
            setLoading(true);
            const data = await SnackComboService.getAvailable();
            setAvailableSnacks(data);
        } catch (error) {
            console.error('Erro ao carregar lanches:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredSnacks = selectedCategory === 'all'
        ? availableSnacks
        : availableSnacks.filter(s => s.category === selectedCategory);

    const addSnack = (snack: SnackCombo) => {
        const existing = selectedSnacks.find(s => s.snackComboId === snack.id);

        if (existing) {
            onSnacksChange(
                selectedSnacks.map(s =>
                    s.snackComboId === snack.id
                        ? { ...s, quantity: s.quantity + 1 }
                        : s
                )
            );
        } else {
            onSnacksChange([
                ...selectedSnacks,
                {
                    snackComboId: snack.id!,
                    quantity: 1,
                    unitPrice: snack.unitPrice,
                    name: snack.name
                }
            ]);
        }
    };

    const removeSnack = (snackComboId: string) => {
        const existing = selectedSnacks.find(s => s.snackComboId === snackComboId);

        if (existing && existing.quantity > 1) {
            onSnacksChange(
                selectedSnacks.map(s =>
                    s.snackComboId === snackComboId
                        ? { ...s, quantity: s.quantity - 1 }
                        : s
                )
            );
        } else {
            onSnacksChange(selectedSnacks.filter(s => s.snackComboId !== snackComboId));
        }
    };

    const getSnackQuantity = (snackId: string): number => {
        return selectedSnacks.find(s => s.snackComboId === snackId)?.quantity || 0;
    };

    const calculateTotal = (): number => {
        return selectedSnacks.reduce((total, snack) => {
            return total + (snack.unitPrice * snack.quantity);
        }, 0);
    };

    if (loading) {
        return (
            <Card>
                <Card.Body className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Carregando...</span>
                    </div>
                </Card.Body>
            </Card>
        );
    }

    if (availableSnacks.length === 0) {
        return (
            <Alert variant="info">
                <strong>ℹ️ Nenhum lanche disponível</strong>
                <p className="mb-0">Cadastre lanches/combos primeiro para poder vendê-los.</p>
            </Alert>
        );
    }

    return (
        <Card>
            <Card.Header>
                <strong>🍿 Adicionar Lanches/Combos</strong>
            </Card.Header>
            <Card.Body>
                {/* Filtro de Categoria */}
                <div className="mb-3">
                    <Button
                        size="sm"
                        variant={selectedCategory === 'all' ? 'primary' : 'outline-primary'}
                        className="me-2"
                        onClick={() => setSelectedCategory('all')}
                    >
                        Todos
                    </Button>
                    <Button
                        size="sm"
                        variant={selectedCategory === 'bebida' ? 'primary' : 'outline-primary'}
                        className="me-2"
                        onClick={() => setSelectedCategory('bebida')}
                    >
                        Bebidas
                    </Button>
                    <Button
                        size="sm"
                        variant={selectedCategory === 'comida' ? 'warning' : 'outline-warning'}
                        className="me-2"
                        onClick={() => setSelectedCategory('comida')}
                    >
                        Comidas
                    </Button>
                    <Button
                        size="sm"
                        variant={selectedCategory === 'combo' ? 'success' : 'outline-success'}
                        onClick={() => setSelectedCategory('combo')}
                    >
                        Combos
                    </Button>
                </div>

                {/* Lista de Lanches */}
                <Row className="g-2 mb-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {filteredSnacks.map((snack) => {
                        const quantity = getSnackQuantity(snack.id!);
                        return (
                            <Col md={6} key={snack.id}>
                                <Card className={quantity > 0 ? 'border-primary' : ''}>
                                    <Card.Body className="p-2">
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div className="flex-grow-1">
                                                <strong className="d-block">{snack.name}</strong>
                                                <small className="text-muted d-block">{snack.description}</small>
                                                <strong className="text-success">
                                                    {SnackComboService.formatPrice(snack.unitPrice)}
                                                </strong>
                                            </div>
                                            <div className="text-end">
                                                {quantity > 0 ? (
                                                    <div className="d-flex align-items-center gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline-danger"
                                                            onClick={() => removeSnack(snack.id!)}
                                                        >
                                                            -
                                                        </Button>
                                                        <Badge bg="primary">{quantity}</Badge>
                                                        <Button
                                                            size="sm"
                                                            variant="outline-success"
                                                            onClick={() => addSnack(snack)}
                                                        >
                                                            +
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <Button
                                                        size="sm"
                                                        variant="outline-primary"
                                                        onClick={() => addSnack(snack)}
                                                    >
                                                        Adicionar
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>

                {/* Resumo de Lanches Selecionados */}
                {selectedSnacks.length > 0 && (
                    <Alert variant="success" className="mb-0">
                        <strong>🛒 Lanches Selecionados:</strong>
                        <ListGroup className="mt-2">
                            {selectedSnacks.map((snack) => (
                                <ListGroup.Item key={snack.snackComboId} className="d-flex justify-content-between align-items-center">
                                    <span>
                                        {snack.quantity}x {snack.name}
                                    </span>
                                    <strong className="text-success">
                                        {SnackComboService.formatPrice(snack.unitPrice * snack.quantity)}
                                    </strong>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                        <div className="mt-3 text-end">
                            <strong className="fs-5">
                                Total Lanches: {SnackComboService.formatPrice(calculateTotal())}
                            </strong>
                        </div>
                    </Alert>
                )}
            </Card.Body>
        </Card>
    );
};
