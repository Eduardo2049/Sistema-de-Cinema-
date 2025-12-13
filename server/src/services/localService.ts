import { db, initDb } from '../db';
import { nanoid } from 'nanoid';

// ensure DB initialized when module is imported
const _initPromise = initDb();

export const LocalService = {
  _init: _initPromise,
  async getAll<T>(table: string): Promise<{ data: T[]; error: null } | { data: null; error: string }> {
    await _initPromise;
    const data = (db.data as any)[table];
    if (!data) return { data: null, error: `Table ${table} not found` };
    return { data: data as T[], error: null };
  },

  async getById<T>(table: string, id: string): Promise<{ data: T | null; error: any }> {
    await _initPromise;
    const arr = (db.data as any)[table];
    if (!arr) return { data: null, error: `Table ${table} not found` };
    const item = arr.find((r: any) => r.id === id) || null;
    return { data: item, error: null };
  },

  async create<T>(table: string, item: Partial<T>): Promise<{ data: any; error: any }> {
    await _initPromise;
    const arr = (db.data as any)[table];
    if (!arr) return { data: null, error: `Table ${table} not found` };
    const now = new Date().toISOString();
    const newItem = { id: nanoid(), ...item, created_at: now };
    arr.unshift(newItem);
    await db.write();
    return { data: newItem, error: null };
  },

  async update<T>(table: string, id: string, updates: Partial<T>): Promise<{ data: any; error: any }> {
    await _initPromise;
    const arr = (db.data as any)[table];
    if (!arr) return { data: null, error: `Table ${table} not found` };
    const idx = arr.findIndex((r: any) => r.id === id);
    if (idx === -1) return { data: null, error: 'Not found' };
    arr[idx] = { ...arr[idx], ...updates, updated_at: new Date().toISOString() };
    await db.write();
    return { data: arr[idx], error: null };
  },

  async delete(table: string, id: string): Promise<{ error: any }> {
    await _initPromise;
    const arr = (db.data as any)[table];
    if (!arr) return { error: `Table ${table} not found` };
    const idx = arr.findIndex((r: any) => r.id === id);
    if (idx === -1) return { error: 'Not found' };
    arr.splice(idx, 1);
    await db.write();
    return { error: null };
  },

  async getSessionsWithDetails() {
    await _initPromise;
    const sessions = (db.data as any).sessions || [];
    const films = (db.data as any).films || [];
    const rooms = (db.data as any).rooms || [];

    const data = sessions.map((s: any) => ({
      ...s,
      films: films.find((f: any) => f.id === s.film_id) || null,
      rooms: rooms.find((r: any) => r.id === s.room_id) || null
    }));

    return { data, error: null };
  },

  async getSalesWithDetails() {
    await _initPromise;
    const sales = (db.data as any).sales || [];
    const sessions = (db.data as any).sessions || [];
    const films = (db.data as any).films || [];
    const rooms = (db.data as any).rooms || [];

    const data = sales.map((sale: any) => ({
      ...sale,
      sessions: sessions.find((s: any) => s.id === sale.session_id) || null
    })).map((s: any) => ({
      ...s,
      sessions: s.sessions ? { ...s.sessions, films: films.find((f: any) => f.id === s.sessions.film_id) || null, rooms: rooms.find((r: any) => r.id === s.sessions.room_id) || null } : null
    }));

    return { data, error: null };
  }
};
