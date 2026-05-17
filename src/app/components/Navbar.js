'use client';
import { useState, useEffect } from 'react';

const links = [
  { label: 'Home', href: '#home' },
  { label: 'Menu', href: '#menu' },
  { label: 'About', href: '#about' },
  { label: 'Facilities', href: '#facilities' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
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
        <div className="nav-logo">CHEEZARILLA</div>
        <ul className="nav-links">
          {links.map(l => (
            <li key={l.href}><a href={l.href}>{l.label}</a></li>
          ))}
        </ul>
        <div className={`hamburger ${menuOpen ? 'active' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </div>
      </nav>
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        {links.map(l => (
          <a key={l.href} href={l.href} onClick={closeMenu}>{l.label}</a>
        ))}
      </div>
      {menuOpen && <div style={{ position: 'fixed', inset: 0, zIndex: 998 }} onClick={closeMenu} />}
    </>
  );
}
