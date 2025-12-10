// Funções genéricas para manipular localStorage com type safety
export const StorageService = {
    getData<T>(key: string): T[] {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : [];
    },

    saveData<T>(key: string, data: T[]): void {
        localStorage.setItem(key, JSON.stringify(data));
    },

    addItem<T>(key: string, item: T): void {
        const list = this.getData<T>(key);
        list.push(item);
        this.saveData(key, list);
    },

    removeItem<T>(key: string, index: number): void {
        const list = this.getData<T>(key);
        list.splice(index, 1);
        this.saveData(key, list);
    },

    clear(key: string): void {
        localStorage.removeItem(key);
    }
};
