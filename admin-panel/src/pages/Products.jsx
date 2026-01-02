import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiImage, FiX } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        featured: false
    });
    const [imageFiles, setImageFiles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [prodRes, catRes] = await Promise.all([
                api.get('/products'),
                api.get('/categories')
            ]);
            setProducts(prodRes.data);
            setCategories(catRes.data);
        } catch (error) {
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category._id || product.category,
                stock: product.stock,
                featured: product.featured
            });
        } else {
            setEditingProduct(null);
            setFormData({ name: '', description: '', price: '', category: '', stock: '', featured: false });
        }
        setImageFiles([]);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (product) => {
        setProductToDelete(product);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!productToDelete) return;
        try {
            await api.delete(`/products/${productToDelete._id}`);
            toast.success('Product removed with love');
            fetchData();
            setIsDeleteModalOpen(false);
        } catch (error) {
            toast.error('Failed to remove product');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        Array.from(imageFiles).forEach(file => data.append('images', file));

        try {
            if (editingProduct) {
                await api.put(`/products/${editingProduct._id}`, data);
                toast.success('Product updated');
            } else {
                await api.post('/products', data);
                toast.success('Product created');
            }
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            toast.error('Operation failed');
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.category?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2 md:px-0">
                <div className="space-y-1">
                    <h1 className="text-2xl md:text-3xl font-serif text-brand-dark">Manage Products</h1>
                    <p className="text-brand-dark/50 text-xs md:text-sm">Update and organize your inventory heartbeat.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="btn-primary flex items-center justify-center space-x-2 bg-brand-pink-dark hover:bg-brand-pink-dark/90 shadow-brand-pink/20 py-4 md:py-3"
                >
                    <FiPlus /> <span>Add New Treasure</span>
                </button>
            </div>

            <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] shadow-sm border border-brand-pink/10 overflow-hidden">
                <div className="p-8 border-b border-brand-pink/10 bg-brand-pink/5">
                    <div className="relative max-w-md">
                        <input
                            type="text" placeholder="Search inventory..."
                            className="w-full pl-12 pr-4 py-3 bg-white/60 border border-brand-pink/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-pink-dark/50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/30 text-xl" />
                    </div>
                </div>

                {/* Desktop View Table */}
                <div className="hidden md:block overflow-x-auto no-scrollbar">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-brand-pink/10 text-[10px] md:text-xs text-brand-dark/40 uppercase tracking-widest bg-brand-pink/5">
                                <th className="px-4 md:px-8 py-5 font-bold">Product</th>
                                <th className="px-4 md:px-8 py-5 font-bold">Category</th>
                                <th className="px-4 md:px-8 py-5 font-bold">Price</th>
                                <th className="px-4 md:px-8 py-5 font-bold text-center">Stock</th>
                                <th className="px-4 md:px-8 py-5 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-pink/10">
                            {filteredProducts.map((p) => (
                                <tr key={p._id} className="hover:bg-brand-pink/5 transition-colors group">
                                    <td className="px-4 md:px-8 py-6">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 md:w-14 md:h-14 shrink-0 rounded-xl overflow-hidden bg-brand-pink/10 border border-brand-pink/10 group-hover:scale-105 transition-transform">
                                                <img src={p.image.startsWith('http') ? p.image : `http://localhost:5000${p.image}`} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-brand-dark truncate max-w-[120px] md:max-w-none">{p.name}</p>
                                                {p.featured && <span className="text-[8px] md:text-[10px] font-bold text-brand-pink-dark uppercase bg-brand-pink/20 px-2 py-0.5 rounded-full">Featured</span>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 md:px-8 py-6 text-brand-dark/60 font-medium text-xs md:text-sm whitespace-nowrap">{p.category?.name || 'Uncategorized'}</td>
                                    <td className="px-4 md:px-8 py-6 font-bold text-brand-blue-dark whitespace-nowrap text-sm md:text-base">Rs. {p.price.toLocaleString()}</td>
                                    <td className="px-4 md:px-8 py-6 text-center">
                                        <span className={`px-3 md:px-4 py-1.5 rounded-full font-bold text-[10px] md:text-xs whitespace-nowrap ${p.stock > 10 ? 'bg-brand-pink/20 text-brand-pink-dark' : 'bg-red-50 text-red-500'}`}>
                                            {p.stock} units
                                        </span>
                                    </td>
                                    <td className="px-4 md:px-8 py-6">
                                        <div className="flex items-center justify-end space-x-1 md:space-x-3">
                                            <button onClick={() => handleOpenModal(p)} className="p-2 md:p-2.5 text-brand-dark/40 hover:text-brand-blue-dark hover:bg-brand-blue/10 rounded-xl transition-all">
                                                <FiEdit2 />
                                            </button>
                                            <button onClick={() => handleDeleteClick(p)} className="p-2 md:p-2.5 text-brand-dark/40 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredProducts.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center text-brand-dark/30 italic">No matching treasures found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View Cards */}
                <div className="md:hidden divide-y divide-brand-pink/10">
                    {filteredProducts.map((p) => (
                        <div key={p._id} className="p-6 flex items-center space-x-4">
                            <div className="w-16 h-16 shrink-0 rounded-2xl overflow-hidden bg-brand-pink/10 border border-brand-pink/10">
                                <img src={p.image.startsWith('http') ? p.image : `http://localhost:5000${p.image}`} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-grow min-w-0 space-y-1">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-brand-dark truncate pr-2">{p.name}</h3>
                                    <span className="text-[10px] font-bold text-brand-blue-dark whitespace-nowrap">Rs. {p.price.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-[10px] text-brand-dark/40 font-medium uppercase tracking-widest">{p.category?.name || 'Uncategorized'}</p>
                                    <span className={`px-2 py-0.5 rounded-full font-bold text-[8px] uppercase tracking-widest ${p.stock > 10 ? 'bg-brand-pink/20 text-brand-pink-dark' : 'bg-red-50 text-red-500'}`}>
                                        {p.stock} units
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2 pt-1">
                                    <button onClick={() => handleOpenModal(p)} className="p-2 text-brand-dark/40 hover:text-brand-blue-dark hover:bg-brand-blue/10 rounded-lg transition-all text-sm">
                                        <FiEdit2 />
                                    </button>
                                    <button onClick={() => handleDeleteClick(p)} className="p-2 text-brand-dark/40 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all text-sm">
                                        <FiTrash2 />
                                    </button>
                                    {p.featured && <span className="text-[8px] font-bold text-brand-pink-dark uppercase bg-brand-pink/20 px-2 py-0.5 rounded-full ml-auto">Featured</span>}
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredProducts.length === 0 && !loading && (
                        <div className="p-12 text-center text-brand-dark/30 italic">No matching treasures found.</div>
                    )}
                </div>
            </div>

            {/* Modal Placeholder Implementation */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-brand-dark/30 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-slide-up">
                        <div className="p-8 border-b border-brand-beige flex items-center justify-between">
                            <h3 className="text-2xl font-serif text-brand-dark">{editingProduct ? 'Edit Product' : 'Add New Treasure'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-2xl hover:text-brand-pink-dark transition-colors"><FiX /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto max-h-[70vh]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-brand-dark/60 uppercase">Product Name</label>
                                    <input required type="text" className="w-full p-4 bg-brand-pink/5 border border-brand-pink/30 rounded-2xl focus:ring-2 focus:ring-brand-pink-dark/50 outline-none transition-all" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-brand-dark/60 uppercase">Category</label>
                                    <select required className="w-full p-4 bg-brand-pink/5 border border-brand-pink/30 rounded-2xl focus:ring-2 focus:ring-brand-pink-dark/50 outline-none transition-all appearance-none cursor-pointer" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                                        <option value="">Select Category</option>
                                        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-brand-dark/60 uppercase">Price (Rs.)</label>
                                    <input required type="number" className="w-full p-4 bg-brand-pink/5 border border-brand-pink/30 rounded-2xl focus:ring-2 focus:ring-brand-pink-dark/50 outline-none transition-all" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-brand-dark/60 uppercase">Stock</label>
                                    <input required type="number" className="w-full p-4 bg-brand-pink/5 border border-brand-pink/30 rounded-2xl focus:ring-2 focus:ring-brand-pink-dark/50 outline-none transition-all" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-brand-dark/60 uppercase">Description</label>
                                <textarea required rows="4" className="w-full p-4 bg-brand-pink/5 border border-brand-pink/30 rounded-2xl focus:ring-2 focus:ring-brand-pink-dark/50 outline-none transition-all" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}></textarea>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-brand-dark/60 uppercase flex items-center"><FiImage className="mr-2" /> Product Images</label>
                                    <input type="file" multiple onChange={(e) => setImageFiles(e.target.files)} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-pink/20 file:text-brand-pink-dark hover:file:bg-brand-pink/30 cursor-pointer" />
                                </div>
                                <label className="flex items-center space-x-3 cursor-pointer mt-6 group">
                                    <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} className="w-5 h-5 accent-brand-pink-dark" />
                                    <span className="text-sm font-bold text-brand-dark group-hover:text-brand-pink-dark transition-colors">Display as Featured Item</span>
                                </label>
                            </div>
                            <button type="submit" className="w-full btn-primary h-14 font-bold text-lg mt-4 shadow-xl shadow-brand-pink/20 bg-brand-pink-dark hover:bg-brand-pink-dark/90">
                                {editingProduct ? 'Update Product' : 'Create Product'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-brand-dark/40 backdrop-blur-md animate-fade-in">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-slide-up border border-brand-pink/20">
                        <div className="p-8 text-center space-y-6">
                            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto text-3xl animate-bounce">
                                <FiTrash2 />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-serif text-brand-dark">Are you sure?</h3>
                                <p className="text-brand-dark/60 leading-relaxed px-4">
                                    You are about to delete <span className="font-bold text-brand-pink-dark">"{productToDelete?.name}"</span>. This action cannot be undone.
                                </p>
                            </div>
                            <div className="flex flex-col space-y-3 pt-4">
                                <button
                                    onClick={confirmDelete}
                                    className="w-full py-4 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                                >
                                    Yes, Delete Product
                                </button>
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="w-full py-4 bg-brand-pink/10 text-brand-pink-dark rounded-2xl font-bold hover:bg-brand-pink/20 transition-all"
                                >
                                    Cancel & Go Back
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageProducts;
