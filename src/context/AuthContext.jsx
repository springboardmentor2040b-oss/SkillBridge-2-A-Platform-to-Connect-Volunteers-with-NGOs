import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUserLoggedIn = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {


                    const storedUser = localStorage.getItem('user');
                    if (storedUser) {
                        setUser(JSON.parse(storedUser));
                    }

                } catch (error) {
                    console.error("Session restoration failed", error);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }
            setLoading(false);
        };

        checkUserLoggedIn();
    }, []);

    const login = async (email, password) => {
        try {
            console.log('AuthContext: Attempting login for', email);
            const res = await api.post('/auth/login', { email, password });
            console.log('AuthContext: Full response:', JSON.stringify(res.data));

            // Handle both response formats: { data: { token, user } } and { token, user }
            const responseData = res.data.data || res.data;
            const token = responseData.token;
            const userData = responseData.user;

            console.log('AuthContext: Token exists:', !!token);
            console.log('AuthContext: User data:', JSON.stringify(userData));

            if (token && userData) {
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
                toast.success(res.data.message || 'Login successful!');
                return true;
            } else {
                console.error('AuthContext: Missing token or user in response');
                toast.error('Unexpected server response');
                return false;
            }
        } catch (error) {
            console.error('AuthContext: Login error:', error.response?.status, error.response?.data);
            toast.error(error.response?.data?.message || 'Login failed');
            return false;
        }
    };

    const register = async (userData) => {
        try {
            const res = await api.post('/auth/register', userData);
            toast.success(res.data.message || 'Registration successful! Please login.');
            return true;

        } catch (error) {
            // Handle validation errors (array or string)
            const msg = error.response?.data?.message || 'Registration failed';
            if (typeof msg === 'string') {
                toast.error(msg);
            } else if (Array.isArray(msg)) {
                msg.forEach(err => toast.error(err.msg));
            } else {
                toast.error('Registration failed');
            }
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        toast.info('Logged out');
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
