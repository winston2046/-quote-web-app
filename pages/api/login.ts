import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

const USERS: Record<string, string> = {
  winston: '2046',
  miny: 'miny8888',
  // 以後可以繼續加
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  const { username, password } = req.body;
  if (username in USERS && USERS[username] === password) {
    // 設置 httpOnly cookie，記錄用戶名
    res.setHeader('Set-Cookie', serialize('token', username, {
      httpOnly: true,
      path: '/',
      maxAge: 300, // 5分鐘後自動登出
    }));
    // 判斷角色
    const role = username === 'winston' ? 'admin' : 'user';
    return res.status(200).json({ message: 'Login success', username, role });
  }
  return res.status(401).json({ message: 'Invalid credentials' });
}