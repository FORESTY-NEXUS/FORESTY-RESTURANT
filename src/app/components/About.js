'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';

// Counter component remains largely the same, just ensuring responsiveness
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
    <div className="flex items-center justify-center gap-1 text-4xl md:text-5xl font-black">
      <h3 ref={ref}>{count.toLocaleString()}{suffix}</h3>
      {icon && <span className="flex items-center justify-center">{icon}</span>}
    </div>
  );
}

const stats = [
  { num: 10000, suffix: '+', label: 'Happy Customers' },
  { num: 50, suffix: '+', label: 'Food Items' },
  { num: 5, suffix: '', label: 'Star Experience', icon: <Star size={28} fill="#FF4500" color="#FF4500" className="ml-1" /> },
  { num: 24, suffix: '/7', label: 'Online Orders' },
];

export default function About() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen bg-[#1c1c1c] text-white overflow-hidden py-16 md:py-24" id="about">
      
      {/* Responsive Corner Images: Using negative margins to tuck them away neatly */}
      <div className="absolute -top-16 -left-16 md:-top-20 md:-left-20 w-40 h-40 md:w-80 md:h-80 rounded-full overflow-hidden opacity-30 md:opacity-100 z-0 pointer-events-none">
        <Image src="/images/—Pngtree—delicious pakistani food with sauce_15589733.png" alt="Food" fill className="object-cover" />
      </div>
      <div className="absolute -top-16 -right-16 md:-top-20 md:-right-20 w-40 h-40 md:w-80 md:h-80 rounded-full overflow-hidden opacity-30 md:opacity-100 z-0 pointer-events-none">
        <Image src="/images/—Pngtree—noodles on white plate transparent_16098830.png" alt="Food" fill className="object-cover" />
      </div>

      {/* Section Title */}
      <div className="relative z-10 w-full text-center px-4 mb-8">
        <h2 className="text-[#FF0000] font-black text-2xl md:text-4xl tracking-widest uppercase">
          ABOUT US
        </h2>
      </div>

      {/* Main Content: Using responsive text sizing */}
      <div className="relative z-10 w-full max-w-4xl px-6 text-center mb-16">
        <p className="text-2xl md:text-4xl lg:text-5xl font-extrabold leading-tight text-gray-100">
          We source only the freshest produce, finest spices, and <span className="text-[#FF6600]">highest quality</span> meats to ensure every bite bursts with authentic, robust flavor. 
          <span className="block mt-4 text-lg md:text-xl text-gray-400 font-normal">No shortcuts, just <span className="text-[#FF0000] font-bold">superior ingredients</span>.</span>
        </p>
      </div>

      {/* Stats Grid: Responsive column count */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-6xl px-4">
        {stats.map((s, i) => (
          <div 
            key={i} 
            className="bg-[#151515] border border-[#222] rounded-2xl py-8 px-6 flex flex-col items-center justify-center hover:border-[#FF4500]/30 transition-colors"
          >
            <div className="text-[#FF4500] mb-2">
              <Counter end={s.num} suffix={s.suffix} icon={s.icon} />
            </div>
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}