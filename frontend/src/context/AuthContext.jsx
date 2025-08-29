import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            // Fetch user profile to validate token
            apiClient.get('/auth/profile')
                .then(res => setUser(res.data.user))
                .catch(() => {
                    // Token is invalid, clear it
                    logout();
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        try {
            const res = await apiClient.post('/auth/login', { email, password });
            const { token, user } = res.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setToken(token);
            setUser(user);
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            toast.success('Logged in successfully!');
            navigate('/');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Login failed');
        }
    };

    const register = async (userData) => {
        try {
            const res = await apiClient.post('/auth/register', userData);
            const { token, user } = res.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setToken(token);
            setUser(user);
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            toast.success('Registered successfully!');
            navigate('/');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Registration failed');
        }
    }

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        delete apiClient.defaults.headers.common['Authorization'];
        toast.success('Logged out.');
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};