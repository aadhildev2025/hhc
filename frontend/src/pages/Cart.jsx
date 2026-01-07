import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { FiTrash2, FiMinus, FiPlus, FiArrowRight, FiShoppingBag } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
    const navigate = useNavigate();

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen pt-32 pb-20 px-6 flex flex-col items-center justify-center space-y-8">
                <div className="w-24 h-24 bg-brand-pink/20 rounded-full flex items-center justify-center text-5xl text-brand-pink-dark/50">
                    <FiShoppingBag />
                </div>
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-serif text-brand-dark">Your cart is empty</h2>
                    <p className="text-brand-dark/60 max-w-sm">Looks like you haven't added any treasures to your cart yet.</p>
                </div>
                <Link to="/shop" className="btn-primary">Start Shopping</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-28 pb-20 px-6 md:px-12 bg-brand-offwhite">
            <div className="max-w-7xl mx-auto space-y-12">
                <h1 className="text-4xl font-serif text-brand-dark">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="hidden md:grid grid-cols-5 pb-4 border-b border-brand-border text-xs font-bold text-brand-dark/40 uppercase tracking-widest">
                            <span className="col-span-2">Product</span>
                            <span className="text-center">Price</span>
                            <span className="text-center">Quantity</span>
                            <span className="text-right">Total</span>
                        </div>

                        {cartItems.map((item) => (
                            <div key={item._id} className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center py-6 border-b border-brand-border group">
                                <div className="col-span-2 flex items-center space-x-6">
                                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-brand-card border border-brand-border">
                                        <img
                                            src={item.image.startsWith('http') ? item.image : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${item.image}`}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Link to={`/product/${item._id}`} className="font-serif font-bold text-brand-dark hover:text-brand-pink-dark transition-colors">{item.name}</Link>
                                        <p className="text-xs text-brand-dark/50">{item.category?.name}</p>
                                        <button
                                            onClick={() => removeFromCart(item._id)}
                                            className="text-red-400 hover:text-red-600 flex items-center text-xs pt-2"
                                        >
                                            <FiTrash2 className="mr-1" /> Remove
                                        </button>
                                    </div>
                                </div>

                                <div className="text-center font-bold text-brand-dark/70">
                                    <span className="md:hidden text-xs text-brand-dark/40 mr-2 uppercase">Price:</span>
                                    LKR {item.price.toLocaleString()}
                                </div>

                                <div className="flex justify-center">
                                    <div className="flex items-center bg-brand-card border border-brand-border rounded-lg overflow-hidden h-10">
                                        <button
                                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                            className="px-3 h-full hover:bg-brand-pink/10 shadow-sm transition-all cursor-pointer"
                                        >
                                            <FiMinus className="text-xs" />
                                        </button>
                                        <span className="px-4 font-bold text-brand-dark text-sm">{item.quantity}</span>
                                        <button
                                            onClick={() => {
                                                if (item.quantity < item.stock) {
                                                    updateQuantity(item._id, item.quantity + 1);
                                                } else {
                                                    toast.error('Maximum stock reached');
                                                }
                                            }}
                                            className="px-3 h-full hover:bg-brand-pink/10 shadow-sm transition-all cursor-pointer"
                                        >
                                            <FiPlus className="text-xs" />
                                        </button>
                                    </div>
                                </div>

                                <div className="text-right font-bold text-brand-blue-dark text-lg">
                                    <span className="md:hidden text-xs text-brand-dark/40 mr-2 uppercase">Total:</span>
                                    LKR {(item.price * item.quantity).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-8">
                        <div className="bg-brand-card border border-brand-border rounded-3xl p-8 space-y-8 shadow-sm">
                            <h2 className="text-2xl font-serif text-brand-dark">Order Summary</h2>

                            <div className="space-y-4">
                                <div className="flex justify-between text-brand-dark/70">
                                    <span>Subtotal</span>
                                    <span className="font-bold">LKR {cartTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-brand-dark/70">
                                    <span>Shipping</span>
                                    <span className="font-bold">Calculated at checkout</span>
                                </div>
                                <div className="pt-4 border-t border-brand-border flex justify-between text-xl text-brand-dark">
                                    <span className="font-serif font-bold">Total</span>
                                    <span className="font-bold text-brand-blue-dark text-2xl">LKR {cartTotal.toLocaleString()}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full btn-primary h-14 flex items-center justify-center space-x-3 text-lg font-bold shadow-lg shadow-brand-pink-dark/20"
                            >
                                <span>Proceed to Checkout</span> <FiArrowRight />
                            </button>
                        </div>

                        <div className="p-8 border-2 border-dashed border-brand-pink/20 rounded-3xl text-center space-y-4">
                            <h3 className="font-bold text-brand-dark">Special Instructions?</h3>
                            <p className="text-xs text-brand-dark/50">Add a note to your order during checkout for personalized crafts or gift messages.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
