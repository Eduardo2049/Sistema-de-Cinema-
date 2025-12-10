import { useState, FormEvent } from 'react';
import { Form, Button, Row, Col, Card, Alert } from 'react-bootstrap';
import { Room } from '../../types';

interface RoomFormProps {
    onSubmit: (room: Room) => void;
}

// Função para gerar layout de assentos automaticamente
const generateSeatLayout = (capacity: number) => {
    // Determinar número de fileiras e assentos por fileira
    // Fazer um layout mais ou menos quadrado/retangular
    const columns = Math.ceil(Math.sqrt(capacity * 1.2)); // Um pouco mais largo que alto
    const rows = Math.ceil(capacity / columns);
    
    return {
        rows,
        columns,
        disabledSeats: [] // Sem assentos desabilitados por padrão
    };
};

export const RoomForm = ({ onSubmit }: RoomFormProps) => {
    const [formData, setFormData] = useState<Room>({
        name: '',
        type: '',
        capacity: 0
    });

    const [generateLayout, setGenerateLayout] = useState(true);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.type || !formData.capacity) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        // Gerar layout de assentos se a opção estiver marcada
        const roomData: Room = {
            ...formData,
            seatLayout: generateLayout ? generateSeatLayout(formData.capacity) : undefined
        };

        onSubmit(roomData);

        // Reset form
        setFormData({
            name: '',
            type: '',
            capacity: 0
        });
        setGenerateLayout(true);
    };

    return (
        <Card className="mb-4">
            <Card.Body>
                <Card.Title>Adicionar Nova Sala</Card.Title>
                <Form onSubmit={handleSubmit}>
                    <Row className="g-3">
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Nome/Número da Sala *</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ex: Sala 1, Sala VIP"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </Form.Group>
                        </Col>

                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Tipo *</Form.Label>
                                <Form.Select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    required
                                >
                                    <option value="">Selecione</option>
                                    <option value="2D">2D</option>
                                    <option value="3D">3D</option>
                                    <option value="IMAX">IMAX</option>
                                    <option value="4DX">4DX</option>
                                    <option value="VIP">VIP</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Capacidade (lugares) *</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Ex: 100"
                                    min="1"
                                    value={formData.capacity || ''}
                                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                                    required
                                />
                            </Form.Group>
                        </Col>

                        <Col md={12}>
                            <Form.Group>
                                <Form.Check
                                    type="checkbox"
                                    label="🪑 Gerar mapa de poltronas automaticamente (permite seleção de assentos)"
                                    checked={generateLayout}
                                    onChange={(e) => setGenerateLayout(e.target.checked)}
                                />
                                <Form.Text className="text-muted">
                                    {generateLayout 
                                        ? `Será criado um layout de aproximadamente ${Math.ceil(Math.sqrt((formData.capacity || 0) * 1.2))} colunas x ${Math.ceil((formData.capacity || 0) / Math.ceil(Math.sqrt((formData.capacity || 0) * 1.2)))} fileiras`
                                        : 'Sem seleção de poltronas (sala tradicional)'
                                    }
                                </Form.Text>
                            </Form.Group>
                        </Col>

                        {generateLayout && formData.capacity > 0 && (
                            <Col md={12}>
                                <Alert variant="info">
                                    <strong>ℹ️ Layout Automático:</strong> O mapa de poltronas será gerado automaticamente 
                                    com base na capacidade da sala. Os clientes poderão escolher assentos específicos ao comprar ingressos.
                                    <hr />
                                    <div className="mt-2">
                                        <strong>📐 Preview do Layout:</strong>
                                        <div style={{ 
                                            marginTop: '10px', 
                                            padding: '15px', 
                                            backgroundColor: '#f8f9fa', 
                                            borderRadius: '8px',
                                            display: 'inline-block'
                                        }}>
                                            {(() => {
                                                const columns = Math.ceil(Math.sqrt(formData.capacity * 1.2));
                                                const rows = Math.ceil(formData.capacity / columns);
                                                const rowLetters = 'ABCDEFGHIJKLMNOP'.slice(0, rows);
                                                
                                                return (
                                                    <div>
                                                        <div style={{ textAlign: 'center', marginBottom: '10px', color: '#666' }}>
                                                            🎬 TELA
                                                        </div>
                                                        {rowLetters.split('').map((rowLetter, rowIdx) => (
                                                            <div key={rowLetter} style={{ 
                                                                display: 'flex', 
                                                                gap: '5px', 
                                                                marginBottom: '5px',
                                                                alignItems: 'center'
                                                            }}>
                                                                <span style={{ 
                                                                    width: '20px', 
                                                                    fontWeight: 'bold',
                                                                    fontSize: '12px',
                                                                    color: '#666'
                                                                }}>{rowLetter}</span>
                                                                {Array.from({ length: columns }).map((_, colIdx) => {
                                                                    const seatNumber = rowIdx * columns + colIdx + 1;
                                                                    if (seatNumber > formData.capacity) return null;
                                                                    return (
                                                                        <div key={colIdx} style={{
                                                                            width: '25px',
                                                                            height: '25px',
                                                                            backgroundColor: '#28a745',
                                                                            borderRadius: '4px',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center',
                                                                            fontSize: '10px',
                                                                            color: 'white',
                                                                            fontWeight: 'bold'
                                                                        }}>
                                                                            {colIdx + 1}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        ))}
                                                        <div style={{ 
                                                            marginTop: '10px', 
                                                            fontSize: '12px', 
                                                            color: '#666',
                                                            textAlign: 'center'
                                                        }}>
                                                            <strong>{columns} colunas × {rows} fileiras = {formData.capacity} assentos</strong>
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                </Alert>
                            </Col>
                        )}

                        <Col md={12}>
                            <Button type="submit" variant="success" className="w-100">
                                💾 Salvar Sala
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card.Body>
        </Card>
    );
};
