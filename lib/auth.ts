import { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';

export function requireAuth(handler: any) {
  return (req: NextApiRequest, res: NextApiResponse) => {
    const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
    if (!cookies.token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    // 將用戶名掛到 req 上
    (req as any).username = cookies.token;
    return handler(req, res);
  };
}