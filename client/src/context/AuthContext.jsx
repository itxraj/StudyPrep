import { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userInfoString = localStorage.getItem('userInfo');
        if (userInfoString) {
            setUser(JSON.parse(userInfoString));
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        const { data } = await api.post('/auth/login', credentials);
        setUser(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
        return data;
    };

    const register = async (credentials) => {
        const { data } = await api.post('/auth/register', credentials);
        setUser(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
        return data;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userInfo');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
