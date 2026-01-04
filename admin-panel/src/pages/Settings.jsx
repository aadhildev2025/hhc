import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { toast } from 'react-hot-toast';
import { FiLock, FiShield, FiCheck, FiX } from 'react-icons/fi';

const AdminSettings = () => {
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loadingPassword, setLoadingPassword] = useState(false);
    const [currentPasswordStatus, setCurrentPasswordStatus] = useState(null); // 'checking', 'valid', 'invalid', null

    useEffect(() => {
        const verifyPassword = async () => {
            if (passwordData.currentPassword.length > 0) {
                setCurrentPasswordStatus('checking');
                try {
                    const { data } = await api.post('/auth/profile/password/verify', {
                        password: passwordData.currentPassword
                    });
                    setCurrentPasswordStatus(data.verified ? 'valid' : 'invalid');
                } catch (error) {
                    setCurrentPasswordStatus('invalid');
                }
            } else {
                setCurrentPasswordStatus(null);
            }
        };

        const timer = setTimeout(verifyPassword, 500);
        return () => clearTimeout(timer);
    }, [passwordData.currentPassword]);

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return toast.error('Passwords do not match');
        }
        if (currentPasswordStatus !== 'valid') {
            return toast.error('Invalid current password');
        }
        setLoadingPassword(true);
        try {
            await api.put('/auth/profile/password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            toast.success('Password updated successfully');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setCurrentPasswordStatus(null);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Password update failed');
        } finally {
            setLoadingPassword(false);
        }
    };

    return (
        <div className="max-w-2xl space-y-12 pb-20">
            <div>
                <h1 className="text-2xl md:text-3xl font-serif text-brand-dark">Security Settings</h1>
                <p className="text-brand-dark/50 text-sm">Manage your administrative password and account safety.</p>
            </div>

            <div className="bg-white/40 backdrop-blur-md p-8 rounded-[2.5rem] shadow-sm border border-brand-pink/10 space-y-6">
                <div className="flex items-center space-x-4 mb-2">
                    <div className="w-10 h-10 bg-brand-blue/10 rounded-xl flex items-center justify-center text-brand-blue-dark">
                        <FiShield />
                    </div>
                    <h2 className="text-xl font-bold text-brand-dark">Change Password</h2>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-brand-dark/40 uppercase tracking-widest ml-1">Current Password</label>
                        <div className="relative">
                            <input
                                type="password"
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                className={`w-full pl-10 pr-10 py-3 bg-white/50 border rounded-xl focus:outline-none focus:ring-2 text-sm transition-all ${currentPasswordStatus === 'valid' ? 'border-green-400 focus:ring-green-400/20' :
                                        currentPasswordStatus === 'invalid' ? 'border-red-400 focus:ring-red-400/20' :
                                            'border-brand-pink/10 focus:ring-brand-pink-dark/20'
                                    }`}
                                placeholder="••••••••"
                                required
                            />
                            <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-dark/30" />
                            {currentPasswordStatus === 'valid' && (
                                <FiCheck className="absolute right-3.5 top-1/2 -translate-y-1/2 text-green-500 animate-fade-in" />
                            )}
                            {currentPasswordStatus === 'invalid' && (
                                <FiX className="absolute right-3.5 top-1/2 -translate-y-1/2 text-red-500 animate-fade-in" />
                            )}
                            {currentPasswordStatus === 'checking' && (
                                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-brand-pink-dark border-t-transparent rounded-full animate-spin"></div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-brand-dark/40 uppercase tracking-widest ml-1">New Password</label>
                        <div className="relative">
                            <input
                                type="password"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 bg-white/50 border border-brand-pink/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-pink-dark/20 text-sm"
                                placeholder="••••••••"
                                required
                            />
                            <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-dark/30" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-brand-dark/40 uppercase tracking-widest ml-1">Confirm Password</label>
                        <div className="relative">
                            <input
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                className={`w-full pl-10 pr-10 py-3 bg-white/50 border rounded-xl focus:outline-none focus:ring-2 text-sm transition-all ${passwordData.confirmPassword && passwordData.confirmPassword !== passwordData.newPassword
                                        ? 'border-red-400 focus:ring-red-400/20 bg-red-50/10'
                                        : passwordData.confirmPassword && passwordData.confirmPassword === passwordData.newPassword
                                            ? 'border-green-400 focus:ring-green-400/20'
                                            : 'border-brand-pink/10 focus:ring-brand-pink-dark/20'
                                    }`}
                                placeholder="••••••••"
                                required
                            />
                            <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-dark/30" />
                            {passwordData.confirmPassword && passwordData.confirmPassword === passwordData.newPassword && (
                                <FiCheck className="absolute right-3.5 top-1/2 -translate-y-1/2 text-green-500 animate-fade-in" />
                            )}
                            {passwordData.confirmPassword && passwordData.confirmPassword !== passwordData.newPassword && (
                                <FiX className="absolute right-3.5 top-1/2 -translate-y-1/2 text-red-500 animate-fade-in" />
                            )}
                        </div>
                        {passwordData.confirmPassword && passwordData.confirmPassword !== passwordData.newPassword && (
                            <p className="text-[10px] text-red-500 ml-1 font-medium animate-slide-down">Passwords do not match</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loadingPassword || currentPasswordStatus !== 'valid' || passwordData.newPassword !== passwordData.confirmPassword || !passwordData.newPassword}
                        className="w-full bg-brand-blue-dark text-white rounded-2xl py-4 hover:bg-brand-blue-dark/90 transition-all duration-300 flex items-center justify-center space-x-2 text-sm shadow-brand-blue/20 disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-lg shadow-brand-blue-dark/20 font-bold"
                    >
                        <FiLock /> <span>{loadingPassword ? 'Updating...' : 'Update Password'}</span>
                    </button>
                </form>

                <div className="p-4 bg-brand-blue/5 rounded-2xl border border-brand-blue/10 mt-6">
                    <p className="text-[10px] text-brand-blue-dark font-medium leading-relaxed">
                        <strong>Security Tip:</strong> Use a strong password with at least 8 characters, including numbers and symbols.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
