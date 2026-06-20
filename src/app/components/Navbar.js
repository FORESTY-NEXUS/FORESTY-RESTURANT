'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart } from 'lucide-react';

const links = [
  { label: 'Home', href: '/#home' },
  { label: 'Menu', href: '/#menu' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
];

// Refined styles to match the clean, crisp typography of the mockup
const navLink = 'relative text-[0.85rem] font-semibold uppercase tracking-wider text-[#F5F5F5] no-underline transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-[#FE5900] after:transition-all hover:text-white hover:after:w-full';
const strongNavLink = 'text-[0.85rem] font-bold uppercase tracking-wider text-white no-underline transition-colors hover:text-gray-300';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav 
        className={`fixed left-0 right-0 top-0 z-[1000] flex items-center justify-between px-[5%] transition-all duration-300 ${
          scrolled 
            ? 'border-b border-white/10 bg-[#191919]/90 py-3 backdrop-blur-xl' 
            : 'py-5 bg-transparent'
        }`}
      >
        {/* Brand Logo (Left Side) */}
        <Link href="/" className="cursor-pointer text-3xl font-black tracking-tight text-[#FF3300] no-underline max-[480px]:text-xl">
          FORESTY
        </Link>

        {/* Core Navigation Links (Centered) */}
        <ul className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden list-none items-center gap-8 uppercase md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className={navLink}>{link.label}</a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-6 uppercase md:flex">
          {user ? (
            user.role === 'admin' ? (
              <>
                <Link href="/admin" className={strongNavLink}>Admin Dashboard</Link>
                <button onClick={logout} className="rounded-md bg-[#FF4500] px-5 py-2 text-[0.85rem] font-extrabold uppercase tracking-wider text-white transition-all duration-200 hover:bg-[#e63e00] hover:scale-105">Logout</button>
              </>
            ) : user.role === 'delivery' ? (
              <>
                <Link href="/delivery" className={strongNavLink}>Delivery Dashboard</Link>
                <button onClick={logout} className="rounded-md bg-[#FF4500] px-5 py-2 text-[0.85rem] font-extrabold uppercase tracking-wider text-white transition-all duration-200 hover:bg-[#e63e00] hover:scale-105">Logout</button>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <Link href="/cart" style={{ position: 'relative', color: '#fff' }}>
                  <ShoppingCart size={22} />
                  {cart?.length > 0 && (
                    <span style={{ position: 'absolute', top: '-8px', right: '-12px', background: 'var(--brand-red, #FF0000)', color: '#fff', fontSize: '0.65rem', fontWeight: 'bold', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {cart.reduce((total, item) => total + item.quantity, 0)}
                    </span>
                  )}
                </Link>
                <div style={{ position: 'relative' }} onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
                  <Link href="/profile" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', textDecoration: 'none' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </Link>
                  <div style={{ position: 'absolute', top: '100%', right: '0', background: 'var(--brand-gray, #2A2A2A)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '10px 0', minWidth: '150px', display: dropdownOpen ? 'flex' : 'none', flexDirection: 'column', gap: '5px', zIndex: 10 }}>
                    <Link href="/my-orders" style={{ padding: '8px 20px', color: '#fff', fontSize: '0.85rem', textDecoration: 'none', textTransform: 'none' }}>My Orders</Link>
                    <Link href="/profile" style={{ padding: '8px 20px', color: '#fff', fontSize: '0.85rem', textDecoration: 'none', textTransform: 'none' }}>Edit Profile</Link>
                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '5px 0' }} />
                    <button onClick={logout} style={{ background: 'none', border: 'none', textAlign: 'left', padding: '8px 20px', color: '#FF0000', fontSize: '0.85rem', cursor: 'pointer', textTransform: 'none' }}>Logout</button>
                  </div>
                </div>
              </div>
            )
          ) : (
            <>
              <Link href="/register" className={strongNavLink}>Sign Up</Link>
              <Link 
                href="/login" 
                className="rounded-md bg-[#FF4500] px-6 py-2.5 text-[0.85rem] font-extrabold uppercase tracking-wider text-white transition-all duration-200 hover:bg-[#e63e00] hover:scale-105"
              >
                Login
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="z-[1001] hidden flex-col gap-[5px] border-0 bg-transparent p-0 max-md:flex"
        >
          <span className={`h-0.5 w-[25px] bg-[#F5F5F5] transition ${menuOpen ? 'translate-x-[5px] translate-y-[5px] rotate-45' : ''}`} />
          <span className={`h-0.5 w-[25px] bg-[#F5F5F5] transition ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`h-0.5 w-[25px] bg-[#F5F5F5] transition ${menuOpen ? 'translate-x-[5px] -translate-y-[5px] -rotate-45' : ''}`} />
        </button>
      </nav>

      {/* Mobile Drawer Slide-out Menu */}
      <div className={`fixed top-0 z-[999] flex h-screen w-[70%] flex-col items-center justify-center gap-[30px] bg-[#0A0A0A]/95 backdrop-blur-3xl transition-[right] duration-300 max-[480px]:w-[82%] ${menuOpen ? 'right-0' : '-right-full'}`}>
        {links.map((link) => (
          <a key={link.href} href={link.href} onClick={closeMenu} className="text-[1.3rem] font-bold uppercase text-white no-underline transition hover:text-[#FE5900]">
            {link.label}
          </a>
        ))}
        {user ? (
          user.role === 'admin' ? (
            <>
              <Link href="/admin" onClick={closeMenu} className="text-[1.3rem] font-bold uppercase text-white no-underline transition hover:text-[#FE5900]">Admin Dashboard</Link>
              <button onClick={() => { logout(); closeMenu(); }} className="border-0 bg-transparent text-[1.3rem] font-semibold text-white uppercase hover:text-[#FE5900]">Logout</button>
            </>
          ) : user.role === 'delivery' ? (
            <>
              <Link href="/delivery" onClick={closeMenu} className="text-[1.3rem] font-bold uppercase text-white no-underline transition hover:text-[#FE5900]">Delivery Dashboard</Link>
              <button onClick={() => { logout(); closeMenu(); }} className="border-0 bg-transparent text-[1.3rem] font-semibold text-white uppercase hover:text-[#FE5900]">Logout</button>
            </>
          ) : (
            <>
              <Link href="/cart" onClick={closeMenu} className="text-[1.3rem] font-bold uppercase text-white no-underline transition hover:text-[#FE5900]">Cart ({cart?.reduce((a, b) => a + b.quantity, 0) || 0})</Link>
              <Link href="/my-orders" onClick={closeMenu} className="text-[1.3rem] font-bold uppercase text-white no-underline transition hover:text-[#FE5900]">My Orders</Link>
              <Link href="/profile" onClick={closeMenu} className="text-[1.3rem] font-bold uppercase text-white no-underline transition hover:text-[#FE5900]">Profile</Link>
              <button onClick={() => { logout(); closeMenu(); }} className="border-0 bg-transparent text-[1.3rem] font-semibold text-[#FF0000] uppercase hover:text-[#FE5900]">Logout</button>
            </>
          )
        ) : (
          <>
            <Link href="/register" onClick={closeMenu} className="text-[1.3rem] font-bold uppercase text-white no-underline transition hover:text-[#FE5900]">Sign Up</Link>
            <Link href="/login" onClick={closeMenu} className="text-[1.3rem] font-bold uppercase text-white no-underline transition hover:text-[#FE5900]">Login</Link>
          </>
        )}
      </div>
      {menuOpen && <div className="fixed inset-0 z-[998]" onClick={closeMenu} />}
    </>
  );
}