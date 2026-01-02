import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-brand-card pt-16 pb-24 md:pb-8 px-6 md:px-12 border-t border-brand-border">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                {/* Brand Section */}
                <div className="space-y-6">
                    <Link to="/" className="text-3xl font-serif font-bold tracking-tighter block mb-6">
                        <span className="text-brand-pink-dark">Home</span>
                        <span className="text-brand-blue-dark">Heart</span>
                        <span className="text-brand-pink-dark/50">Creation</span>
                    </Link>
                    <p className="text-brand-dark/70 leading-relaxed">
                        Spreading love and warmth through handcrafted home décor and unique gift items. Handmade with heart, just for you.
                    </p>
                    <div className="flex space-x-5 text-2xl">
                        <a href="#" className="text-brand-dark/60 hover:text-brand-pink-dark transition-all duration-300 hover:scale-110"><FiInstagram /></a>
                        <a href="https://wa.me/+94771234567" target="_blank" rel="noopener noreferrer" className="text-brand-dark/60 hover:text-green-500 transition-all duration-300 hover:scale-110"><FaWhatsapp /></a>
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-lg font-bold mb-6 text-brand-dark">Quick Links</h3>
                    <ul className="space-y-4 text-brand-dark/70">
                        <li><Link to="/shop" className="hover:text-brand-pink-dark transition-colors">Our Products</Link></li>
                        <li><Link to="/about" className="hover:text-brand-pink-dark transition-colors">Our Story</Link></li>
                        <li><Link to="/contact" className="hover:text-brand-pink-dark transition-colors">Contact Us</Link></li>
                        <li><Link to="/shop?featured=true" className="hover:text-brand-pink-dark transition-colors">Featured Items</Link></li>
                    </ul>
                </div>

                {/* Categories */}
                <div>
                    <h3 className="text-lg font-bold mb-6 text-brand-dark">Categories</h3>
                    <ul className="space-y-4 text-brand-dark/70">
                        <li><Link to="/shop?category=Home Decor" className="hover:text-brand-pink-dark transition-colors">Home Decor</Link></li>
                        <li><Link to="/shop?category=Wall Art" className="hover:text-brand-pink-dark transition-colors">Wall Art</Link></li>
                        <li><Link to="/shop?category=Handmade Gifts" className="hover:text-brand-pink-dark transition-colors">Handmade Gifts</Link></li>
                        <li><Link to="/shop?category=Candles" className="hover:text-brand-pink-dark transition-colors">Candles</Link></li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold mb-6 text-brand-dark">Reach Us</h3>
                    <div className="flex items-start space-x-3 text-brand-dark/70">
                        <FiMapPin className="mt-1 text-brand-pink-dark" />
                        <span>123 Creative Lane, Artisan Village, Colombo 07, Sri Lanka</span>
                    </div>
                    <div className="flex items-center space-x-3 text-brand-dark/70">
                        <FiPhone className="text-brand-pink-dark" />
                        <span>+94 77 123 4567</span>
                    </div>
                    <div className="flex items-center space-x-3 text-brand-dark/70">
                        <FiMail className="text-brand-pink-dark" />
                        <span>hello@homeheartcreation.com</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-brand-pink/10 text-center text-brand-dark/50 text-sm">
                <p>© 2026 HomeHeartCreation. All rights reserved. Crafted with love.</p>
            </div>
        </footer>
    );
};

export default Footer;
