import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

const USERS: Record<string, string> = {
  winston: '2046',
  miny: 'miny8888',
  lda: '888888',
  // 以後可以繼續加
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, password } = req.body;

  if (username in USERS && USERS[username] === password) {
    console.log('登录验证成功:', username);

    const now = new Date();

    // 設置 cookie，记录用户名和登录时间
    res.setHeader('Set-Cookie', [
      // 主要认证token
      serialize('token', username, {
        httpOnly: false, // 客户端JavaScript可以访问
        path: '/',
        maxAge: 24 * 60 * 60, // 24小时有效期
        sameSite: 'strict',
      }),
      // 添加时间戳cookie，防止循环重定向
      serialize('login_timestamp', now.getTime().toString(), {
        httpOnly: false,
        path: '/',
        maxAge: 24 * 60 * 60,
        sameSite: 'strict',
      })
    ]);

    // 判断角色
    const role = username === 'winston' ? 'admin' : 'user';

    return res.status(200).json({
      message: 'Login success',
      username,
      role,
      loginTime: now.toISOString()
    });
  }

  console.log('登录失败：无效凭据', username);
  return res.status(401).json({ message: '用户名或密码错误' });
}