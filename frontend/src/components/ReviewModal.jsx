import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
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
            await api.post(`/products/${productId}/reviews`, { name, rating, comment });
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
            <div className="relative bg-brand-cream w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-slide-up border border-brand-border">
                <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-serif text-brand-dark font-semibold">Write a Review</h2>
                        <button onClick={onClose} className="p-2 hover:bg-brand-linen rounded-full transition-colors">
                            <FiX className="text-2xl text-brand-muted" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-brand-muted uppercase tracking-widest ml-1">Your Rating</label>
                            <div className="flex space-x-1.5">
                                {[1, 2, 3, 4, 5].map((star) => {
                                    const active = (hover || rating) >= star;
                                    return (
                                        <button
                                            key={star}
                                            type="button"
                                            className="transition-transform hover:scale-125"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHover(star)}
                                            onMouseLeave={() => setHover(0)}
                                        >
                                            <svg width="28" height="28" viewBox="0 0 10 10" fill="none">
                                                <path d="M5 1l1.09 2.26L8.5 3.64l-1.75 1.7.41 2.41L5 6.5 2.84 7.75l.41-2.41L1.5 3.64l2.41-.38L5 1z"
                                                    fill={active ? 'var(--brand-gold)' : 'var(--brand-linen)'}
                                                    stroke={active ? 'var(--brand-gold)' : 'var(--brand-border)'}
                                                    strokeWidth="0.5" />
                                            </svg>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--brand-muted)' }}>Your Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="input-base w-full"
                                placeholder="Enter your name"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--brand-muted)' }}>Your Experience</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="input-base w-full min-h-[110px] resize-none"
                                placeholder="Share your thoughts about this product..."
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-4 text-base"
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
