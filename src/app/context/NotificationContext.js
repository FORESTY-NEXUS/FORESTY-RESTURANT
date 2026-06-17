'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useSocket } from './SocketContext';
import { useAuth } from './AuthContext';
import api from '../lib/api';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { socket } = useSocket();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read).length);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  useEffect(() => {
    if (!socket) return;

    // Listen for order status updates
    socket.on('order_status_update', (order) => {
       const newNotification = {
           _id: Date.now().toString(),
           type: 'order_update',
           title: 'Order Status Updated',
           message: `Your order #${order._id.slice(-6).toUpperCase()} is now ${order.status.replace(/_/g, ' ')}.`,
           read: false,
           createdAt: new Date()
       };
       setNotifications(prev => [newNotification, ...prev]);
       setUnreadCount(prev => prev + 1);
       if (window.Notification && Notification.permission === 'granted') {
         new Notification("Order Update", { body: newNotification.message });
       }
    });

    // Listen for new assignments (riders)
    socket.on('new_assignment', (order) => {
        const newNotification = {
           _id: Date.now().toString(),
           type: 'system',
           title: 'New Delivery Assigned',
           message: `You have been assigned order #${order._id.slice(-6).toUpperCase()}.`,
           read: false,
           createdAt: new Date()
       };
       setNotifications(prev => [newNotification, ...prev]);
       setUnreadCount(prev => prev + 1);
       if (window.Notification && Notification.permission === 'granted') {
         new Notification("New Assignment", { body: newNotification.message });
       }
    });

    // Listen for new orders (admins)
    socket.on('new_order', (order) => {
        const newNotification = {
           _id: Date.now().toString(),
           type: 'system',
           title: 'New Order Received',
           message: `New order #${order._id.slice(-6).toUpperCase()} received from ${order.customerName}.`,
           read: false,
           createdAt: new Date()
       };
       setNotifications(prev => [newNotification, ...prev]);
       setUnreadCount(prev => prev + 1);
    });

    return () => {
       socket.off('order_status_update');
       socket.off('new_assignment');
       socket.off('new_order');
    };
  }, [socket]);

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
