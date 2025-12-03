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

        const { data, error: fetchError } = await SupabaseService.getAll<Room>('rooms');

        if (fetchError) {
            setError('Erro ao carregar salas: ' + fetchError.message);
            console.error(fetchError);
        } else {
            setRooms(data || []);
        }

        setLoading(false);
    };

    const addRoom = async (room: Omit<Room, 'id' | 'created_at'>) => {
        setLoading(true);
        setError(null);

        const { error: createError } = await SupabaseService.create<Room>('rooms', room);

        if (createError) {
            setError('Erro ao adicionar sala: ' + createError.message);
            console.error(createError);
        } else {
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
