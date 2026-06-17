'use client';
import { useState } from 'react';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import { Search } from 'lucide-react';

const categories = ['All', 'Burgers', 'Pizza', 'Wraps', 'Fries', 'Drinks', 'Desserts'];

const menuItems = [
  { name: 'Zilla Cheese Burger', desc: 'Double smashed patty, signature cheese sauce, caramelized onions', price: 1299, cat: 'Burgers', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800' },
  { name: 'Inferno Stack Burger', desc: 'Triple stack with jalapeños, pepper jack, spicy mayo', price: 1599, cat: 'Burgers', img: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=800' },
  { name: 'Classic Crunch Burger', desc: 'Crispy chicken fillet, lettuce, garlic aioli, sesame bun', price: 999, cat: 'Burgers', img: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800' },
  { name: 'Lava Chicken Pizza', desc: 'Grilled chicken, mozzarella volcano, red chili flakes', price: 2499, cat: 'Pizza', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800' },
  { name: 'BBQ Ranch Pizza', desc: 'Smoky BBQ base, ranch drizzle, crispy onion rings', price: 2299, cat: 'Pizza', img: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?q=80&w=800' },
  { name: 'Cheese Overload Pizza', desc: 'Four cheese blend with garlic butter crust', price: 2199, cat: 'Pizza', img: 'https://images.unsplash.com/photo-1574129624514-07019349c256?q=80&w=800' },
  { name: 'Zilla Wrap Supreme', desc: 'Grilled chicken, fresh veggies, garlic sauce in a warm tortilla', price: 899, cat: 'Wraps', img: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=800' },
  { name: 'Spicy Shawarma Wrap', desc: 'Marinated chicken, pickles, tahini, and hot sauce', price: 799, cat: 'Wraps', img: 'https://images.unsplash.com/photo-1562059390-a761a084768e?q=80&w=800' },
  { name: 'Loaded Dynamite Fries', desc: 'Crispy fries smothered in cheese, jalapeños, and spicy sauce', price: 899, cat: 'Fries', img: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?q=80&w=800' },
  { name: 'Garlic Parmesan Fries', desc: 'Golden fries tossed in garlic butter and parmesan', price: 699, cat: 'Fries', img: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?q=80&w=800' },
  { name: 'Oreo Milkshake', desc: 'Creamy vanilla base blended with Oreo cookies', price: 599, cat: 'Drinks', img: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=800' },
  { name: 'Molten Lava Cake', desc: 'Warm chocolate cake with gooey molten center, vanilla ice cream', price: 749, cat: 'Desserts', img: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=800' },
];

export default function Menu() {
  const [searchQuery, setSearchQuery] = useState('');
  const [active, setActive] = useState('All');
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filtered = menuItems.filter((item) => {
    const matchesCategory = active === 'All' ? true : item.cat === active;
    const matchesSearch = normalizedQuery
      ? `${item.name} ${item.desc} ${item.cat}`.toLowerCase().includes(normalizedQuery)
      : true;

    return matchesCategory && matchesSearch;
  });

  return (
    <section className="section" id="menu" style={{ background: 'linear-gradient(180deg, var(--black), #0d0d0d)' }}>
      <p className="section-sub">Our Menu</p>
      <h2 className="section-title">Taste The Extraordinary</h2>
      <p className="section-desc">Every dish is crafted with passion, premium ingredients, and an obsession for cheesy perfection.</p>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px', padding: '0 20px' }}>
        <label className="nav-search" aria-label="Search food" style={{ width: '100%', maxWidth: '400px', borderRadius: '12px' }}>
          <Search size={16} />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your food..."
          />
        </label>
      </div>

      <div className="menu-cats">
        {categories.map(c => (
          <button key={c} className={`menu-cat ${active === c ? 'active' : ''}`} onClick={() => setActive(c)}>
            {c}
          </button>
        ))}
      </div>

      {normalizedQuery && (
        <p className="menu-search-status">
          Showing results for "{searchQuery.trim()}"
        </p>
      )}

      <div className="menu-grid">
        {filtered.map((item, i) => (
          <div className="food-card reveal" key={i} style={{ transitionDelay: `${(i % 6) * 0.08}s` }}>
            <div className="food-card-img">
              <Image src={item.img} alt={item.name} width={400} height={200} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div className="food-card-body">
              <h3>{item.name}</h3>
              <p className="desc">{item.desc}</p>
              <div className="food-card-bottom">
                <span className="food-price">Rs. {item.price.toLocaleString()}</span>
                <button className="add-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShoppingCart size={16} /> Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!filtered.length && (
        <div className="menu-empty">
          <h3>No food found</h3>
          <p>Try a different search or switch to another category.</p>
        </div>
      )}
    </section>
  );
}
