import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiShoppingBag, FiInfo, FiMail, FiShoppingCart, FiSearch, FiX, FiSun, FiMoon } from 'react-icons/fi';
import { useCart } from '../context/CartContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

const Navbar = () => {
    const { cartCount } = useCart();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchVal, setSearchVal] = useState('');

    const navLinks = [
        { name: 'Home', path: '/', icon: <FiHome /> },
        { name: 'Shop', path: '/shop', icon: <FiShoppingBag /> },
        { name: 'About', path: '/about', icon: <FiInfo /> },
        { name: 'Contact', path: '/contact', icon: <FiMail /> },
    ];

    const isActive = (path) => location.pathname === path;
    const isHome = location.pathname === '/';
    const useLightText = isHome && !scrolled;

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchVal.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchVal.trim())}`);
            setSearchOpen(false);
            setSearchVal('');
        }
    };

    return (
        <>
            {/* Top Navbar */}
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    scrolled
                        ? 'py-3 shadow-[0_4px_32px_rgba(28,20,16,0.10)] border-b border-brand-border'
                        : 'py-5'
                }`}
                style={{
                    background: scrolled ? 'var(--brand-card-bg)' : 'transparent',
                    backdropFilter: scrolled ? 'blur(20px)' : 'none',
                    WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
                }}
            >
                <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <span
                            className="text-xl md:text-2xl font-serif font-semibold tracking-tight"
                            style={{ color: useLightText ? '#ffffff' : 'var(--brand-dark)' }}
                        >
                            <span style={{ color: 'var(--brand-rose)' }}>Home</span>
                            <span style={{ color: useLightText ? '#ffffff' : 'var(--brand-dark)', transition: 'color 0.3s' }}>Heart</span>
                            <span style={{ color: useLightText ? 'rgba(255,255,255,0.75)' : 'var(--brand-muted)', fontWeight: 400, transition: 'color 0.3s' }}> Creation</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
                                style={{
                                    color: isActive(link.path)
                                        ? 'var(--brand-rose)'
                                        : (useLightText ? 'rgba(255,255,255,0.85)' : 'var(--brand-muted)'),
                                    fontWeight: isActive(link.path) ? 600 : 500,
                                }}
                                onMouseEnter={e => {
                                    if (!isActive(link.path)) {
                                        e.currentTarget.style.color = useLightText ? '#ffffff' : 'var(--brand-rose)';
                                    }
                                }}
                                onMouseLeave={e => {
                                    if (!isActive(link.path)) {
                                        e.currentTarget.style.color = useLightText ? 'rgba(255,255,255,0.85)' : 'var(--brand-muted)';
                                    }
                                }}
                            >
                                {link.name}
                                {isActive(link.path) && (
                                    <span
                                        className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full"
                                        style={{ background: 'var(--brand-rose)' }}
                                    />
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        {/* Search */}
                        <div className="relative hidden lg:flex items-center">
                            {searchOpen ? (
                                <form onSubmit={handleSearch} className="flex items-center gap-2 animate-slide-down">
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="Search products…"
                                        value={searchVal}
                                        onChange={(e) => setSearchVal(e.target.value)}
                                        className="w-56 px-4 py-2 text-sm rounded-xl border outline-none transition-all"
                                        style={{
                                            background: 'var(--brand-cream)',
                                            borderColor: 'var(--brand-rose)',
                                            color: 'var(--brand-dark)',
                                            boxShadow: '0 0 0 3px rgba(244,114,182,0.12)',
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => { setSearchOpen(false); setSearchVal(''); }}
                                        className="p-2 rounded-lg transition-colors"
                                        style={{ color: 'var(--brand-muted)' }}
                                    >
                                        <FiX />
                                    </button>
                                </form>
                            ) : (
                                <button
                                    onClick={() => setSearchOpen(true)}
                                    className="p-2.5 rounded-xl transition-all duration-200"
                                    style={{ color: useLightText ? '#ffffff' : 'var(--brand-muted)' }}
                                    onMouseEnter={e => e.currentTarget.style.color = 'var(--brand-rose)'}
                                    onMouseLeave={e => e.currentTarget.style.color = useLightText ? '#ffffff' : 'var(--brand-muted)'}
                                >
                                    <FiSearch size={18} />
                                </button>
                            )}
                        </div>

                        {/* Mobile search button */}
                        <button
                            onClick={() => navigate('/shop')}
                            className="lg:hidden p-2.5 rounded-xl transition-colors"
                            style={{ color: useLightText ? '#ffffff' : 'var(--brand-muted)' }}
                        >
                            <FiSearch size={18} />
                        </button>

                        {/* Theme toggle */}
                        <button
                            onClick={() => toggleTheme(theme === 'light' ? 'dark' : 'light')}
                            className="p-2.5 rounded-xl transition-all duration-200 border"
                            style={{
                                color: useLightText ? '#ffffff' : 'var(--brand-muted)',
                                borderColor: useLightText ? 'rgba(255,255,255,0.2)' : 'var(--brand-border)',
                                background: useLightText ? 'transparent' : 'var(--brand-card-bg)',
                            }}
                            title="Toggle theme"
                        >
                            {theme === 'dark' ? <FiSun size={16} /> : <FiMoon size={16} />}
                        </button>

                        {/* Cart */}
                        <Link
                            to="/cart"
                            className="relative hidden md:flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200"
                            style={{ color: useLightText ? '#ffffff' : 'var(--brand-dark)' }}
                        >
                            <FiShoppingCart size={18} />
                            {cartCount > 0 && (
                                <span
                                    className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white rounded-full"
                                    style={{ background: 'var(--brand-rose)' }}
                                >
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Mobile Bottom Navigation */}
            <nav
                className="md:hidden fixed bottom-0 left-0 w-full z-[100] px-4 py-2 pb-6"
                style={{
                    background: 'var(--brand-card-bg)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderTop: '1px solid var(--brand-border)',
                    boxShadow: '0 -8px 32px rgba(28,20,16,0.08)',
                }}
            >
                <div className="flex items-center justify-around max-w-sm mx-auto">
                    {[...navLinks, { name: 'Cart', path: '/cart', icon: <FiShoppingCart /> }].map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all duration-200"
                            style={{
                                color: isActive(link.path) ? 'var(--brand-rose)' : 'var(--brand-muted)',
                                transform: isActive(link.path) ? 'translateY(-2px)' : 'none',
                            }}
                        >
                            <div className="relative text-xl">
                                {link.icon}
                                {link.name === 'Cart' && cartCount > 0 && (
                                    <span
                                        className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-4 h-4 text-[8px] font-bold text-white rounded-full"
                                        style={{ background: 'var(--brand-rose)' }}
                                    >
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                            <span className="text-[9px] font-semibold uppercase tracking-wider">{link.name}</span>
                        </Link>
                    ))}
                </div>
            </nav>
            <div className="md:hidden h-20" /> {/* Spacer for mobile layout bottom navigation */}
        </>
    );
};

export default Navbar;
