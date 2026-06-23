'use client';
import { createContext, useContext, useState } from 'react';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  // Socket functionality has been replaced by standard polling for Vercel
  const [socket] = useState(null);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
