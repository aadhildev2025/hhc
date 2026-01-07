import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { FiShoppingBag, FiDollarSign, FiPackage, FiTrendingUp } from 'react-icons/fi';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        pendingOrders: 0,
        shippedOrders: 0,
        deliveredOrders: 0,
        totalRevenue: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [statsRes, ordersRes] = await Promise.all([
                    api.get('/orders/stats'),
                    api.get('/orders?limit=5')
                ]);
                setStats(statsRes.data);
                setRecentOrders(ordersRes.data.slice(0, 5));
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        { title: 'Total Revenue', value: `LKR ${stats.totalRevenue.toLocaleString()}`, icon: <FiDollarSign />, color: 'bg-green-50 text-green-500' },
        { title: 'Total Orders', value: stats.totalOrders, icon: <FiShoppingBag />, color: 'bg-brand-pink/20 text-brand-pink-dark' },
        { title: 'Pending Orders', value: stats.pendingOrders, icon: <FiTrendingUp />, color: 'bg-brand-blue/20 text-brand-blue-dark' },
        { title: 'Active Items', value: '8', icon: <FiPackage />, color: 'bg-brand-offwhite text-brand-dark/50' },
    ];

    if (loading) return <div>Loading Summary...</div>;

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl md:text-3xl font-serif text-brand-dark">Dashboard Summary</h1>
                <div className="text-[10px] md:text-sm font-bold text-brand-dark/40 bg-white/40 backdrop-blur-md px-4 py-2 rounded-xl border border-brand-pink/10 self-start md:self-auto">Jan 1, 2026 - Present</div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {statCards.map((card, idx) => (
                    <div key={idx} className="bg-white/40 backdrop-blur-md p-6 md:p-8 rounded-3xl shadow-sm border border-brand-pink/10 hover:shadow-md transition-shadow duration-300">
                        <div className={`w-12 h-12 md:w-14 md:h-14 ${card.color} rounded-2xl flex items-center justify-center text-xl md:text-2xl mb-4 md:mb-6 shadow-inner`}>
                            {card.icon}
                        </div>
                        <p className="text-[10px] md:text-xs font-bold text-brand-dark/40 uppercase tracking-widest">{card.title}</p>
                        <h3 className="text-xl md:text-2xl font-bold text-brand-dark mt-2">{card.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Recent Orders Table */}
                <div className="bg-white/40 backdrop-blur-md p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-brand-pink/10">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg md:text-xl font-serif font-bold text-brand-dark">Recent Activity</h3>
                        <button className="text-brand-pink-dark text-xs font-bold hover:underline">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-brand-pink/10 text-[10px] text-brand-dark/40 uppercase tracking-widest">
                                    <th className="pb-4 px-2 font-bold">Customer</th>
                                    <th className="pb-4 px-2 font-bold">Amount</th>
                                    <th className="pb-4 px-2 font-bold">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-brand-pink/10">
                                {recentOrders.map((order) => (
                                    <tr key={order._id} className="group">
                                        <td className="py-5 px-2">
                                            <p className="font-bold text-brand-dark text-xs md:text-sm whitespace-nowrap">{order.customerName}</p>
                                            <p className="text-[10px] text-brand-dark/40">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </td>
                                        <td className="py-5 px-2 font-bold text-brand-blue-dark text-xs md:text-sm whitespace-nowrap">
                                            LKR {order.totalPrice.toLocaleString()}
                                        </td>
                                        <td className="py-5 px-2">
                                            <span className={`px-2 py-1 rounded-full text-[8px] md:text-[10px] font-bold uppercase tracking-widest whitespace-nowrap ${order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                                                order.status === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-brand-blue/20 text-brand-blue-dark'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Inventory Quick View */}
                <div className="bg-white/40 backdrop-blur-md p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-brand-pink/10">
                    <h3 className="text-lg md:text-xl font-serif font-bold text-brand-dark mb-8">Quick Insights</h3>
                    <div className="space-y-6">
                        <div className="p-6 bg-brand-pink/5 rounded-2xl border border-brand-pink/10 flex items-center justify-between">
                            <div>
                                <h4 className="font-bold text-brand-dark">Featured Products</h4>
                                <p className="text-xs text-brand-dark/50 mt-1">Items currently on home page slider.</p>
                            </div>
                            <span className="text-2xl font-bold text-brand-pink-dark">4</span>
                        </div>
                        <div className="p-6 bg-brand-blue/5 rounded-2xl border border-brand-blue/10 flex items-center justify-between">
                            <div>
                                <h4 className="font-bold text-brand-dark">Out of Stock</h4>
                                <p className="text-xs text-brand-dark/50 mt-1">Items requiring restock attention.</p>
                            </div>
                            <span className="text-2xl font-bold text-red-400">0</span>
                        </div>
                        <div className="p-6 bg-brand-blue/5 rounded-2xl border border-brand-blue/10 flex items-center justify-between">
                            <div>
                                <h4 className="font-bold text-brand-dark">Total Categories</h4>
                                <p className="text-xs text-brand-dark/50 mt-1">Management domains established.</p>
                            </div>
                            <span className="text-2xl font-bold text-brand-dark/60">6</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
