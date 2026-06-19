'use client';

import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Flame, Users, Moon, ChevronLeft, ChevronRight, Utensils } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

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
  {
    icon: <Utensils size={14} />,
    badge: 'COMBO',
    title: 'Solo Feast Discount',
    desc: 'Get 1 personal pizza, small fries, and a drink for a massive discount.',
    hours: 12,
  },
  {
    icon: <Flame size={14} />,
    badge: 'SPICY',
    title: 'Spicy Wings Challenge',
    desc: 'Finish 10 ghost pepper wings in 5 minutes and get your meal completely free!',
    hours: 24,
  },
   {
    icon: <Utensils size={14} />,
    badge: 'COMBO',
    title: 'Solo Feast Discount',
    desc: 'Get 1 personal pizza, small fries, and a drink for a massive discount.',
    hours: 12,
  },
  {
    icon: <Flame size={14} />,
    badge: 'SPICY',
    title: 'Spicy Wings Challenge',
    desc: 'Finish 10 ghost pepper wings in 5 minutes and get your meal completely free!',
    hours: 24,
  },
];

function Timer({ hours }) {
  const [time, setTime] = useState(hours * 3600);
  useEffect(() => {
    const interval = setInterval(() => setTime((t) => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(interval);
  }, []);

  const h = Math.floor(time / 3600);
  const m = Math.floor((time % 3600) / 60);
  const s = time % 60;

  return (
    <div className="flex items-center justify-center gap-3 mt-6">
      <div className="bg-[#2a2a2a] text-[#FF5722] rounded-lg px-3 py-2 flex flex-col items-center min-w-[60px]">
        <span className="text-xl font-bold leading-none">{String(h).padStart(2, '0')}</span>
        <small className="text-[10px] text-gray-400 mt-1">HRS</small>
      </div>
      <span className="text-gray-500 font-bold">:</span>
      <div className="bg-[#2a2a2a] text-[#FF5722] rounded-lg px-3 py-2 flex flex-col items-center min-w-[60px]">
        <span className="text-xl font-bold leading-none">{String(m).padStart(2, '0')}</span>
        <small className="text-[10px] text-gray-400 mt-1">MIN</small>
      </div>
      <span className="text-gray-500 font-bold">:</span>
      <div className="bg-[#2a2a2a] text-[#FF5722] rounded-lg px-3 py-2 flex flex-col items-center min-w-[60px]">
        <span className="text-xl font-bold leading-none">{String(s).padStart(2, '0')}</span>
        <small className="text-[10px] text-gray-400 mt-1">SEC</small>
      </div>
    </div>
  );
}

export default function SpecialOffers() {
  const scrollerRef = useRef(null);
  
  // Dynamically calculate the middle index for any array length
  const initialMiddleIndex = Math.floor(offers.length / 2);
  const [activeIndex, setActiveIndex] = useState(initialMiddleIndex);

  // Helper function to get precise card width + spacing
  const getCardStepWidth = () => {
    const scroller = scrollerRef.current;
    if (!scroller) return 416;
    const card = scroller.querySelector('.offer-card');
    if (!card) return 416;
    // Card width + the gap (32px from Tailwind's gap-8)
    return card.clientWidth + 32;
  };

  // FIX #1: Automatically center the middle card immediately on component load
  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    // Timeout ensures the DOM elements have calculated their real CSS layout sizes
    const timer = setTimeout(() => {
      scroller.scrollLeft = initialMiddleIndex * getCardStepWidth();
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  // Mouse drag logic for PC
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    const onMouseDown = (e) => {
      isDown = true;
      startX = e.pageX - scroller.offsetLeft;
      scrollLeft = scroller.scrollLeft;
    };
    const onMouseLeave = () => { isDown = false; };
    const onMouseUp = () => { isDown = false; };
    const onMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - scroller.offsetLeft;
      const walk = (x - startX) * 1.5;
      scroller.scrollLeft = scrollLeft - walk;
    };

    scroller.addEventListener('mousedown', onMouseDown);
    scroller.addEventListener('mouseleave', onMouseLeave);
    scroller.addEventListener('mouseup', onMouseUp);
    scroller.addEventListener('mousemove', onMouseMove);

    return () => {
      scroller.removeEventListener('mousedown', onMouseDown);
      scroller.removeEventListener('mouseleave', onMouseLeave);
      scroller.removeEventListener('mouseup', onMouseUp);
      scroller.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  // Tracks which card is centered to update the dot indicators
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const handleScroll = () => {
      const index = Math.round(scroller.scrollLeft / getCardStepWidth());
      if (index !== activeIndex && index >= 0 && index < offers.length) {
        setActiveIndex(index);
      }
    };

    scroller.addEventListener('scroll', handleScroll, { passive: true });
    return () => scroller.removeEventListener('scroll', handleScroll);
  }, [activeIndex]);

  // FIX #2: Updated responsive tracking boundaries so infinite cards rotate accurately
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    const cards = gsap.utils.toArray('.offer-card');

    cards.forEach((card) => {
      gsap.timeline({
        scrollTrigger: {
          trigger: card,
          scroller: scrollerRef.current,
          horizontal: true,
          scrub: true,
          // "containerAnimation" is the secret sauce here. 
          // It tells GSAP to evaluate positions relative to the moving horizontal viewport layout boundaries.
          start: "left center+=100%", 
          end: "right center-=100%",
        }
      })
      .fromTo(card,
        { rotation: 12, scale: 0.85, opacity: 0.4 },
        { rotation: 0, scale: 1, opacity: 1, duration: 0.5, ease: "none" }
      )
      .to(card,
        { rotation: -12, scale: 0.85, opacity: 0.4, duration: 0.5, ease: "none" }
      );
    });
  }, { scope: scrollerRef });

  const scrollToIndex = (index) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollTo({
      left: index * getCardStepWidth(),
      behavior: 'smooth'
    });
  };

  return (
    <section className="section bg-[#1c1c1c] py-20 overflow-hidden select-none">
      <div className="text-center mb-8">
        <p className="text-[#FF5722] font-semibold tracking-wider text-sm mb-2 uppercase">Limited Time</p>
        <h2 className="text-white text-4xl md:text-5xl font-black mb-4">Special Offers</h2>
        <p className="text-gray-400 max-w-xl mx-auto px-6 text-sm">
          Drag with your mouse or swipe on mobile to view exclusive deals.
        </p>
      </div>

      {/* HORIZONTAL TRACK */}
      <div 
        ref={scrollerRef}
        className="flex gap-8 overflow-x-auto snap-x snap-mandatory scroll-smooth py-12 px-[calc(50vw-160px)] md:px-[calc(50vw-192px)] no-scrollbar cursor-grab active:cursor-grabbing"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {offers.map((o, i) => (
          <div
            key={i}
            className="offer-card snap-center shrink-0 w-[320px] md:w-[384px] bg-[#251616] p-8 rounded-3xl shadow-2xl border border-[#2a2a2a] flex flex-col items-start will-change-transform pointer-events-none"
          >
            <span className="inline-flex  items-center gap-1.5 bg-[#FF5722]/10 text-[#FF5722] px-3 py-1.5 rounded-full text-xs font-black tracking-widest mb-6">
              {o.icon} {o.badge}
            </span>
            <h3 className="text-white text-2xl font-bold mb-3">{o.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">{o.desc}</p>
            
            <div className="w-full h-px bg-gradient-to-r from-transparent via-[#2a2a2a] to-transparent my-4"></div>
            
            <Timer hours={o.hours} />
          </div>
        ))}
      </div>

      {/* INDICATORS CONTROL DESIGN */}
      <div className="flex flex-col items-center gap-4 mt-4">
        {/* Dynamic Dot Indicators */}
        <div className="flex items-center gap-2.5">
          {offers.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                activeIndex === i ? 'w-8 bg-[#FF5722]' : 'w-2.5 bg-[#3a3a3a] hover:bg-gray-500'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Control Button Chevrons */}
       
      </div>
    </section>
  );
}