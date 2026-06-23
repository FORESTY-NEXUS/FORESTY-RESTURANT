'use client';
import { useState, useEffect } from 'react';
import api from '../lib/api';
import { Package, Clock, MapPin, Phone, CheckCircle, ChevronRight, XCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AuthGuard from '../components/AuthGuard';
import { useToast } from '../context/ToastContext';

export default function OrdersHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders');
      setOrders(data.reverse());
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    const intervalId = setInterval(() => {
      fetchOrders();
    }, 10000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'var(--yellow)';
      case 'accepted': return '#3498db';
      case 'preparing': return '#e67e22';
      case 'ready': return '#9b59b6';
      case 'rider_assigned': return '#8e44ad';
      case 'picked_up': return '#34495e';
      case 'out_for_delivery': return '#f1c40f';
      case 'arrived': return '#1abc9c';
      case 'delivered': return '#2ecc71';
      case 'cancelled': 
      case 'refunded': return 'var(--red)';
      default: return 'var(--white)';
    }
  };

  const cancelOrder = async (id) => {
    if(!confirm('Are you sure you want to cancel this order?')) return;
    try {
       await api.put(`/orders/${id}/status`, { status: 'cancelled', note: 'Cancelled by customer' });
       await fetchOrders();
       toast.success('Order cancelled successfully');
    } catch (err) {
       toast.error(err.response?.data?.message || 'Failed to cancel order');
    }
  };

  const renderStepper = (order) => {
    if (order.status === 'cancelled' || order.status === 'refunded') {
       return (
           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '20px', background: 'rgba(193, 18, 31, 0.1)', borderRadius: '12px', color: 'var(--red)' }}>
                <XCircle size={24} />
                <span style={{ fontWeight: '600' }}>Order {order.status === 'refunded' ? 'Refunded' : 'Cancelled'}</span>
           </div>
       );
    }

    const steps = [
        { key: 'pending', label: 'Placed' },
        { key: 'accepted', label: 'Accepted' },
        { key: 'preparing', label: 'Preparing' },
        { key: 'out_for_delivery', label: 'On The Way' },
        { key: 'delivered', label: 'Delivered' }
    ];

    let currentStepIndex = 0;
    
    // Map granular API statuses to visual steps
    switch(order.status) {
        case 'pending': currentStepIndex = 0; break;
        case 'accepted': currentStepIndex = 1; break;
        case 'preparing': 
        case 'ready': 
        case 'rider_assigned': 
        case 'picked_up': currentStepIndex = 2; break;
        case 'out_for_delivery': 
        case 'arrived': currentStepIndex = 3; break;
        case 'delivered': currentStepIndex = 4; break;
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px', position: 'relative' }}>
            {/* Progress Bar Background */}
            <div style={{ position: 'absolute', top: '15px', left: '10%', right: '10%', height: '3px', background: 'rgba(255,255,255,0.1)', zIndex: 0 }}></div>
            
            {/* Active Progress Bar */}
            <div style={{ position: 'absolute', top: '15px', left: '10%', width: `${(currentStepIndex / (steps.length - 1)) * 80}%`, height: '3px', background: 'var(--yellow)', zIndex: 0, transition: 'width 0.5s ease-in-out' }}></div>

            {steps.map((step, idx) => {
                const isCompleted = idx <= currentStepIndex;
                const isActive = idx === currentStepIndex;
                return (
                    <div key={step.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 1, width: '20%' }}>
                        <div style={{ 
                            width: '30px', height: '30px', borderRadius: '50%', 
                            background: isCompleted ? 'var(--yellow)' : 'var(--charcoal)', 
                            border: `2px solid ${isCompleted ? 'var(--yellow)' : 'rgba(255,255,255,0.2)'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: isCompleted ? '#000' : 'rgba(255,255,255,0.5)',
                            boxShadow: isActive ? '0 0 10px rgba(244, 180, 0, 0.5)' : 'none',
                            transition: 'all 0.3s'
                        }}>
                            {isCompleted ? <CheckCircle size={16} /> : <span style={{ fontSize: '.7rem' }}>{idx + 1}</span>}
                        </div>
                        <span style={{ fontSize: '.7rem', color: isCompleted ? '#fff' : 'rgba(255,255,255,0.5)', fontWeight: isActive ? '600' : '400', textAlign: 'center' }}>
                            {step.label}
                        </span>
                    </div>
                )
            })}
        </div>
    );
  };

  if (loading) return <div className="section"><p style={{ textAlign: 'center' }}>Loading orders...</p></div>;

  return (
    <AuthGuard roles={['customer']}>
      <Navbar />
      <main className="w-full overflow-x-hidden pt-[100px]">
        <div className="section" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 className="section-title">My Orders</h2>
      
      {orders.length === 0 ? (
        <div className="menu-empty">
          <h3>No orders yet</h3>
          <p>You haven't placed any orders. Start ordering now!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {orders.map((order) => (
            <div key={order._id} className="reveal visible" style={{ 
              background: 'var(--glass)', 
              border: '1px solid var(--glass-border)', 
              borderRadius: '20px', 
              padding: '25px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ 
                position: 'absolute', 
                top: '0', 
                right: '0', 
                background: getStatusColor(order.status), 
                color: '#fff', 
                padding: '5px 20px', 
                borderRadius: '0 0 0 20px', 
                fontSize: '.85rem', 
                fontWeight: '700',
                textTransform: 'uppercase'
              }}>
                {order.status.replace(/_/g, ' ')}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '5px' }}>Order #{order._id.slice(-6).toUpperCase()}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(245,245,245,.5)', fontSize: '.85rem' }}>
                    <Clock size={14} />
                    <span>{new Date(order.createdAt).toLocaleString()}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right', marginTop: '25px' }}>
                  <p style={{ fontSize: '1.3rem', color: 'var(--yellow)', fontWeight: '700' }}>Rs. {order.grandTotal?.toLocaleString() || order.totalPrice?.toLocaleString()}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px', marginBottom: '20px' }}>
                <div>
                  <h4 style={{ marginBottom: '10px', fontSize: '.95rem', color: 'var(--yellow)' }}>Items</h4>
                  <ul style={{ listStyle: 'none', padding: '0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {order.items.map((item, idx) => (
                      <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.9rem' }}>
                        <span>{item.name} x {item.quantity}</span>
                        <span>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                      </li>
                    ))}
                  </ul>
                  {(order.tax > 0 || order.deliveryFee > 0) && (
                      <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '.85rem', color: 'rgba(245,245,245,.7)' }}>
                          {order.tax > 0 && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Tax</span><span>Rs. {order.tax.toLocaleString()}</span></div>}
                          {order.deliveryFee > 0 && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Delivery Fee</span><span>Rs. {order.deliveryFee.toLocaleString()}</span></div>}
                      </div>
                  )}
                </div>
                <div style={{ borderLeft: '1px solid var(--glass-border)', paddingLeft: '30px' }}>
                  <h4 style={{ marginBottom: '10px', fontSize: '.95rem', color: 'var(--yellow)' }}>Order Details</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '.85rem', color: 'rgba(245,245,245,.7)' }}>
                    <div style={{ display: 'flex', gap: '10px' }}><MapPin size={16} /> <span>{order.address}</span></div>
                    <div style={{ display: 'flex', gap: '10px' }}><Phone size={16} /> <span>{order.phone}</span></div>
                    <div style={{ display: 'flex', gap: '10px' }}><Package size={16} /> <span style={{ textTransform: 'uppercase' }}>{order.paymentMethod || 'COD'} ({order.paymentStatus || 'Pending'})</span></div>
                  </div>
                  
                  {order.assignedDeliveryId && order.status !== 'delivered' && order.status !== 'cancelled' && (
                     <div style={{ marginTop: '15px', padding: '10px', background: 'rgba(52, 152, 219, 0.1)', borderRadius: '8px', border: '1px solid rgba(52, 152, 219, 0.3)' }}>
                         <p style={{ fontSize: '.8rem', color: '#3498db', marginBottom: '5px' }}><strong>Rider Assigned:</strong></p>
                         <p style={{ fontSize: '.85rem', color: '#fff' }}>{order.assignedDeliveryId.name} ({order.assignedDeliveryId.phone})</p>
                     </div>
                  )}
                </div>
              </div>

              {renderStepper(order)}

              {(order.status === 'out_for_delivery' || order.status === 'arrived') && (
                <div style={{ 
                  marginTop: '25px', 
                  padding: '15px', 
                  background: 'rgba(244, 180, 0, 0.1)', 
                  border: '1px dashed var(--yellow)', 
                  borderRadius: '12px',
                  textAlign: 'center'
                }}>
                  <p style={{ color: 'var(--yellow)', fontSize: '.9rem' }}>
                    <strong>OTP Verification Required:</strong> Please provide the 6-digit code sent to your email to the delivery agent.
                  </p>
                </div>
              )}

              {['pending', 'accepted'].includes(order.status) && (
                 <div style={{ marginTop: '20px', textAlign: 'right' }}>
                    <button onClick={() => cancelOrder(order._id)} style={{ background: 'none', border: 'none', color: 'var(--red)', fontSize: '.85rem', cursor: 'pointer', textDecoration: 'underline' }}>
                       Cancel Order
                    </button>
                 </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
    </main>
    <Footer />
    </AuthGuard>
  );
}
