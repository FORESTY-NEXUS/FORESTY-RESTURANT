'use client';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import { CheckCircle, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const { forgotPassword } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
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
        <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: '10px' }}>Reset Password</h2>
        <p style={{ textAlign: 'center', color: 'rgba(245,245,245,.5)', marginBottom: '30px' }}>
          Enter your email to receive reset instructions
        </p>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <CheckCircle size={48} color="var(--yellow)" style={{ margin: '0 auto 20px' }} />
            <h3 style={{ marginBottom: '10px' }}>Check your email</h3>
            <p style={{ color: 'rgba(245,245,245,.7)', fontSize: '.9rem' }}>
              We've sent password reset instructions to <strong>{email}</strong>
            </p>
            <Link href="/login" style={{ display: 'inline-block', marginTop: '20px', color: 'var(--yellow)', fontWeight: '600' }}>
              Back to Login
            </Link>
          </div>
        ) : (
          <>
            {error && <p style={{ color: 'var(--red)', textAlign: 'center', marginBottom: '15px', background: 'rgba(193, 18, 31, 0.1)', padding: '10px', borderRadius: '8px' }}>{error}</p>}
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="nav-search" style={{ width: '100%', borderRadius: '12px' }}>
                <Mail size={18} />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%' }}
                  required 
                />
              </div>
              
              <button type="submit" className="btn-primary" disabled={loading} style={{ justifyContent: 'center', borderRadius: '12px' }}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
            
            <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '.9rem', color: 'rgba(245,245,245,.6)' }}>
              Remember your password? <Link href="/login" style={{ color: 'var(--yellow)', fontWeight: '600' }}>Back to Login</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
