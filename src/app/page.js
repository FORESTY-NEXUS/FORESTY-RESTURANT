'use client';
import { useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Menu from './components/Menu';
import SpecialOffers from './components/SpecialOffers';
import Facilities from './components/Facilities';
import Gallery from './components/Gallery';
import Testimonials from './components/Testimonials';
import Timings from './components/Timings';
import Contact from './components/Contact';
import Footer from './components/Footer';

function WaveSeparator({ flip }) {
  return (
   <div></div>
  );
}

export default function Home() {  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);



  return (
    <>
    <main className="w-full overflow-x-hidden">
    
      <LoadingScreen />
      <Navbar />
      <Hero />
      <WaveSeparator />
      <About />
      <WaveSeparator flip />
      <Menu />
      <WaveSeparator />
      <SpecialOffers />
      <Facilities />
      <WaveSeparator flip />
      <Gallery />
      <WaveSeparator />
      <Testimonials />
      <Timings />
      <WaveSeparator flip />
      <Contact />
      <Footer />
      </main>
    </>
  );
}
