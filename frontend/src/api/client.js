import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Add token to headers if it exists
api.interceptors.request.use((config) => {
    const adminData = localStorage.getItem('adminInfo');
    if (adminData) {
        const { token } = JSON.parse(adminData);
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
