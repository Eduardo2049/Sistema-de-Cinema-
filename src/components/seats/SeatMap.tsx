import { useState, useEffect } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import { Seat, SeatLayout } from '../../types';
import './SeatMap.css';

interface SeatMapProps {
    roomLayout: SeatLayout;
    occupiedSeats: string[];
    selectedSeats: string[];
    onSeatSelect: (seatId: string) => void;
    maxSeats?: number;
}

export const SeatMap = ({
    roomLayout,
    occupiedSeats,
    selectedSeats,
    onSeatSelect,
    maxSeats = 10
}: SeatMapProps) => {
    const [seats, setSeats] = useState<Seat[]>([]);

    useEffect(() => {
        generateSeats();
    }, [roomLayout, occupiedSeats]);

    const generateSeats = () => {
        const generatedSeats: Seat[] = [];
        const rows = 'ABCDEFGHIJ'.slice(0, roomLayout.rows);

        for (let i = 0; i < rows.length; i++) {
            for (let j = 1; j <= roomLayout.columns; j++) {
                const seatId = `${rows[i]}${j}`;
                const isDisabled = roomLayout.disabledSeats?.includes(seatId);
                const isOccupied = occupiedSeats.includes(seatId);

                let status: Seat['status'] = 'available';
                if (isDisabled) status = 'disabled';
                else if (isOccupied) status = 'sold';

                generatedSeats.push({
                    id: seatId,
                    row: rows[i],
                    number: j,
                    status
                });
            }
        }

        setSeats(generatedSeats);
    };

    const handleSeatClick = (seat: Seat) => {
        if (seat.status === 'disabled' || seat.status === 'sold') {
            return;
        }

        const isSelected = selectedSeats.includes(seat.id);

        if (!isSelected && selectedSeats.length >= maxSeats) {
            alert(`Você pode selecionar no máximo ${maxSeats} poltronas.`);
            return;
        }

        onSeatSelect(seat.id);
    };

    const getSeatClassName = (seat: Seat): string => {
        const classes = ['seat'];

        if (selectedSeats.includes(seat.id)) {
            classes.push('seat-selected');
        } else {
            classes.push(`seat-${seat.status}`);
        }

        return classes.join(' ');
    };

    // Agrupar poltronas por fileira
    const seatsByRow = seats.reduce((acc, seat) => {
        if (!acc[seat.row]) {
            acc[seat.row] = [];
        }
        acc[seat.row].push(seat);
        return acc;
    }, {} as Record<string, Seat[]>);

    // Calcular estatísticas
    const availableSeats = seats.filter(s => s.status === 'available').length;
    const soldSeats = seats.filter(s => s.status === 'sold').length;

    return (
        <Container className="seat-map">
            <div className="screen mb-4">
                <div className="screen-label">🎬 TELA</div>
            </div>

            {availableSeats === 0 && (
                <Alert variant="danger" className="mb-3">
                    <strong>⚠️ Sessão Esgotada!</strong> Não há poltronas disponíveis para esta sessão.
                </Alert>
            )}

            <div className="seats-container">
                {Object.entries(seatsByRow).map(([row, rowSeats]) => (
                    <div key={row} className="seat-row">
                        <span className="row-label">{row}</span>
                        <div className="seats">
                            {rowSeats.map(seat => (
                                <button
                                    key={seat.id}
                                    className={getSeatClassName(seat)}
                                    onClick={() => handleSeatClick(seat)}
                                    disabled={seat.status === 'disabled' || seat.status === 'sold'}
                                    title={
                                        seat.status === 'sold'
                                            ? `${seat.id} - Ocupada`
                                            : seat.status === 'disabled'
                                                ? 'Indisponível'
                                                : `${seat.id} - Disponível`
                                    }
                                    aria-label={`Poltrona ${seat.id}`}
                                >
                                    {seat.status !== 'disabled' && seat.number}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <Row className="mt-4">
                <Col md={6}>
                    <div className="legend">
                        <strong className="d-block mb-2">Legenda:</strong>
                        <div className="legend-item">
                            <div className="legend-seat available"></div>
                            <span>Disponível ({availableSeats})</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-seat selected"></div>
                            <span>Selecionada</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-seat sold"></div>
                            <span>Ocupada ({soldSeats})</span>
                        </div>
                    </div>
                </Col>
                <Col md={6}>
                    <div className="selected-seats">
                        <strong>Poltronas Selecionadas:</strong>{' '}
                        {selectedSeats.length > 0 ? (
                            <span className="text-primary fw-bold">{selectedSeats.join(', ')}</span>
                        ) : (
                            <span className="text-muted">Nenhuma</span>
                        )}
                        <div className="mt-2 small text-muted">
                            {selectedSeats.length > 0 && (
                                <span>
                                    {selectedSeats.length} de {maxSeats} poltronas selecionadas
                                </span>
                            )}
                        </div>
                    </div>
                </Col>
            </Row>

            <Alert variant="info" className="mt-3 mb-0">
                <small>
                    <strong>💡 Dica:</strong> Clique nas poltronas verdes para selecioná-las.
                    Poltronas vermelhas já estão ocupadas.
                </small>
            </Alert>
        </Container>
    );
};
