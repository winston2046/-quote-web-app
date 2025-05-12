import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import { parse } from 'cookie';
import { serialize } from 'cookie';

interface QuoteItem {
  product: string;
  quantity: number;
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { province, city, district, items, totalVolume, pricePerM3 } = req.body;

  const emailContent = `
新的報價查詢：

配送地址：${province} ${city} ${district}

產品明細：
${items.map((item: QuoteItem) => item.product && item.quantity ? `${item.product} × ${item.quantity}` : '').filter(Boolean).join('\n')}

總體積：${totalVolume.toFixed(3)} m³
單價：${pricePerM3} 元/m³
總價：${(totalVolume * (pricePerM3 || 0)).toFixed(2)} 元

查詢時間：${new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.NOTIFY_EMAIL, // 您的接收郵箱
      subject: `新報價查詢 - ${province}${city}${district}`,
      text: emailContent,
    });

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Failed to send email:', error);
    res.status(500).json({ message: 'Failed to send email' });
  }
} 