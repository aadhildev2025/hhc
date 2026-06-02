import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import api from '../api/client';
import { toast } from 'react-hot-toast';
import { FiCheckCircle, FiArrowLeft, FiTruck } from 'react-icons/fi';
import SEO from '../components/SEO';

const inputClass = "input-base w-full";

const Checkout = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    const [orderId, setOrderId] = useState('');

    const [formData, setFormData] = useState({
        customerName: '', customerEmail: '', customerPhone: '',
        address: '', city: '', postalCode: '', notes: ''
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/orders', {
                orderItems: cartItems.map(i => ({ product: i._id, name: i.name, quantity: i.quantity, price: i.price, image: i.image })),
                customerName: formData.customerName,
                customerEmail: formData.customerEmail,
                customerPhone: formData.customerPhone,
                shippingAddress: { address: formData.address, city: formData.city, postalCode: formData.postalCode, country: 'Sri Lanka' },
                notes: formData.notes
            });
            setOrderId(data._id);
            setOrderComplete(true);
            window.scrollTo(0, 0);
            clearCart();
            toast.success('Order placed successfully!');
        } catch (err) {
            toast.error('Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (orderComplete) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-8 px-6 animate-fade-in" style={{ paddingTop: '6rem' }}>
                <SEO title="Order Confirmed" description="Your order has been placed." />
                <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl text-white shadow-xl"
                    style={{ background: 'linear-gradient(135deg, var(--brand-rose) 0%, var(--brand-rose-dark) 100%)' }}>
                    <FiCheckCircle />
                </div>
                <div className="text-center space-y-3 max-w-md">
                    <h2 className="font-serif font-semibold text-4xl" style={{ color: 'var(--brand-dark)' }}>Thank You!</h2>
                    <p className="text-base" style={{ color: 'var(--brand-muted)' }}>
                        Your order <span className="font-bold" style={{ color: 'var(--brand-rose)' }}>#{orderId.slice(-8).toUpperCase()}</span> has been placed.
                        We'll contact you shortly to confirm.
                    </p>
                </div>
                <div className="flex flex-wrap gap-3 justify-center">
                    <button onClick={() => navigate('/')} className="btn-primary px-10">Back to Home</button>
                    <Link to="/shop" className="btn-outline px-8">Continue Shopping</Link>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) { navigate('/cart'); return null; }

    return (
        <div style={{ background: 'var(--brand-cream)', paddingTop: '5rem' }}>
            <SEO title="Checkout" description="Complete your order" />
            <div className="py-8 px-6 md:px-12" style={{ background: 'var(--brand-linen)', borderBottom: '1px solid var(--brand-border)' }}>
                <div className="max-w-7xl mx-auto flex items-center gap-3">
                    <button onClick={() => navigate('/cart')} className="flex items-center gap-2 text-sm transition-colors"
                        style={{ color: 'var(--brand-muted)' }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--brand-rose)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--brand-muted)'}>
                        <FiArrowLeft size={15} /> Back to Cart
                    </button>
                    <span style={{ color: 'var(--brand-border)' }}>/</span>
                    <span className="text-sm font-semibold" style={{ color: 'var(--brand-dark)' }}>Checkout</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
                    {/* FORM */}
                    <div className="space-y-10 animate-slide-up">
                        <h1 className="font-serif font-semibold" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', color: 'var(--brand-dark)' }}>Complete Your Order</h1>
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Personal */}
                            <div className="space-y-5">
                                <h3 className="font-semibold text-sm uppercase tracking-widest pb-3" style={{ color: 'var(--brand-muted)', borderBottom: '1px solid var(--brand-border)' }}>Personal Details</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--brand-muted)' }}>Full Name</label>
                                        <input required name="customerName" type="text" value={formData.customerName} onChange={handleChange} className={inputClass} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--brand-muted)' }}>Phone Number</label>
                                        <input required name="customerPhone" type="tel" value={formData.customerPhone} onChange={handleChange} className={inputClass} />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--brand-muted)' }}>Email Address</label>
                                        <input required name="customerEmail" type="email" value={formData.customerEmail} onChange={handleChange} className={inputClass} />
                                    </div>
                                </div>
                            </div>
                            {/* Shipping */}
                            <div className="space-y-5">
                                <h3 className="font-semibold text-sm uppercase tracking-widest pb-3" style={{ color: 'var(--brand-muted)', borderBottom: '1px solid var(--brand-border)' }}>Shipping Address</h3>
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--brand-muted)' }}>Street Address</label>
                                    <input required name="address" type="text" value={formData.address} onChange={handleChange} className={inputClass} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--brand-muted)' }}>City</label>
                                        <input required name="city" type="text" value={formData.city} onChange={handleChange} className={inputClass} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--brand-muted)' }}>Postal Code</label>
                                        <input name="postalCode" type="text" value={formData.postalCode} onChange={handleChange} className={inputClass} />
                                    </div>
                                </div>
                            </div>
                            {/* Notes */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--brand-muted)' }}>Order Notes (Optional)</label>
                                <textarea name="notes" rows={3} value={formData.notes} onChange={handleChange} className={inputClass + ' resize-none'}
                                    placeholder="Special requirements for handmade items or gift messages…" />
                            </div>
                            <button type="submit" disabled={loading}
                                className="btn-primary w-full py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed">
                                {loading ? 'Placing Order…' : `Place Order · LKR ${cartTotal.toLocaleString()}`}
                            </button>
                        </form>
                    </div>

                    {/* SIDEBAR SUMMARY */}
                    <div className="animate-slide-up delay-200">
                        <div className="glass-card p-7 rounded-3xl sticky top-24 space-y-6">
                            <h2 className="font-serif font-semibold text-xl" style={{ color: 'var(--brand-dark)' }}>Verify Your Items</h2>
                            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                                {cartItems.map(item => {
                                    const imgSrc = item.image?.startsWith('http') ? item.image : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${item.image}`;
                                    return (
                                        <div key={item._id} className="flex items-center gap-4 py-3" style={{ borderBottom: '1px solid var(--brand-border)' }}>
                                            <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0" style={{ background: 'var(--brand-linen)' }}>
                                                <img src={imgSrc} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <p className="text-sm font-semibold truncate" style={{ color: 'var(--brand-dark)' }}>{item.name}</p>
                                                <p className="text-xs mt-0.5" style={{ color: 'var(--brand-muted)' }}>Qty: {item.quantity}</p>
                                            </div>
                                            <span className="font-bold text-sm shrink-0" style={{ color: 'var(--brand-rose)' }}>LKR {(item.price * item.quantity).toLocaleString()}</span>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="space-y-3 pt-2">
                                <div className="flex justify-between text-sm" style={{ color: 'var(--brand-muted)' }}>
                                    <span>Subtotal</span>
                                    <span className="font-semibold" style={{ color: 'var(--brand-dark)' }}>LKR {cartTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm" style={{ color: 'var(--brand-muted)' }}>
                                    <span className="flex items-center gap-1.5"><FiTruck size={13} /> Shipping</span>
                                    <span className="font-semibold" style={{ color: 'var(--brand-sage)' }}>FREE</span>
                                </div>
                                <div className="flex justify-between text-lg pt-3" style={{ borderTop: '1px solid var(--brand-border)' }}>
                                    <span className="font-serif font-semibold" style={{ color: 'var(--brand-dark)' }}>Total</span>
                                    <span className="font-bold" style={{ color: 'var(--brand-rose)' }}>LKR {cartTotal.toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="text-xs p-4 rounded-xl leading-relaxed" style={{ background: 'rgba(107,143,126,0.08)', color: 'var(--brand-sage)', border: '1px solid rgba(107,143,126,0.2)' }}>
                                💳 Payment is collected as <strong>Cash on Delivery</strong>. We appreciate your trust!
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
