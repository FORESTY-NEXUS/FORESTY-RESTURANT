'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function AuthGuard({ children, roles = [] }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        toast.warning('Please log in to continue.');
        router.push('/login');
      } else if (roles.length > 0 && !roles.includes(user.role)) {
        toast.error('Unauthorized access.');
        if (user.role === 'customer') router.push('/');
        else if (user.role === 'admin') router.push('/admin');
        else if (user.role === 'delivery') router.push('/delivery');
      }
    }
  }, [user, loading, router, toast, roles]);

  if (loading || !user || (roles.length > 0 && !roles.includes(user.role))) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1c1c1c', color: '#fff' }}>
        <p>Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}
