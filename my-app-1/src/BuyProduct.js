import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Navigation from "./navigation";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function BuyProductPage() {
    const [product, setProduct] = useState(null);
    const [qty, setQty] = useState(1);
    const [address, setAddress] = useState('');
    const [contact, setContact] = useState('');
    const [message, setMessage] = useState(null);
    const [paid, setPaid] = useState(false);

    const query = new URLSearchParams(useLocation().search);
    const productId = query.get('id');
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchProduct();
    }, [productId]);

    const fetchProduct = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/products');
            const matched = res.data.products.find(p => p.id.toString() === productId);
            if (matched) setProduct(matched);
        } catch (err) {
            console.error('Error loading product:', err);
        }
    };

    const submitOrder = async () => {
        try {
            const res = await axios.post('http://localhost:5000/api/buy', {
                token,
                product_id: productId,
                qty,
                address,
                contact_number: contact
            });
            setMessage(res.data.message);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Failed to place order.');
        }
    };

    if (!product) return <p className="text-center mt-10 text-gray-600">Loading...</p>;

    return (
        <>
            <Navigation />

            <PayPalScriptProvider options={{ "client-id": "YOUR_PAYPAL_CLIENT_ID" }}>
                <div className="min-h-screen bg-gray-100 py-10 px-4">
                    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8">
                        <div className="flex flex-col md:flex-row gap-6">
                            <img
                                src={`http://localhost:5000${product.image}`}
                                alt={product.name}
                                className="w-full md:w-1/2 object-cover rounded"
                            />

                            <div className="flex-1 space-y-2">
                                <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
                                <p className="text-gray-600">{product.description}</p>
                                <div className="text-lg text-blue-700 font-semibold">Rs. {product.price}</div>
                                <div className="text-sm text-gray-500">Available: {product.qty}</div>
                            </div>
                        </div>

                        <form className="mt-8 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                                <input
                                    type="number"
                                    min="1"
                                    max={product.qty}
                                    className="w-full mt-1 border rounded p-2"
                                    value={qty}
                                    onChange={(e) => setQty(Number(e.target.value))}
                                    required
                                    disabled={paid}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Delivery Address</label>
                                <textarea
                                    className="w-full mt-1 border rounded p-2"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    rows={3}
                                    required
                                    disabled={paid}
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                                <input
                                    type="text"
                                    className="w-full mt-1 border rounded p-2"
                                    value={contact}
                                    onChange={(e) => setContact(e.target.value)}
                                    required
                                    disabled={paid}
                                />
                            </div>

                            {!paid ? (
                                <div className="pt-4">
                                    <PayPalButtons
                                        style={{ layout: 'horizontal' }}
                                        createOrder={(data, actions) => {
                                            return actions.order.create({
                                                purchase_units: [{
                                                    amount: {
                                                        value: (product.price * qty).toFixed(2)
                                                    }
                                                }]
                                            });
                                        }}
                                        onApprove={async (data, actions) => {
                                            const details = await actions.order.capture();
                                            setPaid(true);
                                            submitOrder();
                                        }}
                                        onError={(err) => {
                                            console.error("PayPal error:", err);
                                            setMessage("Payment error. Please try again.");
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className="mt-4 text-green-700 bg-green-100 p-2 rounded text-center font-medium">
                                    ✅ Payment received. Your order has been placed!
                                </div>
                            )}

                            {message && (
                                <div className="mt-4 text-center text-sm text-blue-700 font-medium bg-blue-100 p-2 rounded">
                                    {message}
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </PayPalScriptProvider>
        </>
    );
}
