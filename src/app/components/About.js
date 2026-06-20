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
      // --- 1. UNIVERSAL ENTRY ANIMATIONS ---
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      });

      // Desktop Waves
      tl.fromTo('.desktop-left-wave', { xPercent: -100, scaleX: 0.5 }, { xPercent: 0, scaleX: 1, duration: 1.2, ease: 'power4.out' }, 0)
        .fromTo('.desktop-right-wave', { xPercent: 100, scaleX: 0.5 }, { xPercent: 0, scaleX: 1, duration: 1.2, ease: 'power4.out' }, 0)
      // Mobile Waves
        .fromTo('.mobile-top-wave', { yPercent: -100, scaleY: 0.5 }, { yPercent: 0, scaleY: 1, duration: 1.2, ease: 'power4.out' }, 0)
        .fromTo('.mobile-bottom-wave', { yPercent: 100, scaleY: 0.5 }, { yPercent: 0, scaleY: 1, duration: 1.2, ease: 'power4.out' }, 0)
        
      // Elements
        .fromTo('.floating-food', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, stagger: 0.2, ease: 'back.out(1.5)' }, 0.3)
        .fromTo('.section-title', { y: -30, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.2)' }, 0.5)
        .fromTo('.main-text', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, 0.7)
        .fromTo('.stat-card', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'back.out(1.2)' }, 0.9);

      // Counter logic
      tl.to('.counter', {
        duration: 2,
        innerText: (index, target) => parseFloat(target.getAttribute('data-target').replace('+', '')),
        snap: { innerText: 1 }, 
        ease: 'power1.out',
        onUpdate: function() {
          this.targets().forEach(target => {
            const originalVal = target.getAttribute('data-target');
            const hasPlus = originalVal.includes('+');
            target.innerText = Math.ceil(target.innerText) + (hasPlus ? '+' : '');
          });
        }
      }, 1.2); 


      // --- 2. RESPONSIVE PARALLAX ANIMATIONS ---
      let mm = gsap.matchMedia();

      // DESKTOP & TABLET (768px and up)
      mm.add("(min-width: 768px)", () => {
        gsap.to(".shawarma-float", {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            end: "bottom top",
            scrub: 1,
          },
          x: -150, 
          y: 300,
          rotation: -15,
          ease: "none"
        });

        gsap.to(".burger-float", {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            end: "bottom top",
            scrub: 1,
          },
          x: 150,
          y: 400,
          rotation: 15,
          ease: "none"
        });
      });

      // MOBILE (767px and down) - Scroll from top waves to bottom waves
      mm.add("(max-width: 767px)", () => {
         gsap.set(".shawarma-float", { rotation: -55 }); 
  gsap.set(".burger-float", { rotation: 15 });

  gsap.fromTo(".shawarma-float", 
    // 1. The "From" Object (Start State)
    { 
      y: -500, 
      opacity: 0 
    },
    // 2. The "To" Object (End State & ScrollTrigger)
    { 
      scrollTrigger: { 
        trigger: sectionRef.current, 
        start: "top 50%", // Using the start value from your error log
        end: "center center",
        scrub: 1 
      },
      y: 100, 
      opacity: 1, 
      duration: 1, 
      ease: "none"
    }
  );

  // Apply the same fix to the burger if needed!
  gsap.fromTo(".shawarma-float", 
    // 1. The "From" Object (Start State)
    { 
      y: -500, 
      opacity: 0 
    },
    // 2. The "To" Object (End State & ScrollTrigger)
    { 
      scrollTrigger: { 
        trigger: sectionRef.current, 
        start: "top 50%", // Using the start value from your error log
        end: "center center",
        scrub: 1 
      },
      y: 100, 
      opacity: 1, 
      duration: 1, 
      ease: "none"
    }
  );
});

    }, sectionRef);

    return () => ctx.revert(); 
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="relative bg-[#1c1c1c] py-24 md:py-32 min-h-[85vh] flex flex-col items-center justify-center w-full overflow-hidden"
    >
      {/* --- BACKGROUND WAVES (DESKTOP: Left/Right) --- */}
      <div className="desktop-left-wave hidden md:block absolute top-0 left-0 h-full w-[20vw] z-0 origin-left">
        <svg preserveAspectRatio="none" viewBox="0 0 100 1000" className="h-full w-full text-[#FF5722] fill-current drop-shadow-2xl">
          <path d="M0,0 L80,0 C10,200 130,450 50,650 C-10,850 90,1000 0,1000 Z" />
        </svg>
      </div>

      <div className="desktop-right-wave hidden md:block absolute top-0 right-0 h-full w-[20vw] z-0 origin-right">
        <svg preserveAspectRatio="none" viewBox="0 0 100 1000" className="h-full w-full text-[#FF5722] fill-current drop-shadow-2xl">
          <path d="M100,0 L20,0 C90,200 -30,450 50,650 C110,850 10,1000 100,1000 Z" />
        </svg>
      </div>

      {/* --- BACKGROUND WAVES (MOBILE: Top/Bottom) --- */}
      <div className="mobile-top-wave block md:hidden absolute top-0 left-0 w-full h-[25vh] z-0 origin-top">
        <svg preserveAspectRatio="none" viewBox="0 0 100 100" className="h-full w-full text-[#FF5722] fill-current drop-shadow-2xl">
          {/* Dips UP in the center */}
         <path d="M0,0 H100 V75
