import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navigation from "./navigation";

export default function ViewProductsPage() {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/products');
            if (res.data.success) {
                setProducts(res.data.products);
            }
        } catch (err) {
            console.error('Error fetching products:', err);
        }
    };

    const handleClick = (id) => {
        navigate(`/buy?id=${id}`);
    };

    return (
       <>
       <Navigation/>
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-800 mb-8">Available Products</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            onClick={() => handleClick(product.id)}
                            className="bg-white shadow hover:shadow-lg cursor-pointer rounded-lg overflow-hidden transition duration-300"
                        >
                            <img
                                src={`http://localhost:5000${product.image}`}
                                alt={product.name}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-1">{product.name}</h3>
                                <p className="text-gray-600">Rs. {product.price}</p>
                            </div>
                        </div>
                    ))}

                    {products.length === 0 && (
                        <p className="text-gray-600 text-center col-span-full">No products available.</p>
                    )}
                </div>
            </div>
        </div>
       </>
    );
}
