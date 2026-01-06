import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import api from '../api/client';
import { toast } from 'react-hot-toast';
import { FiCheckCircle, FiArrowLeft, FiTruck } from 'react-icons/fi';

const Checkout = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    const [orderId, setOrderId] = useState('');

    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        address: '',
        city: '',
        postalCode: '',
        notes: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const orderData = {
            orderItems: cartItems.map(item => ({
                product: item._id,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                image: item.image
            })),
            customerName: formData.customerName,
            customerEmail: formData.customerEmail,
            customerPhone: formData.customerPhone,
            shippingAddress: {
                address: formData.address,
                city: formData.city,
                postalCode: formData.postalCode,
                country: 'Sri Lanka'
            },
            notes: formData.notes
        };

        try {
            const { data } = await api.post('/orders', orderData);
            setOrderId(data._id);
            setOrderComplete(true);
            window.scrollTo(0, 0);
            clearCart();
            toast.success('Order placed successfully!');
        } catch (error) {
            console.error('Error placing order:', error);
            toast.error('Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (orderComplete) {
        return (
            <div className="min-h-screen pt-32 pb-20 px-6 flex flex-col items-center justify-center space-y-8 animate-fade-in bg-brand-offwhite">
                <div className="w-24 h-24 bg-brand-pink-dark rounded-full flex items-center justify-center text-5xl text-white shadow-lg shadow-brand-pink/20">
                    <FiCheckCircle />
                </div>
                <div className="text-center space-y-4">
                    <h2 className="text-4xl font-serif text-brand-dark">Thank You for Your Order!</h2>
                    <p className="text-brand-dark/60 max-w-md mx-auto">
                        Your order <span className="font-bold text-brand-pink-dark">#{orderId.slice(-8).toUpperCase()}</span> has been placed successfully.
                        We'll contact you shortly for confirmation.
                    </p>
                </div>
                <div className="flex space-x-4">
                    <button onClick={() => navigate('/')} className="btn-primary">Back to Home</button>
                    <button onClick={() => navigate('/shop')} className="px-8 py-3 border border-brand-border rounded-full hover:bg-brand-card transition-colors text-brand-dark">Continue Shopping</button>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="min-h-screen pt-28 pb-20 px-6 md:px-12 bg-brand-offwhite">
            <div className="max-w-7xl mx-auto">
                <button
                    onClick={() => navigate('/cart')}
                    className="flex items-center space-x-2 text-brand-dark/60 hover:text-brand-pink-dark mb-8 transition-colors"
                >
                    <FiArrowLeft /> <span>Back to cart</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Checkout Form */}
                    <div className="space-y-12">
                        <h1 className="text-4xl font-serif text-brand-dark">Checkout</h1>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-brand-dark border-b border-brand-beige pb-4">Personal Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-brand-dark/70">Full Name</label>
                                        <input
                                            required name="customerName" type="text" value={formData.customerName} onChange={handleChange}
                                            className="w-full p-3 bg-brand-card border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-pink-dark/50 text-brand-dark"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-brand-dark/70">Phone Number</label>
                                        <input
                                            required name="customerPhone" type="tel" value={formData.customerPhone} onChange={handleChange}
                                            className="w-full p-3 bg-brand-card border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-pink-dark/50 text-brand-dark"
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-sm font-medium text-brand-dark/70">Email Address</label>
                                        <input
                                            required name="customerEmail" type="email" value={formData.customerEmail} onChange={handleChange}
                                            className="w-full p-3 bg-brand-card border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-pink-dark/50 text-brand-dark"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-brand-dark border-b border-brand-beige pb-4">Shipping Address</h3>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-brand-dark/70">Street Address</label>
                                        <input
                                            required name="address" type="text" value={formData.address} onChange={handleChange}
                                            className="w-full p-3 bg-brand-card border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-pink-dark/50 text-brand-dark"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-brand-dark/70">City</label>
                                            <input
                                                required name="city" type="text" value={formData.city} onChange={handleChange}
                                                className="w-full p-3 bg-brand-card border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-pink-dark/50 text-brand-dark"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-brand-dark/70">Postal Code</label>
                                            <input
                                                name="postalCode" type="text" value={formData.postalCode} onChange={handleChange}
                                                className="w-full p-3 bg-brand-card border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-pink-dark/50 text-brand-dark"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-sm font-medium text-brand-dark/70">Order Notes (Optional)</label>
                                <textarea
                                    name="notes" rows="4" value={formData.notes} onChange={handleChange}
                                    className="w-full p-3 bg-brand-card border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-pink-dark/50 text-brand-dark"
                                    placeholder="Notes about your order, e.g. special requirements for handmade items."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary h-16 flex items-center justify-center space-x-3 text-xl font-bold shadow-xl shadow-brand-pink-dark/20 disabled:opacity-50"
                            >
                                {loading ? 'Processing...' : `Place Order • Rs. ${cartTotal.toLocaleString()}`}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="space-y-8">
                        <div className="bg-brand-card rounded-3xl p-8 sticky top-32 space-y-8 border border-brand-border shadow-sm">
                            <h2 className="text-2xl font-serif text-brand-dark">Verify Items</h2>
                            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
                                {cartItems.map((item) => (
                                    <div key={item._id} className="flex justify-between items-center bg-brand-offwhite/50 p-4 rounded-2xl border border-brand-border">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-brand-card">
                                                <img src={item.image.startsWith('http') ? item.image : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${item.image}`} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-brand-dark text-sm">{item.name}</h4>
                                                <p className="text-xs text-brand-dark/50">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <span className="font-bold text-brand-blue-dark text-sm">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-6 border-t border-brand-pink/10 space-y-4">
                                <div className="flex justify-between text-brand-dark/70">
                                    <span>Subtotal</span>
                                    <span className="font-bold">Rs. {cartTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-brand-dark/70">
                                    <span className="flex items-center"><FiTruck className="mr-2" /> Shipping</span>
                                    <span className="font-bold text-brand-pink-dark">FREE</span>
                                </div>
                                <div className="pt-6 flex justify-between text-2xl text-brand-dark">
                                    <span className="font-serif font-bold">Total</span>
                                    <span className="font-bold text-brand-blue-dark">Rs. {cartTotal.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="p-4 bg-brand-blue/5 rounded-2xl border border-brand-blue/10 text-xs text-brand-dark/60 italic">
                                * Payment will be collected as Cash on Delivery. We appreciate your trust in HomeHeartCreation!
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
