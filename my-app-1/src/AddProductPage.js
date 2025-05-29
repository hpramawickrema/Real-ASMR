import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navigation from './navigation';

export default function ManageProductsPage() {
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({ name: '', qty: '', price: '', description: '' });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState('');
    const [response, setResponse] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const res = await axios.get('http://localhost:5000/api/products');
        if (res.data.success) setProducts(res.data.products);
    };

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const resetForm = () => {
        setFormData({ name: '', qty: '', price: '', description: '' });
        setImage(null);
        setPreview('');
        setEditingId(null);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setResponse(null);
        setLoading(true);

        if (!image && !editingId) {
            setError('Please select an image to upload.');
            setLoading(false);
            return;
        }

        setError('');

        try {
            if (editingId) {
                const res = await axios.put(`http://localhost:5000/api/products/${editingId}`, formData);
                setResponse(res.data);
            } else {
                const data = new FormData();
                Object.entries(formData).forEach(([key, val]) => data.append(key, val));
                data.append('image', image);
                const res = await axios.post('http://localhost:5000/api/products/add', data);
                setResponse(res.data);
            }

            resetForm();
            fetchProducts();
        } catch (err) {
            console.error(err);
            setResponse({ success: false, message: 'Failed to submit.' });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (product) => {
        setFormData({
            name: product.name,
            qty: product.qty,
            price: product.price,
            description: product.description,
        });
        setEditingId(product.id);
        setPreview(product.image ? `http://localhost:5000${product.image}` : '');
    };

    const confirmDelete = (id) => {
        setProductToDelete(id);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirmed = async () => {
        try {
            const res = await axios.delete(`http://localhost:5000/api/products/${productToDelete}`);
            setResponse(res.data);
            fetchProducts();
        } catch (err) {
            console.error(err);
            setResponse({ success: false, message: 'Failed to delete product.' });
        } finally {
            setShowDeleteModal(false);
            setProductToDelete(null);
        }
    };

    return (
        <>
            <Navigation/>

            <div className="min-h-screen bg-gray-100 py-10 px-4">
                <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        {editingId ? 'Update Product' : 'Add New Product'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block font-medium text-gray-700">Product Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                className="w-full mt-1 p-2 border border-gray-300 rounded"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block font-medium text-gray-700">Quantity</label>
                                <input
                                    type="number"
                                    name="qty"
                                    required
                                    className="w-full mt-1 p-2 border border-gray-300 rounded"
                                    value={formData.qty}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block font-medium text-gray-700">Price</label>
                                <input
                                    type="number"
                                    name="price"
                                    step="0.01"
                                    required
                                    className="w-full mt-1 p-2 border border-gray-300 rounded"
                                    value={formData.price}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block font-medium text-gray-700">Description</label>
                            <textarea
                                name="description"
                                rows={3}
                                className="w-full mt-1 p-2 border border-gray-300 rounded"
                                value={formData.description}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>

                        {!editingId && (
                            <div>
                                <label className="block font-medium text-gray-700">Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="mt-1"
                                    required
                                />
                                {preview && (
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="mt-2 w-40 h-40 object-cover rounded shadow"
                                    />
                                )}
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
                            >
                                {loading ? 'Submitting...' : editingId ? 'Update Product' : 'Add Product'}
                            </button>
                            {editingId && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="bg-gray-300 text-gray-800 py-2 px-4 rounded"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>

                    {response && (
                        <div
                            className={`mt-4 text-center font-medium px-4 py-2 rounded ${
                                response.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}
                        >
                            {response.message}
                        </div>
                    )}

                    <h3 className="text-xl font-semibold mt-10 mb-4 text-gray-800">All Products</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {products.map((product) => (
                            <div key={product.id} className="border rounded p-4 shadow-sm bg-white relative">
                                <img
                                    src={`http://localhost:5000${product.image}`}
                                    alt={product.name}
                                    className="w-full h-40 object-cover rounded mb-2"
                                />
                                <h4 className="font-bold text-gray-800">{product.name}</h4>
                                <p className="text-sm text-gray-600 mb-1">{product.description}</p>
                                <div className="text-sm text-gray-500">Qty: {product.qty}</div>
                                <div className="text-sm text-gray-500">Price: Rs. {product.price}</div>
                                <div className="flex gap-2 mt-4">
                                    <button
                                        onClick={() => handleEdit(product)}
                                        className="bg-yellow-400 text-white px-3 py-1 rounded text-sm hover:bg-yellow-500"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => confirmDelete(product.id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Deletion</h3>
                            <p className="text-gray-600 mb-6">Are you sure you want to delete this product?</p>
                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteConfirmed}
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </>
    );
}