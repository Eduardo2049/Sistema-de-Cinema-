import { supabase } from '../lib/supabase';
import { Order, TicketQuantities } from '../types';

export class OrderService {
    /**
     * Criar pedido completo (ingressos + lanches)
     */
    static async createOrder(orderData: {
        customerName: string;
        customerEmail: string;
        sessionId: string;
        sessionPrice: number;
        ticketQuantities: TicketQuantities;
        selectedSeats?: string[];
        snacks?: Array<{ snackComboId: string; quantity: number; unitPrice: number }>;
        paymentMethod?: string;
    }): Promise<Order> {
        // Calcular totais
        const ticketTotal = this.calculateTicketTotal(orderData.sessionPrice, orderData.ticketQuantities);
        const snackTotal = this.calculateSnackTotal(orderData.snacks || []);
        const totalAmount = ticketTotal + snackTotal;

        // Criar pedido
        const { data: orderDb, error: orderError } = await supabase
            .from('orders')
            .insert([{
                customer_name: orderData.customerName,
                customer_email: orderData.customerEmail,
                session_id: orderData.sessionId,
                total_tickets: ticketTotal,
                total_snacks: snackTotal,
                total_amount: totalAmount,
                status: 'pendente',
                payment_method: orderData.paymentMethod
            }])
            .select()
            .single();

        if (orderError) throw orderError;

        const orderId = orderDb.id;

        // Criar ingressos
        await this.createTickets(orderId, orderData);

        // Criar itens de lanches
        if (orderData.snacks && orderData.snacks.length > 0) {
            await this.createOrderSnacks(orderId, orderData.snacks);
        }

        // Buscar pedido completo
        return this.getById(orderId);
    }

