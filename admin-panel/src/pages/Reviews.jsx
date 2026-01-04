import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { FiStar, FiTrash2, FiSearch, FiMessageSquare } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const ManageReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [reviewToDelete, setReviewToDelete] = useState(null);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const { data } = await api.get('/products/reviews/all');
            setReviews(data);
        } catch (error) {
            toast.error('Failed to load reviews');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (review) => {
        setReviewToDelete(review);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!reviewToDelete) return;
        try {
            await api.delete(`/products/${reviewToDelete.productId}/reviews/${reviewToDelete._id}`);
            toast.success('Review removed successfully');
            fetchReviews();
            setIsDeleteModalOpen(false);
        } catch (error) {
            toast.error('Failed to remove review');
        }
    };

    const filteredReviews = reviews.filter(r =>
        r.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.comment.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2 md:px-0">
                <div className="space-y-1">
                    <h1 className="text-2xl md:text-3xl font-serif text-brand-dark">Product Reviews</h1>
                    <p className="text-brand-dark/50 text-xs md:text-sm">Manage customer feedback and ratings.</p>
                </div>
            </div>

            <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] shadow-sm border border-brand-pink/10 overflow-hidden">
                <div className="p-8 border-b border-brand-pink/10 bg-brand-pink/5">
                    <div className="relative max-w-md">
                        <input
                            type="text"
                            placeholder="Search reviews..."
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
                                <th className="px-8 py-5 font-bold">Product</th>
                                <th className="px-8 py-5 font-bold">Reviewer</th>
                                <th className="px-8 py-5 font-bold">Rating</th>
                                <th className="px-8 py-5 font-bold">Comment</th>
                                <th className="px-8 py-5 font-bold">Date</th>
                                <th className="px-8 py-5 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-pink/10">
                            {filteredReviews.map((review) => (
                                <tr key={review._id} className="hover:bg-brand-pink/5 transition-colors group">
                                    <td className="px-8 py-6 font-bold text-brand-dark">{review.productName}</td>
                                    <td className="px-8 py-6 text-brand-dark/60 font-medium">{review.name}</td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center text-brand-pink-dark">
                                            {[...Array(5)].map((_, i) => (
                                                <FiStar
                                                    key={i}
                                                    className={`text-xs ${i < review.rating ? 'fill-brand-pink-dark' : 'text-brand-dark/10'}`}
                                                />
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-brand-dark/70 text-sm max-w-md truncate">"{review.comment}"</td>
                                    <td className="px-8 py-6 text-brand-dark/40 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button
                                            onClick={() => handleDeleteClick(review)}
                                            className="p-2.5 text-brand-dark/40 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredReviews.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="6" className="px-8 py-20 text-center text-brand-dark/30 italic">No reviews found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-brand-dark/40 backdrop-blur-md animate-fade-in">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-slide-up border border-brand-pink/20">
                        <div className="p-8 text-center space-y-6">
                            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto text-3xl animate-bounce">
                                <FiTrash2 />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-serif text-brand-dark">Remove Review?</h3>
                                <p className="text-brand-dark/60 leading-relaxed px-4">
                                    Are you sure you want to delete this review from <span className="font-bold text-brand-pink-dark">"{reviewToDelete?.name}"</span>?
                                </p>
                            </div>
                            <div className="flex flex-col space-y-3 pt-4">
                                <button
                                    onClick={confirmDelete}
                                    className="w-full py-4 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                                >
                                    Yes, Delete Review
                                </button>
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="w-full py-4 bg-brand-pink/10 text-brand-pink-dark rounded-2xl font-bold hover:bg-brand-pink/20 transition-all"
                                >
                                    Cancel & Keep
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageReviews;
