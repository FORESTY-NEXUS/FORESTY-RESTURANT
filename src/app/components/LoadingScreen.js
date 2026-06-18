'use client';
import { useState, useEffect } from 'react';

export default function LoadingScreen() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHidden(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-5 bg-[#0A0A0A] transition-[opacity,visibility] duration-700 ${hidden ? 'pointer-events-none invisible opacity-0' : 'visible opacity-100'}`}>
      <div className="animate-pulse bg-gradient-to-r from-[#FF0000] to-[#FE5900] bg-clip-text text-5xl font-extrabold text-transparent">
        FORESTY
      </div>
      <div className="h-[3px] w-[200px] overflow-hidden rounded-sm bg-[#2A2A2A]">
        <span className="block h-full animate-[load_2s_ease_forwards] bg-gradient-to-r from-[#FF0000] to-[#FE5900]" />
      </div>
    </div>
  );
}
