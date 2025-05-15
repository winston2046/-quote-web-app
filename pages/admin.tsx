import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

// 清除cookie函数
function deleteCookie(name: string) {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
}

export default function Admin() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');
  const [user, setUser] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // 检查是否有权限访问管理页面
    const match = document.cookie.match(/token=([^;]+)/);
    if (!match || match[1] !== 'winston') {
      router.push('/');
      return;
    }
    
    setUser(match[1]);
    
    fetch('/api/admin/quotes-today')
      .then(res => {
        if (!res.ok) throw new Error('未授權或伺服器錯誤');
        return res.json();
      })
      .then(setData)
      .catch(err => setError(err.message));
  }, [router]);

  const handleLogout = () => {
    // 清除登录cookie
    deleteCookie('token');
    deleteCookie('login_timestamp');
    
    // 返回主页
    router.push('/');
  };

  const handleBack = () => {
    router.push('/');
  };

  return (
    <>
      <Head>
        <title>管理员后台 - 报价系统</title>
        <meta name="description" content="报价系统管理后台" />
      </Head>
      
      {/* 导航栏 */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '15px 20px',
        background: '#333',
        color: 'white'
      }}>
        <div>
          <button 
            onClick={handleBack}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#555', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            返回首页
          </button>
          <span style={{ fontSize: '18px', fontWeight: 'bold' }}>管理员后台</span>
        </div>
        
        {user && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '15px' }}>管理员: {user}</span>
            <button 
              onClick={handleLogout} 
              style={{ 
                padding: '6px 12px', 
                backgroundColor: '#f44336', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer'
              }}
            >
              退出登录
            </button>
          </div>
        )}
      </div>
      
      <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 20px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>询价记录查询</h2>
        {error && <div style={{ color: 'red', padding: '10px', background: '#ffeeee', borderRadius: '4px', marginBottom: '20px' }}>{error}</div>}
        {data && (
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ border: '1px solid #ddd', padding: 10 }}>用户名</th>
                <th style={{ border: '1px solid #ddd', padding: 10 }}>查询时间</th>
                <th style={{ border: '1px solid #ddd', padding: 10 }}>地址</th>
                <th style={{ border: '1px solid #ddd', padding: 10 }}>总体积(m³)</th>
                <th style={{ border: '1px solid #ddd', padding: 10 }}>总金额(元)</th>
                <th style={{ border: '1px solid #ddd', padding: 10 }}>IP地址</th>
              </tr>
            </thead>
            <tbody>
              {data.quotes.map((q: any, idx: number) => (
                <tr key={q.id || idx}>
                  <td style={{ border: '1px solid #ddd', padding: 10 }}>{q.username || '未知'}</td>
                  <td style={{ border: '1px solid #ddd', padding: 10 }}>{q.timestamp ? new Date(q.timestamp).toLocaleString() : ''}</td>
                  <td style={{ border: '1px solid #ddd', padding: 10 }}>{q.province} {q.city} {q.district}</td>
                  <td style={{ border: '1px solid #ddd', padding: 10 }}>{q.totalVolume}</td>
                  <td style={{ border: '1px solid #ddd', padding: 10 }}>{q.pricePerM3 && q.totalVolume ? (q.pricePerM3 * q.totalVolume).toFixed(2) : ''}</td>
                  <td style={{ border: '1px solid #ddd', padding: 10 }}>{q.ip || '未知'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}