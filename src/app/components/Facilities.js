'use client';

import { useRef } from 'react';
import { Wifi, Users, Snowflake, Bike, Flame, ParkingCircle, Leaf, Smartphone } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

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
  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Grab all the facility cards inside our container
    const cards = gsap.utils.toArray('.facility-card');

    cards.forEach((card) => {
      gsap.to(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 95%",     // Start when the card just peeks into the bottom of the screen
          end: "center center", // Finish the animation when the card reaches the middle of the screen
          scrub: 1,             // 1-second lag for that smooth, buttery scroll tracking
        },
        // Keyframes let us sequence the scale down -> scale up effect
        keyframes: [
          { scale: 0.85, duration: 0.5, ease: "power1.out" }, // 1. Compress down slightly
          { scale: 1, duration: 0.5, ease: "back.out(1.5)" }  // 2. Pop back out to original size
        ]
      });
    });
  }, { scope: containerRef }); // Scope ensures GSAP only targets elements inside this specific section

  return (
    <section className="section bg-[#1c1c1c] py-20" id="facilities" ref={containerRef}>
      <p className="section-sub text-center text-brand-orange mb-2">Our Facilities</p>
      <h2 className="section-title text-center text-white text-4xl font-bold mb-4">Premium Experience</h2>
      <p className="section-desc text-center text-gray-400 mb-12 max-w-2xl mx-auto">
        We go beyond food - every visit to FORESTY RESTAURANT is designed to be a premium experience.
      </p>
      
      <div className="facilities-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto px-6">
        {facilities.map((f, i) => (
          <div 
            className="facility-card bg-[#151515] hover:bg-[#1a1a1a] transition-colors duration-300 border border-[#2a2a2a] rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-2xl" 
            key={i}
          >
            <div className="facility-icon flex justify-center text-[#FF5722] mb-4">
              {f.icon}
            </div>
            <h3 className="text-white text-xl font-bold mb-2">{f.title}</h3>
            <p className="text-gray-400 text-sm">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}