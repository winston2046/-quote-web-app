import { useEffect, useState } from 'react';

export default function Admin() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/quotes-today')
      .then(res => {
        if (!res.ok) throw new Error('未授權或伺服器錯誤');
        return res.json();
      })
      .then(setData)
      .catch(err => setError(err.message));
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: '40px auto' }}>
      <h2>今日詢價詳細記錄</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {data && (
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ border: '1px solid #ddd', padding: 8 }}>用戶名</th>
              <th style={{ border: '1px solid #ddd', padding: 8 }}>查詢時間</th>
              <th style={{ border: '1px solid #ddd', padding: 8 }}>地點</th>
              <th style={{ border: '1px solid #ddd', padding: 8 }}>總體積(m³)</th>
              <th style={{ border: '1px solid #ddd', padding: 8 }}>總金額(元)</th>
              <th style={{ border: '1px solid #ddd', padding: 8 }}>IP地址</th>
            </tr>
          </thead>
          <tbody>
            {data.quotes.map((q: any, idx: number) => (
              <tr key={q.id || idx}>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>{q.username || '未知'}</td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>{q.timestamp ? new Date(q.timestamp).toLocaleString() : ''}</td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>{q.province} {q.city} {q.district}</td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>{q.totalVolume}</td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>{q.pricePerM3 && q.totalVolume ? (q.pricePerM3 * q.totalVolume).toFixed(2) : ''}</td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>{q.ip || '未知'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}