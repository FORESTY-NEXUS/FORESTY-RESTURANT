'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function AboutUsSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      });

      // 1. Animate Waves sliding in
      tl.fromTo(
        '.left-wave',
        { xPercent: -100, scaleX: 0.5 },
        { xPercent: 0, scaleX: 1, duration: 1.2, ease: 'power4.out' },
        0
      )
      .fromTo(
        '.right-wave',
        { xPercent: 100, scaleX: 0.5 },
        { xPercent: 0, scaleX: 1, duration: 1.2, ease: 'power4.out' },
        0
      )
      
      // 2. Animate Floating Food Items
      .fromTo(
        '.floating-food',
        { scale: 0, rotation: -45, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'back.out(1.5)' },
        0.3
      )

      // 3. Animate the 'About Us' Badge
      .fromTo(
        '.about-badge',
        { y: -30, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.2)' },
        0.5
      )

      // 4. Animate Main Text
      .fromTo(
        '.main-text',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        0.7
      )

      // 5. Stagger Stats Cards
      .fromTo(
        '.stat-card',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'back.out(1.2)' },
        0.9
      );
      // 5. Stagger Stats Cards & Counters
tl.fromTo(
  '.stat-card',
  { y: 40, opacity: 0 },
  { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'back.out(1.2)' },
  0.9
);

// Counter Animation
tl.to('.counter', {
  duration: 2,
  innerText: (index, target) => target.getAttribute('data-target'),
  snap: { innerText: 1 }, // This makes it count by whole numbers
  ease: 'power1.out',
  onUpdate: function() {
    this.targets().forEach(target => {
      // Formats the number (optional: add commas if needed)
      target.innerText = Math.ceil(target.innerText);
    });
  }
}, 1.2); // Start slightly after the cards appear
    }, sectionRef);

    return () => ctx.revert(); // Cleanup GSAP context on unmount
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="relative bg-[#1c1c1c] py-20 md:py-32  min-h-[80vh] flex flex-col items-center justify-center w-full"
    >
      {/* --- BACKGROUND WAVES --- */}
      {/* Left Orange Wave */}
      <div className="left-wave absolute top-0 left-0 h-full w-[25vw] md:w-[20vw] z-0 origin-left">
        <svg preserveAspectRatio="none" viewBox="0 0 100 1000" className="h-full w-full text-[#FF5722] fill-current drop-shadow-2xl">
          <path d="M0,0 L80,0 C10,200 130,450 50,650 C-10,850 90,1000 0,1000 Z" />
        </svg>
      </div>

      {/* Right Orange Wave */}
      <div className="right-wave absolute top-0 right-0 h-full w-[25vw] md:w-[20vw] z-0 origin-right">
        <svg preserveAspectRatio="none" viewBox="0 0 100 1000" className="h-full w-full text-[#FF5722] fill-current drop-shadow-2xl">
          <path d="M100,0 L20,0 C90,200 -30,450 50,650 C110,850 10,1000 100,1000 Z" />
        </svg>
      </div>

      {/* --- FLOATING DECORATIONS --- */}
      {/* Top Left Wrap */}
      <div className="floating-food absolute top-50 md:top-20 -left-15 md:left-12 z-20 w-44 h-44 md:w-58 md:h-58 rotate-45 transform  ">
        
        <Image 
          src="/images/shawarma.png" 
          alt="Wrap" fill className="object-contain"
        />
      </div>

      {/* Top Right Burger */}
      <div className="floating-food absolute top-50 md:top-22 -right-8 md:right-2 z-20 w-28 h-28 md:w-58 md:h-58  ">
       <Image
  src="/images/burger2.png" 
  alt="Burger" 
  fill 
  className="object-cover"
/>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 flex flex-col items-center w-full">
        
      {/* About Us Banner */}
<div className="about-badge relative bg-[#FF0000]  text-white font-black text-xl md:text-3xl tracking-widest py-4 md:py-8 px-16 md:px-32 rounded-2xl shadow-[0_10px_30px_rgba(255,0,0,0.3)] mb-12 md:mb-16 flex  items-center justify-center max-w-fit mx-auto overflow-hidden">
  
  {/* Text kept safely above the images */}
  <span className="relative z-20">ABOUT US</span>
  
  {/* Mini food attached to LEFT of banner */}
  <div className="absolute -left-6 md:-left-8 bottom-2 translate-y-1/2 w-14 h-14 md:w-30 md:h-30 rounded-full overflow-hidden shadow-lg z-10 ">
    <Image 
      src="/images/—Pngtree—noodles on white plate transparent_16098830.png" 
      alt="Noodles" 
      fill 
      className="object-cover" 
    />
  </div>
  
  {/* Mini food attached to RIGHT of banner */}
  <div className="absolute -right-6 md:-right-8 top-2 -translate-y-1/2 w-14 h-14 md:w-30 md:h-30 rounded-full overflow-hidden shadow-lg z-10 ">
    <Image 
      src="/images/—Pngtree—delicious pakistani food with sauce_15589733.png" 
      alt="Meatballs" 
      fill 
      className="object-cover" 
    />
  </div>
</div>

        {/* Hero Paragraph */}
        <p className="main-text text-white text-xl md:text-3xl lg:text-[40px] font-bold text-center leading-[1.5] md:leading-[1.6] mb-16 md:mb-24 max-w-full px-6 not-lg:px-18">
          We source only the freshest produce, finest spices, and <span className="text-[#FF5722]">highest quality</span> meats to ensure every bite bursts with authentic, robust flavor. No shortcuts, just <span className="text-[#FF0000]">superior</span> ingredients.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full max-w-5xl">
          {/* Card 1 */}
          <div className="stat-card bg-[#151515] hover:bg-[#1a1a1a] transition-colors duration-300 border border-[#2a2a2a] rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center shadow-2xl">
            <h4 className="text-[#FF5722] text-2xl md:text-4xl font-black mb-2"
            ><span className="counter" data-target="10000+">0</span></h4>
            <p className="text-gray-400 text-xs md:text-sm font-medium tracking-wide">Happy Customers</p>
          </div>

          {/* Card 2 */}
          <div className="stat-card bg-[#151515] hover:bg-[#1a1a1a] transition-colors duration-300 border border-[#2a2a2a] rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center shadow-2xl">
            <h4 className="text-[#FF5722] text-2xl md:text-4xl font-black mb-2">
             <span className="counter" data-target="50">50+</span> </h4>
            <p className="text-gray-400 text-xs md:text-sm font-medium tracking-wide">Food Items</p>
          </div>

          {/* Card 3 */}
          <div className="stat-card bg-[#151515] hover:bg-[#1a1a1a] transition-colors duration-300 border border-[#2a2a2a] rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center shadow-2xl">
            <h4 className="text-[#FF5722] text-2xl md:text-4xl font-black mb-2 flex items-center gap-2">
              5 <Star fill="currentColor" size={28} className="text-[#FF5722] mt-[-4px]" />
            </h4>
            <p className="text-gray-400 text-xs md:text-sm font-medium tracking-wide">Star Experience</p>
          </div>

          {/* Card 4 */}
          <div className="stat-card bg-[#151515] hover:bg-[#1a1a1a] transition-colors duration-300 border border-[#2a2a2a] rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center shadow-2xl">
            <h4 className="text-[#FF5722] text-2xl md:text-4xl font-black mb-2">24/7</h4>
            <p className="text-gray-400 text-xs md:text-sm font-medium tracking-wide">Online Orders</p>
          </div>
        </div>

      </div>
    </section>
  );
}