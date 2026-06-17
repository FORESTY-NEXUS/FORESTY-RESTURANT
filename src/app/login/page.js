'use client';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
     try {
         // In real implementation, this gets an idToken from Google popup
         await loginWithGoogle('dummy-token');
     } catch (err) {
         setError('Google login currently disabled pending API keys.');
     }
  };

  return (
    <div className="section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="reveal visible" style={{ 
        background: 'var(--glass)', 
        border: '1px solid var(--glass-border)', 
        borderRadius: '20px', 
        padding: '40px', 
        width: '100%', 
        maxWidth: '400px',
        backdropFilter: 'blur(10px)'
      }}>
        <h2 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Login</h2>
        <p style={{ textAlign: 'center', color: 'rgba(245,245,245,.5)', marginBottom: '30px' }}>Welcome back to FORESTY</p>
        
        {error && <p style={{ color: 'var(--red)', textAlign: 'center', marginBottom: '15px', background: 'rgba(193, 18, 31, 0.1)', padding: '10px', borderRadius: '8px' }}>{error}</p>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="nav-search" style={{ width: '100%', borderRadius: '12px' }}>
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <div className="nav-search" style={{ width: '100%', borderRadius: '12px' }}>
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            <Link href="/forgot-password" style={{ color: 'rgba(245,245,245,.6)', fontSize: '.8rem', textAlign: 'right', marginTop: '5px' }}>
              Forgot Password?
            </Link>
          </div>
          <button type="submit" className="btn-primary" disabled={loading} style={{ justifyContent: 'center', borderRadius: '12px', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ margin: '25px 0', display: 'flex', alignItems: 'center', textAlign: 'center', color: 'rgba(245,245,245,.3)' }}>
             <hr style={{ flex: 1, borderTop: '1px solid rgba(255,255,255,0.1)' }} />
             <span style={{ padding: '0 10px', fontSize: '.8rem' }}>OR</span>
             <hr style={{ flex: 1, borderTop: '1px solid rgba(255,255,255,0.1)' }} />
        </div>

        <button onClick={handleGoogleLogin} style={{ 
            width: '100%', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', 
            border: '1px solid rgba(255,255,255,0.2)', color: 'white', display: 'flex', 
            justifyContent: 'center', alignItems: 'center', gap: '10px', cursor: 'pointer',
            transition: 'background 0.3s'
        }}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" style={{ width: '18px', height: '18px' }} />
            Continue with Google
        </button>
        
        <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '.9rem', color: 'rgba(245,245,245,.6)' }}>
          Don't have an account? <Link href="/register" style={{ color: 'var(--yellow)', fontWeight: '600' }}>Register Now</Link>
        </p>
      </div>
    </div>
  );
}
