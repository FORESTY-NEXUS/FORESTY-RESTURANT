'use client';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, Plus, Minus, CreditCard, Banknote, MapPin, User as UserIcon, Phone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import api from '../lib/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AuthGuard from '../components/AuthGuard';
import { useToast } from '../context/ToastContext';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const { user } = useAuth();
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const tax = total * 0.16;
  const deliveryFee = 150;
  const grandTotal = total > 0 ? total + tax + deliveryFee : 0;

  useEffect(() => {
     if (user) {
         setPhone(user.phone || '');
         setCustomerName(user.name || '');
         const defaultLocation = user.addresses?.find(a => a.isDefault);
         if (defaultLocation) {
             setAddress(defaultLocation.street);
         }
     }
  }, [user]);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setLoading(true);
    try {
      await api.post('/orders', {
        items: cart.map(i => ({ 
          menuItemId: i._id, 
          name: i.name, 
          price: i.price, 
          quantity: i.quantity 
        })),
        address,
        phone,
        customerName,
        paymentMethod,
        deliveryNotes
      });
      clearCart();
      toast.success('Order placed successfully!');
      router.push('/my-orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const handleSetAddress = (addr) => {
      setAddress(addr);
  };

  const handleGeolocation = () => {
      if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
              (position) => {
                  // In a real implementation with a Google Maps key, we would reverse geocode here.
                  setAddress(`${position.coords.latitude}, ${position.coords.longitude} (Location captured)`);
              },
              (error) => alert('Location access denied or failed.')
          );
      }
  };

  return (
    <AuthGuard roles={['customer']}>
      <Navbar />
      <main className="w-full overflow-x-hidden pt-[100px]">
        <div className="section" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 className="section-title">Checkout</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: cart.length > 0 ? '1.5fr 1fr' : '1fr', gap: '40px', alignItems: 'start' }}>
        <div>
          {cart.length === 0 ? (
            <div className="menu-empty">
              <h3>Your cart is empty</h3>
              <p>Add some delicious food to start your order!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {cart.map((item) => (
                <div key={item._id} className="food-card reveal visible" style={{ 
                  display: 'flex', 
                  flexDirection: 'row', 
                  alignItems: 'center', 
                  padding: '15px' 
                }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0 }}>
                    <img 
                      src={item.image || item.img || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200&auto=format&fit=crop'} 
                      alt={item.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200&auto=format&fit=crop';
                      }}
                    />
                  </div>
                  <div style={{ flex: 1, paddingLeft: '20px' }}>
                    <h3 style={{ fontSize: '1.1rem' }}>{item.name}</h3>
                    <p style={{ color: 'var(--yellow)', fontWeight: '600' }}>Rs. {item.price.toLocaleString()}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--charcoal)', borderRadius: '20px', padding: '5px 10px' }}>
                      <button onClick={() => updateQuantity(item._id, item.quantity - 1)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><Minus size={16} /></button>
                      <span style={{ width: '25px', textAlign: 'center' }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.quantity + 1)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><Plus size={16} /></button>
                    </div>
                    <button onClick={() => removeFromCart(item._id)} style={{ color: 'var(--red)', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={20} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="reveal visible" style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '20px', padding: '30px', position: 'sticky', top: '100px' }}>
            <h3 style={{ marginBottom: '20px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Banknote size={20} color="var(--yellow)" /> Order Summary
            </h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: 'rgba(245,245,245,.8)' }}>
              <span>Subtotal</span>
              <span>Rs. {total.toLocaleString()}</span>
            </div>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: 'rgba(245,245,245,.8)' }}>
              <span>Tax (16% GST)</span>
              <span>Rs. {tax.toLocaleString()}</span>
            </div>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: 'rgba(245,245,245,.8)' }}>
              <span>Delivery Fee</span>
              <span>Rs. {deliveryFee.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '15px 0 25px 0', fontWeight: '800', fontSize: '1.4rem', color: 'var(--yellow)', borderTop: '1px solid var(--glass-border)', paddingTop: '15px' }}>
              <span>Total</span>
              <span>Rs. {grandTotal.toLocaleString()}</span>
            </div>

            <form onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              <div className="nav-search" style={{ width: '100%', borderRadius: '10px' }}>
                <UserIcon size={18} color="rgba(245,245,245,.5)" />
                <input 
                  type="text" 
                  placeholder="Customer Name" 
                  value={customerName} 
                  onChange={(e) => setCustomerName(e.target.value)} 
                  required 
                />
              </div>

              <div className="nav-search" style={{ width: '100%', borderRadius: '10px' }}>
                <Phone size={18} color="rgba(245,245,245,.5)" />
                <input 
                  type="tel" 
                  placeholder="Phone Number" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  required 
                />
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '.9rem' }}>Delivery Address</span>
                      <button type="button" onClick={handleGeolocation} style={{ background: 'none', border: 'none', color: '#3498db', fontSize: '.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <MapPin size={14} /> Detect Location
                      </button>
                  </div>
                  
                  {user?.addresses && user.addresses.length > 0 && (
                      <div style={{ display: 'flex', gap: '5px', marginBottom: '10px', overflowX: 'auto', paddingBottom: '5px' }}>
                          {user.addresses.map((a, i) => (
                              <button type="button" key={i} onClick={() => handleSetAddress(a.street)} style={{ whiteSpace: 'nowrap', padding: '5px 10px', borderRadius: '5px', background: address === a.street ? 'var(--red)' : 'var(--charcoal)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '.8rem' }}>
                                  {a.isDefault ? 'Default' : `Address ${i+1}`}
                              </button>
                          ))}
                      </div>
                  )}

                  <textarea 
                      placeholder="Full street address..." 
                      value={address} 
                      onChange={(e) => setAddress(e.target.value)} 
                      required 
                      style={{ width: '100%', background: 'var(--charcoal)', border: 'none', color: '#fff', padding: '10px', borderRadius: '8px', outline: 'none', resize: 'vertical', minHeight: '60px' }}
                  />
              </div>

              <div className="nav-search" style={{ width: '100%', borderRadius: '10px' }}>
                <input 
                  type="text" 
                  placeholder="Delivery Notes (e.g. Leave at front door)" 
                  value={deliveryNotes} 
                  onChange={(e) => setDeliveryNotes(e.target.value)} 
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '5px' }}>
                <span style={{ fontSize: '.85rem', color: 'rgba(245,245,245,.6)' }}>Payment Method</span>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="button" onClick={() => setPaymentMethod('cod')} style={{ flex: 1, padding: '15px 10px', borderRadius: '10px', background: paymentMethod === 'cod' ? 'var(--red)' : 'var(--charcoal)', border: '1px solid var(--glass-border)', color: '#fff', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', transition: 'all .3s' }}>
                        <Banknote size={20} />
                        <span style={{ fontSize: '.8rem' }}>Cash on Delivery</span>
                    </button>
                    <button type="button" onClick={() => setPaymentMethod('card')} style={{ flex: 1, padding: '15px 10px', borderRadius: '10px', background: paymentMethod === 'card' ? '#3498db' : 'var(--charcoal)', border: '1px solid var(--glass-border)', color: '#fff', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', transition: 'all .3s' }}>
                        <CreditCard size={20} />
                        <span style={{ fontSize: '.8rem' }}>Pay with Card</span>
                    </button>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn-primary" 
                disabled={loading}
                style={{ width: '100%', justifyContent: 'center', marginTop: '15px', padding: '15px', fontSize: '1.1rem' }}
              >
                {loading ? 'Processing...' : `Place Order (Rs. ${grandTotal.toLocaleString()})`}
              </button>
            </form>
          </div>
        )}
      </div>
      </div>
    </main>
    <Footer />
    </AuthGuard>
  );
}
