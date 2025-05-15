import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { requireAuth } from '../../lib/auth';

const QUOTES_FILE = path.join(process.cwd(), 'data', 'quotes.json');

// 確保 data 目錄存在
if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
  fs.mkdirSync(path.join(process.cwd(), 'data'));
}

// 如果報價文件不存在，創建一個空的
if (!fs.existsSync(QUOTES_FILE)) {
  fs.writeFileSync(QUOTES_FILE, '[]', 'utf8');
}

function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const quotes = JSON.parse(fs.readFileSync(QUOTES_FILE, 'utf8'));
    // 获取真实IP地址 - 处理各种代理和部署环境
    const ip =
      req.headers['x-real-ip'] ||
      req.headers['x-forwarded-for'] ||
      req.headers['cf-connecting-ip'] ||
      req.socket.remoteAddress ||
      '';

    // 确保IP是字符串并处理可能的数组
    const clientIp = Array.isArray(ip)
      ? ip[0]
      : typeof ip === 'string'
        ? ip.split(',')[0].trim()
        : '';
    // 直接從 req 取用戶名
    const username = (req as any).username || '未知';

    const newQuote = {
      ...req.body,
      username,
      ip: clientIp,
      timestamp: new Date().toISOString(),
      id: `QUOTE-${Date.now()}`
    };

    quotes.push(newQuote);

    fs.writeFileSync(QUOTES_FILE, JSON.stringify(quotes, null, 2), 'utf8');

    res.status(200).json({ message: 'Quote saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save quote' });
  }
}

export default requireAuth(handler);