'use client';
import { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Quote, Star } from 'lucide-react';

const reviews = [
  { name: 'Ahmed Raza', role: 'Food Blogger', text: 'Best burgers in town! The Zilla Cheese Burger is absolutely insane — the cheese pull is unreal. 10/10 would recommend!', stars: 5 },
  { name: 'Fatima Khan', role: 'Regular Customer', text: 'Amazing cheese quality and ambiance. Took my family here last weekend and everyone loved it. The kids can\'t stop talking about the fries!', stars: 5 },
  { name: 'Ali Hassan', role: 'Food Critic', text: 'Perfect place for family dinners. The Lava Chicken Pizza is a must-try. Great service, premium vibes, and reasonable prices.', stars: 5 },
  { name: 'Ayesha Malik', role: 'Foodstagram', text: 'The presentation is next level! Every dish is Instagram-worthy. The Midnight Cravings deal is a steal. My go-to spot now!', stars: 5 },
  { name: 'Usman Tariq', role: 'Student', text: 'Affordable and delicious! As a student, I love the value deals. The shawarma wrap is packed with flavor. Best fast food in Islamabad!', stars: 4 },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent(c => (c + 1) % reviews.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [next]);

  return (
    <section className="section bg-[#1c1c1c]">
      <p className="section-sub flex items-center justify-center gap-2">
        <MessageSquare size={18} /> Testimonials
      </p>
      <h2 className="section-title">What Our Customers Say</h2>
      <p className="section-desc">Real reviews from real food lovers who can&apos;t get enough of FORESTY.</p>

      <div className="testimonial-slider">
        <div className="testimonial-track" style={{ transform: `translateX(-${current * 100}%)` }}>
          {reviews.map((r, i) => (
            <div className="testimonial-card" key={i}>
              <div className="mb-[15px] flex justify-center text-brand-red">
                <Quote size={40} fill="var(--red)" fillOpacity={0.1} />
              </div>
              <div className="stars mb-[15px] flex justify-center gap-1">
                {[...Array(5)].map((_, index) => (
                  <Star key={index} size={16} fill={index < r.stars ? 'var(--yellow)' : 'transparent'} color="var(--yellow)" />
                ))}
              </div>
              <p className="not-italic">&ldquo;{r.text}&rdquo;</p>
              <div className="author mt-5">{r.name}</div>
              <div className="role">{r.role}</div>
            </div>
          ))}
        </div>
        <div className="testimonial-dots">
          {reviews.map((_, i) => (
            <button key={i} className={i === current ? 'active' : ''} onClick={() => setCurrent(i)} />
          ))}
        </div>
      </div>
    </section>
  );
}
