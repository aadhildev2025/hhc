import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiEye } from 'react-icons/fi';
import { useCart } from '../context/CartContext.jsx';
import { toast } from 'react-hot-toast';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (product.stock <= 0) {
            toast.error('Sorry, this item is out of stock!');
            return;
        }
        addToCart(product);
        toast.success(`${product.name} added to cart!`);
    };

    return (
        <div className="group bg-brand-card backdrop-blur-sm rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-brand-border">
            <Link to={`/product/${product._id}`} className="block relative aspect-square overflow-hidden bg-brand-beige/30">
                <img
                    src={product.image.startsWith('http') ? product.image : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${product.image}`}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />

                {/* Quick Actions Overlay */}
                <div className="absolute inset-0 bg-brand-dark/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
                    <button
                        className="p-3 bg-white rounded-full text-brand-dark hover:bg-brand-blue-dark hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300"
                        onClick={(e) => { e.preventDefault(); /* Open quick view */ }}
                    >
                        <FiEye />
                    </button>
                    <button
                        className="p-3 bg-white rounded-full text-brand-dark hover:bg-brand-pink-dark hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75"
                        onClick={handleAddToCart}
                    >
                        <FiShoppingCart />
                    </button>
                    <button
                        className="p-3 bg-white rounded-full text-brand-dark hover:bg-brand-blue-dark hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 delay-150"
                    >
                        <FiHeart />
                    </button>
                </div>

                {/* Badge */}
                {product.featured && (
                    <div className="absolute top-4 left-4 bg-brand-pink-dark/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        Featured
                    </div>
                )}
            </Link>

            <div className="p-5 space-y-2">
                <Link to={`/product/${product._id}`} className="block">
                    <h3 className="text-lg font-serif font-semibold text-brand-dark group-hover:text-brand-pink-dark transition-colors truncate">
                        {product.name}
                    </h3>
                </Link>
                <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-brand-blue-dark">Rs. {product.price.toLocaleString()}</span>
                    <div className="flex items-center text-xs text-brand-dark/50">
                        <span className="text-brand-pink-dark mr-1">★</span> {product.rating > 0 ? product.rating.toFixed(1) : 'New'}
                    </div>
                </div>
                <p className="text-sm text-brand-dark/60 line-clamp-2 leading-relaxed">
                    {product.description}
                </p>
            </div>
        </div>
    );
};

export default ProductCard;
