'use client';
import { Heart } from 'lucide-react';
import { InstagramIcon, FacebookIcon, TikTokIcon, WhatsAppIcon } from './Icons';

const quickLinks = ['Home', 'Menu', 'About', 'Gallery', 'Contact'];
const menuLinks = ['Burgers', 'Pizza', 'Wraps', 'Fries', 'Drinks', 'Desserts'];

const socialIcons = [
  <InstagramIcon key="inst" size={20} />,
  <FacebookIcon key="fb" size={20} />,
  <TikTokIcon key="tk" size={20} />,
  <WhatsAppIcon key="wa" size={20} />,
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <h2>CHEEZARILLA</h2>
          <p>Where Every Bite Melts With Flavor. Premium Pakistani fast food crafted with passion, served with love. Join the Zilla family today.</p>
          <div className="social-links" style={{ marginTop: '20px' }}>
            {socialIcons.map((icon, i) => (
              <div className="social-link" key={i}>{icon}</div>
            ))}
          </div>
        </div>
        <div className="footer-col">
          <h4>Quick Links</h4>
          {quickLinks.map(l => <a href={`#${l.toLowerCase()}`} key={l}>{l}</a>)}
        </div>
        <div className="footer-col">
          <h4>Menu</h4>
          {menuLinks.map(l => <a href="#menu" key={l}>{l}</a>)}
        </div>
        <div className="footer-col">
          <h4>Contact</h4>
          <a href="tel:+923004567890">+92 300 4567890</a>
          <a href="mailto:contact@cheezarilla.com">contact@cheezarilla.com</a>
          <a href="#">Main Food Street, Islamabad</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
          © 2026 CHEEZARILLA. All Rights Reserved. Designed with <Heart size={14} fill="var(--red)" color="var(--red)" /> by CHEEZARILLA
        </p>
      </div>
    </footer>
  );
}
