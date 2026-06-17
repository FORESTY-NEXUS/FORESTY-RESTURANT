'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

import { useAuth } from '../context/AuthContext';

const links = [
  { label: 'Home', href: '/#home' },
  { label: 'Menu', href: '/#menu' },
  { label: 'About', href: '/#about' },
  { label: 'Facilities', href: '/#facilities' },
];

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
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <Link href="/" className="nav-logo">FORESTY</Link>
        <ul className="nav-links">

          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
          {user ? (
            <>
              <li><Link href="/order" style={{ color: 'var(--yellow)', fontWeight: '600' }}>Order</Link></li>
              <li><button onClick={logout} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '.9rem' }}>Logout</button></li>
            </>
          ) : (
            <>
              <li><Link href="/login">Login</Link></li>
              <li><Link href="/register" className="btn-primary" style={{ padding: '8px 20px', fontSize: '.85rem' }}>Join</Link></li>
            </>
          )}
        </ul>
        <div className={`hamburger ${menuOpen ? 'active' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </div>
      </nav>
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>

        {links.map(l => (
          <a key={l.href} href={l.href} onClick={closeMenu}>{l.label}</a>
        ))}
        {user ? (
          <button onClick={() => { logout(); closeMenu(); }} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.3rem', fontWeight: '600' }}>Logout</button>
        ) : (
          <>
            <Link href="/login" onClick={closeMenu}>Login</Link>
            <Link href="/register" onClick={closeMenu}>Join</Link>
          </>
        )}
      </div>
      {menuOpen && <div style={{ position: 'fixed', inset: 0, zIndex: 998 }} onClick={closeMenu} />}
    </>
  );
}
