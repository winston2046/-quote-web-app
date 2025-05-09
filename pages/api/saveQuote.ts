import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const QUOTES_FILE = path.join(process.cwd(), 'data', 'quotes.json');

// 確保 data 目錄存在
if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
  fs.mkdirSync(path.join(process.cwd(), 'data'));
}

// 如果報價文件不存在，創建一個空的
if (!fs.existsSync(QUOTES_FILE)) {
  fs.writeFileSync(QUOTES_FILE, '[]', 'utf8');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // 讀取現有報價
    const quotes = JSON.parse(fs.readFileSync(QUOTES_FILE, 'utf8'));
    
    // 添加新報價
    const newQuote = {
      ...req.body,
      timestamp: new Date().toISOString(),
      id: `QUOTE-${Date.now()}`
    };
    
    quotes.push(newQuote);
    
    // 保存更新後的報價列表
    fs.writeFileSync(QUOTES_FILE, JSON.stringify(quotes, null, 2), 'utf8');
    
    res.status(200).json({ message: 'Quote saved successfully' });
  } catch (error) {
    console.error('Failed to save quote:', error);
    res.status(500).json({ message: 'Failed to save quote' });
  }
} 