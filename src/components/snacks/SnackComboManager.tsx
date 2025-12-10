import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Badge, Alert } from 'react-bootstrap';
import { SnackCombo, SnackCategory } from '../../types';
import { SnackComboService } from '../../services/snack-combo.service';

// Opções pré-definidas de lanches
const SNACK_OPTIONS = [
    { name: 'Pipoca Pequena', price: 15.00 },
    { name: 'Pipoca Média', price: 20.00 },
    { name: 'Pipoca Grande', price: 25.00 },
    { name: 'Pipoca Mega', price: 30.00 },
    { name: 'Nachos com Queijo', price: 18.00 },
    { name: 'Hot Dog', price: 16.00 },
    { name: 'Hambúrguer', price: 22.00 },
    { name: 'Batata Frita', price: 12.00 },
    { name: 'Nuggets (6 unidades)', price: 15.00 },
    { name: 'Chocolate M&M\'s', price: 8.00 },
    { name: 'Chocolate Twix', price: 8.00 },
    { name: 'Doritos', price: 10.00 }
];

// Opções pré-definidas de bebidas
const DRINK_OPTIONS = [
    { name: 'Refrigerante Pequeno', price: 8.00 },
    { name: 'Refrigerante Médio', price: 10.00 },
    { name: 'Refrigerante Grande', price: 12.00 },
    { name: 'Refrigerante 2L', price: 15.00 },
    { name: 'Água Mineral', price: 5.00 },
    { name: 'Suco Natural', price: 10.00 },
    { name: 'Energético', price: 12.00 },
    { name: 'Cerveja', price: 15.00 },
    { name: 'Milk Shake', price: 18.00 },
    { name: 'Café', price: 6.00 }
];

// Opções pré-definidas de combos
const COMBO_OPTIONS = [
    { name: 'Combo Clássico', description: 'Pipoca Média + Refrigerante Médio', price: 28.00, items: 2 },
    { name: 'Combo Família', description: 'Pipoca Grande + 2 Refrigerantes Médios', price: 42.00, items: 3 },
    { name: 'Combo Casal', description: 'Pipoca Média + 2 Refrigerantes Pequenos', price: 32.00, items: 3 },
    { name: 'Combo Premium', description: 'Pipoca Grande + 2 Refrigerantes Grandes + Nachos', price: 55.00, items: 4 },
    { name: 'Combo Econômico', description: 'Pipoca Pequena + Refrigerante Pequeno', price: 20.00, items: 2 },
    { name: 'Combo Mega', description: 'Pipoca Mega + 3 Refrigerantes Grandes', price: 60.00, items: 4 },
    { name: 'Combo Hot Dog', description: 'Hot Dog + Refrigerante Médio', price: 24.00, items: 2 },
    { name: 'Combo Kids', description: 'Pipoca Pequena + Suco Natural + Chocolate', price: 28.00, items: 3 },
    { name: 'Combo Lanche', description: 'Hambúrguer + Batata Frita + Refrigerante Grande', price: 40.00, items: 3 },
    { name: 'Combo Deluxe', description: 'Pipoca Grande + 2 Milk Shakes + Nachos', price: 65.00, items: 4 }
];

