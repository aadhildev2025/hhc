import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiMail, FiPhone, FiMapPin, FiArrowRight } from 'react-icons/fi';
import { FaWhatsapp, FaFacebook } from 'react-icons/fa';

const Footer = () => {
    const navLinks = [
        { name: 'Our Products', path: '/shop' },
        { name: 'Our Story', path: '/about' },
        { name: 'Contact Us', path: '/contact' },
        { name: 'Featured Items', path: '/shop?featured=true' },
    ];
    const categories = [
        'Wall art', 'Planters', 'Personalized Gifts', 'Event Decor', 'Home Decor', 'Candles'
    ];

    return (
        <footer style={{ background: 'var(--brand-dark)', color: 'rgba(245,237,228,0.75)' }}
            className="pt-20 pb-28 md:pb-12 px-6 md:px-12">
            {/* Top divider accent */}
            <div className="max-w-7xl mx-auto">
                <div className="h-px mb-16 rounded-full"
                    style={{ background: 'linear-gradient(90deg, transparent, var(--brand-rose), var(--brand-sage), transparent)' }} />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="lg:col-span-1 space-y-6">
                        <Link to="/" className="block">
                            <span className="text-2xl font-serif font-semibold" style={{ color: '#FAF5EF' }}>
                                <span style={{ color: 'var(--brand-rose)' }}>Home</span>Heart
                                <span style={{ color: 'var(--brand-muted)', fontWeight: 400 }}> Creation</span>
                            </span>
                        </Link>
                        <p className="text-sm leading-relaxed" style={{ color: 'rgba(245,237,228,0.6)' }}>
                            Spreading love and warmth through handcrafted home décor and unique gift items.
                            Handmade with heart, just for you.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://www.facebook.com/share/1Besh5q7ZA/?mibextid=wwXIfr"
                                target="_blank" rel="noopener noreferrer"
                                className="flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 hover:scale-110"
                                style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(245,237,228,0.7)' }}
                                onMouseEnter={e => { e.currentTarget.style.background = '#1877F2'; e.currentTarget.style.color = '#fff'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(245,237,228,0.7)'; }}>
                                <FaFacebook size={18} />
                            </a>
                            <a href="https://www.instagram.com/homeheartcreation/?igsh=Y3RydDRhbmVkdzhv#"
                                target="_blank" rel="noopener noreferrer"
                                className="flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 hover:scale-110"
                                style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(245,237,228,0.7)' }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'var(--brand-rose)'; e.currentTarget.style.color = '#fff'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(245,237,228,0.7)'; }}>
                                <FiInstagram size={18} />
                            </a>
                            <a href="https://wa.me/94760601163?text=Hello%20HomeHeartCreation"
                                target="_blank" rel="noopener noreferrer"
                                className="flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 hover:scale-110"
                                style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(245,237,228,0.7)' }}
                                onMouseEnter={e => { e.currentTarget.style.background = '#25D366'; e.currentTarget.style.color = '#fff'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(245,237,228,0.7)'; }}>
                                <FaWhatsapp size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-sm uppercase tracking-widest mb-6"
                            style={{ color: 'var(--brand-rose)' }}>Quick Links</h3>
                        <ul className="space-y-3">
                            {navLinks.map(link => (
                                <li key={link.name}>
                                    <Link to={link.path}
                                        className="flex items-center gap-2 text-sm transition-all duration-200 group"
                                        style={{ color: 'rgba(245,237,228,0.6)' }}
                                        onMouseEnter={e => e.currentTarget.style.color = 'var(--brand-rose-light)'}
                                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(245,237,228,0.6)'}>
                                        <FiArrowRight size={12} className="opacity-0 group-hover:opacity-100 -ml-3 group-hover:ml-0 transition-all duration-200" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="font-semibold text-sm uppercase tracking-widest mb-6"
                            style={{ color: 'var(--brand-sage)' }}>Categories</h3>
                        <ul className="space-y-3">
                            {categories.map(cat => (
                                <li key={cat}>
                                    <Link to={`/shop?category=${cat}`}
                                        className="text-sm transition-all duration-200"
                                        style={{ color: 'rgba(245,237,228,0.6)' }}
                                        onMouseEnter={e => e.currentTarget.style.color = 'var(--brand-sage-light)'}
                                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(245,237,228,0.6)'}>
                                        {cat}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold text-sm uppercase tracking-widest mb-6"
                            style={{ color: '#FAF5EF' }}>Reach Us</h3>
                        <div className="space-y-5">
                            <div className="flex items-start gap-3">
                                <FiMapPin className="mt-0.5 shrink-0" style={{ color: 'var(--brand-rose)' }} />
                                <span className="text-sm leading-relaxed" style={{ color: 'rgba(245,237,228,0.6)' }}>
                                    173/B Madurankuliya<br />Puttalam, Sri Lanka
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <FiPhone className="shrink-0" style={{ color: 'var(--brand-rose)' }} />
                                <a href="tel:+94760601163" className="text-sm transition-colors"
                                    style={{ color: 'rgba(245,237,228,0.6)' }}
                                    onMouseEnter={e => e.currentTarget.style.color = 'var(--brand-rose-light)'}
                                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(245,237,228,0.6)'}>
                                    +94 76 060 1163
                                </a>
                            </div>
                            <div className="flex items-center gap-3">
                                <FiMail className="shrink-0" style={{ color: 'var(--brand-rose)' }} />
                                <a href="mailto:hello@homeheartcreation.com" className="text-sm transition-colors"
                                    style={{ color: 'rgba(245,237,228,0.6)' }}
                                    onMouseEnter={e => e.currentTarget.style.color = 'var(--brand-rose-light)'}
                                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(245,237,228,0.6)'}>
                                    hello@homeheartcreation.com
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-xs" style={{ color: 'rgba(245,237,228,0.35)' }}>
                        © 2026 HomeHeartCreation. All rights reserved.
                    </p>
                    <p className="text-xs flex items-center gap-1" style={{ color: 'rgba(245,237,228,0.35)' }}>
                        Crafted with <span style={{ color: 'var(--brand-rose)' }}>♥</span> in Sri Lanka
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
