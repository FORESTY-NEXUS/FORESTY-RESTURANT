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
    <section className="section" style={{ background: 'linear-gradient(180deg, var(--black), #0d0d0d)' }}>
      <p className="section-sub" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        <Clock size={18} /> Opening Hours
      </p>
      <h2 className="section-title">Restaurant Timings</h2>
      <p className="section-desc">We&apos;re open when your cravings hit — from lunch through late-night snacking.</p>
      <div className="timings-wrap">
        {schedule.map((s, i) => (
          <div className="timing-card reveal" key={i} style={{
            transitionDelay: `${i * 0.08}s`,
            borderColor: dayMap[today] === s.day ? 'var(--yellow)' : undefined,
            background: dayMap[today] === s.day ? 'rgba(244,180,0,.05)' : undefined
          }}>
            <div className="day" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock size={16} color={s.open ? '#4CAF50' : 'var(--red)'} />
              {s.day} {dayMap[today] === s.day && <span style={{ fontSize: '.7rem', color: 'var(--yellow)', fontWeight: 700, marginLeft: '5px' }}>TODAY</span>}
            </div>
            <div className="time">{s.time}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
