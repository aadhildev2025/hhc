import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiEye } from 'react-icons/fi';
import { useCart } from '../context/CartContext.jsx';
import { toast } from 'react-hot-toast';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (product.stock <= 0) {
            toast.error('Sorry, this item is out of stock!');
            return;
        }
        addToCart(product);
        toast.success(`${product.name} added to cart!`);
    };

    const imgSrc = product.image?.startsWith('http')
        ? product.image
        : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${product.image}`;

    const renderStars = (rating) => {
        const r = Math.round(rating * 2) / 2;
        return (
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M5 1l1.09 2.26L8.5 3.64l-1.75 1.7.41 2.41L5 6.5 2.84 7.75l.41-2.41L1.5 3.64l2.41-.38L5 1z"
                            fill={star <= r ? 'var(--brand-gold)' : 'var(--brand-linen)'}
                            stroke={star <= r ? 'var(--brand-gold)' : 'var(--brand-border)'}
                            strokeWidth="0.5"
                        />
                    </svg>
                ))}
            </div>
        );
    };

    return (
        <div
            className="group relative flex flex-col overflow-hidden rounded-2xl"
            style={{
                background: 'var(--brand-card-bg)',
                border: '1px solid var(--brand-border)',
                boxShadow: '0 2px 16px var(--brand-shadow)',
                transition: 'transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s ease',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 16px 48px rgba(28,20,16,0.13)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 16px var(--brand-shadow)';
            }}
        >
            {/* Image Container */}
            <div className="relative overflow-hidden aspect-square" style={{ background: 'var(--brand-linen)' }}>
                <Link to={`/product/${product._id}`} className="block w-full h-full">
                    <img
                        src={imgSrc}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&q=80'; }}
                    />
                </Link>

                {/* Overlay with actions - rendered as a sibling, not inside the Link! */}
                <div className="absolute inset-0 flex items-end justify-center pb-4 gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                        background: 'linear-gradient(to top, rgba(28,20,16,0.45) 0%, transparent 60%)',
                    }}
                >
                    <div className="flex gap-2 pointer-events-auto">
                        <Link to={`/product/${product._id}`}
                            className="flex items-center justify-center w-10 h-10 rounded-xl font-medium text-sm transition-all duration-200"
                            style={{ background: 'rgba(250,245,239,0.95)', color: 'var(--brand-dark)' }}
                            title="View Product"
                        >
                            <FiEye size={15} />
                        </Link>
                        <button
                            onClick={handleAddToCart}
                            className="flex items-center justify-center px-4 h-10 rounded-xl font-semibold text-sm gap-1.5 transition-all duration-200"
                            style={{ background: 'var(--brand-rose)', color: '#fff' }}
                            title="Add to Cart"
                        >
                            <FiShoppingCart size={14} />
                            <span>Add to Cart</span>
                        </button>
                    </div>
                </div>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
                    {product.featured && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white"
                            style={{ background: 'var(--brand-rose)' }}>
                            Featured
                        </span>
                    )}
                    {product.stock === 0 && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white"
                            style={{ background: 'var(--brand-muted)' }}>
                            Sold Out
                        </span>
                    )}
                </div>
            </div>

            {/* Info */}
            <div className="flex flex-col flex-grow p-4 gap-2">
                <Link to={`/product/${product._id}`} className="block">
                    <h3 className="font-serif font-semibold text-base leading-snug line-clamp-2"
                        style={{ color: 'var(--brand-dark)', transition: 'color 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--brand-rose)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--brand-dark)'}
                    >
                        {product.name}
                    </h3>
                </Link>

                <div className="flex items-center justify-between mt-auto pt-2">
                    <span className="font-bold text-lg" style={{ color: 'var(--brand-rose)' }}>
                        LKR {product.price.toLocaleString()}
                    </span>
                    <div className="flex flex-col items-end gap-0.5">
                        {product.rating > 0 ? renderStars(product.rating) : (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                                style={{ background: 'rgba(96,165,250,0.12)', color: 'var(--brand-sage)' }}>New</span>
                        )}
                        {product.rating > 0 && (
                            <span className="text-[10px]" style={{ color: 'var(--brand-muted)' }}>
                                {product.rating.toFixed(1)}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
