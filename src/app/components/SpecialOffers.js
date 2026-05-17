'use client';
import { useState, useEffect } from 'react';
import { Flame, Users, Moon } from 'lucide-react';

const offers = [
  {
    icon: <Flame size={14} />,
    badge: 'HOT DEAL',
    title: 'Buy 1 Get 1 Free',
    desc: 'On all Zilla Burgers every Tuesday! Grab your buddy and double the flavor.',
    hours: 47,
  },
  {
    icon: <Users size={14} />,
    badge: 'FAMILY',
    title: 'Weekend Family Deal',
    desc: '2 Burgers + 1 Pizza + Fries + 4 Drinks for just Rs. 3,999. Save big!',
    hours: 72,
  },
  {
    icon: <Moon size={14} />,
    badge: 'MIDNIGHT',
    title: 'Midnight Cravings Discount',
    desc: '30% off on all orders placed between 11 PM and 2 AM. Night owls rejoice!',
    hours: 23,
  },
];

function Timer({ hours }) {
  const [time, setTime] = useState(hours * 3600);

  useEffect(() => {
    const interval = setInterval(() => setTime(t => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(interval);
  }, []);

  const h = Math.floor(time / 3600);
  const m = Math.floor((time % 3600) / 60);
  const s = time % 60;

  return (
    <div className="offer-timer">
      <div className="timer-box"><span>{String(h).padStart(2, '0')}</span><small>HRS</small></div>
      <div className="timer-box"><span>{String(m).padStart(2, '0')}</span><small>MIN</small></div>
      <div className="timer-box"><span>{String(s).padStart(2, '0')}</span><small>SEC</small></div>
    </div>
  );
}

export default function SpecialOffers() {
  return (
    <section className="section">
      <p className="section-sub">Limited Time</p>
      <h2 className="section-title">Special Offers</h2>
      <p className="section-desc">Don&apos;t miss out on our exclusive deals — because great food deserves great prices.</p>
      <div className="offers-grid">
        {offers.map((o, i) => (
          <div className="offer-card reveal" key={i} style={{ transitionDelay: `${i * 0.15}s` }}>
            <span className="offer-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              {o.icon} {o.badge}
            </span>
            <h3>{o.title}</h3>
            <p>{o.desc}</p>
            <Timer hours={o.hours} />
          </div>
        ))}
      </div>
    </section>
  );
}
