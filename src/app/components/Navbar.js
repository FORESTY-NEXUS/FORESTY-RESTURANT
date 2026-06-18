'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

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
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

        {/* Action/Auth Buttons (Right Side) */}
        <div className="hidden items-center gap-6 uppercase md:flex">
          {user ? (
            <>
              <Link href="/order" className={strongNavLink}>Order</Link>
              <button 
                onClick={logout} 
                className="rounded-md bg-[#FF4500] px-5 py-2 text-[0.85rem] font-extrabold uppercase tracking-wider text-white transition-all duration-200 hover:bg-[#e63e00] hover:scale-105"
              >
                Logout
              </button>
            </>
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
          <>
            <Link href="/order" onClick={closeMenu} className="text-[1.3rem] font-bold uppercase text-white no-underline transition hover:text-[#FE5900]">Order</Link>
            <button onClick={() => { logout(); closeMenu(); }} className="border-0 bg-transparent text-[1.3rem] font-semibold text-white uppercase hover:text-[#FE5900]">
              Logout
            </button>
          </>
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