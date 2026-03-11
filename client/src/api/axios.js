import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Add a request interceptor to attach JWT token
api.interceptors.request.use(
    (config) => {
        const userInfoString = localStorage.getItem('userInfo');
        if (userInfoString) {
            const userInfo = JSON.parse(userInfoString);
            if (userInfo && userInfo.token) {
                config.headers.Authorization = `Bearer ${userInfo.token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
