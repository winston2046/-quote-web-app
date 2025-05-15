import { useState, useEffect } from 'react';

interface LoginModalProps {
  onSuccess?: (username: string) => void;
  isOpen: boolean;
}

export default function LoginModal({ onSuccess, isOpen }: LoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 当模态框打开时重置表单
  useEffect(() => {
    if (isOpen) {
      setError('');
      setUsername('');
      setPassword('');
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('登录成功!', data);

        // 刷新页面以应用新的登录状态
        if (onSuccess) {
          onSuccess(username);
        } else {
          window.location.reload();
        }
      } else {
        setError(data.message || '用户名或密码错误');
      }
    } catch (err) {
      console.error('登录请求错误:', err);
      setError('网络错误，请稍后再试');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  // 使用内联样式确保模态框居中显示，并有粉红色半透明背景
  const modalStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  };

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // 黑色半透明背景
    zIndex: 999,
  };

  const contentStyle: React.CSSProperties = {
    width: '350px',
    maxWidth: '90%',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '28px',
    position: 'relative',
    zIndex: 1001,
  };

  return (
    <div style={modalStyle}>
      {/* 粉红色半透明背景 */}
      <div style={overlayStyle}></div>

      {/* 登录窗口内容 */}
      <div style={contentStyle}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 'bold', color: '#1F2937', marginBottom: '8px' }}>登陆</h2>
          <p style={{ color: '#6B7280', fontSize: '15px' }}>请输入您的账号和密码</p>
        </div>

        {error && (
          <div style={{
            marginBottom: '16px',
            padding: '12px',
            backgroundColor: '#FEF2F2',
            color: '#DC2626',
            borderRadius: '8px',
            border: '1px solid #FECACA',
            display: 'flex',
            alignItems: 'center'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '20px', height: '20px', marginRight: '8px' }} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
          <div style={{ width: '100%', textAlign: 'center' }}>
            <label style={{
              display: 'block',
              color: '#4B5563',
              fontSize: '15px',
              fontWeight: '500',
              marginBottom: '10px',
              textAlign: 'center'
            }} htmlFor="username">
              用户名
            </label>
            <input
              id="username"
              type="text"
              style={{
                width: '85%',
                padding: '12px 15px',
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                outline: 'none',
                fontSize: '15px',
                textAlign: 'center'
              }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
              placeholder="请输入用户名"
            />
          </div>

          <div style={{ width: '100%', textAlign: 'center' }}>
            <label style={{
              display: 'block',
              color: '#4B5563',
              fontSize: '15px',
              fontWeight: '500',
              marginBottom: '10px',
              textAlign: 'center'
            }} htmlFor="password">
              密码
            </label>
            <input
              id="password"
              type="password"
              style={{
                width: '85%',
                padding: '12px 15px',
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                outline: 'none',
                fontSize: '15px',
                textAlign: 'center'
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              placeholder="请输入密码"
            />
          </div>

          <button
            type="submit"
            style={{
              width: '85%',
              padding: '12px 16px',
              backgroundColor: isLoading ? '#9CA3AF' : '#000000',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '500',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '10px',
              fontSize: '16px'
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg style={{
                  animation: 'spin 1s linear infinite',
                  marginRight: '8px',
                  width: '16px',
                  height: '16px'
                }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle style={{ opacity: '0.25' }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path style={{ opacity: '0.75' }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                登录中...
              </span>
            ) : '登录'}
          </button>
        </form>
      </div>
    </div>
  );
}