'use client';
import { useAuth } from '../context/AuthContext';
import Link from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Utensils, Users, LogOut, Package } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({ children }) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) return <div className="loader-wrap"><div className="loader-text">Loading...</div></div>;

  const sidebarLinks = [
    { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={20} /> },
    { label: 'Orders', href: '/admin/orders', icon: <ShoppingBag size={20} /> },
    { label: 'Menu Items', href: '/admin/menu', icon: <Utensils size={20} /> },
    { label: 'Delivery Agents', href: '/admin/delivery-agents', icon: <Users size={20} /> },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--black)' }}>
      {/* Sidebar */}
      <aside style={{ 
        width: '280px', 
        background: 'var(--charcoal)', 
        borderRight: '1px solid var(--glass-border)', 
        padding: '30px 20px', 
        position: 'fixed', 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column' 
      }}>
        <div className="nav-logo" style={{ marginBottom: '50px', paddingLeft: '15px' }}>FORESTY ADMIN</div>
        
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {sidebarLinks.map((link) => (
            <button 
              key={link.href}
              onClick={() => router.push(link.href)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '15px', 
                padding: '12px 15px', 
                borderRadius: '12px', 
                border: 'none', 
                background: pathname === link.href ? 'var(--red)' : 'transparent',
                color: '#fff',
                cursor: 'pointer',
                transition: 'all .3s',
                textAlign: 'left',
                fontWeight: pathname === link.href ? '600' : '400'
              }}
            >
              {link.icon}
              {link.label}
            </button>
          ))}
        </nav>

        <button 
          onClick={logout}
          style={{ 
            marginTop: 'auto', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '15px', 
            padding: '12px 15px', 
            borderRadius: '12px', 
            border: 'none', 
            background: 'var(--glass)',
            color: 'var(--red)',
            cursor: 'pointer'
          }}
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main style={{ marginLeft: '280px', flex: 1, padding: '40px' }}>
        <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '700' }}>Admin Dashboard</h1>
            <p style={{ color: 'rgba(245,245,245,.5)' }}>Manage your restaurant operations</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', background: 'var(--glass)', padding: '10px 20px', borderRadius: '12px' }}>
            <Users size={18} />
            <span>{user.name}</span>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
