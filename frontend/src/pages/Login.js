import { useState } from 'react';
import api from '../api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      window.location.href = '/projects';
    } catch {
      setError('Email ou mot de passe incorrect');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: 20, boxShadow: '0 2px 10px rgba(0,0,0,0.1)', borderRadius: 8 }}>
      <h2 style={{ textAlign: 'center', color: '#1a73e8' }}>APJ3D — Login</h2>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
        style={{ width: '100%', marginBottom: 10, padding: 10, borderRadius: 4, border: '1px solid #ddd', boxSizing: 'border-box' }} />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)}
        style={{ width: '100%', marginBottom: 10, padding: 10, borderRadius: 4, border: '1px solid #ddd', boxSizing: 'border-box' }} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleLogin}
        style={{ width: '100%', padding: 10, background: '#1a73e8', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 16 }}>
        Se connecter
      </button>
    </div>
  );
}