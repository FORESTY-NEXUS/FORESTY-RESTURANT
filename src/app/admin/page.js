'use client';
import { useState, useEffect } from 'react';
import api from '../lib/api';
import { ShoppingBag, Star, TrendingUp, Clock } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    menuItems: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordersRes, menuRes] = await Promise.all([
          api.get('/orders'),
          api.get('/menu')
        ]);
        
        const orders = ordersRes.data;
        setStats({
          totalOrders: orders.length,
          pendingOrders: orders.filter(o => o.status === 'pending').length,
          totalRevenue: orders.filter(o => o.status === 'delivered').reduce((acc, o) => acc + o.totalPrice, 0),
          menuItems: menuRes.data.length
        });
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: 'Total Orders', value: stats.totalOrders, icon: <ShoppingBag size={24} />, color: '#3498db' },
    { label: 'Pending Orders', value: stats.pendingOrders, icon: <Clock size={24} />, color: 'var(--yellow)' },
    { label: 'Total Revenue', value: `Rs. ${stats.totalRevenue.toLocaleString()}`, icon: <TrendingUp size={24} />, color: '#2ecc71' },
    { label: 'Menu Items', value: stats.menuItems, icon: <Star size={24} />, color: 'var(--red)' },
  ];

  return (
    <div className="reveal visible">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {cards.map((card, idx) => (
          <div key={idx} style={{ 
            background: 'var(--glass)', 
            border: '1px solid var(--glass-border)', 
            borderRadius: '20px', 
            padding: '30px',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
          }}>
            <div style={{ 
              width: '50px', 
              height: '50px', 
              borderRadius: '12px', 
              background: `${card.color}20`, 
              color: card.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {card.icon}
            </div>
            <div>
              <p style={{ color: 'rgba(245,245,245,.5)', fontSize: '.9rem' }}>{card.label}</p>
              <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginTop: '5px' }}>{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>
        <div style={{ 
          background: 'var(--glass)', 
          border: '1px solid var(--glass-border)', 
          borderRadius: '20px', 
          padding: '30px' 
        }}>
          <h3 style={{ marginBottom: '20px' }}>Recent Activity</h3>
          <p style={{ color: 'rgba(245,245,245,.4)', textAlign: 'center', padding: '40px' }}>
            System logs and activity feed will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}
