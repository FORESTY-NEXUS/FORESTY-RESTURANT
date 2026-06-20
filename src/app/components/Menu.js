'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import { ShoppingCart, Search } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCart } from '../context/CartContext';

const categories = ['All', 'Burgers', 'Pizza', 'Wraps', 'Fries', 'Drinks', 'Desserts'];

const menuItems = [
  { name: 'Zilla Cheese Burger', desc: 'Double smashed patty, signature cheese sauce, caramelized onions', price: 1299, cat: 'Burgers', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800' },
  { name: 'Inferno Stack Burger', desc: 'Triple stack with jalapeños, pepper jack, spicy mayo', price: 1599, cat: 'Burgers', img: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=800' },
  { name: 'Classic Crunch Burger', desc: 'Crispy chicken fillet, lettuce, garlic aioli, sesame bun', price: 999, cat: 'Burgers', img: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800' },
  { name: 'Lava Chicken Pizza', desc: 'Grilled chicken, mozzarella volcano, red chili flakes', price: 2499, cat: 'Pizza', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800' },
  { name: 'BBQ Ranch Pizza', desc: 'Smoky BBQ base, ranch drizzle, crispy onion rings', price: 2299, cat: 'Pizza', img: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?q=80&w=800' },
  { name: 'Cheese Overload Pizza', desc: 'Four cheese blend with garlic butter crust', price: 2199, cat: 'Pizza', img: 'https://images.unsplash.com/photo-1604917869287-3ae73c77e227?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { name: 'Zilla Wrap Supreme', desc: 'Grilled chicken, fresh veggies, garlic sauce in a warm tortilla', price: 899, cat: 'Wraps', img: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=800' },
  { name: 'Spicy Shawarma Wrap', desc: 'Marinated chicken, pickles, tahini, and hot sauce', price: 799, cat: 'Wraps', img: 'https://images.unsplash.com/photo-1562059390-a761a084768e?q=80&w=800' },
  { name: 'Loaded Dynamite Fries', desc: 'Crispy fries smothered in cheese, jalapeños, and spicy sauce', price: 899, cat: 'Fries', img: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?q=80&w=800' },
  { name: 'Garlic Parmesan Fries', desc: 'Golden fries tossed in garlic butter and parmesan', price: 699, cat: 'Fries', img: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?q=80&w=800' },
  { name: 'Oreo Milkshake', desc: 'Creamy vanilla base blended with Oreo cookies', price: 599, cat: 'Drinks', img: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=800' },
  { name: 'Molten Lava Cake', desc: 'Warm chocolate cake with gooey molten center, vanilla ice cream', price: 749, cat: 'Desserts', img: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=800' },
];

export default function Menu() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [active, setActive] = useState('All');
  const gridRef = useRef(null);
  const { addToCart } = useCart();
  
  // Debounce the search query to prevent heavy re-renders on every keystroke
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const normalizedQuery = debouncedQuery.trim().toLowerCase();
  
  const filtered = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = active === 'All' ? true : item.cat === active;
      const matchesSearch = normalizedQuery
        ? `${item.name} ${item.desc} ${item.cat}`.toLowerCase().includes(normalizedQuery)
        : true;

      return matchesCategory && matchesSearch;
    });
  }, [active, normalizedQuery]);

  // GSAP Scroll Animation
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Using gsap.context for React cleanup (prevents memory leaks in strict mode)
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.food-card');
      
      cards.forEach((card) => {
        gsap.fromTo(card, 
          { 
            scale: 0.85, 
            opacity: 0 
          },
          {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            ease: "back.out(1.2)", // Gives a slight "pop" effect
            scrollTrigger: {
              trigger: card,
              start: "top 90%", // Animation starts when top of card hits 90% of viewport height
              toggleActions: "play none none reverse", // Reverses the animation if user scrolls back up
            }
          }
        );
      });
    }, gridRef);

    return () => ctx.revert();
  }, [filtered]); // Re-run animation logic if the filtered array changes

  return (
    <section className="bg-[#1c1c1c] py-12 md:py-24 px-3 sm:px-6 lg:px-8 w-full" id="menu">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Headers */}
        <p className="text-orange-500 font-semibold uppercase tracking-widest text-xs md:text-base mb-2">
          Our Menu
        </p>
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white text-center mb-3 md:mb-4">
          Taste The Extraordinary
        </h2>
        <p className="text-gray-400 text-center max-w-2xl mx-auto mb-8 text-xs md:text-base leading-relaxed px-4">
          Every dish is crafted with passion, premium ingredients, and an obsession for cheesy perfection.
        </p>

        {/* Search Bar */}
        <div className="w-full max-w-md mb-8 px-2">
          <label 
            className="flex items-center gap-3 bg-[#2a2a2a] border border-gray-700 hover:border-gray-500 focus-within:border-orange-500 rounded-xl px-4 py-2 md:py-3 transition-colors duration-200" 
            aria-label="Search food"
          >
            <Search size={18} className="text-gray-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your food..."
              className="w-full bg-transparent text-sm md:text-base text-white placeholder-gray-500 outline-none"
            />
          </label>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 w-full px-2">
          {categories.map(c => (
            <button 
              key={c} 
              className={`px-4 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-base font-medium transition-all duration-300 ${
                active === c 
                  ? 'bg-[#FF0000] text-white shadow-[0_0_15px_rgba(249,115,22,0.3)]' 
                  : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a] hover:text-white'
              }`} 
              onClick={() => setActive(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Search Status */}
        {normalizedQuery && (
          <p className="text-gray-400 text-xs md:text-base mb-6 text-center w-full">
            Showing results for <span className="text-white font-medium">"{searchQuery.trim()}"</span>
          </p>
        )}

        {/* Responsive Grid - Changed to grid-cols-2 for mobile */}
        <div ref={gridRef} className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-8 w-full">
          {filtered.map((item, i) => (
            <div 
              className="food-card bg-[#2a2a2a] rounded-xl md:rounded-2xl overflow-hidden border border-gray-800 shadow-xl flex flex-col group hover:border-gray-600 transition-colors duration-300" 
              key={item.name} 
            >
              {/* Image Container */}
              <div className="relative w-full h-28 sm:h-48 overflow-hidden">
                <Image 
                  src={item.img} 
                  alt={item.name} 
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transform group-hover:scale-110 hover:rotate-2 transition-transform duration-500" 
                />
              </div>

              {/* Card Body */}
              <div className="p-3 md:p-5 flex flex-col flex-grow">
                <h3 className="text-sm md:text-xl font-bold text-white mb-1 md:mb-2 line-clamp-1">{item.name}</h3>
                <p className="text-gray-400 text-[10px] md:text-sm mb-3 md:mb-6 flex-grow leading-snug md:leading-relaxed line-clamp-2 md:line-clamp-none">{item.desc}</p>
                
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mt-auto pt-2 md:pt-4 border-t border-gray-700/50 gap-2">
                  <span className="text-sm md:text-lg font-bold text-orange-400">
                    Rs. {item.price.toLocaleString()}
                  </span>
                  <button 
                    onClick={() => addToCart({ ...item, _id: item.name })} 
                    className="w-full xl:w-auto justify-center inline-flex items-center gap-1 md:gap-2 bg-[#FF0000] hover:scale-105 text-white px-2 md:px-4 py-1.5 md:py-2 rounded md:rounded-lg text-xs md:text-sm font-semibold transition-colors duration-200"
                  >
                    <ShoppingCart size={14} className="md:w-4 md:h-4" /> 
                    <span className="hidden sm:inline">Add</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {!filtered.length && (
          <div className="w-full text-center py-12 md:py-20 bg-[#2a2a2a] rounded-2xl border border-gray-800 mt-4">
            <h3 className="text-lg md:text-2xl font-bold text-white mb-2">No food found</h3>
            <p className="text-sm md:text-base text-gray-400">Try a different search or switch to another category.</p>
          </div>
        )}
      </div>
    </section>
  );
}