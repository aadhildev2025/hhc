import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { toast } from 'react-hot-toast';
import { FiLock, FiMail, FiArrowRight } from 'react-icons/fi';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const adminData = localStorage.getItem('adminInfo');
        if (adminData) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/auth/login', { email, password });
            localStorage.setItem('adminInfo', JSON.stringify(data));
            toast.success('Login successful!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-20 flex items-center justify-center bg-transparent px-6">
            <div className="max-w-md w-full bg-white/60 backdrop-blur-md rounded-[2.5rem] shadow-xl p-10 md:p-12 space-y-8 border border-brand-pink/10">
                <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-brand-pink/10 rounded-2xl flex items-center justify-center mx-auto text-brand-pink-dark text-2xl mb-4">
                        <FiLock />
                    </div>
                    <h1 className="text-3xl font-serif text-brand-dark">Admin Access</h1>
                    <p className="text-brand-dark/50 text-sm">Manage your HomeHeartCreation heartbeats.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-brand-dark/60 uppercase tracking-widest pl-1">Email Address</label>
                        <div className="relative">
                            <input
                                required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-brand-pink/5 border border-brand-pink/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-pink-dark/50 transition-all font-medium"
                                placeholder="admin@homeheartcreation.com"
                            />
                            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/30 text-xl" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-brand-dark/60 uppercase tracking-widest pl-1">Password</label>
                        <div className="relative">
                            <input
                                required type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-brand-pink/5 border border-brand-pink/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-pink-dark/50 transition-all font-medium"
                                placeholder="••••••••"
                            />
                            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/30 text-xl" />
                        </div>
                    </div>

                    <button
                        type="submit" disabled={loading}
                        className="w-full btn-primary h-16 flex items-center justify-center space-x-3 text-lg font-bold shadow-lg shadow-brand-pink-dark/20 disabled:opacity-50"
                    >
                        {loading ? 'Authenticating...' : 'Login to Dashboard'} <FiArrowRight />
                    </button>
                </form>

                <div className="text-center">
                    <p className="text-xs text-brand-dark/40 italic">Unauthorized access is strictly prohibited.</p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
