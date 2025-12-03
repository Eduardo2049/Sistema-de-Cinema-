import { supabase } from '../lib/supabase';

export class SupabaseService {
    /**
     * Busca todos os registros de uma tabela
     */
    static async getAll<T>(table: string): Promise<{ data: T[] | null; error: any }> {
        const { data, error } = await supabase
            .from(table)
            .select('*')
            .order('created_at', { ascending: false });

        return { data, error };
    }

    /**
     * Busca um registro específico por ID
     */
    static async getById<T>(table: string, id: string): Promise<{ data: T | null; error: any }> {
        const { data, error } = await supabase
            .from(table)
            .select('*')
            .eq('id', id)
            .single();

        return { data, error };
    }

    /**
     * Cria um novo registro
     */
    static async create<T>(table: string, item: Partial<T>): Promise<{ data: T | null; error: any }> {
        const { data, error } = await supabase
            .from(table)
            .insert(item)
            .select()
            .single();

        return { data, error };
    }

    /**
     * Atualiza um registro existente
     */
    static async update<T>(table: string, id: string, updates: Partial<T>): Promise<{ data: T | null; error: any }> {
        const { data, error } = await supabase
            .from(table)
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        return { data, error };
    }

    /**
     * Remove um registro
     */
    static async delete(table: string, id: string): Promise<{ error: any }> {
        const { error } = await supabase
            .from(table)
            .delete()
            .eq('id', id);

        return { error };
    }

    /**
     * Busca sessões com informações de filmes e salas (JOIN)
     */
    static async getSessionsWithDetails() {
        const { data, error } = await supabase
            .from('sessions')
            .select(`
        *,
        films (id, title),
        rooms (id, name)
      `)
            .order('datetime', { ascending: true });

        return { data, error };
    }

    /**
     * Busca vendas com informações de sessões (JOIN)
     */
    static async getSalesWithDetails() {
        const { data, error } = await supabase
            .from('sales')
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
            .order('purchase_date', { ascending: false });

        return { data, error };
    }
}
