import type { NextApiRequest, NextApiResponse } from 'next';

const quotes = [
  {
    id: 1,
    text: "生活就像一盒巧克力，你永远不知道下一块是什么味道。",
    author: "阿甘正传"
  },
  {
    id: 2,
    text: "要么创新，要么死亡。",
    author: "盖伊·川崎"
  },
  {
    id: 3,
    text: "成功不是偶然的，而是必然的。",
    author: "未知"
  }
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).json(quotes);
}
