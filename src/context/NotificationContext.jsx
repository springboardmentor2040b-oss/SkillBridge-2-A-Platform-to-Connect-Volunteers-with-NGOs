import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from './AuthContext';
import api from '../utils/api';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const intervalRef = useRef(null);

    const fetchNotifications = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data.data || []);
        } catch (err) {
            console.error('Notification fetch error:', err?.response?.status, err?.response?.data);
        }
    };

    useEffect(() => {
        if (user) {
            // Fetch immediately when user logs in
            // eslint-disable-next-line react-hooks/set-state-in-effect
            fetchNotifications();
            // Poll every 15s for quicker updates
            intervalRef.current = setInterval(fetchNotifications, 15000);
        } else {
            setNotifications([]);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [user?.id]); // stable: only re-runs when user id changes

    const markRead = async (id) => {
        try {
            await api.patch(`/notifications/${id}/read`);
            setNotifications(prev =>
                prev.map(n => n._id === id ? { ...n, read: true } : n)
            );
        } catch (err) {
            console.error('Failed to mark notification as read', err);
        }
    };

    const markAllRead = async () => {
        try {
            await api.patch('/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (err) {
            console.error('Failed to mark all as read', err);
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markRead, markAllRead, refresh: fetchNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);
