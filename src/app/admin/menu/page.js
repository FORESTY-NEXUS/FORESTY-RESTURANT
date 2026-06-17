'use client';
import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Plus, Edit, Trash2, X, Check } from 'lucide-react';

export default function AdminMenuPage() {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '', price: '', category: 'Burgers', description: '', image: '', availability: true
  });

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const { data } = await api.get('/menu');
      setItems(data);
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editItem) {
        await api.put(`/menu/${editItem._id}`, formData);
      } else {
        await api.post('/menu', formData);
      }
      setShowModal(false);
      setEditItem(null);
      setFormData({ name: '', price: '', category: 'Burgers', description: '', image: '', availability: true });
      fetchMenu();
    } catch (err) { alert('Operation failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      await api.delete(`/menu/${id}`);
      fetchMenu();
    } catch (err) { alert('Delete failed'); }
  };

  return (
    <div className="reveal visible">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.5rem' }}>Management: Menu Items</h2>
        <button onClick={() => { setEditItem(null); setShowModal(true); }} className="btn-primary" style={{ padding: '10px 20px', borderRadius: '12px' }}>
          <Plus size={18} style={{ marginRight: '8px' }} /> Add New Item
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
        {items.map((item) => (
          <div key={item._id} className="food-card visible" style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)' }}>
            <div style={{ height: '150px', overflow: 'hidden' }}>
              <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem' }}>{item.name}</h3>
                  <span style={{ fontSize: '.7rem', color: 'var(--yellow)', textTransform: 'uppercase', letterSpacing: '1px' }}>{item.category}</span>
                </div>
                <p style={{ fontWeight: '700', color: 'var(--yellow)' }}>Rs. {item.price}</p>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button onClick={() => { setEditItem(item); setFormData(item); setShowModal(true); }} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(52, 152, 219, 0.1)', color: '#3498db', cursor: 'pointer' }}><Edit size={16} /></button>
                <button onClick={() => handleDelete(item._id)} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c', cursor: 'pointer' }}><Trash2 size={16} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)' }}>
          <div style={{ background: 'var(--charcoal)', border: '1px solid var(--glass-border)', borderRadius: '20px', padding: '40px', width: '100%', maxWidth: '500px' }}>
            <h3 style={{ marginBottom: '25px' }}>{editItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div className="nav-search" style={{ width: '100%', borderRadius: '10px' }}>
                <input type="text" placeholder="Item Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="nav-search" style={{ width: '100%', borderRadius: '10px' }}>
                <input type="number" placeholder="Price (PKR)" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
              </div>
              <div className="nav-search" style={{ width: '100%', borderRadius: '10px' }}>
                <input type="text" placeholder="Image URL" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} required />
              </div>
              <select 
                value={formData.category} 
                onChange={e => setFormData({...formData, category: e.target.value})}
                style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', color: '#fff', padding: '12px', borderRadius: '10px', outline: 'none' }}
              >
                {['Burgers', 'Pizza', 'Wraps', 'Fries', 'Drinks', 'Desserts'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <textarea 
                placeholder="Description" 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})}
                style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', color: '#fff', padding: '12px', borderRadius: '10px', minHeight: '100px', outline: 'none', resize: 'none' }}
              />
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}><Check size={18} style={{ marginRight: '8px' }} /> Save</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}><X size={18} style={{ marginRight: '8px' }} /> Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
