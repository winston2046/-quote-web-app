import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

const USER = 'winston';
const PASS = '2046';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  const { username, password } = req.body;
  if (username === USER && password === PASS) {
    // 設置 httpOnly cookie
    res.setHeader('Set-Cookie', serialize('token', 'admin', {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 8, // 8小時
    }));
    return res.status(200).json({ message: 'Login success' });
  }
  return res.status(401).json({ message: 'Invalid credentials' });
}