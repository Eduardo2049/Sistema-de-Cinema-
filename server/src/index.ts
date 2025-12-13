import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { LocalService } from './services/localService';
import { db, initDb } from './db';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 4000;

// ensure DB initialized (start initialization in background)
initDb();

// Generic CRUD endpoints for tables like films, snack_combos, rooms, sessions
app.get('/api/:table', async (req: Request, res: Response) => {
  const { table } = req.params;
  try {
    const { data, error } = await LocalService.getAll(table);
    if (error) return res.status(500).json({ error });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.get('/api/:table/:id', async (req: Request, res: Response) => {
  const { table, id } = req.params;
  try {
    const { data, error } = await LocalService.getById(table, id);
    if (error) return res.status(500).json({ error });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.post('/api/:table', async (req: Request, res: Response) => {
  const { table } = req.params;
  const payload = req.body;
  try {
    // special-casing orders to create tickets/snacks atomically would go here
    const { data, error } = await LocalService.create(table, payload as any);
    if (error) return res.status(500).json({ error });
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.put('/api/:table/:id', async (req: Request, res: Response) => {
  const { table, id } = req.params;
  const payload = req.body;
  try {
    const { data, error } = await LocalService.update(table, id, payload as any);
    if (error) return res.status(500).json({ error });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.delete('/api/:table/:id', async (req: Request, res: Response) => {
  const { table, id } = req.params;
  try {
    const { error } = await LocalService.delete(table, id);
    if (error) return res.status(500).json({ error });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// Sessions with join details
app.get('/api/sessions/details', async (req: Request, res: Response) => {
  try {
    const { data, error } = await LocalService.getSessionsWithDetails();
    if (error) return res.status(500).json({ error });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// Sales / orders with details
app.get('/api/sales/details', async (req: Request, res: Response) => {
  try {
    const { data, error } = await LocalService.getSalesWithDetails();
    if (error) return res.status(500).json({ error });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// Example: create an order endpoint that performs the inserts for order, tickets and order_snacks
app.post('/api/orders/create', async (req: Request, res: Response) => {
  const orderData = req.body;

  try {
    // calculate totals similarly to frontend service
    const ticketTotal = (orderData.sessionPrice || 0) * ((orderData.ticketQuantities?.inteira || 0) + 0.5 * (orderData.ticketQuantities?.meia || 0));
    const snackTotal = (orderData.snacks || []).reduce((acc: number, s: any) => acc + (s.unitPrice * s.quantity), 0);
    const totalAmount = ticketTotal + snackTotal;

    const { data: orderDb, error: orderError } = await (async () => {
      const payload = {
        customer_name: orderData.customerName,
        customer_email: orderData.customerEmail,
        session_id: orderData.sessionId,
        total_tickets: ticketTotal,
        total_snacks: snackTotal,
        total_amount: totalAmount,
        status: 'pendente',
        payment_method: orderData.paymentMethod
      };
      return await LocalService.create('orders', payload as any);
    })();

    if (orderError) throw orderError;

  if (!orderDb || !(orderDb as any).id) throw new Error('Failed to create order');

  const orderId = (orderDb as any).id as string;

    // create tickets
    const tickets: any[] = [];
    const quantities = orderData.ticketQuantities || { inteira: 0, meia: 0 };
    const seats = orderData.selectedSeats || [];
    let seatIdx = 0;

    for (let i = 0; i < quantities.inteira; i++) {
      tickets.push({
        session_id: orderData.sessionId,
        ticket_type: 'inteira',
        base_price: orderData.sessionPrice,
        final_price: orderData.sessionPrice,
        seat_number: seats[seatIdx] || null,
        status: 'vendido',
        order_id: orderId
      });
      seatIdx++;
    }
    for (let i = 0; i < quantities.meia; i++) {
      tickets.push({
        session_id: orderData.sessionId,
        ticket_type: 'meia',
        base_price: orderData.sessionPrice,
        final_price: (orderData.sessionPrice || 0) * 0.5,
        seat_number: seats[seatIdx] || null,
        status: 'vendido',
        order_id: orderId
      });
      seatIdx++;
    }

    if (tickets.length > 0) {
      const { error } = await LocalService.create('tickets', tickets as any);
      // LocalService.create expects a single item; for multiple tickets write directly to db
      if (error) {
        // fallback: push all tickets
        const arr = (db.data as any).tickets;
        tickets.forEach((t: any) => arr.unshift({ id: require('nanoid').nanoid(), ...t, created_at: new Date().toISOString() }));
        await db.write();
      }
    }

    // create order snacks
    if ((orderData.snacks || []).length > 0) {
      const orderSnacks = (orderData.snacks || []).map((s: any) => ({
        order_id: orderId,
        snack_combo_id: s.snackComboId,
        quantity: s.quantity,
        unit_price: s.unitPrice,
        subtotal: s.unitPrice * s.quantity
      }));

      // push order snacks
      const arrSnacks = (db.data as any).order_snacks;
      orderSnacks.forEach((s: any) => arrSnacks.unshift({ id: require('nanoid').nanoid(), ...s, created_at: new Date().toISOString() }));
      await db.write();
    }

    // return full order
    const { data: fullOrder, error: fullErr } = await LocalService.getById('orders', orderId);
    if (fullErr) throw fullErr;

    res.status(201).json(fullOrder);
  } catch (err: any) {
    res.status(500).json({ error: String(err) });
  }
});


app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${port}`);
});
