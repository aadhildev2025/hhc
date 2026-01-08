import React, { useState, useEffect } from 'react'; // Git tracking check
import { Link } from 'react-router-dom';
import api from '../api/client';
import ProductCard from '../components/ProductCard';
import { FiArrowRight, FiShield, FiHeart, FiGift } from 'react-icons/fi';
import SEO from '../components/SEO';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, catRes] = await Promise.all([
                    api.get('/products/featured'),
                    api.get('/categories')
                ]);
                setFeaturedProducts(prodRes.data);
                setCategories(catRes.data);
            } catch (error) {
                console.error('Error fetching home data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-20 pb-20">
            <SEO
                title="Home"
                description="Welcome to HomeHeartCreation. Discover handcrafted treasures, wall art, and personalized gifts made with love in Sri Lanka."
            />
            {/* Hero Section */}
            <section className="relative h-[90vh] flex items-center overflow-hidden">
                {/* Abstract Background Elements */}
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-brand-blue/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-brand-pink/20 rounded-full blur-3xl"></div>

                <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
                    <div className="space-y-8 animate-slide-up">
                        <div className="space-y-4">
                            <span className="text-brand-pink-dark font-bold tracking-[0.2em] uppercase text-sm block">Handcrafted with love</span>
                            <h1 className="text-5xl md:text-7xl font-serif text-brand-dark leading-tight">
                                Embrace the Heart of <span className="text-brand-blue-dark">Home</span>
                            </h1>
                            <p className="text-lg text-brand-dark/70 max-w-lg leading-relaxed">
                                Discover a curated collection of handmade treasures that turn a house into a warm, artistic home. Every piece tells a story of creativity and soul.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <Link to="/shop" className="btn-primary flex items-center space-x-2 text-lg px-8 py-4 shadow-lg shadow-brand-pink/20">
                                <span>Shop Collection</span> <FiArrowRight />
                            </Link>
                            <Link to="/about" className="px-8 py-4 border-2 border-brand-blue-dark/20 text-brand-blue-dark rounded-full font-bold hover:bg-brand-blue-dark hover:text-white transition-all duration-300">
                                Our Story
                            </Link>
                        </div>

                        <div className="flex items-center space-x-8 pt-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-brand-dark">500+</div>
                                <div className="text-sm text-brand-dark/50 uppercase tracking-widest">Products</div>
                            </div>
                            <div className="w-[1px] h-10 bg-brand-beige"></div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-brand-dark">1K+</div>
                                <div className="text-sm text-brand-dark/50 uppercase tracking-widest">Happy Homes</div>
                            </div>
                        </div>
                    </div>

                    <div className="relative hidden md:block animate-float">
                        <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl skew-y-2 group">
                            <img
                                src="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=1200"
                                alt="Home Decor Hero"
                                className="w-full h-[600px] object-cover group-hover:scale-105 transition-transform duration-1000"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/40 to-transparent"></div>
                        </div>
                        {/* Decal Image */}
                        <div className="absolute -bottom-10 -left-10 bg-brand-card p-4 rounded-xl shadow-xl z-20 animate-bounce-slow border border-brand-border">
                            <img
                                src="https://images.unsplash.com/photo-1596433809252-260c2745dfdd?auto=format&fit=crop&q=80&w=400"
                                alt="Product Preview"
                                className="w-32 h-32 object-cover rounded-lg"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Grid */}
            <section className="max-w-7xl mx-auto px-6 md:px-12 py-10 animate-slide-up delay-100">
                <div className="text-center space-y-4 mb-16">
                    <h2 className="text-4xl font-serif text-brand-dark">Explore by Category</h2>
                    <div className="h-1 w-20 bg-brand-blue-dark mx-auto"></div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map((cat, index) => (
                        <Link
                            key={cat._id}
                            to={`/shop?category=${cat._id}`}
                            className="group relative h-64 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
                        >
                            <img
                                src={cat.image && cat.image.startsWith('http') ? cat.image : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${cat.image || ''}`}
                                alt={cat.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                onError={(e) => {
                                    e.target.src = 'https://images.unsplash.com/photo-1459231905403-7c5b62859941?auto=format&fit=crop&q=80&w=800';
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-brand-dark/20 to-transparent flex flex-col justify-end p-8">
                                <h3 className="text-2xl font-serif text-white mb-2">{cat.name}</h3>
                                <p className="text-white/80 text-sm opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                    {cat.description}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Featured Products */}
            <section className="bg-brand-card/30 backdrop-blur-sm py-24 animate-slide-up delay-200">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-16 space-y-4">
                        <div className="space-y-4">
                            <span className="text-brand-pink-dark font-bold uppercase tracking-widest text-sm">Our Favorites</span>
                            <h2 className="text-4xl font-serif text-brand-dark">Featured Treasures</h2>
                        </div>
                        <Link to="/shop" className="text-brand-blue-dark font-bold flex items-center space-x-2 group">
                            <span>View All Collection</span>
                            <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredProducts.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Brand Values / Why Us */}
            <section className="max-w-7xl mx-auto px-6 md:px-12 py-10 grid grid-cols-1 md:grid-cols-3 gap-12 text-center animate-slide-up delay-300">
                <div className="space-y-4 p-8 rounded-2xl bg-brand-card shadow-sm border border-brand-border hover:-translate-y-2 transition-all duration-300">
                    <div className="w-16 h-16 bg-brand-pink/20 text-brand-pink-dark rounded-full flex items-center justify-center mx-auto text-3xl">
                        <FiHeart />
                    </div>
                    <h3 className="text-xl font-serif font-bold text-brand-dark">Made with Love</h3>
                    <p className="text-brand-dark/70">Each item is carefully handcrafted with attention to every tiny detail.</p>
                </div>
                <div className="space-y-4 p-8 rounded-2xl bg-brand-card shadow-sm border border-brand-border hover:-translate-y-2 transition-all duration-300">
                    <div className="w-16 h-16 bg-brand-blue/20 text-brand-blue-dark rounded-full flex items-center justify-center mx-auto text-3xl">
                        <FiGift />
                    </div>
                    <h3 className="text-xl font-serif font-bold text-brand-dark">Perfect Gifts</h3>
                    <p className="text-brand-dark/70">Unique gift items that make special occasions even more memorable.</p>
                </div>
                <div className="space-y-4 p-8 rounded-2xl bg-brand-card shadow-sm border border-brand-border hover:-translate-y-2 transition-all duration-300">
                    <div className="w-16 h-16 bg-brand-pink/20 text-brand-pink-dark rounded-full flex items-center justify-center mx-auto text-3xl">
                        <FiShield />
                    </div>
                    <h3 className="text-xl font-serif font-bold text-brand-dark">Trust & Quality</h3>
                    <p className="text-brand-dark/70">We guarantee high-quality materials and durable craftsmanship.</p>
                </div>
            </section>

            {/* Mini About Section */}
            <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 flex flex-col md:flex-row items-center gap-16 animate-slide-up delay-400">
                <div className="w-full md:w-1/2">
                    <img
                        src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=800"
                        alt="About Us"
                        className="rounded-2xl shadow-2xl"
                    />
                </div>
                <div className="w-full md:w-1/2 space-y-8">
                    <h2 className="text-4xl font-serif text-brand-dark leading-tight">Handcrafted with a Vision to <span className="text-brand-pink-dark italic">Inspire</span></h2>
                    <p className="text-lg text-brand-dark/70 leading-relaxed">
                        HomeHeartCreation started as a small dream in a cozy studio. We believe that home is more than just a place—it's a reflection of who you are. Our mission is to fetch local artisans' creativity to your doorstep.
                    </p>
                    <Link to="/about" className="btn-secondary inline-block shadow-lg shadow-brand-blue/20">Learn More About Us</Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
