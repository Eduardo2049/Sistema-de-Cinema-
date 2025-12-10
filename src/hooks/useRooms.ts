import { useState, useEffect } from 'react';
import { Room } from '../types';
import { SupabaseService } from '../services/supabase.service';

export const useRooms = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadRooms();
    }, []);

    const loadRooms = async () => {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await SupabaseService.getAll<any>('rooms');

        if (fetchError) {
            setError('Erro ao carregar salas: ' + fetchError.message);
            console.error(fetchError);
        } else {
            // Converter seat_layout (snake_case) para seatLayout (camelCase)
            const roomsFormatted: Room[] = (data || []).map((room: any) => ({
                id: room.id,
                name: room.name,
                type: room.type,
                capacity: room.capacity,
                seatLayout: room.seat_layout ? {
                    rows: room.seat_layout.rows,
                    columns: room.seat_layout.columns,
                    disabledSeats: room.seat_layout.disabledSeats || []
                } : undefined,
                created_at: room.created_at
            }));
            setRooms(roomsFormatted);
        }

        setLoading(false);
    };

    const addRoom = async (room: Omit<Room, 'id' | 'created_at'>) => {
        setLoading(true);
        setError(null);

        // Converter seatLayout para snake_case (seat_layout) para o banco
        const roomData: any = {
            name: room.name,
            type: room.type,
            capacity: room.capacity,
            seat_layout: room.seatLayout ? {
                rows: room.seatLayout.rows,
                columns: room.seatLayout.columns,
                disabledSeats: room.seatLayout.disabledSeats || []
            } : null
        };

        const { error: createError } = await SupabaseService.create('rooms', roomData);

        if (createError) {
            setError('Erro ao adicionar sala: ' + createError.message);
            console.error('Erro detalhado:', createError);
            alert('Erro ao adicionar sala: ' + createError.message);
        } else {
            alert('✅ Sala criada com sucesso!');
            await loadRooms();
        }

        setLoading(false);
    };

    const removeRoom = async (id: string) => {
        setLoading(true);
        setError(null);

        const { error: deleteError } = await SupabaseService.delete('rooms', id);

        if (deleteError) {
            setError('Erro ao remover sala: ' + deleteError.message);
            console.error(deleteError);
        } else {
            await loadRooms();
        }

        setLoading(false);
    };

    return {
        rooms,
        loading,
        error,
        addRoom,
        removeRoom,
        refreshRooms: loadRooms
    };
};
