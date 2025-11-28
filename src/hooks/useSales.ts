import { useState, useEffect } from 'react';
import { Sale } from '../types';
import { StorageService } from '../services/storage';

const STORAGE_KEY = 'vendas';

export const useSales = () => {
    const [sales, setSales] = useState<Sale[]>([]);

    useEffect(() => {
        loadSales();
    }, []);

    const loadSales = () => {
        const data = StorageService.getData<Sale>(STORAGE_KEY);
        setSales(data);
    };

    const addSale = (sale: Sale) => {
        StorageService.addItem<Sale>(STORAGE_KEY, sale);
        loadSales();
    };

    const removeSale = (index: number) => {
        StorageService.removeItem<Sale>(STORAGE_KEY, index);
        loadSales();
    };

    return {
        sales,
        addSale,
        removeSale,
        refreshSales: loadSales
    };
};