export const SnackComboManager = () => {
    const [snacks, setSnacks] = useState<SnackCombo[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState<Partial<SnackCombo>>({
        name: '',
        description: '',
        unitPrice: 0,
        itemsQuantity: 1,
        category: 'combo',
        isAvailable: true
    });

    useEffect(() => {
        loadSnacks();
    }, []);

    const loadSnacks = async () => {
        try {
            setLoading(true);
            const data = await SnackComboService.getAll();
            setSnacks(data);
        } catch (error) {
            console.error('Erro ao carregar lanches:', error);
            alert('Erro ao carregar lanches');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingId) {
                await SnackComboService.update(editingId, formData);
                alert('Lanche atualizado com sucesso!');
            } else {
                await SnackComboService.create(formData as SnackCombo);
                alert('Lanche criado com sucesso!');
            }

            resetForm();
            loadSnacks();
        } catch (error) {
            console.error('Erro ao salvar lanche:', error);
            alert('Erro ao salvar lanche');
        }
    };

    const handleEdit = (snack: SnackCombo) => {
        setFormData(snack);
        setEditingId(snack.id || null);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Deseja realmente excluir este lanche/combo?')) return;

        try {
            await SnackComboService.delete(id);
            alert('Lanche excluído com sucesso!');
            loadSnacks();
        } catch (error) {
            console.error('Erro ao excluir lanche:', error);
            alert('Erro ao excluir lanche');
        }
    };

    const handleToggleAvailability = async (id: string, currentStatus: boolean) => {
        try {
            await SnackComboService.toggleAvailability(id, !currentStatus);
            loadSnacks();
        } catch (error) {
            console.error('Erro ao alterar disponibilidade:', error);
            alert('Erro ao alterar disponibilidade');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            unitPrice: 0,
            itemsQuantity: 1,
            category: 'combo',
            isAvailable: true
        });
        setEditingId(null);
        setShowForm(false);
    };

    const getCategoryBadge = (category: SnackCategory) => {
        const variants: Record<SnackCategory, string> = {
            bebida: 'primary',
            comida: 'warning',
            combo: 'success'
        };
        return <Badge bg={variants[category]}>{category.toUpperCase()}</Badge>;
    };

    return (
        <Container className="py-4">
            <Row className="mb-4">
                <Col>
                    <h2>🍿 Gerenciar Lanches e Combos</h2>
                </Col>
                <Col xs="auto">
                    <Button
                        variant="primary"
                        onClick={() => setShowForm(!showForm)}
                    >
                        {showForm ? '❌ Cancelar' : '➕ Novo Lanche/Combo'}
                    </Button>
                </Col>
            </Row>

            {showForm && (
                <Card className="mb-4">
                    <Card.Body>
                        <Card.Title>{editingId ? 'Editar' : 'Novo'} Lanche/Combo</Card.Title>
                        <Form onSubmit={handleSubmit}>
                            <Row className="g-3">
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Categoria *</Form.Label>
                                        <Form.Select
                                            value={formData.category}
                                            onChange={(e) => {
                                                const category = e.target.value as SnackCategory;
                                                setFormData({ 
                                                    ...formData, 
                                                    category,
                                                    name: '',
                                                    description: '',
                                                    unitPrice: 0,
                                                    itemsQuantity: 1
                                                });
                                            }}
                                            required
                                        >
                                            <option value="">Selecione a categoria</option>
                                            <option value="comida">🍿 Lanche</option>
                                            <option value="bebida">🥤 Bebida</option>
                                            <option value="combo">🎁 Combo</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>
                                            {formData.category === 'comida' && 'Escolha o Lanche *'}
                                            {formData.category === 'bebida' && 'Escolha a Bebida *'}
                                            {formData.category === 'combo' && 'Escolha o Combo *'}
                                            {!formData.category && 'Selecione primeiro a categoria'}
                                        </Form.Label>
                                        <Form.Select
                                            value={formData.name}
                                            onChange={(e) => {
                                                const selectedName = e.target.value;
                                                let selectedItem;
                                                
                                                if (formData.category === 'comida') {
                                                    selectedItem = SNACK_OPTIONS.find(s => s.name === selectedName);
                                                    if (selectedItem) {
                                                        setFormData({
                                                            ...formData,
                                                            name: selectedItem.name,
                                                            unitPrice: selectedItem.price,
                                                            itemsQuantity: 1,
                                                            description: `Lanche: ${selectedItem.name}`
                                                        });
                                                    }
                                                } else if (formData.category === 'bebida') {
                                                    selectedItem = DRINK_OPTIONS.find(d => d.name === selectedName);
                                                    if (selectedItem) {
                                                        setFormData({
                                                            ...formData,
                                                            name: selectedItem.name,
                                                            unitPrice: selectedItem.price,
                                                            itemsQuantity: 1,
                                                            description: `Bebida: ${selectedItem.name}`
                                                        });
                                                    }
                                                } else if (formData.category === 'combo') {
                                                    selectedItem = COMBO_OPTIONS.find(c => c.name === selectedName);
                                                    if (selectedItem) {
                                                        setFormData({
                                                            ...formData,
                                                            name: selectedItem.name,
                                                            unitPrice: selectedItem.price,
                                                            itemsQuantity: 1,
                                                            description: selectedItem.description
                                                        });
                                                    }
                                                }
                                            }}
                                            required
                                            disabled={!formData.category}
                                        >
                                            <option value="">Selecione uma opção</option>
                                            {formData.category === 'comida' && SNACK_OPTIONS.map(snack => (
                                                <option key={snack.name} value={snack.name}>
                                                    {snack.name} - R$ {snack.price.toFixed(2)}
                                                </option>
                                            ))}
                                            {formData.category === 'bebida' && DRINK_OPTIONS.map(drink => (
                                                <option key={drink.name} value={drink.name}>
                                                    {drink.name} - R$ {drink.price.toFixed(2)}
                                                </option>
                                            ))}
                                            {formData.category === 'combo' && COMBO_OPTIONS.map(combo => (
                                                <option key={combo.name} value={combo.name}>
                                                    {combo.name} - R$ {combo.price.toFixed(2)}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>

                                {formData.description && formData.name && (
                                    <Col md={12}>
                                        <Alert variant="info" className="mb-0">
                                            <strong>
                                                {formData.category === 'combo' ? '📦 Itens do Combo:' : 
                                                 formData.category === 'comida' ? '🍿 Lanche Selecionado:' :
                                                 '🥤 Bebida Selecionada:'}
                                            </strong> {formData.description}
                                        </Alert>
                                    </Col>
                                )}

                                <Col md={3}>
                                    <Form.Group>
                                        <Form.Label>Preço Unitário (R$) *</Form.Label>
                                        <Form.Control
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={formData.unitPrice}
                                            onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })}
                                            required
                                            readOnly
                                        />
                                        <Form.Text className="text-muted">
                                            Preço por unidade
                                        </Form.Text>
                                    </Form.Group>
                                </Col>

                                <Col md={3}>
                                    <Form.Group>
                                        <Form.Label>Quantidade *</Form.Label>
                                        <Form.Control
                                            type="number"
                                            min="1"
                                            value={formData.itemsQuantity}
                                            onChange={(e) => setFormData({ ...formData, itemsQuantity: parseInt(e.target.value) || 1 })}
                                            required
                                        />
                                        <Form.Text className="text-muted">
                                            Quantas unidades?
                                        </Form.Text>
                                    </Form.Group>
                                </Col>

                                <Col md={3}>
                                    <Form.Group>
                                        <Form.Label>Total (R$)</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={`R$ ${((formData.unitPrice || 0) * (formData.itemsQuantity || 1)).toFixed(2)}`}
                                            readOnly
                                            style={{ fontWeight: 'bold', backgroundColor: '#e9ecef' }}
                                        />
                                        <Form.Text className="text-muted">
                                            Valor total
                                        </Form.Text>
                                    </Form.Group>
                                </Col>

                                <Col md={3}>
                                    <Form.Group>
                                        <Form.Label>Disponível</Form.Label>
                                        <Form.Check
                                            type="switch"
                                            label={formData.isAvailable ? 'Sim' : 'Não'}
                                            checked={formData.isAvailable}
                                            onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={12}>
                                    <Button type="submit" variant="success" className="me-2">
                                        💾 Salvar
                                    </Button>
                                    <Button variant="secondary" onClick={resetForm}>
                                        Cancelar
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Card.Body>
                </Card>
            )}

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Carregando...</span>
                    </div>
                </div>
            ) : snacks.length === 0 ? (
                <Alert variant="info">
                    <strong>Nenhum lanche cadastrado</strong>
                    <p className="mb-0">Clique em "Novo Lanche/Combo" para começar.</p>
                </Alert>
            ) : (
                <Card>
                    <Card.Body>
                        <Table responsive hover>
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Categoria</th>
                                    <th>Descrição</th>
                                    <th>Preço</th>
                                    <th>Itens</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {snacks.map((snack) => (
                                    <tr key={snack.id}>
                                        <td><strong>{snack.name}</strong></td>
                                        <td>{getCategoryBadge(snack.category)}</td>
                                        <td className="text-muted small">{snack.description || '-'}</td>
                                        <td><strong>{SnackComboService.formatPrice(snack.unitPrice)}</strong></td>
                                        <td>{snack.itemsQuantity}</td>
                                        <td>
                                            <Form.Check
                                                type="switch"
                                                checked={snack.isAvailable}
                                                onChange={() => handleToggleAvailability(snack.id!, snack.isAvailable)}
                                                label={snack.isAvailable ? 'Disponível' : 'Indisponível'}
                                            />
                                        </td>
                                        <td>
                                            <Button
                                                size="sm"
                                                variant="outline-primary"
                                                className="me-2"
                                                onClick={() => handleEdit(snack)}
                                            >
                                                ✏️ Editar
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline-danger"
                                                onClick={() => handleDelete(snack.id!)}
                                            >
                                                🗑️ Excluir
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
};
