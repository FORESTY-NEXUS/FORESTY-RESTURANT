'use client';
import { Clock } from 'lucide-react';

const schedule = [
  { day: 'Monday', time: '12:00 PM — 11:00 PM', open: true },
  { day: 'Tuesday', time: '12:00 PM — 11:00 PM', open: true },
  { day: 'Wednesday', time: '12:00 PM — 11:00 PM', open: true },
  { day: 'Thursday', time: '12:00 PM — 11:00 PM', open: true },
  { day: 'Friday', time: '12:00 PM — 1:00 AM', open: true },
  { day: 'Saturday', time: '12:00 PM — 1:00 AM', open: true },
  { day: 'Sunday', time: '12:00 PM — 1:00 AM', open: true },
];

export default function Timings() {
  const today = new Date().getDay();
  const dayMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <section className="section bg-[#1c1c1c]">
      <p className="section-sub flex items-center justify-center gap-2">
        <Clock size={18} /> Opening Hours
      </p>
      <h2 className="section-title">Restaurant Timings</h2>
      <p className="section-desc">We&apos;re open when your cravings hit — from lunch through late-night snacking.</p>
      <div className="timings-wrap">
        {schedule.map((s, i) => (
          <div className={`timing-card reveal ${dayMap[today] === s.day ? 'border-brand-orange bg-brand-orange/5' : ''}`} key={i} style={{ transitionDelay: `${i * 0.08}s` }}>
            <div className="day">
              <Clock size={16} color={s.open ? '#4CAF50' : 'var(--red)'} />
              {s.day} {dayMap[today] === s.day && <span className="ml-[5px] text-[.7rem] font-bold text-brand-orange">TODAY</span>}
            </div>
            <div className="time">{s.time}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
