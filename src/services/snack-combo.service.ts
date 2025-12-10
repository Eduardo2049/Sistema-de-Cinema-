import { supabase } from '../lib/supabase';
import { SnackCombo } from '../types';

export class SnackComboService {
    /**
     * Buscar todos os lanches/combos
     */
    static async getAll(): Promise<SnackCombo[]> {
        const { data, error } = await supabase
            .from('snack_combos')
            .select('*')
            .order('category', { ascending: true })
            .order('name', { ascending: true });

        if (error) throw error;
        return this.mapFromDatabase(data || []);
    }

    /**
     * Buscar apenas lanches/combos disponíveis
     */
    static async getAvailable(): Promise<SnackCombo[]> {
        const { data, error } = await supabase
            .from('snack_combos')
            .select('*')
            .eq('is_available', true)
            .order('category', { ascending: true })
            .order('name', { ascending: true });

        if (error) throw error;
        return this.mapFromDatabase(data || []);
    }

    /**
     * Buscar por categoria
     */
    static async getByCategory(category: string): Promise<SnackCombo[]> {
        const { data, error } = await supabase
            .from('snack_combos')
            .select('*')
            .eq('category', category)
            .eq('is_available', true)
            .order('name', { ascending: true });

        if (error) throw error;
        return this.mapFromDatabase(data || []);
    }

    /**
     * Criar novo lanche/combo
     */
    static async create(snackCombo: SnackCombo): Promise<SnackCombo> {
        const dbData = this.mapToDatabase(snackCombo);
        const { data, error } = await supabase
            .from('snack_combos')
            .insert([dbData])
            .select()
            .single();

        if (error) throw error;
        return this.mapFromDatabase([data])[0];
    }

    /**
     * Atualizar lanche/combo
     */
    static async update(id: string, snackCombo: Partial<SnackCombo>): Promise<SnackCombo> {
        const dbData = this.mapToDatabase(snackCombo);
        const { data, error } = await supabase
            .from('snack_combos')
            .update(dbData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return this.mapFromDatabase([data])[0];
    }

    /**
     * Deletar lanche/combo
     */
    static async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('snack_combos')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }

    /**
     * Alternar disponibilidade
     */
    static async toggleAvailability(id: string, isAvailable: boolean): Promise<SnackCombo> {
        const { data, error } = await supabase
            .from('snack_combos')
            .update({ is_available: isAvailable })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return this.mapFromDatabase([data])[0];
    }

    /**
     * Calcular subtotal
     */
    static calculateSubtotal(unitPrice: number, quantity: number): number {
        return unitPrice * quantity;
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

    // ============================================
    // MAPEAMENTO DATABASE <-> TYPESCRIPT
    // ============================================

    private static mapFromDatabase(data: any[]): SnackCombo[] {
        return data.map(item => ({
            id: item.id,
            name: item.name,
            description: item.description,
            unitPrice: parseFloat(item.unit_price),
            itemsQuantity: item.items_quantity,
            category: item.category,
            isAvailable: item.is_available,
            imageUrl: item.image_url,
            created_at: item.created_at
        }));
    }

    private static mapToDatabase(snackCombo: Partial<SnackCombo>): any {
        const dbData: any = {};

        if (snackCombo.name !== undefined) dbData.name = snackCombo.name;
        if (snackCombo.description !== undefined) dbData.description = snackCombo.description;
        if (snackCombo.unitPrice !== undefined) dbData.unit_price = snackCombo.unitPrice;
        if (snackCombo.itemsQuantity !== undefined) dbData.items_quantity = snackCombo.itemsQuantity;
        if (snackCombo.category !== undefined) dbData.category = snackCombo.category;
        if (snackCombo.isAvailable !== undefined) dbData.is_available = snackCombo.isAvailable;
        if (snackCombo.imageUrl !== undefined) dbData.image_url = snackCombo.imageUrl;

        return dbData;
    }
}
