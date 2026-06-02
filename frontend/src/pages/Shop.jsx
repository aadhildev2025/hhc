import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/client';
import ProductCard from '../components/ProductCard';
import { FiFilter, FiSearch, FiX, FiChevronDown } from 'react-icons/fi';
import SEO from '../components/SEO';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
    const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
    const [showFilters, setShowFilters] = useState(false);
    const [sortOpen, setSortOpen] = useState(false);
    const [debouncedSearch, setDebouncedSearch] = useState(search);

    const sortOptions = [
        { id: 'newest', label: 'Newest First' },
        { id: 'price-asc', label: 'Price: Low to High' },
        { id: 'price-desc', label: 'Price: High to Low' },
    ];

    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(search), 400);
        return () => clearTimeout(t);
    }, [search]);

    useEffect(() => {
        const p = searchParams.get('search') || '';
        const c = searchParams.get('category') || '';
        const s = searchParams.get('sort') || 'newest';
        if (p !== search) setSearch(p);
        if (c !== selectedCategory) setSelectedCategory(c);
        if (s !== sortBy) setSortBy(s);
        window.scrollTo(0, 0);
    }, [searchParams]);

    useEffect(() => {
        const params = {};
        if (debouncedSearch) params.search = debouncedSearch;
        if (selectedCategory) params.category = selectedCategory;
        if (sortBy !== 'newest') params.sort = sortBy;
        setSearchParams(params, { replace: true });
    }, [debouncedSearch, selectedCategory, sortBy]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const q = new URLSearchParams({ search: debouncedSearch, category: selectedCategory, sort: sortBy });
                const [prodRes, catRes] = await Promise.all([api.get(`/products?${q}`), api.get('/categories')]);
                setProducts(prodRes.data?.products ?? prodRes.data);
                setCategories(catRes.data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchData();
    }, [debouncedSearch, selectedCategory, sortBy]);

    const clearFilters = () => setSearchParams({});
    const hasFilters = search || selectedCategory || sortBy !== 'newest';

    return (
        <div className="min-h-screen" style={{ background: 'var(--brand-cream)', paddingTop: '5rem' }}>
            <SEO title="Shop All" description="Browse our wide collection of handmade wall art, planters, and personalized gifts." url="/shop" />

            {/* Page Header */}
            <div className="py-16 px-6 md:px-12" style={{ background: 'var(--brand-linen)', borderBottom: '1px solid var(--brand-border)' }}>
                <div className="max-w-7xl mx-auto">
                    <span className="section-label">All Products</span>
                    <h1 className="section-title mt-2">Our Collection</h1>
                    <p className="mt-3 text-sm" style={{ color: 'var(--brand-muted)' }}>Discover unique handmade items for your beautiful home.</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
                {/* Search + filter bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
                    <div className="relative flex-grow max-w-md">
                        <input type="text" placeholder="Search products…" value={search} onChange={e => setSearch(e.target.value)}
                            className="input-base pl-10 pr-4 w-full" />
                        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--brand-muted)' }} />
                        {search && (
                            <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--brand-muted)' }}>
                                <FiX size={14} />
                            </button>
                        )}
                    </div>
                    <button onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 px-4 py-3 rounded-xl border font-medium text-sm transition-all duration-200 sm:w-auto w-full justify-center"
                        style={{
                            borderColor: showFilters ? 'var(--brand-rose)' : 'var(--brand-border)',
                            background: showFilters ? 'var(--brand-rose)' : 'var(--brand-card-bg)',
                            color: showFilters ? '#fff' : 'var(--brand-dark)',
                        }}>
                        <FiFilter size={15} /> {showFilters ? 'Hide Filters' : 'Filter & Sort'}
                    </button>
                    {hasFilters && (
                        <button onClick={clearFilters} className="flex items-center gap-1.5 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                            style={{ color: 'var(--brand-rose)', background: 'rgba(201,123,94,0.08)' }}>
                            <FiX size={14} /> Clear All
                        </button>
                    )}
                </div>

                {/* Active filter chips */}
                {hasFilters && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {search && (
                            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                                style={{ background: 'rgba(201,123,94,0.12)', color: 'var(--brand-rose)' }}>
                                "{search}" <button onClick={() => setSearch('')}><FiX size={10} /></button>
                            </span>
                        )}
                        {selectedCategory && categories.find(c => c._id === selectedCategory) && (
                            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                                style={{ background: 'rgba(107,143,126,0.12)', color: 'var(--brand-sage)' }}>
                                {categories.find(c => c._id === selectedCategory)?.name}
                                <button onClick={() => setSelectedCategory('')}><FiX size={10} /></button>
                            </span>
                        )}
                        {sortBy !== 'newest' && (
                            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                                style={{ background: 'rgba(201,163,76,0.12)', color: 'var(--brand-gold)' }}>
                                {sortOptions.find(o => o.id === sortBy)?.label}
                                <button onClick={() => setSortBy('newest')}><FiX size={10} /></button>
                            </span>
                        )}
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* SIDEBAR */}
                    <aside className={`${showFilters ? 'block' : 'hidden lg:block'} lg:w-60 shrink-0 space-y-8`}>
                        {/* Categories */}
                        <div>
                            <h3 className="font-semibold text-xs uppercase tracking-widest mb-4" style={{ color: 'var(--brand-muted)' }}>Categories</h3>
                            <div className="space-y-1">
                                <button onClick={() => setSelectedCategory('')}
                                    className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                                    style={{ background: !selectedCategory ? 'var(--brand-rose)' : 'transparent', color: !selectedCategory ? '#fff' : 'var(--brand-muted)' }}>
                                    All Categories
                                </button>
                                {categories.map(cat => (
                                    <button key={cat._id} onClick={() => setSelectedCategory(cat._id)}
                                        className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                                        style={{ background: selectedCategory === cat._id ? 'var(--brand-rose)' : 'transparent', color: selectedCategory === cat._id ? '#fff' : 'var(--brand-muted)' }}
                                        onMouseEnter={e => { if (selectedCategory !== cat._id) e.currentTarget.style.background = 'rgba(201,123,94,0.08)'; }}
                                        onMouseLeave={e => { if (selectedCategory !== cat._id) e.currentTarget.style.background = 'transparent'; }}>
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {/* Sort */}
                        <div>
                            <h3 className="font-semibold text-xs uppercase tracking-widest mb-4" style={{ color: 'var(--brand-muted)' }}>Sort By</h3>
                            <div className="relative">
                                <button onClick={() => setSortOpen(!sortOpen)}
                                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-medium transition-all"
                                    style={{ background: 'var(--brand-card-bg)', borderColor: 'var(--brand-border)', color: 'var(--brand-dark)' }}>
                                    <span>{sortOptions.find(o => o.id === sortBy)?.label}</span>
                                    <FiChevronDown className={`transition-transform duration-300 ${sortOpen ? 'rotate-180' : ''}`} style={{ color: 'var(--brand-rose)' }} />
                                </button>
                                {sortOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
                                        <div className="absolute top-full left-0 w-full mt-2 rounded-xl border shadow-xl z-20 overflow-hidden py-1"
                                            style={{ background: 'var(--brand-card-bg)', borderColor: 'var(--brand-border)', backdropFilter: 'blur(12px)' }}>
                                            {sortOptions.map(opt => (
                                                <button key={opt.id} onClick={() => { setSortBy(opt.id); setSortOpen(false); }}
                                                    className="w-full text-left px-4 py-3 text-sm transition-all"
                                                    style={{ color: sortBy === opt.id ? 'var(--brand-rose)' : 'var(--brand-muted)', fontWeight: sortBy === opt.id ? 600 : 400 }}
                                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,123,94,0.06)'}
                                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </aside>

                    {/* GRID */}
                    <div className="flex-grow">
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => <div key={i} className="h-80 rounded-2xl shimmer" />)}
                            </div>
                        ) : products.length > 0 ? (
                            <>
                                <p className="text-sm mb-6" style={{ color: 'var(--brand-muted)' }}>{products.length} product{products.length !== 1 ? 's' : ''} found</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {products.map(p => <ProductCard key={p._id} product={p} />)}
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-24 space-y-4">
                                <div className="text-6xl">🔍</div>
                                <h3 className="section-title" style={{ fontSize: '1.8rem' }}>No products found</h3>
                                <p className="text-sm" style={{ color: 'var(--brand-muted)' }}>Try adjusting your search or filters.</p>
                                <button onClick={clearFilters} className="btn-primary mt-4">Clear All Filters</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;
