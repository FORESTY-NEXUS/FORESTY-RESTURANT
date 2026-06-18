'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';
import Link from 'next/link';

const dishes = [
  {
    // Kept 'hero-dish' classes for GSAP targeting, added Tailwind for layout/z-index/overlap
    className: 'hero-dish hero-dish-noodles relative flex justify-center items-center w-[28vw] max-w-[350px] z-10 -mr-[12%]',
    src: '/images/—Pngtree—noodles on white plate transparent_16098830.png',
    alt: 'Noodles served on a white plate',
  },
  {
    className: 'hero-dish hero-dish-main relative flex justify-center items-center w-[38vw] max-w-[500px] z-30',
    src: '/images/—Pngtree—delicious pakistani food with sauce_15589733.png',
    alt: 'Pakistani food with sauce and garnish',
  },
  {
    className: 'hero-dish hero-dish-pizza relative flex justify-center items-center w-[34vw] max-w-[420px] z-20 -ml-[12%]',
    src: '/images/—Pngtree—closeup of a chicken pizza_16083305.png',
    alt: 'Chicken pizza with herbs',
  },
];

export default function Hero() {
  const heroRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Let GSAP handle the transform centering to avoid conflicts with Tailwind's translate classes
      gsap.set('.hero-title', { xPercent: -50, yPercent: -50 });

      const timeline = gsap.timeline({ delay: 2.35, defaults: { ease: 'power3.out' } });

      timeline
        .from('.hero-title', { y: 54, opacity: 0, duration: 0.9 })
        .from('.hero-dish', { y: 42, opacity: 0, scale: 0.86, stagger: 0.12, duration: 0.8 }, '-=0.55')
        .from('.hero-copy, .hero-order-block', { y: 22, opacity: 0, stagger: 0.12, duration: 0.65 }, '-=0.35');

      gsap.to('.hero-dish-main', {
        y: -10,
        duration: 3.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to('.hero-dish-noodles, .hero-dish-pizza', {
        y: -7,
        duration: 4.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.35,
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      className="hero relative min-h-screen flex flex-col justify-center items-center overflow-hidden bg-[#212121] text-white" 
      id="home" 
      ref={heroRef}
    >
      <div className="hero-content w-full">
      <div 
  className="hero-showcase relative flex items-center justify-center w-full mt-[8vh]" 
  aria-label="Featured FORESTY dishes"
>
  {/* 1. Title moved inside the food container */}
  <h1 
    className="hero-title absolute top-[5%] left-[50%]  text-[clamp(4rem,14vw,15rem)] font-black whitespace-nowrap z-0 tracking-tighter pointer-events-none select-none"
  >
    ZAIQA HUB
  </h1>

  {/* 2. Food dishes mapping */}
  {dishes.map((dish) => (
    <div className={`${dish.className} relative z-10`} key={dish.alt}>
      <Image
        src={dish.src}
        alt={dish.alt}
        width={940}
        height={940}
        priority
        sizes="(max-width: 640px) 44vw, (max-width: 1024px) 31vw, 300px"
      />
    </div>
  ))}
</div>
        {/* Footer Content */}
        <div className="absolute bottom-0 left-0 w-full px-[5%] py-10 flex justify-between items-end z-10">
          <p className="hero-copy max-w-[320px] text-lg font-semibold leading-relaxed">
            From Desi Taste To <span className="text-[#ff3300]">Fast Food Cravings.</span> We provide all in one Place.
          </p>
          <div className="hero-order-block text-right flex flex-col items-end gap-3">
            <p className="text-sm tracking-wide">40+ FOODS 10+ variety</p>
            <Link 
              href="/order" 
              className="bg-[#ff4500] text-white px-10 py-3 rounded-md font-extrabold text-xl transition-all duration-200 hover:scale-105 hover:bg-[#e63e00]"
            >
              ORDER NOW
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}