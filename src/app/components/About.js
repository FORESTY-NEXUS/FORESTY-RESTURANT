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
    <div className="flex items-center justify-center gap-1">
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
    <section className="relative flex flex-col items-center justify-center min-h-screen bg-[#1c1c1c] text-white overflow-hidden py-24" id="about">
      
      {/* Corner Images - Replace src with your actual asset paths in your public folder */}
      <div className="absolute top-[-80px] left-[-80px] w-64 h-64 md:w-[350px] md:h-[350px] rounded-full overflow-hidden shadow-2xl z-0 pointer-events-none">
        <Image 
          src="/images/—Pngtree—delicious pakistani food with sauce_15589733.png" 
          alt="Noodles Dish" 
          fill
          className="object-cover"
        />
      </div>
      <div className="absolute top-[-80px] right-[-80px] w-64 h-64 md:w-[350px] md:h-[350px] rounded-full overflow-hidden shadow-2xl z-0 pointer-events-none">
        <Image 
          src="/images/—Pngtree—noodles on white plate transparent_16098830.png" 
          alt="Meat Dish" 
          fill
          className="object-cover"
        />
      </div>

      {/* Section Title */}
      <div className="absolute top-16 w-full text-center z-10">
        <h2 className="text-[#FF0000] font-black text-3xl md:text-4xl tracking-wide uppercase drop-shadow-md">
          ABOUT US
        </h2>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-5xl px-6 text-center mt-12 mb-20">
        <p className="text-3xl md:text-5xl font-extrabold leading-[1.5] text-gray-100">
          We source only the freshest produce, finest spices, and <span className="text-[#FF6600]">highest quality</span> meats to ensure every bite bursts with authentic, robust flavor. No shortcuts, just <span className="text-[#FF0000]">superior ingredients</span>.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-6xl px-6">
        {stats.map((s, i) => (
          <div 
            key={i} 
            className="bg-[#151515] border border-[#222] rounded-2xl py-12 px-4 flex flex-col items-center justify-center shadow-lg"
          >
            <div className="text-[#FF4500] text-4xl md:text-5xl font-black mb-4">
              <Counter end={s.num} suffix={s.suffix} icon={s.icon} />
            </div>
            <p className="text-gray-400 text-sm md:text-sm font-medium tracking-wide">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}