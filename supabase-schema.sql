CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.cinemas (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    opening_hours JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

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

CREATE TABLE IF NOT EXISTS public.rooms (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    seat_layout JSONB,
    cinema_id UUID REFERENCES public.cinemas(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

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

CREATE TABLE IF NOT EXISTS public.snack_combos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
    items_quantity INTEGER DEFAULT 1 CHECK (items_quantity > 0),
    category TEXT CHECK (category IN ('bebida', 'comida', 'combo')),
    is_available BOOLEAN DEFAULT true,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    session_id UUID NOT NULL REFERENCES public.sessions(id),
    total_tickets NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total_snacks NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(10, 2) NOT NULL,
    status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmado', 'cancelado')),
    payment_method TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.sales (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    ticket_quantity INTEGER NOT NULL CHECK (ticket_quantity > 0),
    ticket_inteira_qty INTEGER DEFAULT 0 CHECK (ticket_inteira_qty >= 0),
    ticket_meia_qty INTEGER DEFAULT 0 CHECK (ticket_meia_qty >= 0),
    ticket_details JSONB,
    total_price NUMERIC(10, 2) NOT NULL CHECK (total_price >= 0),
    purchase_date TIMESTAMP WITH TIME ZONE NOT NULL,
    order_id UUID REFERENCES public.orders(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.tickets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
    ticket_type TEXT NOT NULL CHECK (ticket_type IN ('inteira', 'meia')),
    base_price NUMERIC(10, 2) NOT NULL CHECK (base_price >= 0),
    final_price NUMERIC(10, 2) NOT NULL CHECK (final_price >= 0),
    seat_number TEXT,
    status TEXT DEFAULT 'disponivel' CHECK (status IN ('disponivel', 'reservado', 'vendido')),
    sale_id UUID REFERENCES public.sales(id) ON DELETE SET NULL,
    order_id UUID REFERENCES public.orders(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.order_snacks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    snack_combo_id UUID NOT NULL REFERENCES public.snack_combos(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sessions_film_id ON public.sessions(film_id);
CREATE INDEX IF NOT EXISTS idx_sessions_room_id ON public.sessions(room_id);
CREATE INDEX IF NOT EXISTS idx_sessions_datetime ON public.sessions(datetime);
CREATE INDEX IF NOT EXISTS idx_sales_session_id ON public.sales(session_id);
CREATE INDEX IF NOT EXISTS idx_sales_purchase_date ON public.sales(purchase_date);
CREATE INDEX IF NOT EXISTS idx_tickets_session_id ON public.tickets(session_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON public.tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_sale_id ON public.tickets(sale_id);
CREATE INDEX IF NOT EXISTS idx_tickets_order_id ON public.tickets(order_id);
CREATE INDEX IF NOT EXISTS idx_order_snacks_order_id ON public.order_snacks(order_id);
CREATE INDEX IF NOT EXISTS idx_snack_combos_category ON public.snack_combos(category);
CREATE INDEX IF NOT EXISTS idx_rooms_cinema_id ON public.rooms(cinema_id);

-- Constraint única para evitar venda duplicada da mesma poltrona
CREATE UNIQUE INDEX IF NOT EXISTS idx_tickets_session_seat 
ON public.tickets(session_id, seat_number) 
WHERE status IN ('reservado', 'vendido') AND seat_number IS NOT NULL;

ALTER TABLE public.cinemas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.films ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.snack_combos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_snacks ENABLE ROW LEVEL SECURITY;

-- Políticas para CINEMAS
CREATE POLICY "Enable all for cinemas" ON public.cinemas FOR ALL USING (true) WITH CHECK (true);

-- Políticas para FILMES
CREATE POLICY "Enable all for films" ON public.films FOR ALL USING (true) WITH CHECK (true);

-- Políticas para SALAS
CREATE POLICY "Enable all for rooms" ON public.rooms FOR ALL USING (true) WITH CHECK (true);

-- Políticas para SESSÕES
CREATE POLICY "Enable all for sessions" ON public.sessions FOR ALL USING (true) WITH CHECK (true);

-- Políticas para VENDAS
CREATE POLICY "Enable all for sales" ON public.sales FOR ALL USING (true) WITH CHECK (true);

-- Políticas para TICKETS
CREATE POLICY "Enable all for tickets" ON public.tickets FOR ALL USING (true) WITH CHECK (true);

-- Políticas para LANCHES/COMBOS
CREATE POLICY "Enable all for snack_combos" ON public.snack_combos FOR ALL USING (true) WITH CHECK (true);

-- Políticas para PEDIDOS
CREATE POLICY "Enable all for orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);

-- Políticas para ITENS DO PEDIDO
CREATE POLICY "Enable all for order_snacks" ON public.order_snacks FOR ALL USING (true) WITH CHECK (true);
