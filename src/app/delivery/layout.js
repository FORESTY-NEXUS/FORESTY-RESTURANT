'use client';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import Link from 'next/link';
import { LayoutDashboard, Package, Clock, User as UserIcon, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function DeliveryLayout({ children }) {
  const { user, logout } = useAuth();
  const { unreadCount, markAllAsRead } = useNotification();
  const pathname = usePathname();

  const links = [
    { href: '/delivery', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { href: '/delivery/orders', label: 'Active', icon: <Package size={20} /> },
    { href: '/delivery/history', label: 'History', icon: <Clock size={20} /> },
    { href: '/delivery/profile', label: 'Profile', icon: <UserIcon size={20} /> }
  ];

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh', paddingBottom: '70px' }}>
      {/* Top Header */}
      <header style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, 
          background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(10px)', 
          borderBottom: '1px solid var(--glass-border)', padding: '15px 20px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
          <Link href="/delivery" className="nav-logo" style={{ fontSize: '1.2rem' }}>FORESTY RIDER</Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
             {/* Notification Bell */}
             <div onClick={markAllAsRead} style={{ position: 'relative', cursor: 'pointer', color: 'rgba(245,245,245,.8)' }}>
               {unreadCount > 0 && (
                 <span style={{ position: 'absolute', top: '-2px', right: '-2px', background: 'var(--red)', color: '#fff', borderRadius: '50%', width: '12px', height: '12px', fontSize: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                   {unreadCount}
                 </span>
               )}
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            </div>
            
            <button onClick={logout} style={{ background: 'none', border: 'none', color: 'rgba(245,245,245,.5)', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
               <LogOut size={18} />
            </button>
          </div>
      </header>

      <main style={{ paddingTop: '80px', paddingLeft: '20px', paddingRight: '20px' }}>
        {children}
      </main>

      {/* Bottom Nav for Riders (Mobile First) */}
      <nav style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000,
          background: 'var(--charcoal)', borderTop: '1px solid var(--glass-border)',
          display: 'flex', justifyContent: 'space-around', alignItems: 'center',
          padding: '10px 0', paddingBottom: 'max(10px, env(safe-area-inset-bottom))'
      }}>
          {links.map(link => {
              const isActive = pathname === link.href;
              return (
                  <Link href={link.href} key={link.href} style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
                      color: isActive ? 'var(--yellow)' : 'rgba(245,245,245,.5)', textDecoration: 'none'
                  }}>
                      <div style={{ 
                          padding: '5px 15px', borderRadius: '50px', 
                          background: isActive ? 'rgba(244,180,0,0.1)' : 'transparent',
                          transition: 'all 0.3s'
                      }}>
                          {link.icon}
                      </div>
                      <span style={{ fontSize: '.7rem', fontWeight: isActive ? '600' : '400' }}>{link.label}</span>
                  </Link>
              )
          })}
      </nav>
    </div>
  );
}
