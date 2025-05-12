import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { requireAuth } from '../../../lib/auth';

const QUOTES_FILE = path.join(process.cwd(), 'data', 'quotes.json');

function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const quotes = JSON.parse(fs.readFileSync(QUOTES_FILE, 'utf8'));
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10); // yyyy-mm-dd

    const todayQuotes = quotes.filter((q: any) =>
      q.timestamp && q.timestamp.startsWith(todayStr)
    );

    res.status(200).json({
      count: todayQuotes.length,
      quotes: todayQuotes,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to read quotes' });
  }
}

export default requireAuth(handler);