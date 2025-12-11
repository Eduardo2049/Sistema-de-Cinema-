import { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { SeatLayout } from '../../types';

interface SeatMapProps {
    roomLayout: SeatLayout;
    occupiedSeats: string[];
    selectedSeats: string[];
    onSeatSelect: (seatId: string) => void;
    onClearSeats?: () => void;
    maxSeats?: number;
}

export const SeatMap = ({
    roomLayout,
    occupiedSeats,
    selectedSeats,
    onSeatSelect,
    onClearSeats,
    maxSeats = 10
}: SeatMapProps) => {
    const [selectedRow, setSelectedRow] = useState<string>('');
    const [selectedColumn, setSelectedColumn] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    // Gerar fileiras disponíveis (A, B, C, ...)
    const rows = 'ABCDEFGHIJ'.slice(0, roomLayout.rows).split('');
    
    // Gerar colunas disponíveis (1, 2, 3, ...)
    const columns = Array.from({ length: roomLayout.columns }, (_, i) => i + 1);

    const handleAddSeat = () => {
        setErrorMessage('');

        // Validações
        if (!selectedRow || !selectedColumn) {
            setErrorMessage('Selecione a fileira e a coluna');
            return;
        }

        const seatId = `${selectedRow}${selectedColumn}`;

        // Verificar se já está selecionada
        if (selectedSeats.includes(seatId)) {
            setErrorMessage(`A poltrona ${seatId} já foi selecionada`);
            return;
        }

        // Verificar se está ocupada
        if (occupiedSeats.includes(seatId)) {
            setErrorMessage(`A poltrona ${seatId} está ocupada`);
            return;
        }

        // Verificar se está desabilitada
        if (roomLayout.disabledSeats?.includes(seatId)) {
            setErrorMessage(`A poltrona ${seatId} não está disponível`);
            return;
        }

        // Verificar limite máximo
        if (selectedSeats.length >= maxSeats) {
            setErrorMessage(`Você já selecionou o máximo de ${maxSeats} poltronas`);
            return;
        }

        // Adicionar poltrona
        onSeatSelect(seatId);
        
        // Limpar seleção
        setSelectedRow('');
        setSelectedColumn('');
    };

    const handleRemoveSeat = (seatId: string) => {
        onSeatSelect(seatId);
    };

    return (
        <Container className="seat-map">
            <Alert variant="info" className="mb-4">
                <strong>Como funciona:</strong> Selecione a fileira e a coluna da poltrona desejada e clique em "Adicionar".
            </Alert>

            <Row className="mb-4">
                <Col md={4}>
                    <Form.Group>
                        <Form.Label>Fileira</Form.Label>
                        <Form.Select
                            value={selectedRow}
                            onChange={(e) => setSelectedRow(e.target.value)}
                        >
                            <option value="">Selecione...</option>
                            {rows.map(row => (
                                <option key={row} value={row}>
                                    Fileira {row}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group>
                        <Form.Label>Coluna</Form.Label>
                        <Form.Select
                            value={selectedColumn}
                            onChange={(e) => setSelectedColumn(e.target.value)}
                        >
                            <option value="">Selecione...</option>
                            {columns.map(col => (
                                <option key={col} value={col}>
                                    Coluna {col}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col md={4} className="d-flex align-items-end">
                    <Button 
                        variant="primary" 
                        onClick={handleAddSeat}
                        className="w-100"
                    >
                        ➕ Adicionar Poltrona
                    </Button>
                </Col>
            </Row>

            {errorMessage && (
                <Alert variant="warning" dismissible onClose={() => setErrorMessage('')}>
                    {errorMessage}
                </Alert>
            )}

            <div className="selected-seats-list mt-4">
                <h5>Poltronas Selecionadas ({selectedSeats.length}/{maxSeats})</h5>
                
                {selectedSeats.length === 0 ? (
                    <Alert variant="secondary">
                        Nenhuma poltrona selecionada
                    </Alert>
                ) : (
                    <div className="list-group">
                        {selectedSeats.map(seatId => (
                            <div 
                                key={seatId} 
                                className="list-group-item d-flex justify-content-between align-items-center"
                            >
                                <span className="fw-bold">🪑 Poltrona {seatId}</span>
                                <Button 
                                    variant="outline-danger" 
                                    size="sm"
                                    onClick={() => handleRemoveSeat(seatId)}
                                >
                                    ❌ Remover
                                </Button>
                            </div>
                        ))}
                        {onClearSeats && selectedSeats.length > 0 && (
                            <div className="mt-2">
                                <Button 
                                    variant="warning" 
                                    size="sm" 
                                    onClick={onClearSeats}
                                    className="w-100"
                                >
                                    🔄 Limpar Todas
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Container>
    );
};
