'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';
import Link from 'next/link';

const dishes = [
  {
    // NOODLES (Left side on mobile)
    className: 'hero-dish hero-dish-noodles absolute left-[60%] w-[45vw] z-10 md:relative md:left-auto md:w-[28vw] max-w-[350px] md:z-10 md:-mr-[12%]',
    src: '/images/—Pngtree—noodles on white plate transparent_16098830.png',
    alt: 'Noodles served on a white plate',
  },
  {
    // MAIN DISH (Center - stays on top of both)
    className: 'hero-dish hero-dish-main relative w-[58vw] z-30 mx-auto md:w-[38vw] max-w-[500px] md:mx-0',
    src: '/images/—Pngtree—delicious pakistani food with sauce_15589733.png',
    alt: 'Pakistani food with sauce and garnish',
  },
  {
    // PIZZA (Right side on mobile)
    className: 'hero-dish  hero-dish-pizza absolute right-[60%] w-[45vw] z-20 md:relative md:right-auto md:w-[34vw] max-w-[420px] md:z-20 md:-ml-[12%]',
    src: '/images/—Pngtree—closeup of a chicken pizza_16083305.png',
    alt: 'Chicken pizza with herbs',
  },
];
export default function Hero() {
  const heroRef = useRef(null);

  const handleMouseEnter = (e) => {
    const randomRotation = Math.random() * 8 - 4; 
    gsap.to(e.currentTarget, {
      y: -40, // Stronger lift
      rotation: randomRotation,
      scale: 1.1, // Added scale for more emphasis on hover
      duration: 0.8,
      ease: 'elastic.out(1.2, 0.4)', 
      overwrite: 'auto'
    });
  };

  const handleMouseLeave = (e) => {
    gsap.to(e.currentTarget, {
      y: 0,
      rotation: 0,
      scale: 1,
      duration: 0.8,
      ease: 'elastic.out(1, 0.5)',
      overwrite: 'auto'
    });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add({ isDesktop: "(min-width: 768px)", isMobile: "(max-width: 767px)" }, (context) => {
        const { isDesktop } = context.conditions;

        if (isDesktop) {
          gsap.set('.hero-title', { xPercent: -50, yPercent: -50 });
          const timeline = gsap.timeline({ delay: 0.5, defaults: { ease: 'power3.out' } });
          timeline
            .from('.hero-title', { y: 54, opacity: 0, duration: 0.9 })
            .from('.hero-dish', { y: 42, opacity: 0, scale: 0.86, stagger: 0.12, duration: 0.8 }, '-=0.55')
            .from('.hero-copy, .hero-order-block', { y: 22, opacity: 0, stagger: 0.12, duration: 0.65 }, '-=0.35');
        }
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section 
   className="hero relative min-h-full  lg:min-h-screen flex flex-col justify-start lg:justify-between items-center overflow-x-hidden bg-[#212121] text-white pt-20 pb-10" id="home" ref={heroRef}>
      <div className="hero-content w-full flex flex-col items-center justify-center lg:block">
        <div className="hero-showcase relative flex flex-col items-center justify-center w-full mt-[1vh] lg:mt-[16vh]">
          <h1 className="hero-title text-center
           lg:absolute lg:top-[5%] lg:left-[50%] 
           text-[clamp(3.5rem,12vw,15rem)] 
           font-black whitespace-nowrap z-0 tracking-tighter
            pointer-events-none">ZAIQA HUB</h1>

          <div className="flex relative md:flex-row items-center mb-6 justify-center mt-6 lg:mt-0">
            {dishes.map((dish) => (
              <div className={dish.className} key={dish.alt}>
                {/* Wrapped in a div to trigger the hover without affecting the layout wrapper */}
                <div 
                  className="cursor-pointer transition-transform w-full"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <Image
                    src={dish.src}
                    alt={dish.alt}
                    width={940}
                    height={940}
                    priority
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* ... rest of your footer code ... */}
        <div className="w-full px-[5%] mt-2 flex flex-col items-center justify-between gap-6 lg:mt-0 lg:absolute lg:bottom-0 lg:left-0 lg:py-10 lg:flex-row lg:justify-between lg:items-end lg:gap-0 z-20">
          
          <p className="hero-copy  text-2xl  max-w-[320px] lg:text-lg font-semibold 
          leading-relaxed text-center lg:text-start">
            From Desi Taste To <span className="text-[#ff3300]">Fast Food Cravings.</span> We provide all in one Place.
          </p>
          
          <div className="hero-order-block flex flex-col not-lg:mt-15 items-center lg:items-end gap-2">
            <p className="text-sm tracking-wide text-center lg:text-start lg:mr-5">40+ FOODS 10+ variety</p>
            <Link 
              href="/order" 
              className="bg-[#ff4500] text-white px-10 py-3 rounded-md font-extrabold text-xl transition-all duration-200 hover:scale-105 hover:bg-[#e63e00] "
            >
              ORDER NOW
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}