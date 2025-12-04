-- ============================================
-- CINEMA DATABASE SCHEMA - SUPABASE

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABELA: FILMES
-- ============================================
CREATE TABLE IF NOT EXISTS public.films (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    genre TEXT NOT NULL,
    rating TEXT NOT NULL,
    duration INTEGER NOT NULL CHECK (duration > 0),
    release_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================
-- TABELA: SALAS
-- ============================================
CREATE TABLE IF NOT EXISTS public.rooms (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================
-- TABELA: SESSÕES
-- ============================================
CREATE TABLE IF NOT EXISTS public.sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    film_id UUID NOT NULL REFERENCES public.films(id) ON DELETE CASCADE,
    room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
    datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    language TEXT NOT NULL,
    format TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================
-- TABELA: VENDAS
-- ============================================
CREATE TABLE IF NOT EXISTS public.sales (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    ticket_quantity INTEGER NOT NULL CHECK (ticket_quantity > 0),
    total_price NUMERIC(10, 2) NOT NULL CHECK (total_price >= 0),
    purchase_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_sessions_film_id ON public.sessions(film_id);
CREATE INDEX IF NOT EXISTS idx_sessions_room_id ON public.sessions(room_id);
CREATE INDEX IF NOT EXISTS idx_sessions_datetime ON public.sessions(datetime);
CREATE INDEX IF NOT EXISTS idx_sales_session_id ON public.sales(session_id);
CREATE INDEX IF NOT EXISTS idx_sales_purchase_date ON public.sales(purchase_date);

-- ============================================
-- HABILITAR ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE public.films ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS DE ACESSO (DESENVOLVIMENTO)
-- AVISO: Em produção, restrinja estas políticas
-- ============================================

-- Políticas para FILMES
CREATE POLICY "Enable read access for all users" ON public.films
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON public.films
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON public.films
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON public.films
    FOR DELETE USING (true);

-- Políticas para SALAS
CREATE POLICY "Enable read access for all users" ON public.rooms
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON public.rooms
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON public.rooms
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON public.rooms
    FOR DELETE USING (true);

-- Políticas para SESSÕES
CREATE POLICY "Enable read access for all users" ON public.sessions
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON public.sessions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON public.sessions
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON public.sessions
    FOR DELETE USING (true);

-- Políticas para VENDAS
CREATE POLICY "Enable read access for all users" ON public.sales
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON public.sales
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON public.sales
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON public.sales
    FOR DELETE USING (true);


