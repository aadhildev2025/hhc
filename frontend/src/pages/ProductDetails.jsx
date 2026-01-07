import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useCart } from '../context/CartContext.jsx';
import { FiShoppingCart, FiHeart, FiArrowLeft, FiTruck, FiRefreshCw, FiShield, FiStar, FiEdit3 } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import ReviewModal from '../components/ReviewModal';
import SEO from '../components/SEO';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState('');
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

    const fetchProduct = async () => {
        try {
            const { data } = await api.get(`/products/${id}`);
            setProduct(data);
            setActiveImage(data.image);
        } catch (error) {
            console.error('Error fetching product:', error);
            toast.error('Product not found');
            navigate('/shop');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [id, navigate]);

    const handleAddToCart = () => {
        if (product.stock <= 0) {
            toast.error('Sorry, this item is out of stock!');
            return;
        }
        addToCart(product, quantity);
        toast.success(`${product.name} added to cart!`);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center pt-20"><div className="w-12 h-12 border-4 border-brand-pink-dark border-t-transparent rounded-full animate-spin"></div></div>;
    if (!product) return null;

    return (
        <div className="min-h-screen pt-28 pb-20 px-6 md:px-12 bg-brand-offwhite">
            <SEO
                title={product.name}
                description={product.description}
                image={product.image.startsWith('http') ? product.image : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${product.image}`}
                url={`/product/${product._id}`}
                type="product"
            />
            <div className="max-w-7xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 text-brand-dark/60 hover:text-brand-pink-dark mb-8 transition-all animate-slide-down"
                >
                    <FiArrowLeft /> <span>Back to products</span>
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    {/* Images Gallery */}
                    <div className="space-y-6 animate-slide-up delay-100">
                        <div className="aspect-square rounded-3xl overflow-hidden bg-brand-card border border-brand-border">
                            <img
                                src={activeImage.startsWith('http') ? activeImage : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${activeImage}`}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {product.images && product.images.length > 1 && (
                            <div className="grid grid-cols-5 gap-4">
                                {product.images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImage(img)}
                                        className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-brand-pink-dark scale-95 shadow-lg' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                    >
                                        <img
                                            src={img.startsWith('http') ? img : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${img}`}
                                            alt={`View ${i}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info Details */}
                    <div className="space-y-8 animate-slide-up delay-200">
                        <div className="space-y-4">
                            <span className="text-brand-pink-dark font-bold uppercase tracking-widest text-xs px-3 py-1 bg-brand-pink/20 rounded-full inline-block">
                                {product.category?.name || 'Handmade'}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-serif text-brand-dark">{product.name}</h1>
                            <div className="flex items-center space-x-4">
                                <span className="text-3xl font-bold text-brand-blue-dark">LKR {product.price.toLocaleString()}</span>
                                <div className="flex items-center text-sm text-brand-dark/40">
                                    <span className="text-brand-pink-dark mr-1 text-lg">★</span>
                                    <span className="font-bold text-brand-dark mr-1">
                                        {product.rating > 0 ? product.rating.toFixed(1) : 'New'}
                                    </span>
                                    ({product.numReviews || 0} reviews)
                                </div>
                            </div>
                        </div>

                        <p className="text-lg text-brand-dark/70 leading-relaxed border-b border-brand-beige pb-8">
                            {product.description}
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-center space-x-6">
                                <div className="flex items-center bg-brand-card border border-brand-border rounded-xl overflow-hidden h-14">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-6 h-full hover:bg-brand-pink/10 transition-colors text-xl"
                                    >
                                        -
                                    </button>
                                    <span className="px-6 font-bold text-brand-dark text-lg">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        className="px-6 h-full hover:bg-brand-pink/10 transition-colors text-xl"
                                    >
                                        +
                                    </button>
                                </div>
                                <div className="text-sm font-medium text-brand-dark/60">
                                    {product.stock > 0 ? (
                                        <span className="text-brand-pink-dark">In Stock ({product.stock} available)</span>
                                    ) : (
                                        <span className="text-red-400">Out of Stock</span>
                                    )}
                                </div>
                            </div>

                            <div className="flex space-x-4">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={product.stock <= 0}
                                    className="flex-grow btn-primary h-14 flex items-center justify-center space-x-3 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <FiShoppingCart /> <span>Add to Cart</span>
                                </button>
                                <button className="w-14 h-14 rounded-xl border border-brand-pink/10 flex items-center justify-center text-xl text-brand-dark/60 hover:text-brand-pink-dark hover:border-brand-pink-dark transition-all">
                                    <FiHeart />
                                </button>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-8 border-t border-brand-border">
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-brand-card rounded-lg flex items-center justify-center text-brand-pink-dark text-xl border border-brand-border"><FiTruck /></div>
                                <div>
                                    <h4 className="text-sm font-bold text-brand-dark">Fast Delivery</h4>
                                    <p className="text-xs text-brand-dark/50">Within 3-5 business days</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-brand-card rounded-lg flex items-center justify-center text-brand-pink-dark text-xl border border-brand-border"><FiRefreshCw /></div>
                                <div>
                                    <h4 className="text-sm font-bold text-brand-dark">Easy Returns</h4>
                                    <p className="text-xs text-brand-dark/50">Return within 7 days</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-brand-card rounded-lg flex items-center justify-center text-brand-pink-dark text-xl border border-brand-border"><FiShield /></div>
                                <div>
                                    <h4 className="text-sm font-bold text-brand-dark">Secure Shopping</h4>
                                    <p className="text-xs text-brand-dark/50">100% safe checkout</p>
                                </div>
                            </div>
                        </div>

                        {/* Reviews Section */}
                        <div className="pt-12 border-t border-brand-border space-y-8">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-serif text-brand-dark">Customer Reviews</h3>
                                <button
                                    onClick={() => setIsReviewModalOpen(true)}
                                    className="flex items-center space-x-2 text-brand-pink-dark font-bold hover:bg-brand-pink/10 px-4 py-2 rounded-xl transition-all"
                                >
                                    <FiEdit3 /> <span>Write a Review</span>
                                </button>
                            </div>

                            {product.reviews && product.reviews.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {product.reviews.map((review, i) => (
                                        <div key={i} className="p-6 bg-white/40 backdrop-blur-md rounded-2xl border border-brand-pink/10 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-bold text-brand-dark">{review.name}</h4>
                                                <div className="flex text-brand-pink-dark text-xs">
                                                    {[...Array(5)].map((_, i) => (
                                                        <FiStar key={i} className={i < review.rating ? 'fill-brand-pink-dark' : 'text-brand-dark/10'} />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-sm text-brand-dark/70 leading-relaxed italic">
                                                "{review.comment}"
                                            </p>
                                            <p className="text-[10px] text-brand-dark/30 uppercase tracking-widest font-bold">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-12 text-center bg-brand-pink/5 rounded-3xl border border-brand-pink/10 border-dashed">
                                    <p className="text-brand-dark/40 mb-4 italic">No reviews yet. Be the first to share your thoughts!</p>
                                    <button
                                        onClick={() => setIsReviewModalOpen(true)}
                                        className="text-brand-pink-dark font-bold hover:underline"
                                    >
                                        Leave a review
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <ReviewModal
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                productId={product._id}
                onReviewAdded={fetchProduct}
            />
        </div>
    );
};

export default ProductDetails;
