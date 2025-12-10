// ============================================
// TIPOS DO SISTEMA DE CINEMA COMPLETO
// ============================================

// ============================================
// CINEMA
// ============================================
export interface Cinema {
    id?: string;
    name: string;
    address: string;
    phone?: string;
    email?: string;
    openingHours?: {
        start: string;
        end: string;
    };
    created_at?: string;
}

// ============================================
// FILMES
// ============================================
export interface Film {
    id?: string;
    title: string;
    description: string;
    genre: string;
    rating: string;
    duration: number;
    releaseDate: string;
    created_at?: string;
}

// ============================================
// SALAS E POLTRONAS
// ============================================
export interface SeatLayout {
    rows: number;
    columns: number;
    disabledSeats?: string[];
}

export interface Seat {
    id: string;
    row: string;
    number: number;
    status: 'available' | 'reserved' | 'sold' | 'disabled';
    ticketId?: string;
}

export interface Room {
    id?: string;
    name: string;
    type: string;
    capacity: number;
    seatLayout?: SeatLayout;
    cinemaId?: string;
    created_at?: string;
}

// ============================================
// SESSÕES
// ============================================
export interface Session {
    id?: string;
    movieId: string;
    movieTitle?: string;
    roomId: string;
    roomName?: string;
    datetime: string;
    price: number;
    language: string;
    format: string;
    created_at?: string;
}

// ============================================
// INGRESSOS
// ============================================
export type TicketType = 'inteira' | 'meia';
export type TicketStatus = 'disponivel' | 'reservado' | 'vendido';

export interface Ticket {
    id?: string;
    sessionId: string;
    ticketType: TicketType;
    basePrice: number;
    finalPrice: number;
    seatNumber?: string;
    status: TicketStatus;
    saleId?: string;
    orderId?: string;
    created_at?: string;
}

export interface TicketQuantities {
    inteira: number;
    meia: number;
}

export interface TicketPricing {
    inteira: number;
    meia: number;
    total: number;
}

// ============================================
// LANCHES E COMBOS
// ============================================
export type SnackCategory = 'bebida' | 'comida' | 'combo';

export interface SnackCombo {
    id?: string;
    name: string;
    description?: string;
    unitPrice: number;
    itemsQuantity: number;
    category: SnackCategory;
    isAvailable: boolean;
    imageUrl?: string;
    created_at?: string;
}

export interface OrderSnack {
    id?: string;
    orderId: string;
    snackComboId: string;
    snackComboName?: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    created_at?: string;
}

// ============================================
// PEDIDOS
// ============================================
export type OrderStatus = 'pendente' | 'confirmado' | 'cancelado';

export interface Order {
    id?: string;
    customerName: string;
    customerEmail: string;
    sessionId: string;
    sessionInfo?: string;
    tickets?: Ticket[];
    snacks?: OrderSnack[];
    totalTickets: number;
    totalSnacks: number;
    totalAmount: number;
    status: OrderStatus;
    paymentMethod?: string;
    created_at?: string;
}

// ============================================
// VENDAS (Compatibilidade)
// ============================================
export interface Sale {
    id?: string;
    sessionId: string;
    sessionInfo?: string;
    customerName: string;
    customerEmail: string;
    ticketQuantity: number;
    ticketInteiraQty?: number;
    ticketMeiaQty?: number;
    ticketDetails?: TicketQuantities;
    totalPrice: number;
    purchaseDate: string;
    orderId?: string;
    created_at?: string;
}
