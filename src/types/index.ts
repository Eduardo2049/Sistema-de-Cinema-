// Tipos para as entidades do sistema de cinema

export interface Film {
    title: string;
    description: string;
    genre: string;
    rating: string;
    duration: number;
    releaseDate: string;
}

export interface Room {
    name: string;
    type: string;
    capacity: number;
}

export interface Session {
    movieId: number;
    movieTitle: string;
    roomId: number;
    roomName: string;
    datetime: string;
    price: number;
    language: string;
    format: string;
}

export interface Sale {
    sessionId: number;
    sessionInfo: string;
    customerName: string;
    customerEmail: string;
    ticketQuantity: number;
    totalPrice: number;
    purchaseDate: string;
}

export type StorageKey = 'cinema_films' | 'cinema_rooms' | 'sessoes' | 'vendas';
