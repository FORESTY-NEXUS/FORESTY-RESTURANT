'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Phone, MapPin, Edit, Check, X, Plus } from 'lucide-react';
import api from '../../lib/api';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name || '', phone: user.phone || '' });
      setAddresses(user.addresses || []);
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedUser = await updateProfile({ ...formData, addresses });
      setAddresses(updatedUser.addresses || []);
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setMessage('Failed to update profile.');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const addAddress = () => {
    if (!newAddress.trim()) return;
    setAddresses([...addresses, { street: newAddress, isDefault: addresses.length === 0 }]);
    setNewAddress('');
  };

  const removeAddress = (index) => {
    setAddresses(addresses.filter((_, i) => i !== index));
  };

  const setDefaultAddress = (index) => {
    setAddresses(addresses.map((addr, i) => ({ ...addr, isDefault: i === index })));
  };

  if (!user) return <div className="section">Loading...</div>;

  return (
    <div className="section" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 className="section-title">My Profile</h2>

      {message && <p style={{ padding: '10px', background: 'rgba(244,180,0,0.1)', color: 'var(--yellow)', borderRadius: '10px', textAlign: 'center', marginBottom: '20px' }}>{message}</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 2fr', gap: '40px' }}>
        {/* Profile Sidebar */}
        <div style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '20px', padding: '30px', textAlign: 'center', height: 'fit-content' }}>
          <div style={{ 
            width: '100px', height: '100px', borderRadius: '50%', background: 'var(--charcoal)', 
            margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2.5rem', fontWeight: '700', color: 'var(--yellow)'
          }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '5px' }}>{user.name}</h3>
          <p style={{ color: 'rgba(245,245,245,.6)', fontSize: '.9rem', marginBottom: '20px' }}>{user.email}</p>
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.1)', padding: '5px 15px', borderRadius: '50px', fontSize: '.8rem', textTransform: 'uppercase' }}>
             {user.role}
          </div>
        </div>

        {/* Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Details Form */}
          <div style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '20px', padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3>Personal Details</h3>
              {!isEditing && <button onClick={() => setIsEditing(true)} style={{ background: 'none', border: 'none', color: 'var(--yellow)', cursor: 'pointer', display: 'flex', gap: '5px', alignItems: 'center' }}><Edit size={16} /> Edit</button>}
            </div>

            {isEditing ? (
              <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div className="nav-search" style={{ width: '100%' }}>
                  <User size={18} />
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="nav-search" style={{ width: '100%' }}>
                  <Phone size={18} />
                  <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="Phone number" />
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 1, justifyContent: 'center' }}><Check size={18} /> Save</button>
                  <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}><X size={18} /> Cancel</button>
                </div>
              </form>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', color: 'rgba(245,245,245,.8)' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}><User size={18} color="var(--red)" /> <span>{formData.name}</span></div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}><Phone size={18} color="var(--red)" /> <span>{formData.phone || 'Not provided'}</span></div>
              </div>
            )}
          </div>

          {/* Adresses */}
          <div style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '20px', padding: '30px' }}>
             <h3 style={{ marginBottom: '20px' }}>Saved Addresses</h3>
             
             {addresses.length === 0 ? (
                 <p style={{ color: 'rgba(245,245,245,.5)', fontSize: '.9rem' }}>No saved addresses.</p>
             ) : (
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
                    {addresses.map((addr, idx) => (
                       <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: addr.isDefault ? '1px solid var(--yellow)' : '1px solid transparent' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                             <MapPin size={20} color={addr.isDefault ? 'var(--yellow)' : 'var(--red)'} />
                             <div>
                               <p style={{ fontSize: '.95rem' }}>{addr.street}</p>
                               {addr.isDefault && <span style={{ fontSize: '.7rem', color: 'var(--yellow)' }}>Default Address</span>}
                             </div>
                          </div>
                          <div style={{ display: 'flex', gap: '10px' }}>
                             {!addr.isDefault && <button onClick={() => setDefaultAddress(idx)} style={{ background: 'none', border: '1px solid var(--yellow)', color: 'var(--yellow)', padding: '5px 10px', borderRadius: '5px', fontSize: '.8rem', cursor: 'pointer' }}>Set Default</button>}
                             <button onClick={() => removeAddress(idx)} style={{ background: 'none', border: 'none', color: 'var(--red)', cursor: 'pointer' }}><X size={18} /></button>
                          </div>
                       </div>
                    ))}
                 </div>
             )}

             <div style={{ display: 'flex', gap: '10px' }}>
                <div className="nav-search" style={{ flex: 1 }}>
                  <input type="text" placeholder="Add new address..." value={newAddress} onChange={e => setNewAddress(e.target.value)} />
                </div>
                <button onClick={addAddress} className="btn-secondary" style={{ padding: '0 20px' }}><Plus size={20} /></button>
             </div>
             {addresses.length !== (user?.addresses || []).length && (
                 <button onClick={handleUpdate} className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '20px' }}>
                     {loading ? 'Saving...' : 'Save Addresses'}
                 </button>
             )}
          </div>

        </div>
      </div>
    </div>
  );
}
