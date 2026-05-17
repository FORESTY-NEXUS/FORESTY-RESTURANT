'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';

function Counter({ end, suffix = '', icon = null }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const step = Math.ceil(end / 60);
        const interval = setInterval(() => {
          start += step;
          if (start >= end) { setCount(end); clearInterval(interval); }
          else setCount(start);
        }, 30);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
      <h3 ref={ref}>{count.toLocaleString()}{suffix}</h3>
      {icon && <span style={{ display: 'flex' }}>{icon}</span>}
    </div>
  );
}

const stats = [
  { num: 10000, suffix: '+', label: 'Happy Customers' },
  { num: 50, suffix: '+', label: 'Food Items' },
  { num: 5, suffix: '', label: 'Star Experience', icon: <Star size={24} fill="var(--yellow)" color="var(--yellow)" /> },
  { num: 24, suffix: '/7', label: 'Online Orders' },
];

export default function About() {
  return (
    <section className="section" id="about">
      <p className="section-sub">Our Story</p>
      <h2 className="section-title">About CHEEZARILLA</h2>
      <p className="section-desc">Born from a passion for bold flavors and cheesy perfection, CHEEZARILLA brings you Pakistani taste with a modern fusion twist.</p>

      <div className="about-grid reveal">
        <div className="about-img">
          <Image src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800" alt="CHEEZARILLA Interior" width={600} height={400} style={{ width: '100%', height: '400px', objectFit: 'cover' }} />
        </div>
        <div className="about-text">
          <p>At CHEEZARILLA, we believe in crafting every dish with <strong style={{ color: '#F4B400' }}>premium ingredients</strong> sourced from the finest local suppliers. Our chefs blend traditional Pakistani spices with modern culinary techniques to deliver an unforgettable dining experience.</p>
          <p>Whether you're craving a juicy Zilla Cheese Burger dripping with our signature cheese sauce or our crispy Dynamite Loaded Fries, every bite is a celebration of flavor. We serve families, friends, and foodies in a <strong style={{ color: '#C1121F' }}>warm, welcoming environment</strong> that feels like home.</p>
          <p>With <strong style={{ color: '#F4B400' }}>lightning-fast service</strong> and a menu that caters to every craving, CHEEZARILLA is redefining fast food in Pakistan — one cheesy masterpiece at a time.</p>
        </div>
      </div>

      <div className="stats-row">
        {stats.map((s, i) => (
          <div className="stat-card reveal" key={i} style={{ transitionDelay: `${i * 0.1}s` }}>
            <Counter end={s.num} suffix={s.suffix} icon={s.icon} />
            <p>{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
