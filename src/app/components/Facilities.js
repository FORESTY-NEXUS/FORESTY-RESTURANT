'use client';
import { Wifi, Users, Snowflake, Bike, Flame, ParkingCircle, Leaf, Smartphone } from 'lucide-react';

const facilities = [
  { icon: <Wifi size={32} />, title: 'Free WiFi', desc: 'High-speed internet throughout the restaurant' },
  { icon: <Users size={32} />, title: 'Family Hall', desc: 'Spacious private area for family gatherings' },
  { icon: <Snowflake size={32} />, title: 'Air Conditioning', desc: 'Fully climate-controlled dining experience' },
  { icon: <Bike size={32} />, title: 'Home Delivery', desc: 'Fast delivery across the city within 30 mins' },
  { icon: <Flame size={32} />, title: 'Live Cooking', desc: 'Watch our chefs prepare your meal in real-time' },
  { icon: <ParkingCircle size={32} />, title: 'Car Parking', desc: 'Ample free parking space for customers' },
  { icon: <Leaf size={32} />, title: 'Outdoor Seating', desc: 'Beautiful open-air dining under the stars' },
  { icon: <Smartphone size={32} />, title: 'Online Reservations', desc: 'Book your table in advance via our app' },
];

export default function Facilities() {
  return (
    <section className="section" id="facilities">
      <p className="section-sub">Our Facilities</p>
      <h2 className="section-title">Premium Experience</h2>
      <p className="section-desc">We go beyond food - every visit to FORESTY RESTURANT is designed to be a premium experience.</p>
      <div className="facilities-grid">
        {facilities.map((f, i) => (
          <div className="facility-card reveal" key={i} style={{ transitionDelay: `${i * 0.08}s` }}>
            <div className="facility-icon" style={{ color: 'var(--yellow)', display: 'flex', justifyContent: 'center' }}>{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
