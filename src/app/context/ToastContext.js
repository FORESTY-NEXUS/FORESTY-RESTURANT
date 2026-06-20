'use client';
import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback((msg, duration) => addToast(msg, 'success', duration), [addToast]);
  const error = useCallback((msg, duration) => addToast(msg, 'error', duration), [addToast]);
  const info = useCallback((msg, duration) => addToast(msg, 'info', duration), [addToast]);
  const warning = useCallback((msg, duration) => addToast(msg, 'warning', duration), [addToast]);

  const value = useMemo(() => ({ success, error, info, warning }), [success, error, info, warning]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div 
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          pointerEvents: 'none'
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              background: 'rgba(10, 10, 10, 0.9)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${
                toast.type === 'success' ? 'rgba(46, 204, 113, 0.3)' :
                toast.type === 'error' ? 'rgba(231, 76, 60, 0.3)' :
                toast.type === 'warning' ? 'rgba(241, 196, 15, 0.3)' :
                'rgba(255, 255, 255, 0.1)'
              }`,
              color: '#fff',
              padding: '12px 20px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              minWidth: '300px',
              pointerEvents: 'auto',
              animation: 'slideInRight 0.3s ease forwards',
            }}
          >
            {toast.type === 'success' && <CheckCircle size={20} color="#2ecc71" />}
            {toast.type === 'error' && <AlertCircle size={20} color="#e74c3c" />}
            {toast.type === 'warning' && <AlertTriangle size={20} color="#f1c40f" />}
            {toast.type === 'info' && <Info size={20} color="#3498db" />}
            
            <p style={{ flex: 1, fontSize: '0.9rem', margin: 0 }}>{toast.message}</p>
            
            <button 
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                display: 'flex',
                padding: 0
              }}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}} />
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
