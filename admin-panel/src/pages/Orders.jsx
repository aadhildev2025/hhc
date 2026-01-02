import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { FiEye, FiCheckCircle, FiTruck, FiXCircle, FiSearch } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        fetchOrders();
    }, [filter]);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get(`/orders${filter ? `?status=${filter}` : ''}`);
            setOrders(data);
        } catch (error) {
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/orders/${id}/status`, { status });
            toast.success(`Order marked as ${status}`);
            fetchOrders();
        } catch (error) {
            toast.error('Status update failed');
        }
    };

    const statusMap = {
        pending: { color: 'bg-yellow-50 text-yellow-600 border-yellow-100', icon: <FiCheckCircle className="text-xs" /> },
        shipped: { color: 'bg-blue-50 text-blue-600 border-blue-100', icon: <FiTruck className="text-xs" /> },
        delivered: { color: 'bg-green-50 text-green-600 border-green-100', icon: <FiCheckCircle className="text-xs" /> },
        cancelled: { color: 'bg-red-50 text-red-600 border-red-100', icon: <FiXCircle className="text-xs" /> }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-serif text-brand-dark">Order Fulfillment</h1>
                    <p className="text-brand-dark/50 text-sm">Track and fulfill handmade treasures for your customers.</p>
                </div>
                <div className="flex items-center space-x-2 bg-white/40 backdrop-blur-md p-1.5 rounded-2xl border border-brand-pink/10 overflow-x-auto no-scrollbar max-w-[calc(100vw-3rem)] md:max-w-none">
                    {['', 'pending', 'shipped', 'delivered'].map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={`px-4 py-2 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all shrink-0 ${filter === s ? 'bg-brand-pink-dark text-white shadow-md' : 'text-brand-dark/40 hover:text-brand-dark'}`}
                        >
                            {s || 'All'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] shadow-sm border border-brand-pink/10 overflow-hidden">
                {/* Desktop View Table */}
                <div className="hidden md:block overflow-x-auto no-scrollbar">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-brand-pink/10 text-[10px] md:text-xs text-brand-dark/40 uppercase tracking-widest bg-brand-pink/5">
                                <th className="px-4 md:px-8 py-5 font-bold">Order ID & Date</th>
                                <th className="px-4 md:px-8 py-5 font-bold">Customer</th>
                                <th className="px-4 md:px-8 py-5 font-bold">Shipping</th>
                                <th className="px-4 md:px-8 py-5 font-bold">Items</th>
                                <th className="px-4 md:px-8 py-5 font-bold">Total</th>
                                <th className="px-4 md:px-8 py-5 font-bold">Status</th>
                                <th className="px-4 md:px-8 py-5 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-pink/10">
                            {orders.map((order) => (
                                <tr key={order._id} className="hover:bg-brand-pink/5 transition-colors group">
                                    <td className="px-4 md:px-8 py-6">
                                        <p className="font-bold text-brand-dark font-mono text-xs md:text-sm whitespace-nowrap">#{order._id.slice(-8).toUpperCase()}</p>
                                        <p className="text-[10px] text-brand-dark/40 mt-1 whitespace-nowrap">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </td>
                                    <td className="px-4 md:px-8 py-6">
                                        <p className="font-bold text-brand-dark text-sm md:text-base whitespace-nowrap">{order.customerName}</p>
                                        <p className="text-[10px] text-brand-dark/40 truncate max-w-[80px] md:max-w-[150px]">{order.customerEmail}</p>
                                        <p className="text-[10px] text-brand-dark/30 font-medium">{order.customerPhone}</p>
                                    </td>
                                    <td className="px-4 md:px-8 py-6">
                                        <p className="text-xs text-brand-dark font-medium leading-relaxed max-w-[180px]">
                                            {order.shippingAddress.address}
                                        </p>
                                        <p className="text-[10px] text-brand-dark/40 mt-0.5">
                                            {order.shippingAddress.city}{order.shippingAddress.postalCode ? `, ${order.shippingAddress.postalCode}` : ''}
                                        </p>
                                    </td>
                                    <td className="px-4 md:px-8 py-6">
                                        <div className="flex -space-x-3 overflow-hidden">
                                            {order.orderItems.map((item, i) => (
                                                <div key={i} className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white overflow-hidden bg-brand-pink/10 ring-1 ring-brand-pink-dark/20">
                                                    <img src={item.image.startsWith('http') ? item.image : `http://localhost:5000${item.image}`} className="w-full h-full object-cover" title={item.name} />
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-4 md:px-8 py-6 font-bold text-brand-blue-dark whitespace-nowrap text-sm">Rs. {order.totalPrice.toLocaleString()}</td>
                                    <td className="px-4 md:px-8 py-6">
                                        <span className={`inline-flex items-center space-x-2 px-2.5 py-1 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest border whitespace-nowrap ${statusMap[order.status]?.color || 'bg-gray-50'}`}>
                                            {statusMap[order.status]?.icon}
                                            <span className="capitalize">{order.status}</span>
                                        </span>
                                    </td>
                                    <td className="px-4 md:px-8 py-6">
                                        <div className="flex items-center justify-end space-x-1 md:space-x-2">
                                            {order.status === 'pending' && (
                                                <button onClick={() => updateStatus(order._id, 'shipped')} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Mark Shipped">
                                                    <FiTruck />
                                                </button>
                                            )}
                                            {order.status === 'shipped' && (
                                                <button onClick={() => updateStatus(order._id, 'delivered')} className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors" title="Mark Delivered">
                                                    <FiCheckCircle />
                                                </button>
                                            )}
                                            <button className="p-2 text-brand-dark/40 hover:text-brand-pink-dark hover:bg-brand-pink/5 rounded-lg transition-colors">
                                                <FiEye />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View Cards */}
                <div className="md:hidden divide-y divide-brand-pink/10">
                    {orders.map((order) => (
                        <div key={order._id} className="p-6 space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] font-bold text-brand-dark/30 uppercase tracking-widest mb-1">#{order._id.slice(-8).toUpperCase()}</p>
                                    <h3 className="font-bold text-brand-dark">{order.customerName}</h3>
                                    <p className="text-[10px] text-brand-dark/40">{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <span className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${statusMap[order.status]?.color || 'bg-gray-50'}`}>
                                    {statusMap[order.status]?.icon}
                                    <span className="capitalize">{order.status}</span>
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-bold text-brand-dark/30 uppercase tracking-tighter">Shipping Address</p>
                                    <p className="text-[11px] text-brand-dark leading-tight">{order.shippingAddress.address}</p>
                                    <p className="text-[10px] text-brand-dark/40">{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-bold text-brand-dark/30 uppercase tracking-tighter">Order Total</p>
                                    <p className="text-sm font-bold text-brand-blue-dark">Rs. {order.totalPrice.toLocaleString()}</p>
                                    <p className="text-[10px] text-brand-dark/40 font-medium">{order.customerPhone}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <div className="flex -space-x-2">
                                    {order.orderItems.map((item, i) => (
                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-brand-pink/10 ring-1 ring-brand-pink-dark/10">
                                            <img src={item.image.startsWith('http') ? item.image : `http://localhost:5000${item.image}`} className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                                <div className="flex space-x-2">
                                    <button className="flex items-center space-x-2 px-4 py-2 bg-brand-pink/10 text-brand-pink-dark rounded-xl text-[10px] font-bold uppercase tracking-widest">
                                        <FiEye /> <span>Details</span>
                                    </button>
                                    {order.status === 'pending' && (
                                        <button onClick={() => updateStatus(order._id, 'shipped')} className="px-4 py-2 bg-brand-blue-dark text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-brand-blue-dark/20">
                                            Ship
                                        </button>
                                    )}
                                    {order.status === 'shipped' && (
                                        <button onClick={() => updateStatus(order._id, 'delivered')} className="px-4 py-2 bg-green-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-green-500/20">
                                            Deliver
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {orders.length === 0 && (
                    <div className="text-center py-20 text-brand-dark/30 italic">No orders found matching this filter.</div>
                )}
            </div>
        </div>
    );
};

export default ManageOrders;
