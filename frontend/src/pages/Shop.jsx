import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/client';
import ProductCard from '../components/ProductCard';
import { FiFilter, FiSearch, FiX } from 'react-icons/fi';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();

    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
    const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const queryParams = new URLSearchParams({
                    search,
                    category: selectedCategory,
                    sort: sortBy
                });

                const [prodRes, catRes] = await Promise.all([
                    api.get(`/products?${queryParams.toString()}`),
                    api.get('/categories')
                ]);

                setProducts(prodRes.data);
                setCategories(catRes.data);
            } catch (error) {
                console.error('Error fetching shop data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [search, selectedCategory, sortBy]);

    const clearFilters = () => {
        setSearch('');
        setSelectedCategory('');
        setSortBy('newest');
        setSearchParams({});
    };

    return (
        <div className="min-h-screen pt-24 pb-20 px-6 md:px-12 bg-brand-offwhite">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-slide-down">
                    <div className="space-y-2">
                        <h1 className="text-4xl md:text-5xl font-serif text-brand-dark">Our Collection</h1>
                        <p className="text-brand-dark/60">Discover unique handmade items for your beautiful home.</p>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="relative flex-grow md:w-64">
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full pl-10 pr-4 py-3 bg-brand-card border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-pink-dark/50 text-brand-dark"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-dark/40" />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`p-3 rounded-xl border transition-all ${showFilters ? 'bg-brand-pink-dark text-white border-brand-pink-dark' : 'border-brand-pink/20 text-brand-dark hover:bg-brand-pink/10'}`}
                        >
                            <FiFilter />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 animate-slide-up delay-100">
                    {/* Sidebar Filters */}
                    <aside className={`lg:w-64 space-y-8 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-brand-dark uppercase tracking-widest text-sm">Categories</h3>
                                {(search || selectedCategory || sortBy !== 'newest') && (
                                    <button onClick={clearFilters} className="text-xs text-brand-pink-dark hover:underline flex items-center">
                                        <FiX className="mr-1" /> Clear
                                    </button>
                                )}
                            </div>
                            <div className="space-y-3">
                                <button
                                    onClick={() => setSelectedCategory('')}
                                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${selectedCategory === '' ? 'bg-brand-pink-dark text-white shadow-md' : 'hover:bg-brand-pink/10 text-brand-dark/70'}`}
                                >
                                    All Categories
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat._id}
                                        onClick={() => setSelectedCategory(cat._id)}
                                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${selectedCategory === cat._id ? 'bg-brand-pink-dark text-white shadow-md' : 'hover:bg-brand-pink/10 text-brand-dark/70'}`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="font-bold text-brand-dark uppercase tracking-widest text-sm">Sort By</h3>
                            <select
                                className="w-full p-3 bg-brand-card border border-brand-border rounded-xl focus:outline-none text-brand-dark"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="newest">Newest First</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                            </select>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-grow">
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="bg-brand-pink/5 rounded-2xl h-96 animate-pulse border border-brand-pink/10"></div>
                                ))}
                            </div>
                        ) : products.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {products.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 space-y-4">
                                <div className="text-5xl text-brand-pink/20">🔍</div>
                                <h3 className="text-2xl font-serif text-brand-dark">No products found</h3>
                                <p className="text-brand-dark/60">Try adjusting your search or filters.</p>
                                <button onClick={clearFilters} className="btn-primary">Clear All Filters</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;
