import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FiGrid, FiPackage, FiShoppingBag, FiUsers, FiLogOut, FiMenu, FiX, FiHome, FiMail, FiBell, FiCheckCircle, FiStar } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import api from '../api/client';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const navigate = useNavigate();
    const [adminInfo, setAdminInfo] = useState({ name: 'Admin', image: '' });

    const fetchNotifications = async () => {
        try {
            const [notifRes, countRes] = await Promise.all([
                api.get('/notifications'),
                api.get('/notifications/unread-count')
            ]);
            setNotifications(notifRes.data);
            setUnreadCount(countRes.data.count);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            fetchNotifications();
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.put('/notifications/read-all');
            fetchNotifications();
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const updateProfile = () => {
        const stored = localStorage.getItem('adminInfo');
        if (stored) {
            setAdminInfo(JSON.parse(stored));
        }
    };

    useEffect(() => {
        const stored = localStorage.getItem('adminInfo');
        if (!stored) {
            navigate('/');
        } else {
            updateProfile();
            fetchNotifications();
        }

        const interval = setInterval(fetchNotifications, 30000); // Poll every 30s

        window.addEventListener('adminProfileUpdated', updateProfile);
        return () => {
            window.removeEventListener('adminProfileUpdated', updateProfile);
            clearInterval(interval);
        };
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('adminInfo');
        toast.success('Logged out successfully');
        navigate('/');
    };

    const navItems = [
        { name: 'Summary', path: '/dashboard', icon: <FiGrid /> },
        { name: 'Products', path: '/products', icon: <FiPackage /> },
        { name: 'Orders', path: '/orders', icon: <FiShoppingBag /> },
        { name: 'Reviews', path: '/reviews', icon: <FiStar /> },
        { name: 'Messages', path: '/messages', icon: <FiMail /> },
        { name: 'Settings', path: '/settings', icon: <FiUsers /> },
    ];

    return (
        <div className="flex h-screen bg-brand-offwhite font-sans">
            {/* Mobile Backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-brand-dark/20 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`fixed lg:static inset-y-0 left-0 w-72 bg-white/80 backdrop-blur-xl border-r border-brand-pink/10 z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto no-scrollbar ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <div className="h-full flex flex-col p-8">
                    <div className="flex items-center justify-between mb-12">
                        <div className="flex flex-col">
                            <h1 className="text-xl font-serif font-bold bg-gradient-to-r from-brand-pink-dark to-brand-blue-dark bg-clip-text text-transparent">HomeHeartCreation</h1>
                            <span className="text-[10px] font-bold text-brand-dark/30 tracking-widest uppercase">Management</span>
                        </div>
                        <button className="lg:hidden text-2xl" onClick={() => setSidebarOpen(false)}><FiX /></button>
                    </div>

                    <div className="mb-10 px-4 flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full border-2 border-brand-pink/20 overflow-hidden bg-brand-pink/5 flex items-center justify-center shrink-0">
                            {adminInfo.image ? (
                                <img src={`http://localhost:5000${adminInfo.image}`} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-brand-pink-dark font-bold">{adminInfo.name[0]}</span>
                            )}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-brand-dark truncate">{adminInfo.name}</p>
                        </div>
                    </div>

                    <nav className="flex-grow space-y-4">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all duration-300 font-medium ${isActive
                                        ? 'bg-brand-pink-dark text-white shadow-lg shadow-brand-pink-dark/20'
                                        : 'text-brand-dark/50 hover:bg-brand-pink/10 hover:text-brand-dark'
                                    }`
                                }
                                onClick={() => setSidebarOpen(false)}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span>{item.name}</span>
                            </NavLink>
                        ))}
                    </nav>

                    <div className="pt-8 border-t border-brand-pink/10 space-y-4">
                        <button
                            onClick={() => window.location.href = 'http://localhost:5173'}
                            className="flex items-center space-x-4 px-6 py-4 w-full text-brand-dark/50 hover:text-brand-pink-dark transition-colors"
                        >
                            <FiHome /> <span className="font-bold">View Site</span>
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-4 px-6 py-4 w-full text-red-400 hover:bg-red-50 rounded-2xl transition-all"
                        >
                            <FiLogOut /> <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Content */}
            <div className="flex-grow flex flex-col overflow-hidden">
                {/* Topbar */}
                <header className="h-16 md:h-20 bg-white/60 backdrop-blur-xl border-b border-brand-pink/10 flex items-center justify-between px-4 md:px-8 z-30">
                    <div className="flex items-center space-x-4">
                        <button className="lg:hidden text-2xl text-brand-dark/60" onClick={() => setSidebarOpen(true)}><FiMenu /></button>
                        <div className="flex items-center space-x-2">
                            <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-brand-pink-dark animate-pulse"></span>
                            <span className="text-[8px] md:text-[10px] font-bold text-brand-dark/30 uppercase tracking-[0.2em]">Admin Workspace</span>
                        </div>
                    </div>
                    <div className="ml-auto flex items-center space-x-4 md:space-x-8">
                        {/* Notifications */}
                        <div className="relative">
                            <button
                                onClick={() => setNotificationsOpen(!notificationsOpen)}
                                className={`p-2.5 rounded-xl transition-all relative ${notificationsOpen ? 'bg-brand-pink/20 text-brand-pink-dark' : 'text-brand-dark/40 hover:bg-brand-pink/10 hover:text-brand-dark'}`}
                            >
                                <FiBell className="text-xl md:text-2xl" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
                                )}
                            </button>

                            {/* Notifications Dropdown */}
                            {notificationsOpen && (
                                <div className="absolute right-0 mt-4 w-80 md:w-96 bg-white rounded-[2rem] shadow-2xl border border-brand-pink/10 overflow-hidden z-[100] animate-slide-up">
                                    <div className="p-6 border-b border-brand-pink/10 bg-brand-pink/5 flex items-center justify-between">
                                        <h3 className="font-serif font-bold text-brand-dark">Notifications</h3>
                                        <button
                                            onClick={markAllAsRead}
                                            className="text-xs font-bold text-brand-pink-dark hover:underline"
                                        >
                                            Mark all read
                                        </button>
                                    </div>
                                    <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                                        {notifications.length > 0 ? (
                                            notifications.map((n) => (
                                                <div
                                                    key={n._id}
                                                    onClick={() => {
                                                        markAsRead(n._id);
                                                        if (n.link) navigate(n.link);
                                                        setNotificationsOpen(false);
                                                    }}
                                                    className={`p-6 border-b border-brand-pink/5 cursor-pointer hover:bg-brand-pink/5 transition-colors flex items-start space-x-4 ${!n.isRead ? 'bg-brand-blue/5' : ''}`}
                                                >
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${n.type === 'order' ? 'bg-brand-blue/20 text-brand-blue-dark' :
                                                        n.type === 'message' ? 'bg-brand-pink/20 text-brand-pink-dark' :
                                                            'bg-brand-dark/10 text-brand-dark'
                                                        }`}>
                                                        {n.type === 'order' ? <FiShoppingBag /> : n.type === 'message' ? <FiMail /> : <FiBell />}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className={`text-sm font-bold text-brand-dark ${!n.isRead ? 'text-brand-pink-dark' : ''}`}>{n.title}</p>
                                                        <p className="text-xs text-brand-dark/50 mt-1 line-clamp-2">{n.message}</p>
                                                        <p className="text-[10px] text-brand-dark/30 mt-2">{new Date(n.createdAt).toLocaleString()}</p>
                                                    </div>
                                                    {!n.isRead && <div className="w-2 h-2 bg-brand-pink-dark rounded-full shrink-0 mt-2"></div>}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-12 text-center text-brand-dark/30 italic">
                                                No notifications yet.
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4 bg-brand-pink/5 text-center">
                                        <button
                                            onClick={() => setNotificationsOpen(false)}
                                            className="text-xs font-bold text-brand-dark/40 hover:text-brand-pink-dark transition-colors"
                                        >
                                            Close Panel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-brand-dark">{adminInfo.name}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full border border-brand-pink/20 overflow-hidden bg-brand-pink/5 flex items-center justify-center font-bold">
                                {adminInfo.image ? (
                                    <img src={`http://localhost:5000${adminInfo.image}`} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-brand-pink-dark">{adminInfo.name[0]}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Viewport */}
                <main className="flex-grow p-4 md:p-10 overflow-y-auto no-scrollbar bg-brand-offwhite/50">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
