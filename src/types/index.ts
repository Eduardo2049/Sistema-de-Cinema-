// Tipos para as entidades do sistema de cinema

export interface Film {
    id?: string; // UUID do Supabase (opcional para criação)
    title: string;
    description: string;
    genre: string;
    rating: string;
    duration: number;
    releaseDate: string;
    created_at?: string;
}

export interface Room {
    id?: string;
    name: string;
    type: string;
    capacity: number;
    created_at?: string;
}

export interface Session {
    id?: string;
    movieId: string; // UUID do filme
    movieTitle?: string; // Para exibição
    roomId: string; // UUID da sala
    roomName?: string; // Para exibição
    datetime: string;
    price: number;
    language: string;
    format: string;
    created_at?: string;
}

export interface Sale {
    id?: string;
    sessionId: string; // UUID da sessão
    sessionInfo?: string; // Para exibição
    customerName: string;
    customerEmail: string;
    ticketQuantity: number;
    totalPrice: number;
    purchaseDate: string;
    created_at?: string;
}

export type StorageKey = 'cinema_films' | 'cinema_rooms' | 'sessoes' | 'vendas';
