import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import ProductCard from '../components/ProductCard';
import { FiArrowRight, FiShield, FiHeart, FiGift, FiTruck, FiChevronDown } from 'react-icons/fi';
import SEO from '../components/SEO';

const useReveal = (dependency) => {
    useEffect(() => {
        const targets = document.querySelectorAll('.reveal');
        const io = new IntersectionObserver(
            (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); } }),
            { threshold: 0.05 }
        );
        targets.forEach(t => io.observe(t));
        return () => io.disconnect();
    }, [dependency]);
};

const tickerItems = [
    '✦ 500+ Handcrafted Products', '✦ 1,000+ Happy Homes',
    '✦ Made in Sri Lanka', '✦ Ships Island-Wide',
    '✦ Unique Personalized Gifts', '✦ Cash on Delivery',
];

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    useReveal(loading);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, catRes] = await Promise.all([api.get('/products/featured'), api.get('/categories')]);
                setFeaturedProducts(prodRes.data);
                setCategories(catRes.data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchData();
    }, []);

    const values = [
        { icon: <FiHeart />, label: 'Made with Love', desc: 'Each piece is carefully handcrafted with attention to every tiny detail.' },
        { icon: <FiGift />, label: 'Perfect Gifts', desc: 'Unique items that make special occasions truly memorable.' },
        { icon: <FiShield />, label: 'Trust & Quality', desc: 'Premium natural materials and durable artisan craftsmanship.' },
        { icon: <FiTruck />, label: 'Island-Wide Delivery', desc: 'We deliver to your doorstep across all of Sri Lanka.' },
    ];

    return (
        <div style={{ overflowX: 'hidden' }}>
            <SEO title="Home" description="Welcome to HomeHeartCreation. Discover handcrafted treasures, wall art, and personalized gifts made with love in Sri Lanka." />

            {/* HERO */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img src="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=1800" alt="Hero" className="w-full h-full object-cover" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(28,20,16,0.78) 0%, rgba(28,20,16,0.35) 60%, rgba(201,123,94,0.15) 100%)' }} />
                </div>
                <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-28 pb-24 w-full">
                    <div className="max-w-2xl animate-slide-up">
                        <span className="section-label mb-4 block" style={{ color: 'var(--brand-rose-light)' }}>Handcrafted with Love · Sri Lanka</span>
                        <h1 className="font-serif text-white mb-6" style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', lineHeight: 1.05, fontWeight: 600 }}>
                            Embrace the&nbsp;<span style={{ color: 'var(--brand-rose-light)', fontStyle: 'italic' }}>Heart</span><br />of Home
                        </h1>
                        <p className="text-lg mb-10 max-w-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.78)' }}>
                            Discover a curated collection of handmade treasures that turn a house into a warm, artistic home. Every piece tells a story of creativity and soul.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/shop" className="btn-primary px-8 py-4" style={{ fontSize: '1rem' }}>
                                Shop Collection <FiArrowRight />
                            </Link>
                            <Link to="/about" className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-base border transition-all duration-300"
                                style={{ borderColor: 'rgba(255,255,255,0.35)', color: '#fff', background: 'rgba(255,255,255,0.08)' }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}>
                                Our Story
                            </Link>
                        </div>
                        <div className="flex gap-10 mt-14">
                            {[['500+', 'Products'], ['1K+', 'Happy Homes'], ['100%', 'Handmade']].map(([num, label]) => (
                                <div key={label}>
                                    <div className="text-3xl font-serif font-bold text-white">{num}</div>
                                    <div className="text-xs uppercase tracking-widest mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    <span className="text-[10px] uppercase tracking-widest">Scroll</span>
                    <FiChevronDown size={16} />
                </div>
            </section>

            {/* TICKER */}
            <div className="py-3 overflow-hidden" style={{ background: 'var(--brand-rose)', color: '#fff' }}>
                <div className="animate-marquee">
                    {[...tickerItems, ...tickerItems].map((item, i) => (
                        <span key={i} className="inline-flex items-center gap-8 px-8 text-sm font-medium tracking-wide whitespace-nowrap">{item}</span>
                    ))}
                </div>
            </div>

            {/* CATEGORIES */}
            <section className="max-w-7xl mx-auto px-6 md:px-12 py-24">
                <div className="text-center mb-14 reveal">
                    <span className="section-label">Browse by Category</span>
                    <h2 className="section-title mt-3">Explore Our Collections</h2>
                    <div className="divider-rose mx-auto mt-4" />
                </div>
                {loading ? (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">{[...Array(6)].map((_, i) => <div key={i} className="h-64 rounded-2xl shimmer" />)}</div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((cat, index) => (
                            <Link key={cat._id} to={`/shop?category=${cat._id}`}
                                className={`reveal group relative overflow-hidden rounded-2xl ${index === 0 ? 'lg:row-span-2' : ''}`}
                                style={{ height: index === 0 ? undefined : '200px', minHeight: index === 0 ? '424px' : undefined, animationDelay: `${index * 80}ms` }}>
                                <img src={cat.image?.startsWith('http') ? cat.image : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${cat.image || ''}`}
                                    alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1459231905403-7c5b62859941?w=800&q=80'; }} />
                                <div className="absolute inset-0 flex flex-col justify-end p-6" style={{ background: 'linear-gradient(to top, rgba(28,20,16,0.75) 0%, transparent 60%)' }}>
                                    <h3 className="font-serif text-white font-semibold" style={{ fontSize: index === 0 ? '1.5rem' : '1.1rem' }}>{cat.name}</h3>
                                    <p className="text-xs mt-1 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300" style={{ color: 'rgba(255,255,255,0.75)' }}>{cat.description}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            {/* FEATURED PRODUCTS */}
            <section className="py-24" style={{ background: 'var(--brand-linen)' }}>
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 reveal">
                        <div>
                            <span className="section-label">Our Favorites</span>
                            <h2 className="section-title mt-2">Featured Treasures</h2>
                        </div>
                        <Link to="/shop" className="inline-flex items-center gap-2 font-semibold text-sm transition-all group" style={{ color: 'var(--brand-rose)' }}>
                            View All Collection <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">{[...Array(4)].map((_, i) => <div key={i} className="h-80 rounded-2xl shimmer" />)}</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuredProducts.map((p, i) => (
                                <div key={p._id} className="reveal" style={{ animationDelay: `${i * 80}ms` }}><ProductCard product={p} /></div>
                            ))}
                        </div>
                    )}
                    <div className="text-center mt-12 reveal"><Link to="/shop" className="btn-outline px-10">Browse All Products</Link></div>
                </div>
            </section>

            {/* VALUES */}
            <section className="max-w-7xl mx-auto px-6 md:px-12 py-24">
                <div className="text-center mb-14 reveal">
                    <span className="section-label">Why Choose Us</span>
                    <h2 className="section-title mt-3">Crafted with Purpose</h2>
                    <div className="divider-rose mx-auto mt-4" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {values.map((v, i) => (
                        <div key={i} className="reveal glass-card p-8 flex flex-col items-center text-center gap-4"
                            style={{ animationDelay: `${i * 100}ms`, transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 48px rgba(28,20,16,0.1)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all duration-300" style={{ background: 'rgba(201,123,94,0.1)', color: 'var(--brand-rose)' }}>{v.icon}</div>
                            <h3 className="font-serif font-semibold text-lg" style={{ color: 'var(--brand-dark)' }}>{v.label}</h3>
                            <p className="text-sm leading-relaxed" style={{ color: 'var(--brand-muted)' }}>{v.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ABOUT SPLIT */}
            <section className="py-24" style={{ background: 'var(--brand-linen)' }}>
                <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center gap-16">
                    <div className="w-full lg:w-1/2 reveal relative">
                        <img src="https://images.unsplash.com/photo-1601579112934-17ac2aa86292?auto=format&fit=crop&q=80&w=800" alt="Artisan" className="rounded-3xl w-full h-[440px] object-cover shadow-2xl" />
                        <div className="absolute -bottom-6 right-4 glass-card px-6 py-4 shadow-xl hidden md:block">
                            <p className="font-serif italic text-base" style={{ color: 'var(--brand-rose)' }}>"Crafting warmth since 2025"</p>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2 reveal">
                        <span className="section-label">Our Story</span>
                        <h2 className="section-title mt-3 mb-6">Handcrafted with a Vision to <span style={{ color: 'var(--brand-rose)', fontStyle: 'italic' }}>Inspire</span></h2>
                        <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--brand-muted)' }}>HomeHeartCreation started as a small dream in a cozy studio. We believe that home is more than just a place — it's a reflection of who you are.</p>
                        <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--brand-muted)' }}>Our mission is to bring local artisans' creativity to your doorstep — each piece made with intention, care, and a whole lot of love.</p>
                        <Link to="/about" className="btn-primary px-8">Learn More About Us</Link>
                    </div>
                </div>
            </section>

            {/* WHATSAPP CTA */}
            <section className="py-20 px-6 text-center" style={{ background: 'linear-gradient(135deg, var(--brand-rose) 0%, var(--brand-rose-dark) 100%)' }}>
                <div className="max-w-2xl mx-auto reveal">
                    <h2 className="font-serif text-white font-semibold mb-4" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>Have a Custom Order in Mind?</h2>
                    <p className="mb-8 text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.82)' }}>Chat with us directly on WhatsApp. We'd love to create something special just for you.</p>
                    <a href="https://wa.me/94760601163?text=Hello%20HomeHeartCreation" target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-bold text-base transition-all duration-300"
                        style={{ background: '#fff', color: 'var(--brand-rose)' }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,0,0,0.18)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                        Chat on WhatsApp
                    </a>
                </div>
            </section>
        </div>
    );
};

export default Home;
