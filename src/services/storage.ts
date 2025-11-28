import { StorageKey } from '../types';

// Funções genéricas para manipular localStorage com type safety
export const StorageService = {
    getData<T>(key: StorageKey): T[] {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : [];
    },

    saveData<T>(key: StorageKey, data: T[]): void {
        localStorage.setItem(key, JSON.stringify(data));
    },

    addItem<T>(key: StorageKey, item: T): void {
        const list = this.getData<T>(key);
        list.push(item);
        this.saveData(key, list);
    },

    removeItem<T>(key: StorageKey, index: number): void {
        const list = this.getData<T>(key);
        list.splice(index, 1);
        this.saveData(key, list);
    },

    clear(key: StorageKey): void {
        localStorage.removeItem(key);
    }
};
