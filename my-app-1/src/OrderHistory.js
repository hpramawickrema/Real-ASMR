import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navigation from "./navigation";

export default function OrderHistoryPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await axios.post('http://localhost:5000/api/orders', { token });
            if (res.data.success) {
                setOrders(res.data.orders);
            }
        } catch (err) {
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    const statusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'processing': return 'bg-orange-100 text-orange-700';
            case 'shipped': return 'bg-blue-100 text-blue-700';
            case 'out for delivery': return 'bg-purple-100 text-purple-700';
            case 'delivered': return 'bg-green-100 text-green-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const orderSteps = ['pending', 'processing', 'shipped', 'out for delivery', 'delivered'];

    const renderProgressBar = (currentStatus) => {
        const currentIndex = orderSteps.indexOf(currentStatus.toLowerCase());
        return (
            <div className="flex space-x-6 mt-4">
                {orderSteps.map((step, index) => (
                    <div key={step} className="flex flex-col items-center text-xs">
                        <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-white ${
                                index < currentIndex ? 'bg-green-500' :
                                    index === currentIndex ? 'bg-yellow-500' :
                                        'bg-gray-300'
                            }`}
                        >
                            {index < currentIndex ? '✓' : index + 1}
                        </div>
                        <span
                            className={`mt-1 w-20 text-center ${index <= currentIndex ? 'text-gray-800' : 'text-gray-400'}`}
                        >
              {step}
            </span>
                    </div>
                ))}
            </div>
        );
    };

    return (
     <>
     <Navigation/>

        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">My Orders</h2>

                {loading ? (
                    <p className="text-center text-gray-600">Loading orders...</p>
                ) : orders.length === 0 ? (
                    <p className="text-center text-gray-500">No orders found.</p>
                ) : (
                    <div className="space-y-4">
                        {orders.map(order => (
                            <div
                                key={order.order_id}
                                className="bg-white shadow rounded-lg p-4"
                            >
                                <div className="flex items-center gap-4">
                                    <img
                                        src={`http://localhost:5000${order.product_image}`}
                                        alt={order.product_name}
                                        className="w-20 h-20 object-cover rounded"
                                    />
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-800">{order.product_name}</h3>
                                        <p className="text-sm text-gray-600">
                                            Qty: {order.qty} | Total: Rs. {order.total_price}
                                        </p>
                                        <p className="text-sm text-gray-500">{order.created_at}</p>
                                    </div>
                                    <span className={`px-3 py-1 text-sm font-medium rounded ${statusColor(order.status)}`}>
                    {order.status}
                  </span>
                                </div>
                                {renderProgressBar(order.status)}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
     </>
    );
}
