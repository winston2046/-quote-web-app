import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      router.push('/admin');
    } else {
      setError('帳號或密碼錯誤');
    }
  };

  return (
    <div style={{ maxWidth: 320, margin: '100px auto', padding: 24, border: '1px solid #eee', borderRadius: 8 }}>
      <h2>管理員登入</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="帳號"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={{ width: '100%', marginBottom: 12, padding: 8 }}
        />
        <input
          type="password"
          placeholder="密碼"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: '100%', marginBottom: 12, padding: 8 }}
        />
        <button type="submit" style={{ width: '100%', padding: 8 }}>登入</button>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      </form>
    </div>
  );
}