'use client';

import { useState, useEffect, useRef } from 'react';
import { Clock, CheckCircle2 } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

const schedule = [
  { day: 'Monday', hours: '12:00 PM — 11:00 PM', close24: 23 },
  { day: 'Tuesday', hours: '12:00 PM — 11:00 PM', close24: 23 },
  { day: 'Wednesday', hours: '12:00 PM — 11:00 PM', close24: 23 },
  { day: 'Thursday', hours: '12:00 PM — 11:00 PM', close24: 23 },
  { day: 'Friday', hours: '12:00 PM — 1:00 AM', close24: 1 },
  { day: 'Saturday', hours: '12:00 PM — 1:00 AM', close24: 1 },
  { day: 'Sunday', hours: '12:00 PM — 1:00 AM', close24: 1 },
];

export default function RestaurantTimings() {
  const containerRef = useRef(null);
  const [currentDayIndex, setCurrentDayIndex] = useState(-1);
  const [isOpenNow, setIsOpenNow] = useState(true);

  useEffect(() => {
    const jsDay = new Date().getDay(); 
    const normalizedIndex = jsDay === 0 ? 6 : jsDay - 1; 
    setCurrentDayIndex(normalizedIndex);

    const now = new Date();
    const currentHour = now.getHours();
    const currentDaySchedule = schedule[normalizedIndex];

    if (currentDaySchedule.close24 === 1) {
      setIsOpenNow(currentHour >= 12 || currentHour < 1);
    } else {
      setIsOpenNow(currentHour >= 12 && currentHour < 23);
    }
  }, []);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo('.timing-row',
      { 
        x: -20, 
        opacity: 0 
      },
      {
        x: 0,
        opacity: 1,
        stagger: 0.06,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
        }
      }
    );
  }, { scope: containerRef });

  return (
    <section className="bg-[#1c1c1c] py-16 md:py-24 overflow-hidden" ref={containerRef}>
      <div className="text-center mb-10 px-4">
        {/* PRIMARY RED USED FOR ICON & SUBTITLE */}
        <div className="inline-flex items-center gap-2 text-[#FF0000] font-semibold tracking-wider text-xs md:text-sm mb-2 uppercase">
          <Clock size={16} /> Opening Hours
        </div>
        <h2 className="text-white text-3xl md:text-5xl font-black mb-4">Restaurant Timings</h2>
        
        {/* LIVE STATUS BANNER */}
        <div className="inline-flex items-center gap-2 bg-[#151515] px-4 py-2 rounded-full border border-[#252525] mt-2 shadow-xl max-w-full">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isOpenNow ? 'bg-green-400' : 'bg-red-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isOpenNow ? 'bg-green-500' : 'bg-red-500'}`}></span>
          </span>
          <p className="text-[11px] md:text-xs font-bold text-gray-300 uppercase tracking-wider text-left md:text-center">
            We are {isOpenNow ? 'Open Now' : 'Closed Now'} 
          </p>
        </div>
      </div>

      {/* TIMINGS LIST CONTAINER */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 flex flex-col gap-3">
        {schedule.map((item, i) => {
          const isToday = currentDayIndex === i;
          
          return (
            <div
              key={item.day}
              /* RESPONSIVE LAYOUT FIX:
                - Uses 'flex-col items-start gap-2' on mobile so items layout vertically without squishing.
                - Scales up to 'sm:flex-row sm:items-center sm:justify-between sm:gap-0' on wider devices.
              */
              className={`timing-row flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-0 p-4 sm:p-5 rounded-2xl border transition-all duration-300 transform md:hover:translate-x-2
                ${isToday 
                  ? 'bg-[#1f1515] border-[#FF0000] text-white shadow-[0_0_25px_rgba(255,0,0,0.1)]' 
                  : 'bg-[#151515] border-[#252525] text-gray-400 md:hover:border-gray-700 md:hover:bg-[#1a1a1a]'
                }`}
            >
              <div className="flex items-center gap-3">
                {isToday ? (
                  /* PRIMARY RED FOR ACTIVE STATE ICONS */
                  <CheckCircle2 size={18} className="text-[#FF0000] shrink-0" />
                ) : (
                  <Clock size={18} className="text-gray-600 shrink-0" />
                )}
                <span className={`font-bold tracking-wide text-base ${isToday ? 'text-white' : 'text-gray-300'}`}>
                  {item.day}
                </span>
                {isToday && (
                  /* PRIMARY RED FOR "TODAY" BADGE BACKGROUND */
                  <span className="bg-[#FF0000] text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest animate-pulse">
                    Today
                  </span>
                )}
              </div>
              
              {/* SECONDARY ORANGE USED ON TIMING NUMBERS */}
              <span className={`font-semibold tracking-wider text-sm md:text-base self-start sm:self-center pl-7 sm:pl-0 ${isToday ? 'text-[#FF5722]' : 'text-gray-400'}`}>
                {item.hours}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}