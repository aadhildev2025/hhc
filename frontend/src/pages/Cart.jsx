import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { FiTrash2, FiMinus, FiPlus, FiArrowRight, FiShoppingBag } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import SEO from '../components/SEO';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
    const navigate = useNavigate();

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-8 px-6" style={{ paddingTop: '6rem' }}>
                <SEO title="Cart" description="Your shopping cart" />
                <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl"
                    style={{ background: 'rgba(201,123,94,0.1)', color: 'var(--brand-rose)' }}>
                    <FiShoppingBag />
                </div>
                <div className="text-center space-y-2">
                    <h2 className="font-serif font-semibold text-3xl" style={{ color: 'var(--brand-dark)' }}>Your cart is empty</h2>
                    <p className="text-sm max-w-xs mx-auto" style={{ color: 'var(--brand-muted)' }}>Looks like you haven't added any treasures to your cart yet.</p>
                </div>
                <Link to="/shop" className="btn-primary px-10">Start Shopping</Link>
            </div>
        );
    }

    return (
        <div style={{ background: 'var(--brand-cream)', paddingTop: '5rem' }}>
            <SEO title="Shopping Cart" description="Review your cart" />
            <div className="py-10 px-6 md:px-12" style={{ background: 'var(--brand-linen)', borderBottom: '1px solid var(--brand-border)' }}>
                <div className="max-w-7xl mx-auto">
                    <h1 className="font-serif font-semibold" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--brand-dark)' }}>Shopping Cart</h1>
                    <p className="mt-1 text-sm" style={{ color: 'var(--brand-muted)' }}>{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* ITEMS */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map(item => {
                            const imgSrc = item.image?.startsWith('http') ? item.image : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${item.image}`;
                            return (
                                <div key={item._id} className="glass-card p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center rounded-2xl">
                                    <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0" style={{ background: 'var(--brand-linen)' }}>
                                        <img src={imgSrc} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <Link to={`/product/${item._id}`} className="font-serif font-semibold text-base leading-snug block truncate" style={{ color: 'var(--brand-dark)' }}>
                                            {item.name}
                                        </Link>
                                        <p className="text-xs mt-0.5" style={{ color: 'var(--brand-muted)' }}>{item.category?.name}</p>
                                        <div className="flex items-center justify-between mt-3 flex-wrap gap-3">
                                            <div className="flex items-center rounded-xl overflow-hidden border" style={{ borderColor: 'var(--brand-border)' }}>
                                                <button onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                    className="w-9 h-9 flex items-center justify-center transition-colors"
                                                    style={{ color: 'var(--brand-muted)' }}
                                                    onMouseEnter={e => e.currentTarget.style.background = 'var(--brand-linen)'}
                                                    onMouseLeave={e => e.currentTarget.style.background = ''}>
                                                    <FiMinus size={13} />
                                                </button>
                                                <span className="w-9 text-center text-sm font-bold" style={{ color: 'var(--brand-dark)' }}>{item.quantity}</span>
                                                <button onClick={() => { if (item.quantity < item.stock) updateQuantity(item._id, item.quantity + 1); else toast.error('Maximum stock reached'); }}
                                                    className="w-9 h-9 flex items-center justify-center transition-colors"
                                                    style={{ color: 'var(--brand-muted)' }}
                                                    onMouseEnter={e => e.currentTarget.style.background = 'var(--brand-linen)'}
                                                    onMouseLeave={e => e.currentTarget.style.background = ''}>
                                                    <FiPlus size={13} />
                                                </button>
                                            </div>
                                            <span className="font-bold text-base" style={{ color: 'var(--brand-rose)' }}>
                                                LKR {(item.price * item.quantity).toLocaleString()}
                                            </span>
                                            <button onClick={() => removeFromCart(item._id)} className="flex items-center gap-1 text-xs transition-colors"
                                                style={{ color: 'var(--brand-muted)' }}
                                                onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                                                onMouseLeave={e => e.currentTarget.style.color = 'var(--brand-muted)'}>
                                                <FiTrash2 size={13} /> Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* ORDER SUMMARY */}
                    <div className="space-y-4">
                        <div className="glass-card p-7 rounded-3xl sticky top-24">
                            <h2 className="font-serif font-semibold text-xl mb-6" style={{ color: 'var(--brand-dark)' }}>Order Summary</h2>
                            <div className="space-y-3 pb-5 mb-5" style={{ borderBottom: '1px solid var(--brand-border)' }}>
                                <div className="flex justify-between text-sm" style={{ color: 'var(--brand-muted)' }}>
                                    <span>Subtotal ({cartItems.length} items)</span>
                                    <span className="font-semibold" style={{ color: 'var(--brand-dark)' }}>LKR {cartTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm" style={{ color: 'var(--brand-muted)' }}>
                                    <span>Shipping</span>
                                    <span className="font-semibold" style={{ color: 'var(--brand-sage)' }}>FREE</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center mb-7">
                                <span className="font-serif font-semibold text-lg" style={{ color: 'var(--brand-dark)' }}>Total</span>
                                <span className="font-bold text-2xl" style={{ color: 'var(--brand-rose)' }}>LKR {cartTotal.toLocaleString()}</span>
                            </div>
                            <button onClick={() => navigate('/checkout')} className="btn-primary w-full py-4 text-base">
                                Proceed to Checkout <FiArrowRight />
                            </button>
                            <Link to="/shop" className="block text-center text-xs mt-4 transition-colors"
                                style={{ color: 'var(--brand-muted)' }}
                                onMouseEnter={e => e.currentTarget.style.color = 'var(--brand-rose)'}
                                onMouseLeave={e => e.currentTarget.style.color = 'var(--brand-muted)'}>
                                ← Continue Shopping
                            </Link>
                        </div>
                        <div className="p-5 rounded-2xl border text-center text-xs leading-relaxed"
                            style={{ borderColor: 'var(--brand-border)', color: 'var(--brand-muted)', borderStyle: 'dashed' }}>
                            💬 Add a note for personalized or custom orders during checkout.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
