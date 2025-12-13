import { useState, useEffect } from 'react';
import { Order } from '../types';
import { OrderService } from '../services/order.service';

export const useOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await OrderService.getAll();
            setOrders(data);
        } catch (err: any) {
            setError('Erro ao carregar pedidos: ' + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const confirmOrder = async (id: string) => {
        setLoading(true);
        setError(null);

        try {
            await OrderService.confirmOrder(id);
            await loadOrders();
        } catch (err: any) {
            setError('Erro ao confirmar pedido: ' + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const cancelOrder = async (id: string) => {
        setLoading(true);
        setError(null);

        try {
            await OrderService.cancelOrder(id);
            await loadOrders();
        } catch (err: any) {
            setError('Erro ao cancelar pedido: ' + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (id: string, newStatus: 'pendente' | 'confirmado' | 'cancelado') => {
        setLoading(true);
        setError(null);

        try {
            await OrderService.updateStatus(id, newStatus);
            await loadOrders();
        } catch (err: any) {
            setError('Erro ao atualizar status do pedido: ' + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        orders,
        loading,
        error,
        confirmOrder,
        cancelOrder,
        updateOrderStatus,
        refreshOrders: loadOrders
    };
};
