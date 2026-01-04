import React, { useState } from 'react';
import { FiX, FiStar } from 'react-icons/fi';
import api from '../api/client';
import { toast } from 'react-hot-toast';

const ReviewModal = ({ isOpen, onClose, productId, onReviewAdded }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [hover, setHover] = useState(0);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!comment || !name) return toast.error('Please fill in all fields');

        setLoading(true);
        try {
            await api.post(`/products/${productId}/reviews`, {
                name,
                rating,
                comment
            });
            toast.success('Review submitted successfully!');
            onReviewAdded();
            onClose();
            setName('');
            setComment('');
            setRating(5);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit review');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-brand-dark/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />
            <div className="relative bg-brand-offwhite w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-slide-up border border-brand-pink/10">
                <div className="p-8 space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-serif text-brand-dark">Write a Review</h2>
                        <button onClick={onClose} className="p-2 hover:bg-brand-pink/10 rounded-full transition-colors">
                            <FiX className="text-2xl text-brand-dark/40" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-brand-dark/40 uppercase tracking-widest ml-1">Your Rating</label>
                            <div className="flex space-x-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className="transition-transform hover:scale-125"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHover(star)}
                                        onMouseLeave={() => setHover(0)}
                                    >
                                        <FiStar
                                            className={`text-3xl ${(hover || rating) >= star
                                                    ? 'fill-brand-pink-dark text-brand-pink-dark'
                                                    : 'text-brand-dark/20'
                                                } transition-colors`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-brand-dark/40 uppercase tracking-widest ml-1">Your Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-6 py-4 bg-white/50 border border-brand-pink/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-pink-dark/20 text-brand-dark"
                                placeholder="Enter your name"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-brand-dark/40 uppercase tracking-widest ml-1">Your Experience</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full px-6 py-4 bg-white/50 border border-brand-pink/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-pink-dark/20 text-brand-dark min-h-[120px] resize-none"
                                placeholder="Share your thoughts about this product..."
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-5 text-lg font-bold shadow-lg shadow-brand-pink-dark/20 disabled:opacity-50"
                        >
                            {loading ? 'Submitting...' : 'Post Review'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;
