import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { FiMail, FiTrash2, FiSearch, FiCheckCircle, FiClock, FiX } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const ManageMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [messageToDelete, setMessageToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const { data } = await api.get('/messages');
            setMessages(data);
        } catch (error) {
            toast.error('Failed to load messages');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await api.put(`/messages/${id}`, { status });
            toast.success(`Message marked as ${status}`);
            fetchMessages();
            if (selectedMessage && selectedMessage._id === id) {
                setSelectedMessage({ ...selectedMessage, status });
            }
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleDeleteClick = (message) => {
        setMessageToDelete(message);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!messageToDelete) return;
        try {
            await api.delete(`/messages/${messageToDelete._id}`);
            toast.success('Inquiry removed');
            fetchMessages();
            setIsDeleteModalOpen(false);
            setIsViewModalOpen(false);
        } catch (error) {
            toast.error('Failed to remove message');
        }
    };

    const handleViewMessage = (message) => {
        setSelectedMessage(message);
        setIsViewModalOpen(true);
        if (message.status === 'unread') {
            handleUpdateStatus(message._id, 'read');
        }
    };

    const filteredMessages = messages.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2 md:px-0">
                <div className="space-y-1">
                    <h1 className="text-2xl md:text-3xl font-serif text-brand-dark">Customer Inquiries</h1>
                    <p className="text-brand-dark/50 text-xs md:text-sm">Manage and respond to your community's heartbeat.</p>
                </div>
            </div>

            <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] shadow-sm border border-brand-pink/10 overflow-hidden">
                <div className="p-8 border-b border-brand-pink/10 bg-brand-pink/5">
                    <div className="relative max-w-md">
                        <input
                            type="text"
                            placeholder="Search messages..."
                            className="w-full pl-12 pr-4 py-3 bg-white/60 border border-brand-pink/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-pink-dark/50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/30 text-xl" />
                    </div>
                </div>

                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-brand-pink/10 text-[10px] md:text-xs text-brand-dark/40 uppercase tracking-widest bg-brand-pink/5">
                                <th className="px-8 py-5 font-bold">Sender</th>
                                <th className="px-8 py-5 font-bold">Subject</th>
                                <th className="px-8 py-5 font-bold">Date</th>
                                <th className="px-8 py-5 font-bold text-center">Status</th>
                                <th className="px-8 py-5 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-pink/10">
                            {filteredMessages.map((m) => (
                                <tr key={m._id} className={`hover:bg-brand-pink/5 transition-colors group ${m.status === 'unread' ? 'bg-brand-blue/5' : ''}`}>
                                    <td className="px-8 py-6">
                                        <div className="min-w-0">
                                            <p className={`font-bold text-brand-dark truncate ${m.status === 'unread' ? 'text-brand-pink-dark' : ''}`}>{m.name}</p>
                                            <p className="text-xs text-brand-dark/40 truncate">{m.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 font-medium text-brand-dark/70 text-sm whitespace-nowrap">{m.subject}</td>
                                    <td className="px-8 py-6 text-brand-dark/60 text-xs whitespace-nowrap">{new Date(m.createdAt).toLocaleDateString()}</td>
                                    <td className="px-8 py-6 text-center">
                                        <span className={`px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-widest whitespace-nowrap ${m.status === 'unread' ? 'bg-red-50 text-red-500' :
                                            m.status === 'read' ? 'bg-brand-blue/20 text-brand-blue-dark' :
                                                'bg-green-50 text-green-500'
                                            }`}>
                                            {m.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end space-x-3">
                                            <button onClick={() => handleViewMessage(m)} className="p-2.5 text-brand-dark/40 hover:text-brand-blue-dark hover:bg-brand-blue/10 rounded-xl transition-all">
                                                <FiMail />
                                            </button>
                                            <button onClick={() => handleDeleteClick(m)} className="p-2.5 text-brand-dark/40 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredMessages.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center text-brand-dark/30 italic">No messages found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* View Message Modal */}
            {isViewModalOpen && selectedMessage && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-brand-dark/30 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-slide-up border border-brand-pink/20">
                        <div className="p-8 border-b border-brand-pink/10 flex items-center justify-between bg-brand-pink/5">
                            <div>
                                <h3 className="text-2xl font-serif text-brand-dark">{selectedMessage.subject}</h3>
                                <div className="flex items-center space-x-4 mt-2">
                                    <p className="text-xs font-bold text-brand-pink-dark uppercase flex items-center shrink-0">
                                        <FiMail className="mr-2" /> From: {selectedMessage.name} ({selectedMessage.email})
                                    </p>
                                    <span className="w-1 h-1 bg-brand-dark/20 rounded-full"></span>
                                    <p className="text-xs text-brand-dark/40 font-medium flex items-center shrink-0">
                                        <FiClock className="mr-2" /> {new Date(selectedMessage.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setIsViewModalOpen(false)} className="text-2xl hover:text-brand-pink-dark transition-colors"><FiX /></button>
                        </div>
                        <div className="p-8 space-y-8">
                            <div className="bg-brand-pink/5 p-8 rounded-3xl border border-brand-pink/10">
                                <p className="text-brand-dark/80 whitespace-pre-wrap leading-relaxed italic">
                                    "{selectedMessage.message}"
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={() => handleUpdateStatus(selectedMessage._id, 'replied')}
                                        disabled={selectedMessage.status === 'replied'}
                                        className={`px-6 py-3 rounded-2xl font-bold text-sm flex items-center space-x-2 transition-all ${selectedMessage.status === 'replied'
                                            ? 'bg-green-50 text-green-500 cursor-not-allowed'
                                            : 'bg-brand-blue/20 text-brand-blue-dark hover:bg-brand-blue-dark hover:text-white'
                                            }`}
                                    >
                                        <FiCheckCircle /> <span>{selectedMessage.status === 'replied' ? 'Replied' : 'Mark as Replied'}</span>
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(selectedMessage)}
                                        className="px-6 py-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl font-bold text-sm flex items-center space-x-2 transition-all"
                                    >
                                        <FiTrash2 /> <span>Delete</span>
                                    </button>
                                </div>
                                <button className="text-brand-dark/40 hover:text-brand-pink-dark font-bold text-sm transition-all" onClick={() => setIsViewModalOpen(false)}>
                                    Close Message
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-brand-dark/40 backdrop-blur-md animate-fade-in">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-slide-up border border-brand-pink/20">
                        <div className="p-8 text-center space-y-6">
                            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto text-3xl animate-bounce">
                                <FiTrash2 />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-serif text-brand-dark">Delete Message?</h3>
                                <p className="text-brand-dark/60 leading-relaxed px-4">
                                    Are you sure you want to remove the inquiry from <span className="font-bold text-brand-pink-dark">"{messageToDelete?.name}"</span>?
                                </p>
                            </div>
                            <div className="flex flex-col space-y-3 pt-4">
                                <button
                                    onClick={confirmDelete}
                                    className="w-full py-4 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                                >
                                    Yes, Delete Message
                                </button>
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="w-full py-4 bg-brand-pink/10 text-brand-pink-dark rounded-2xl font-bold hover:bg-brand-pink/20 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageMessages;
