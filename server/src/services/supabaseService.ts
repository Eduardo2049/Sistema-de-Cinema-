import { LocalService } from './localService';

// Backwards-compat shim: previously this module used Supabase. Now re-export the LocalService
export const SupabaseService = LocalService;
