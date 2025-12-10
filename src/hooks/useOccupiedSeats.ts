import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Hook para buscar poltronas ocupadas de uma sessão específica
 */
export const useOccupiedSeats = (sessionId: string | null) => {
    const [occupiedSeats, setOccupiedSeats] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!sessionId) {
            setOccupiedSeats([]);
            return;
        }

        fetchOccupiedSeats();
    }, [sessionId]);

    const fetchOccupiedSeats = async () => {
        if (!sessionId) return;

        setLoading(true);
        setError(null);

        try {
            const { data, error: fetchError } = await supabase
                .from('tickets')
                .select('seat_number')
                .eq('session_id', sessionId)
                .in('status', ['reservado', 'vendido'])
                .not('seat_number', 'is', null);

            if (fetchError) throw fetchError;

            const seats = data?.map(ticket => ticket.seat_number).filter(Boolean) || [];
            setOccupiedSeats(seats as string[]);
        } catch (err) {
            console.error('Erro ao buscar poltronas ocupadas:', err);
            setError('Erro ao carregar poltronas ocupadas');
            setOccupiedSeats([]);
        } finally {
            setLoading(false);
        }
    };

    const refresh = () => {
        fetchOccupiedSeats();
    };

    return {
        occupiedSeats,
        loading,
        error,
        refresh
    };
};
