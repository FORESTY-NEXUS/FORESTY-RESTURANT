'use client';
import { useAuth } from '../context/AuthContext';
import Link from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Utensils, Users, LogOut, Package, Menu, X } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminLayout({ children }) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    <div className="flex min-h-screen bg-[#0a0a0a]">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-[40] bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-[50] flex w-[280px] flex-col bg-[#1A1A1A] border-r border-white/10 p-[30px_20px] transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between mb-[50px] pl-[15px]">
          <div className="nav-logo text-xl">FORESTY ADMIN</div>
          <button className="md:hidden text-white" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex flex-1 flex-col gap-2.5">
          {sidebarLinks.map((link) => (
            <button 
              key={link.href}
              onClick={() => {
                router.push(link.href);
                setSidebarOpen(false);
              }}
              className={`flex items-center gap-[15px] p-[12px_15px] rounded-xl border-none cursor-pointer transition-all duration-300 text-left ${
                pathname.startsWith(link.href) && (link.href !== '/admin' || pathname === '/admin') 
                  ? 'bg-[#FF0000] text-white font-semibold' 
                  : 'bg-transparent text-white font-normal'
              }`}
            >
              {link.icon}
              {link.label}
            </button>
          ))}
        </nav>

        <button 
          onClick={logout}
          className="mt-auto flex items-center gap-[15px] p-[12px_15px] rounded-xl border-none bg-white/5 text-[#ff0000] cursor-pointer"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden p-[20px] md:p-[40px] md:ml-[280px] transition-all duration-300">
        <header className="mb-[40px] flex flex-col md:flex-row gap-5 md:justify-between md:items-center">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-white" onClick={() => setSidebarOpen(true)}>
              <Menu size={28} />
            </button>
            <div>
              <h1 className="text-[1.5rem] md:text-[1.8rem] font-bold">Admin Dashboard</h1>
              <p className="text-white/50 text-[0.85rem] md:text-base">Manage your restaurant operations</p>
            </div>
          </div>
          <div className="flex items-center gap-[15px] bg-white/5 p-[10px_20px] rounded-xl self-start md:self-auto">
            <Users size={18} />
            <span className="text-sm md:text-base">{user.name}</span>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
