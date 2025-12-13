import { Low, JSONFile } from 'lowdb';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync, existsSync } from 'fs';

type DBSchema = {
  films: any[];
  sessions: any[];
  rooms: any[];
  snack_combos: any[];
  orders: any[];
  tickets: any[];
  order_snacks: any[];
  sales: any[];
};

const dataDir = join(process.cwd(), 'server', 'data');
if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });

const file = join(dataDir, 'db.json');
const adapter = new JSONFile<DBSchema>(file);
export const db = new Low<DBSchema>(adapter);

export async function initDb() {
  await db.read();
  db.data ||= {
    films: [],
    sessions: [],
    rooms: [],
    snack_combos: [],
    orders: [],
    tickets: [],
    order_snacks: [],
    sales: []
  };
  await db.write();
}
