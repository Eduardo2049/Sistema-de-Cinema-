import { useState, useEffect } from 'react';
import { Room } from '../types';
import { StorageService } from '../services/storage';

const STORAGE_KEY = 'cinema_rooms';

export const useRooms = () => {
    const [rooms, setRooms] = useState<Room[]>([]);

    useEffect(() => {
        loadRooms();
    }, []);

    const loadRooms = () => {
        const data = StorageService.getData<Room>(STORAGE_KEY);
        setRooms(data);
    };

    const addRoom = (room: Room) => {
        StorageService.addItem<Room>(STORAGE_KEY, room);
        loadRooms();
    };

    const removeRoom = (index: number) => {
        StorageService.removeItem<Room>(STORAGE_KEY, index);
        loadRooms();
    };

    return {
        rooms,
        addRoom,
        removeRoom,
        refreshRooms: loadRooms
    };
};
