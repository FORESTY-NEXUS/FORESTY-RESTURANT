'use client';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [terms, setTerms] = useState(false);
  const { register, loginWithGoogle } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!terms) {
      setError('You must accept the Terms & Conditions.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await register(name, email, password, phone, role);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
     try {
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
        maxWidth: '450px',
        backdropFilter: 'blur(10px)'
      }}>
        <h2 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Register</h2>
        <p style={{ textAlign: 'center', color: 'rgba(245,245,245,.5)', marginBottom: '30px' }}>Join the FORESTY family</p>
        
        {error && <p style={{ color: 'var(--red)', textAlign: 'center', marginBottom: '15px', background: 'rgba(193, 18, 31, 0.1)', padding: '10px', borderRadius: '8px' }}>{error}</p>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="nav-search" style={{ width: '100%', borderRadius: '12px' }}>
            <input 
              type="text" 
              placeholder="Full Name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
          </div>
          <div className="nav-search" style={{ width: '100%', borderRadius: '12px' }}>
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="nav-search" style={{ width: '100%', borderRadius: '12px' }}>
            <input 
              type="tel" 
              placeholder="Phone Number" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required 
            />
          </div>
          <div className="nav-search" style={{ width: '100%', borderRadius: '12px' }}>
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <p style={{ fontSize: '.85rem', color: 'rgba(245,245,245,.6)', paddingLeft: '5px' }}>I am a:</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                type="button" 
                onClick={() => setRole('customer')}
                style={{ 
                  flex: 1, 
                  padding: '10px', 
                  borderRadius: '10px', 
                  border: '1px solid var(--glass-border)',
                  background: role === 'customer' ? 'var(--red)' : 'var(--glass)',
                  color: '#fff',
                  cursor: 'pointer',
                  transition: 'all .3s'
                }}
              >
                Customer
              </button>
              <button 
                type="button" 
                onClick={() => setRole('delivery')}
                style={{ 
                  flex: 1, 
                  padding: '10px', 
                  borderRadius: '10px', 
                  border: '1px solid var(--glass-border)',
                  background: role === 'delivery' ? 'var(--red)' : 'var(--glass)',
                  color: '#fff',
                  cursor: 'pointer',
                  transition: 'all .3s'
                }}
              >
                Delivery Agent
              </button>
            </div>
          </div>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '.85rem', color: 'rgba(245,245,245,.8)', cursor: 'pointer' }}>
             <input type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)} style={{ accentColor: 'var(--red)', width: '16px', height: '16px' }} />
             I agree to the Terms & Conditions
          </label>

          <button type="submit" className="btn-primary" disabled={loading} style={{ justifyContent: 'center', borderRadius: '12px', marginTop: '10px', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Creating Account...' : 'Create Account'}
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
          Already have an account? <Link href="/login" style={{ color: 'var(--yellow)', fontWeight: '600' }}>Login</Link>
        </p>
      </div>
    </div>
  );
}
