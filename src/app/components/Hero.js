'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';
import Link from 'next/link';

const dishes = [
  {
    // Restricting negative horizontal margin to desktop (md:-mr-[12%])
    // Added negative vertical margin on mobile (-mb-[16%]) to pull items tightly together and fix the ghost padding gaps
    className: 'hero-dish hero-dish-noodles relative flex justify-center items-center w-[45vw] md:w-[28vw] max-w-[350px] z-10 -mb-[35%] md:mb-0 md:-mr-[12%]',
    src: '/images/—Pngtree—noodles on white plate transparent_16098830.png',
    alt: 'Noodles served on a white plate',
  },
  {
    className: 'hero-dish hero-dish-main relative flex justify-center items-center w-[55vw] md:w-[38vw] max-w-[500px] z-30 -mb-[35%] md:mb-0',
    src: '/images/—Pngtree—delicious pakistani food with sauce_15589733.png',
    alt: 'Pakistani food with sauce and garnish',
  },
  {
    className: 'hero-dish hero-dish-pizza relative flex justify-center items-center w-[45vw]  md:w-[34vw] max-w-[420px] z-20 md:-ml-[12%]',
    src: '/images/—Pngtree—closeup of a chicken pizza_16083305.png',
    alt: 'Chicken pizza with herbs',
  },
];

export default function Hero() {
  const heroRef = useRef(null);

useEffect(() => {
  const ctx = gsap.context(() => {
    const mm = gsap.matchMedia();

    mm.add({
      isDesktop: "(min-width: 768px)",
      isMobile: "(max-width: 767px)"
    }, (context) => {
      const { isDesktop, isMobile } = context.conditions;

      if (isDesktop) {
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
      }
if (isMobile) {
  // 1. Mobile Intro Animation Timeline
  const mobileTimeline = gsap.timeline({ delay: 0.5, defaults: { ease: 'power3.out' } });

  mobileTimeline
    .from('.hero-title', { y: 30, opacity: 0, duration: 0.8 })
    .from('.hero-dish', { y: 35, opacity: 0, scale: 0.9, stagger: 0.15, duration: 0.8 }, '-=0.4')
    .from('.hero-copy, .hero-order-block', { y: 20, opacity: 0, stagger: 0.15, duration: 0.7 }, '-=0.3');

  // 2. Specialized Mobile Looping Actions

  // Middle Dish: Clean Scale Pulsation Only (No coordinates movement)
  gsap.to('.hero-dish-main', {
    scale: 1.03,
    duration: 3.2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });

  // Top Dish (Noodles): Drifts purely up and down
  gsap.to('.hero-dish-noodles', {
    y: 8,
    duration: 4.0,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });

  // Bottom Dish (Pizza): Drifts purely down and up
  gsap.to('.hero-dish-pizza', {
    y: -8,
    duration: 4.2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });
}
   
    });

  }, heroRef);

  return () => ctx.revert();
}, []);

  return (
    <section 
      className="hero relative min-h-screen flex flex-col justify-between items-center overflow-x-hidden overflow-y-auto bg-[#212121] text-white pt-20 pb-10 lg:py-0 lg:justify-center" 
      id="home" 
      ref={heroRef}
    >
      <div className="hero-content w-full flex flex-col items-center justify-center lg:block">
        
        <div 
          className="hero-showcase relative flex flex-col items-center justify-center w-full mt-[1vh] lg:mt-[8vh] " 
          aria-label="Featured FORESTY dishes"
        >
          {/* 1. Responsive Title: Centered naturally on mobile, absolute pinned on desktop */}
          <h1 
            className="hero-title text-center lg:absolute lg:top-[5%] lg:left-[50%] text-[clamp(3.5rem,12vw,15rem)] font-black whitespace-nowrap z-0 tracking-tighter pointer-events-none select-none"
          >
            ZAIQA HUB
          </h1>

          {/* 2. Food dishes wrapper */}
          <div className="flex flex-col md:flex-row items-center justify-center mt-6 lg:mt-0">
            {dishes.map((dish) => (
           <div className={dish.className} key={dish.alt}>
                <Image
                  src={dish.src}
                  alt={dish.alt}
                  width={940}
                  height={940}
                  priority
                  className="w-full h-auto object-contain"
                  sizes="(max-width: 640px) 70vw, (max-width: 1024px) 31vw, 300px"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 3. Bottom Layout: Relative flex block on mobile (pushes below pizza safely), Absolute footer on desktop */}
        <div className="w-full px-[5%] mt-12 flex flex-col items-center gap-8 lg:mt-0 lg:absolute lg:bottom-0 lg:left-0 lg:py-10 lg:flex-row lg:justify-between lg:items-end lg:gap-0 z-20">
          
          <p className="hero-copy max-w-[320px] text-lg font-semibold leading-relaxed text-center lg:text-start">
            From Desi Taste To <span className="text-[#ff3300]">Fast Food Cravings.</span> We provide all in one Place.
          </p>
          
          <div className="hero-order-block flex flex-col items-center lg:items-end gap-2">
            <p className="text-sm tracking-wide text-center lg:text-start lg:mr-5">40+ FOODS 10+ variety</p>
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