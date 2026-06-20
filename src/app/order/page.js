'use client';
import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { ShoppingCart, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import api from '../lib/api';

const categories = ['All', 'Burgers', 'Pizza', 'Wraps', 'Fries', 'Drinks', 'Desserts'];

export default function OrderPage() {
  const [active, setActive] = useState('All');
  const [menuItems, setMenuItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const { data } = await api.get('/menu');
        setMenuItems(data);
      } catch (err) {
        console.error('Failed to fetch menu', err);
      }
    };
    fetchMenu();
  }, []);

  const filtered = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = active === 'All' ? true : item.category === active;
      const matchesSearch = debouncedQuery.trim()
        ? `${item.name} ${item.description} ${item.category}`.toLowerCase().includes(debouncedQuery.toLowerCase())
        : true;
      return matchesCategory && matchesSearch;
    });
  }, [menuItems, active, debouncedQuery]);

  return (
    <div className="section">
      <p className="section-sub">Online Ordering</p>
      <h2 className="section-title">Order Your Favorites</h2>
      
      <div style={{ maxWidth: '600px', margin: '0 auto 40px' }}>
        <div className="nav-search" style={{ width: '100%' }}>
          <Search size={18} />
          <input 
            type="search" 
            placeholder="Search for items..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="menu-cats">
        {categories.map(c => (
          <button 
            key={c} 
            className={`menu-cat ${active === c ? 'active' : ''}`} 
            onClick={() => setActive(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="menu-grid">
        {filtered.map((item, i) => (
          <div className="food-card reveal visible" key={item._id} style={{ transitionDelay: `${(i % 6) * 0.08}s` }}>
            <div className="food-card-img">
              <Image 
                src={item.image} 
                alt={item.name} 
                width={400} 
                height={200} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </div>
            <div className="food-card-body">
              <h3>{item.name}</h3>
              {item.tags && item.tags.length > 0 && (
                <div style={{ display: 'flex', gap: '5px', marginBottom: '8px' }}>
                  {item.tags.map(t => <span key={t} style={{ fontSize: '.7rem', background: 'var(--yellow)', color: '#000', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold', textTransform: 'uppercase' }}>{t}</span>)}
                </div>
              )}
              <p className="desc">{item.description}</p>
              
              {item.stock !== -1 && (
                  <p style={{ fontSize: '.75rem', color: item.stock < 10 ? 'var(--red)' : 'rgba(245,245,245,.5)', marginTop: '5px' }}>
                     {item.stock > 0 ? `Only ${item.stock} left` : 'Out of stock'}
                  </p>
              )}

              <div className="food-card-bottom" style={{ marginTop: '15px' }}>
                <span className="food-price">Rs. {item.price.toLocaleString()}</span>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      className="add-btn" 
                      disabled={item.stock === 0}
                      style={{ opacity: item.stock === 0 ? 0.5 : 1, cursor: item.stock === 0 ? 'not-allowed' : 'pointer', background: 'transparent', border: '1px solid var(--yellow)', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      title="Add to Favorites"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                    </button>
                    <button 
                      className="add-btn" 
                      onClick={() => addToCart(item)}
                      disabled={item.stock === 0}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: item.stock === 0 ? 0.5 : 1, cursor: item.stock === 0 ? 'not-allowed' : 'pointer' }}
                    >
                      <ShoppingCart size={16} /> {item.stock === 0 ? 'Sold Out' : 'Add to Cart'}
                    </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="menu-empty">
          <h3>No items found</h3>
          <p>Try adjusting your search or category filter.</p>
        </div>
      )}
    </div>
  );
}
