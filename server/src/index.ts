import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import db from './db';
import { getAllWeights, upsertWeight, initDB } from './db';
import dayjs from 'dayjs';

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 4000;

app.use(cors());
app.use(bodyParser.json());

app.get('/api/weights', async (req, res) => {
  try {
    const rows = await getAllWeights();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'failed to load weights' });
  }
});

app.post('/api/weights', async (req, res) => {
  const { date, weight, waist } = req.body;
  if (typeof weight !== 'number' || Number.isNaN(weight)) {
    res.status(400).json({ error: 'weight must be a number' });
    return;
  }
  const parsedWaist = typeof waist === 'number' && !Number.isNaN(waist) ? waist : null;
  const usedDate = date ? String(date) : dayjs().format('YYYY-MM-DD');
  try {
    await upsertWeight(usedDate, weight, parsedWaist);
    res.status(201).json({ date: usedDate, weight, waist: parsedWaist });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'failed to save weight' });
  }
});

async function start() {
  try {
    await initDB();
    app.listen(port, () => {
      console.log(`Weight monitor server listening on http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();
