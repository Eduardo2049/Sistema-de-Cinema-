import { useState, useEffect } from 'react';
import { Sale } from '../types';
import { SupabaseService } from '../services/supabase.service';

export const useSales = () => {
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadSales();
    }, []);

    const loadSales = async () => {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await SupabaseService.getSalesWithDetails();

        if (fetchError) {
            setError('Erro ao carregar vendas: ' + fetchError.message);
            console.error(fetchError);
        } else {
            // Converter campos snake_case para camelCase e construir sessionInfo
            const salesFormatted = (data || []).map((sale: any) => {
                // Construir sessionInfo a partir dos dados da sessão
                const sessionData = sale.sessions;
                const movieTitle = sessionData?.films?.title || 'Filme desconhecido';
                const datetime = sessionData?.datetime || '';
                const sessionInfo = `${movieTitle} - ${datetime}`;

                return {
                    id: sale.id,
                    sessionId: sale.session_id,
                    sessionInfo,
                    customerName: sale.customer_name,
                    customerEmail: sale.customer_email,
                    ticketQuantity: sale.ticket_quantity,
                    totalPrice: sale.total_price,
                    purchaseDate: sale.purchase_date,
                    created_at: sale.created_at
                };
            });
            setSales(salesFormatted);
        }

        setLoading(false);
    };

    const addSale = async (sale: Omit<Sale, 'id' | 'created_at'>) => {
        setLoading(true);
        setError(null);

        // Converter camelCase para snake_case
        // Nota: sessionInfo não é salvo no banco, é apenas para exibição
        const { sessionId, customerName, customerEmail, ticketQuantity, totalPrice, purchaseDate } = sale;
        const saleData = {
            session_id: sessionId,
            customer_name: customerName,
            customer_email: customerEmail,
            ticket_quantity: ticketQuantity,
            total_price: totalPrice,
            purchase_date: purchaseDate
        };

        const { error: createError } = await SupabaseService.create<any>('sales', saleData);

        if (createError) {
            setError('Erro ao adicionar venda: ' + createError.message);
            console.error(createError);
        } else {
            await loadSales();
        }

        setLoading(false);
    };

    const removeSale = async (id: string) => {
        setLoading(true);
        setError(null);

        const { error: deleteError } = await SupabaseService.delete('sales', id);

        if (deleteError) {
            setError('Erro ao remover venda: ' + deleteError.message);
            console.error(deleteError);
        } else {
            await loadSales();
        }

        setLoading(false);
    };

    return {
        sales,
        loading,
        error,
        addSale,
        removeSale,
        refreshSales: loadSales
    };
};