    /**
     * Buscar pedido por ID com todos os detalhes
     */
    static async getById(id: string): Promise<Order> {
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                sessions (
                    id,
                    datetime,
                    price,
                    films (title),
                    rooms (name)
                )
            `)
            .eq('id', id)
            .single();

        if (error) throw error;

        // Buscar tickets
        const { data: ticketsData } = await supabase
            .from('tickets')
            .select('*')
            .eq('order_id', id);

        // Buscar lanches
        const { data: snacksData } = await supabase
            .from('order_snacks')
            .select(`
                *,
                snack_combos (name)
            `)
            .eq('order_id', id);

        return this.mapFromDatabase(data, ticketsData || [], snacksData || []);
    }

    /**
     * Buscar todos os pedidos
     */
    static async getAll(): Promise<Order[]> {
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                sessions (
                    id,
                    datetime,
                    price,
                    films (title),
                    rooms (name)
                )
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return Promise.all(
            (data || []).map(async (order) => {
                const { data: ticketsData } = await supabase
                    .from('tickets')
                    .select('*')
                    .eq('order_id', order.id);

                const { data: snacksData } = await supabase
                    .from('order_snacks')
                    .select(`
                        *,
                        snack_combos (name)
                    `)
                    .eq('order_id', order.id);

                return this.mapFromDatabase(order, ticketsData || [], snacksData || []);
            })
        );
    }

    /**
     * Atualizar status do pedido
     */
    static async updateStatus(id: string, status: 'pendente' | 'confirmado' | 'cancelado'): Promise<Order> {
        const { error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', id);

        if (error) throw error;

        // Se cancelar, liberar poltronas
        if (status === 'cancelado') {
            await supabase
                .from('tickets')
                .update({ status: 'disponivel' })
                .eq('order_id', id);
        }

        return this.getById(id);
    }

    /**
     * Confirmar pedido
     */
    static async confirmOrder(id: string): Promise<Order> {
        // Atualizar status do pedido
        await supabase
            .from('orders')
            .update({ status: 'confirmado' })
            .eq('id', id);

        // Marcar tickets como vendidos
        await supabase
            .from('tickets')
            .update({ status: 'vendido' })
            .eq('order_id', id);

        return this.getById(id);
    }

    /**
     * Cancelar pedido
     */
    static async cancelOrder(id: string): Promise<Order> {
        return this.updateStatus(id, 'cancelado');
    }

    // ============================================
    // MÉTODOS AUXILIARES
    // ============================================

    private static async createTickets(orderId: string, orderData: any): Promise<void> {
        const tickets: any[] = [];
        const { sessionPrice, ticketQuantities, selectedSeats = [] } = orderData;

        let seatIndex = 0;

        // Criar ingressos inteiros
        for (let i = 0; i < ticketQuantities.inteira; i++) {
            tickets.push({
                session_id: orderData.sessionId,
                ticket_type: 'inteira',
                base_price: sessionPrice,
                final_price: sessionPrice,
                seat_number: selectedSeats[seatIndex] || null,
                status: 'vendido',
                order_id: orderId
            });
            seatIndex++;
        }

        // Criar meias-entradas
        for (let i = 0; i < ticketQuantities.meia; i++) {
            tickets.push({
                session_id: orderData.sessionId,
                ticket_type: 'meia',
                base_price: sessionPrice,
                final_price: sessionPrice * 0.5,
                seat_number: selectedSeats[seatIndex] || null,
                status: 'vendido',
                order_id: orderId
            });
            seatIndex++;
        }

        if (tickets.length > 0) {
            const { error } = await supabase
                .from('tickets')
                .insert(tickets);

            if (error) throw error;
        }
    }

    private static async createOrderSnacks(orderId: string, snacks: any[]): Promise<void> {
        const orderSnacks = snacks.map(snack => ({
            order_id: orderId,
            snack_combo_id: snack.snackComboId,
            quantity: snack.quantity,
            unit_price: snack.unitPrice,
            subtotal: snack.unitPrice * snack.quantity
        }));

        const { error } = await supabase
            .from('order_snacks')
            .insert(orderSnacks);

        if (error) throw error;
    }

    private static calculateTicketTotal(sessionPrice: number, quantities: TicketQuantities): number {
        const inteiraTotal = sessionPrice * quantities.inteira;
        const meiaTotal = (sessionPrice * 0.5) * quantities.meia;
        return inteiraTotal + meiaTotal;
    }

    private static calculateSnackTotal(snacks: any[]): number {
        return snacks.reduce((total, snack) => {
            return total + (snack.unitPrice * snack.quantity);
        }, 0);
    }

    private static mapFromDatabase(orderDb: any, ticketsDb: any[], snacksDb: any[]): Order {
        const sessionInfo = orderDb.sessions
            ? `${orderDb.sessions.films?.title || 'Filme'} - ${new Date(orderDb.sessions.datetime).toLocaleString('pt-BR')}`
            : '';

        return {
            id: orderDb.id,
            customerName: orderDb.customer_name,
            customerEmail: orderDb.customer_email,
            sessionId: orderDb.session_id,
            sessionInfo,
            tickets: ticketsDb.map(t => ({
                id: t.id,
                sessionId: t.session_id,
                ticketType: t.ticket_type,
                basePrice: parseFloat(t.base_price),
                finalPrice: parseFloat(t.final_price),
                seatNumber: t.seat_number,
                status: t.status,
                orderId: t.order_id,
                created_at: t.created_at
            })),
            snacks: snacksDb.map(s => ({
                id: s.id,
                orderId: s.order_id,
                snackComboId: s.snack_combo_id,
                snackComboName: s.snack_combos?.name,
                quantity: s.quantity,
                unitPrice: parseFloat(s.unit_price),
                subtotal: parseFloat(s.subtotal),
                created_at: s.created_at
            })),
            totalTickets: parseFloat(orderDb.total_tickets),
            totalSnacks: parseFloat(orderDb.total_snacks),
            totalAmount: parseFloat(orderDb.total_amount),
            status: orderDb.status,
            paymentMethod: orderDb.payment_method,
            created_at: orderDb.created_at
        };
    }

    /**
     * Formatar preço
     */
    static formatPrice(price: number): string {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    }

    /**
     * Gerar resumo do pedido
     */
    static generateOrderSummary(order: Order): string {
        const lines: string[] = [];

        lines.push(`PEDIDO #${order.id?.substring(0, 8)}`);
        lines.push(`Cliente: ${order.customerName}`);
        lines.push(`Sessão: ${order.sessionInfo}`);
        lines.push('');

        if (order.tickets && order.tickets.length > 0) {
            lines.push('INGRESSOS:');
            const inteiras = order.tickets.filter(t => t.ticketType === 'inteira');
            const meias = order.tickets.filter(t => t.ticketType === 'meia');

            if (inteiras.length > 0) {
                lines.push(`  ${inteiras.length}x Inteira - ${this.formatPrice(order.totalTickets)}`);
                const seats = inteiras.map(t => t.seatNumber).filter(Boolean);
                if (seats.length > 0) {
                    lines.push(`  Poltronas: ${seats.join(', ')}`);
                }
            }

            if (meias.length > 0) {
                lines.push(`  ${meias.length}x Meia`);
                const seats = meias.map(t => t.seatNumber).filter(Boolean);
                if (seats.length > 0) {
                    lines.push(`  Poltronas: ${seats.join(', ')}`);
                }
            }
            lines.push('');
        }

        if (order.snacks && order.snacks.length > 0) {
            lines.push('LANCHES:');
            order.snacks.forEach(snack => {
                lines.push(`  ${snack.quantity}x ${snack.snackComboName} - ${this.formatPrice(snack.subtotal)}`);
            });
            lines.push('');
        }

        lines.push(`TOTAL: ${this.formatPrice(order.totalAmount)}`);
        lines.push(`Status: ${order.status.toUpperCase()}`);

        return lines.join('\n');
    }
}
