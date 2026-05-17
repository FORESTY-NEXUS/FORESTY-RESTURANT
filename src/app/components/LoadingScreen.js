'use client';
import { useState, useEffect } from 'react';

export default function LoadingScreen() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHidden(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`loader-wrap ${hidden ? 'hidden' : ''}`}>
      <div className="loader-text">CHEEZARILLA</div>
      <div className="loader-bar"><span /></div>
    </div>
  );
}
