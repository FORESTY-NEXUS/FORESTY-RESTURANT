'use client';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';
import Link from 'next/link';
import { ShoppingCart, User, LogOut } from 'lucide-react';

export default function OrderLayout({ children }) {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { unreadCount, markAllAsRead } = useNotification();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh' }}>
      <nav className="navbar scrolled">
        <Link href="/" className="nav-logo">FORESTY</Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <div className="nav-links">
            <Link href="/order">Menu</Link>
            <Link href="/order/orders">My Orders</Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link href="/order/cart" style={{ position: 'relative', color: 'rgba(245,245,245,.8)' }}>
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--red)', color: '#fff', borderRadius: '50%', width: '18px', height: '18px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Notification Bell */}
            <div style={{ position: 'relative', cursor: 'pointer', color: 'rgba(245,245,245,.8)' }} onClick={markAllAsRead}>
               {unreadCount > 0 && (
                 <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'var(--yellow)', color: '#000', borderRadius: '50%', width: '16px', height: '16px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                   {unreadCount}
                 </span>
               )}
               <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <Link href="/order/profile" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(245,245,245,.8)', textDecoration: 'none' }}>
                <User size={20} />
                <span style={{ fontSize: '.9rem' }}>{user?.name || 'Customer'}</span>
              </Link>
              <button title="Logout" onClick={logout} style={{ background: 'none', border: 'none', color: 'var(--red)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main style={{ paddingTop: '100px' }}>
        {children}
      </main>
    </div>
  );
}
