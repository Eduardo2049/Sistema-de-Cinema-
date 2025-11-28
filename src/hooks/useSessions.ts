import { useState, useEffect } from 'react';
import { Session } from '../types';
import { StorageService } from '../services/storage';

const STORAGE_KEY = 'sessoes';

export const useSessions = () => {
    const [sessions, setSessions] = useState<Session[]>([]);

    useEffect(() => {
        loadSessions();
    }, []);

    const loadSessions = () => {
        const data = StorageService.getData<Session>(STORAGE_KEY);
        setSessions(data);
    };

    const addSession = (session: Session) => {
        StorageService.addItem<Session>(STORAGE_KEY, session);
        loadSessions();
    };

    const removeSession = (index: number) => {
        StorageService.removeItem<Session>(STORAGE_KEY, index);
        loadSessions();
    };

    return {
        sessions,
        addSession,
        removeSession,
        refreshSessions: loadSessions
    };
};
