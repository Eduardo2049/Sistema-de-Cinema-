import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Badge, Alert } from 'react-bootstrap';
import { SnackCombo, SnackCategory } from '../../types';
import { SnackComboService } from '../../services/snack-combo.service';

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
                                        <Form.Label>Nome *</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Categoria *</Form.Label>
                                        <Form.Select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value as SnackCategory })}
                                            required
                                        >
                                            <option value="bebida">Bebida</option>
                                            <option value="comida">Comida</option>
                                            <option value="combo">Combo</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>

                                <Col md={12}>
                                    <Form.Group>
                                        <Form.Label>Descrição</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={2}
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label>Preço Unitário (R$) *</Form.Label>
                                        <Form.Control
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={formData.unitPrice}
                                            onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label>Quantidade de Itens *</Form.Label>
                                        <Form.Control
                                            type="number"
                                            min="1"
                                            value={formData.itemsQuantity}
                                            onChange={(e) => setFormData({ ...formData, itemsQuantity: parseInt(e.target.value) || 1 })}
                                            required
                                        />
                                        <Form.Text className="text-muted">
                                            Ex: Combo com 1 pipoca + 1 refrigerante = 2 itens
                                        </Form.Text>
                                    </Form.Group>
                                </Col>

                                <Col md={4}>
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
