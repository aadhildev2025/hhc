import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiShoppingBag, FiInfo, FiMail, FiShoppingCart, FiUser, FiMenu, FiX, FiSearch, FiSun, FiMoon, FiCoffee } from 'react-icons/fi';
import { useCart } from '../context/CartContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

const Navbar = () => {
    const { cartCount } = useCart();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const navLinks = [
        { name: 'Home', path: '/', icon: <FiHome /> },
        { name: 'Shop', path: '/shop', icon: <FiShoppingBag /> },
        { name: 'About', path: '/about', icon: <FiInfo /> },
        { name: 'Contact', path: '/contact', icon: <FiMail /> },
    ];

    const isActive = (path) => location.pathname === path;

    const themeIcons = {
        light: <FiSun />,
        dark: <FiMoon />,
        warm: <FiCoffee />
    };

    const nextTheme = {
        light: 'dark',
        dark: 'warm',
        warm: 'light'
    };

    return (
        <>
            {/* Top Navbar */}
            <nav className="glass sticky top-0 z-50 py-4 px-6 md:px-12 border-b border-white/10">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="text-xl md:text-2xl font-serif font-bold tracking-tight">
                        <span className="text-brand-pink-dark">Home</span>
                        <span className="text-brand-blue-dark">Heart</span>
                        <span className="text-brand-pink-dark/50 hidden sm:inline">Creation</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="flex items-center space-x-1 text-brand-dark/80 hover:text-brand-pink-dark transition-colors duration-200"
                            >
                                <span className="text-lg">{link.icon}</span>
                                <span className="font-medium">{link.name}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-3 md:space-x-5">
                        <div className="relative group hidden lg:block w-64">
                            <input
                                type="text"
                                placeholder="Search ornaments..."
                                className="w-full pl-10 pr-4 py-2 bg-brand-card border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-pink-dark/50 text-brand-dark text-sm"
                            />
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-dark/40" />
                        </div>

                        <button
                            onClick={() => toggleTheme(nextTheme[theme])}
                            className="p-2 md:p-2.5 bg-brand-card text-brand-pink-dark rounded-xl hover:bg-brand-pink-dark hover:text-white transition-all duration-300 shadow-sm border border-brand-border"
                            title={`Switch to ${nextTheme[theme]} theme`}
                        >
                            <span className="text-lg md:text-xl">{themeIcons[theme]}</span>
                        </button>

                        <button onClick={() => navigate('/shop')} className="lg:hidden text-brand-dark/80 hover:text-brand-blue-dark text-xl transition-colors">
                            <FiSearch />
                        </button>

                        <Link to="/cart" className="hidden md:block relative text-brand-dark/80 hover:text-brand-pink-dark text-xl transition-colors">
                            <FiShoppingCart />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-brand-pink-dark text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 w-full bg-brand-card/90 backdrop-blur-xl border-t border-brand-border z-[100] px-6 py-4 pb-8 shadow-[0_-10px_40px_rgba(0,0,0,0.08)]">
                <div className="flex items-center justify-between max-w-md mx-auto">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`flex flex-col items-center space-y-1 transition-all duration-300 ${isActive(link.path)
                                ? 'text-brand-pink-dark -translate-y-1'
                                : 'text-brand-dark/40 hover:text-brand-pink-dark'
                                }`}
                        >
                            <span className="text-2xl">{link.icon}</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest">{link.name}</span>
                        </Link>
                    ))}
                    <Link
                        to="/cart"
                        className={`flex flex-col items-center space-y-1 relative transition-all duration-300 ${isActive('/cart')
                            ? 'text-brand-pink-dark -translate-y-1'
                            : 'text-brand-dark/40'
                            }`}
                    >
                        <div className="relative">
                            <FiShoppingCart className="text-2xl" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-pink-dark text-white text-[8px] flex items-center justify-center rounded-full font-bold">
                                    {cartCount}
                                </span>
                            )}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest">Cart</span>
                    </Link>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
