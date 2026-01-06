import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Add token to headers if it exists
api.interceptors.request.use((config) => {
    const adminData = localStorage.getItem('adminInfo');
    if (adminData) {
        try {
            const { token } = JSON.parse(adminData);
            config.headers.Authorization = `Bearer ${token}`;
        } catch (e) {
            console.error('Error parsing adminInfo from localStorage', e);
        }
    }
    return config;
});

// Handle token expiration/invalid tokens
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('adminInfo');
            if (window.location.pathname !== '/') {
                window.location.href = '/';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
