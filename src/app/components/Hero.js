'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { UtensilsCrossed, ShoppingCart } from 'lucide-react';

export default function Hero() {
  const ref = useRef(null);

  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    setMounted(true);
    setParticles(Array.from({ length: 15 }, (_, i) => ({
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 8}s`,
      animationDuration: `${6 + Math.random() * 6}s`,
      width: `${2 + Math.random() * 4}px`,
      height: `${2 + Math.random() * 4}px`,
    })));

    const el = ref.current;
    if (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      setTimeout(() => {
        el.style.transition = 'all 1s cubic-bezier(.4,0,.2,1)';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 2600);
    }
  }, []);

  return (
    <section className="hero" id="home">
      <div className="hero-bg" />
      <div className="hero-particles">
        {mounted && particles.map((p, i) => (
          <div key={i} className="particle" style={p} />
        ))}
      </div>
      <div className="hero-content" ref={ref}>
        <div className="hero-text">
          <h1>FORESTY</h1>
          <p>Where Every Bite Melts With Flavor - Premium burgers, loaded fries, sizzling pizza &amp; more, crafted with passion in the heart of Pakistan.</p>
          <div className="hero-btns">
            <a href="#menu" className="btn-primary"><UtensilsCrossed size={18} /> Explore Menu</a>
            <Link href="/order" className="btn-secondary"><ShoppingCart size={18} /> Order Online</Link>
          </div>
        </div>
        <div className="hero-image">
          <Image src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800" alt="FORESTY Signature Burger" width={500} height={500} priority style={{ borderRadius: '20px', objectFit: 'cover' }} />
          <div className="hero-float" style={{ top: '5%', right: '-10%' }}>
            <Image src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800" alt="Pizza" width={120} height={120} style={{ objectFit: 'cover' }} />
          </div>
          <div className="hero-float" style={{ bottom: '5%', left: '-10%' }}>
            <Image src="https://images.unsplash.com/photo-1576107232684-1279f390859f?q=80&w=800" alt="Fries" width={120} height={120} style={{ objectFit: 'cover' }} />
          </div>
        </div>
      </div>
    </section>
  );
}
