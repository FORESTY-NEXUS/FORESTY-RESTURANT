'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { UtensilsCrossed, ShoppingCart } from 'lucide-react';

export default function Hero() {
  const ref = useRef(null);

  useEffect(() => {
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

  const particles = Array.from({ length: 15 }, (_, i) => ({
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 8}s`,
    animationDuration: `${6 + Math.random() * 6}s`,
    width: `${2 + Math.random() * 4}px`,
    height: `${2 + Math.random() * 4}px`,
  }));

  return (
    <section className="hero" id="home">
      <div className="hero-bg" />
      <div className="hero-particles">
        {particles.map((p, i) => (
          <div key={i} className="particle" style={p} />
        ))}
      </div>
      <div className="hero-content" ref={ref}>
        <div className="hero-text">
          <h1>CHEEZARILLA</h1>
          <p>Where Every Bite Melts With Flavor — Premium burgers, loaded fries, sizzling pizza &amp; more, crafted with passion in the heart of Pakistan.</p>
          <div className="hero-btns">
            <a href="#menu" className="btn-primary"><UtensilsCrossed size={18} /> Explore Menu</a>
            <a href="#contact" className="btn-secondary"><ShoppingCart size={18} /> Order Now</a>
          </div>
        </div>
        <div className="hero-image">
          <Image src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800" alt="Cheezarilla Signature Burger" width={500} height={500} priority style={{ borderRadius: '20px', objectFit: 'cover' }} />
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
