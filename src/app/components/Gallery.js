'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Camera } from 'lucide-react';

const images = [
  { src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800', alt: 'Restaurant Interior' },
  { src: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800', alt: 'Signature Burger' },
  { src: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800', alt: 'Fresh Pizza' },
  { src: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?q=80&w=800', alt: 'Loaded Fries' },
  { src: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=800', alt: 'Crispy Chicken' },
  { src: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=800', alt: 'Chicken Wrap' },
];

export default function Gallery() {
  const [lightbox, setLightbox] = useState(null);

  return (
    <section className="section bg-[#1c1c1c]" id="gallery">
      <p className="section-sub flex items-center justify-center gap-2">
        <Camera size={18} /> Gallery
      </p>
      <h2 className="section-title">A Feast For The Eyes</h2>
      <p className="section-desc">Take a visual tour of our restaurant, kitchen, and the food that makes FORESTY legendary.</p>
      <div className="gallery-grid">
        {images.map((img, i) => (
          <div className="gallery-item reveal" key={i} onClick={() => setLightbox(img.src)} style={{ transitionDelay: `${i * 0.1}s` }}>
            <Image src={img.src} alt={img.alt} width={400} height={300} className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
      <div className={`lightbox ${lightbox ? 'open' : ''}`} onClick={() => setLightbox(null)}>
        <button className="lightbox-close" onClick={() => setLightbox(null)}>✕</button>
        {lightbox && <Image src={lightbox} alt="Gallery Preview" width={1200} height={800} className="max-h-[85vh] max-w-[90%] object-contain" unoptimized />}
      </div>
    </section>
  );
}
