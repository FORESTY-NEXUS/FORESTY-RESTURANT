'use client';
import { useState, useEffect } from 'react';
import api from '../lib/api';
import { MapPin, Phone, CheckCircle, Smartphone } from 'lucide-react';

export default function DeliveryPage() {
  const [orders, setOrders] = useState([]);
  const [verifying, setVerifying] = useState(null); // ID of order being verified
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignedOrders();
  }, []);

  const fetchAssignedOrders = async () => {
    try {
      const { data } = await api.get('/delivery/orders');
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    try {
      await api.post('/otp/verify', { orderId: verifying, otp });
      setVerifying(null);
      setOtp('');
      fetchAssignedOrders();
      alert('Delivery Confirmed!');
    } catch (err) {
      alert(err.response?.data?.message || 'Invalid OTP');
    }
  };

  if (loading) return <div className="section"><p>Loading assignments...</p></div>;

  return (
    <div className="section" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 className="section-title">Your Assignments</h2>
      
      {orders.length === 0 ? (
        <div className="menu-empty">
          <h3>No orders assigned</h3>
          <p>New orders will appear here when assigned by the admin.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map((order) => (
            <div key={order._id} className="reveal visible" style={{ 
              background: 'var(--glass)', 
              border: '1px solid var(--glass-border)', 
              borderRadius: '20px', 
              padding: '25px' 
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <h3 style={{ fontSize: '1.1rem' }}>Order #{order._id.slice(-6).toUpperCase()}</h3>
                <span style={{ fontSize: '.8rem', color: 'var(--yellow)', fontWeight: '700' }}>{order.status}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '12px', fontSize: '.9rem', color: 'rgba(245,245,245,.7)' }}>
                  <MapPin size={18} color="var(--red)" />
                  <span>{order.address}</span>
                </div>
                <div style={{ display: 'flex', gap: '12px', fontSize: '.9rem', color: 'rgba(245,245,245,.7)' }}>
                  <Phone size={18} color="var(--red)" />
                  <span>{order.phone} ({order.userId?.name})</span>
                </div>
              </div>

              {verifying === order._id ? (
                <form onSubmit={verifyOTP} style={{ background: 'rgba(244,180,0,0.05)', padding: '20px', borderRadius: '15px', border: '1px solid var(--yellow)' }}>
                  <p style={{ fontSize: '.85rem', marginBottom: '10px', textAlign: 'center' }}>Enter customer's 6-digit OTP</p>
                  <div className="nav-search" style={{ width: '100%', marginBottom: '15px', borderRadius: '10px', background: '#000' }}>
                    <Smartphone size={18} />
                    <input 
                      type="text" 
                      maxLength={6} 
                      placeholder="000000" 
                      value={otp} 
                      onChange={e => setOtp(e.target.value)} 
                      style={{ textAlign: 'center', fontSize: '1.2rem', letterSpacing: '5px' }}
                      required 
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Verify & Complete</button>
                    <button type="button" onClick={() => setVerifying(null)} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                  </div>
                </form>
              ) : (
                <button 
                  onClick={() => setVerifying(order._id)}
                  className="btn-primary" 
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <CheckCircle size={18} style={{ marginRight: '10px' }} />
                  Complete Delivery
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
