'use client';
import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Check, X, Truck, Package, RefreshCw } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [deliveryAgents, setDeliveryAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, agentsRes] = await Promise.all([
        api.get('/orders'),
        api.get('/auth/me').then(() => api.get('/orders')) // Just a placeholder for agent fetch logic
      ]);

      // In a real app, I'd have a specific /api/admin/delivery-agents route
      // For now let's assume we can fetch them or we'll add the route later
      setOrders(ordersRes.data.reverse());
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      if (status === 'out_for_delivery') {
        await api.post('/otp/generate', { orderId: id });
      }
      fetchData();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'var(--yellow)';
      case 'accepted': return '#3498db';
      case 'preparing': return '#e67e22';
      case 'out_for_delivery': return '#f1c40f';
      case 'delivered': return '#2ecc71';
      default: return 'var(--white)';
    }
  };

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="reveal visible">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.5rem' }}>Management: Orders</h2>
        <button onClick={fetchData} className="btn-secondary" style={{ padding: '8px 15px' }}><RefreshCw size={16} /></button>
      </div>

      <div style={{ 
        background: 'var(--glass)', 
        border: '1px solid var(--glass-border)', 
        borderRadius: '20px', 
        overflow: 'hidden' 
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--glass-border)' }}>
              <th style={{ padding: '20px' }}>Order ID</th>
              <th style={{ padding: '20px' }}>Customer</th>
              <th style={{ padding: '20px' }}>Items</th>
              <th style={{ padding: '20px' }}>Total</th>
              <th style={{ padding: '20px' }}>Status</th>
              <th style={{ padding: '20px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '20px', fontSize: '.85rem' }}>#{order._id.slice(-6).toUpperCase()}</td>
                <td style={{ padding: '20px' }}>
                  <p style={{ fontWeight: '600', fontSize: '.9rem' }}>{order.userId?.name}</p>
                  <p style={{ fontSize: '.75rem', color: 'rgba(245,245,245,.5)' }}>{order.phone}</p>
                </td>
                <td style={{ padding: '20px', fontSize: '.85rem' }}>
                  {order.items.map(i => `${i.name} x${i.quantity}`).join(', ')}
                </td>
                <td style={{ padding: '20px', fontWeight: '700', color: 'var(--yellow)' }}>Rs. {order.totalPrice.toLocaleString()}</td>
                <td style={{ padding: '20px' }}>
                  <span style={{ 
                    padding: '4px 12px', 
                    borderRadius: '50px', 
                    fontSize: '.75rem', 
                    fontWeight: '700',
                    background: `${getStatusColor(order.status)}20`,
                    color: getStatusColor(order.status),
                    border: `1px solid ${getStatusColor(order.status)}40`
                  }}>
                    {order.status}
                  </span>
                </td>
                <td style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {order.status === 'pending' && (
                      <button onClick={() => updateStatus(order._id, 'accepted')} style={{ p: '8px', borderRadius: '50%', border: 'none', background: '#2ecc7120', color: '#2ecc71', cursor: 'pointer' }} title="Accept Order"><Check size={18} /></button>
                    )}
                    {order.status === 'accepted' && (
                      <button onClick={() => updateStatus(order._id, 'preparing')} style={{ p: '8px', borderRadius: '50%', border: 'none', background: '#3498db20', color: '#3498db', cursor: 'pointer' }} title="Mark Preparing"><Package size={18} /></button>
                    )}
                    {order.status === 'preparing' && (
                      <button onClick={() => updateStatus(order._id, 'out_for_delivery')} style={{ p: '8px', borderRadius: '50%', border: 'none', background: '#f1c40f20', color: '#f1c40f', cursor: 'pointer' }} title="Send for Delivery"><Truck size={18} /></button>
                    )}
                    {order.status !== 'delivered' && order.status !== 'cancelled' && (
                      <button onClick={() => updateStatus(order._id, 'cancelled')} style={{ p: '8px', borderRadius: '50%', border: 'none', background: '#e74c3c20', color: '#e74c3c', cursor: 'pointer' }} title="Cancel Order"><X size={18} /></button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p style={{ textAlign: 'center', padding: '40px', color: 'rgba(245,245,245,.5)' }}>No orders found.</p>}
      </div>
    </div>
  );
}