Q85,120 70,75
Q50,0 30,75
Q12,120 0,75
Z" />
        </svg>
      </div>

      <div className="mobile-bottom-wave block md:hidden absolute bottom-0 left-0 w-full h-[25vh] z-0 origin-bottom">
        <svg preserveAspectRatio="none" viewBox="0 0 100 100" className="h-full w-full text-[#FF5722] fill-current drop-shadow-2xl">
          {/* Dips DOWN in the center */}
        <path d="M0,25
Q15,0 30,25
Q50,120 70,25
Q85,0 100,25
V100
H0
Z" />
        </svg>
      </div>

      {/* --- FLOATING DECORATIONS --- */}
      {/* Top Left Shawarma (Starts high on mobile, moves down) */}
      <div className="floating-food shawarma-float absolute -bottom-7 md:top-20 -left-4 md:left-12 z-20 w-42 h-42 md:w-58 md:h-58 transform   ">
        <Image 
          src="/images/shawarma.png" 
          alt="Wrap" fill className="object-contain"
        />
      </div>

      {/* Top Right Burger (Starts high on mobile, moves down) */}
      <div className="floating-food burger-float absolute bottom-0 md:top-22 -right-2 md:right-2 z-20 w-28 h-28 md:w-58 md:h-58 ">
       <Image
          src="/images/burger2.png" 
          alt="Burger" 
          fill 
          className="object-contain"
        />
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="relative z-10 max-w-6xl mx-auto px-12 flex  flex-col items-center w-full -mt-18 md:pt-0 not-lg:gap-8">
        
        {/* Simple, bold title to replace the red badge */}
     <h2 className="section-title text-white font-black text-4xl md:text-5xl lg:text-6xl tracking-widest  md:mt-0 mb-12 md:mb-16 uppercase drop-shadow-lg">
  About Us
</h2>

        {/* Hero Paragraph */}
        <p className="main-text text-white text-xl not-lg:mt-19 md:text-3xl lg:text-[40px] font-bold text-center leading-[1.5] md:leading-[1.6] mb-16 md:mb-24 max-w-full px-4 md:px-18">
          We source only the freshest produce, finest spices, and <span className="text-[#FF5722]">highest quality</span> meats to ensure every bite bursts with authentic, robust flavor. No shortcuts, just <span className="text-[#FF0000]">superior</span> ingredients.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full max-w-5xl">
          {/* Card 1 */}
          <div className="stat-card bg-[#151515] hover:bg-[#1a1a1a] transition-colors duration-300 border border-[#2a2a2a] rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center shadow-2xl">
            <h4 className="text-[#FF5722] text-2xl md:text-4xl font-black mb-2">
              <span className="counter" data-target="10000+">0</span>
            </h4>
            <p className="text-gray-400 text-xs md:text-sm font-medium tracking-wide">Happy Customers</p>
          </div>

          {/* Card 2 */}
          <div className="stat-card bg-[#151515] hover:bg-[#1a1a1a] transition-colors duration-300 border border-[#2a2a2a] rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center shadow-2xl">
            <h4 className="text-[#FF5722] text-2xl md:text-4xl font-black mb-2">
             <span className="counter" data-target="50+">0</span>
            </h4>
            <p className="text-gray-400 text-xs md:text-sm font-medium tracking-wide">Food Items</p>
          </div>

          {/* Card 3 */}
          <div className="stat-card bg-[#151515] hover:bg-[#1a1a1a] transition-colors duration-300 border border-[#2a2a2a] rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center shadow-2xl">
            <h4 className="text-[#FF5722] text-2xl md:text-4xl font-black mb-2 flex items-center gap-2">
              <span className="counter" data-target="5">0</span> <Star fill="currentColor" size={28} className="text-[#FF5722] mt-[-4px]" />
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