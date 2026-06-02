import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useCart } from '../context/CartContext.jsx';
import { FiShoppingCart, FiHeart, FiArrowLeft, FiTruck, FiRefreshCw, FiShield, FiEdit3, FiMinus, FiPlus } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import ReviewModal from '../components/ReviewModal';
import SEO from '../components/SEO';

const getImgSrc = (img) =>
    img?.startsWith('http') ? img : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${img}`;

const StarRating = ({ rating }) => (
    <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(s => (
            <svg key={s} width="14" height="14" viewBox="0 0 10 10" fill="none">
                <path d="M5 1l1.09 2.26L8.5 3.64l-1.75 1.7.41 2.41L5 6.5 2.84 7.75l.41-2.41L1.5 3.64l2.41-.38L5 1z"
                    fill={s <= Math.round(rating) ? 'var(--brand-gold)' : 'var(--brand-linen)'}
                    stroke={s <= Math.round(rating) ? 'var(--brand-gold)' : 'var(--brand-border)'}
                    strokeWidth="0.5" />
            </svg>
        ))}
    </div>
);

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState('');
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

    const fetchProduct = async () => {
        try {
            const { data } = await api.get(`/products/${id}`);
            setProduct(data);
            setActiveImage(data.image);
        } catch {
            toast.error('Product not found');
            navigate('/shop');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProduct(); }, [id]);

    const handleAddToCart = () => {
        if (product.stock <= 0) { toast.error('Sorry, this item is out of stock!'); return; }
        addToCart(product, quantity);
        toast.success(`${product.name} added to cart!`);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center" style={{ paddingTop: '6rem' }}>
            <div className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin"
                style={{ borderColor: 'var(--brand-rose)', borderTopColor: 'transparent' }} />
        </div>
    );
    if (!product) return null;

    const features = [
        { icon: <FiTruck />, title: 'Fast Delivery', sub: '3–5 business days' },
        { icon: <FiRefreshCw />, title: 'Easy Returns', sub: 'Return within 7 days' },
        { icon: <FiShield />, title: 'Secure Shopping', sub: '100% safe checkout' },
    ];

    return (
        <div style={{ background: 'var(--brand-cream)', paddingTop: '5rem' }}>
            <SEO
                title={product.name}
                description={product.description}
                image={getImgSrc(product.image)}
                url={`/product/${product._id}`}
                type="product"
            />

            {/* Breadcrumb */}
            <div className="py-4 px-6 md:px-12" style={{ background: 'var(--brand-linen)', borderBottom: '1px solid var(--brand-border)' }}>
                <div className="max-w-7xl mx-auto">
                    <button onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-sm font-medium transition-colors"
                        style={{ color: 'var(--brand-muted)' }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--brand-rose)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--brand-muted)'}>
                        <FiArrowLeft size={15} /> Back to products
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">

                    {/* ── IMAGE GALLERY ── */}
                    <div className="space-y-4 animate-slide-up">
                        <div className="aspect-square rounded-3xl overflow-hidden" style={{ background: 'var(--brand-linen)' }}>
                            <img src={getImgSrc(activeImage)} alt={product.name}
                                className="w-full h-full object-cover transition-all duration-500" />
                        </div>
                        {product.images?.length > 1 && (
                            <div className="grid grid-cols-5 gap-3">
                                {product.images.map((img, i) => (
                                    <button key={i} onClick={() => setActiveImage(img)}
                                        className="aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200"
                                        style={{
                                            borderColor: activeImage === img ? 'var(--brand-rose)' : 'transparent',
                                            opacity: activeImage === img ? 1 : 0.65,
                                        }}
                                        onMouseEnter={e => { if (activeImage !== img) e.currentTarget.style.opacity = '1'; }}
                                        onMouseLeave={e => { if (activeImage !== img) e.currentTarget.style.opacity = '0.65'; }}>
                                        <img src={getImgSrc(img)} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── PRODUCT INFO ── */}
                    <div className="space-y-7 animate-slide-up delay-100">
                        {/* Category + name */}
                        <div className="space-y-3">
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
                                style={{ background: 'rgba(201,123,94,0.1)', color: 'var(--brand-rose)' }}>
                                {product.category?.name || 'Handmade'}
                            </span>
                            <h1 className="font-serif font-semibold leading-tight"
                                style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: 'var(--brand-dark)' }}>
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-4 flex-wrap">
                                <span className="font-bold text-3xl" style={{ color: 'var(--brand-rose)' }}>
                                    LKR {product.price.toLocaleString()}
                                </span>
                                {product.rating > 0 && (
                                    <div className="flex items-center gap-2">
                                        <StarRating rating={product.rating} />
                                        <span className="text-sm font-semibold" style={{ color: 'var(--brand-dark)' }}>{product.rating.toFixed(1)}</span>
                                        <span className="text-xs" style={{ color: 'var(--brand-muted)' }}>({product.numReviews || 0} reviews)</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-base leading-relaxed pb-6" style={{ color: 'var(--brand-muted)', borderBottom: '1px solid var(--brand-border)' }}>
                            {product.description}
                        </p>

                        {/* Quantity + stock */}
                        <div className="flex items-center gap-5 flex-wrap">
                            <div className="flex items-center rounded-xl border overflow-hidden" style={{ borderColor: 'var(--brand-border)' }}>
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    className="w-12 h-12 flex items-center justify-center transition-colors"
                                    style={{ color: 'var(--brand-muted)' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'var(--brand-linen)'}
                                    onMouseLeave={e => e.currentTarget.style.background = ''}>
                                    <FiMinus size={14} />
                                </button>
                                <span className="w-12 text-center font-bold text-base" style={{ color: 'var(--brand-dark)' }}>{quantity}</span>
                                <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                                    className="w-12 h-12 flex items-center justify-center transition-colors"
                                    style={{ color: 'var(--brand-muted)' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'var(--brand-linen)'}
                                    onMouseLeave={e => e.currentTarget.style.background = ''}>
                                    <FiPlus size={14} />
                                </button>
                            </div>
                            <span className="text-sm font-medium" style={{ color: product.stock > 0 ? 'var(--brand-sage)' : '#ef4444' }}>
                                {product.stock > 0 ? `✓ In Stock (${product.stock} available)` : '✗ Out of Stock'}
                            </span>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex gap-3">
                            <button onClick={handleAddToCart} disabled={product.stock <= 0}
                                className="btn-primary flex-grow py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed">
                                <FiShoppingCart size={18} /> Add to Cart
                            </button>
                            <button className="flex items-center justify-center w-14 h-14 rounded-xl border transition-all duration-200"
                                style={{ borderColor: 'var(--brand-border)', color: 'var(--brand-muted)' }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--brand-rose)'; e.currentTarget.style.color = 'var(--brand-rose)'; e.currentTarget.style.background = 'rgba(201,123,94,0.06)'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--brand-border)'; e.currentTarget.style.color = 'var(--brand-muted)'; e.currentTarget.style.background = ''; }}>
                                <FiHeart size={18} />
                            </button>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-3 gap-4 pt-6" style={{ borderTop: '1px solid var(--brand-border)' }}>
                            {features.map((f, i) => (
                                <div key={i} className="flex flex-col items-center text-center gap-2 p-3 rounded-xl"
                                    style={{ background: 'var(--brand-linen)' }}>
                                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(201,123,94,0.1)', color: 'var(--brand-rose)' }}>{f.icon}</div>
                                    <div>
                                        <p className="text-xs font-bold" style={{ color: 'var(--brand-dark)' }}>{f.title}</p>
                                        <p className="text-[10px]" style={{ color: 'var(--brand-muted)' }}>{f.sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Reviews */}
                        <div className="space-y-6 pt-6" style={{ borderTop: '1px solid var(--brand-border)' }}>
                            <div className="flex items-center justify-between">
                                <h3 className="font-serif font-semibold text-xl" style={{ color: 'var(--brand-dark)' }}>Customer Reviews</h3>
                                <button onClick={() => setIsReviewModalOpen(true)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                                    style={{ color: 'var(--brand-rose)' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,123,94,0.08)'}
                                    onMouseLeave={e => e.currentTarget.style.background = ''}>
                                    <FiEdit3 size={14} /> Write a Review
                                </button>
                            </div>

                            {product.reviews?.length > 0 ? (
                                <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                                    {product.reviews.map((r, i) => (
                                        <div key={i} className="p-5 rounded-2xl space-y-2" style={{ background: 'var(--brand-linen)', border: '1px solid var(--brand-border)' }}>
                                            <div className="flex items-center justify-between gap-3">
                                                <span className="font-bold text-sm" style={{ color: 'var(--brand-dark)' }}>{r.name}</span>
                                                <div className="flex items-center gap-2">
                                                    <StarRating rating={r.rating} />
                                                    <span className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--brand-muted)' }}>
                                                        {new Date(r.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-sm leading-relaxed italic" style={{ color: 'var(--brand-muted)' }}>"{r.comment}"</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 rounded-2xl border border-dashed" style={{ borderColor: 'var(--brand-border)' }}>
                                    <p className="text-sm italic mb-3" style={{ color: 'var(--brand-muted)' }}>No reviews yet. Be the first to share your thoughts!</p>
                                    <button onClick={() => setIsReviewModalOpen(true)}
                                        className="text-sm font-semibold transition-colors"
                                        style={{ color: 'var(--brand-rose)' }}>
                                        Leave a Review →
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <ReviewModal
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                productId={product._id}
                onReviewAdded={fetchProduct}
            />
        </div>
    );
};

export default ProductDetails;
