import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navigation from "./navigation";

export default function AdminOrderManager() {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [search, setSearch] = useState('');
    const [updateResponse, setUpdateResponse] = useState(null);

    useEffect(() => {
        fetchAllOrders();
    }, []);

    useEffect(() => {
        setFilteredOrders(
            orders.filter(order =>
                order.username.toLowerCase().includes(search.toLowerCase()) ||
                order.email.toLowerCase().includes(search.toLowerCase()) ||
                order.product_name.toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search, orders]);

    const fetchAllOrders = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/orders/all');
            if (res.data.success) {
                setOrders(res.data.orders);
                setFilteredOrders(res.data.orders);
            }
        } catch (err) {
            console.error('Error fetching orders:', err);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.post('http://localhost:5000/api/order/update', {
                token,
                order_id: orderId,
                status: newStatus
            });
            if (res.data.success) {
                setUpdateResponse('Status updated successfully.');
                fetchAllOrders();
            } else {
                setUpdateResponse('Update failed: ' + res.data.message);
            }
        } catch (err) {
            setUpdateResponse('Error: ' + err.message);
        }
        setTimeout(() => setUpdateResponse(null), 3000);
    };

    return (

        <>
            <Navigation/>

            <div className="p-6">
                <h2 className="text-3xl font-bold mb-4 text-gray-800">Admin Order Management</h2>

                <input
                    type="text"
                    placeholder="Search by user, email or product"
                    className="w-full mb-4 p-2 border border-gray-300 rounded"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {updateResponse && (
                    <div className="mb-4 text-sm text-blue-700 bg-blue-100 p-2 rounded">
                        {updateResponse}
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border">
                        <thead>
                        <tr>
                            <th className="px-4 py-2 border">User</th>
                            <th className="px-4 py-2 border">Email</th>
                            <th className="px-4 py-2 border">Product</th>
                            <th className="px-4 py-2 border">Qty</th>
                            <th className="px-4 py-2 border">Total</th>
                            <th className="px-4 py-2 border">Status</th>
                            <th className="px-4 py-2 border">Update</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredOrders.map(order => (
                            <tr key={order.order_id}>
                                <td className="px-4 py-2 border">{order.username}</td>
                                <td className="px-4 py-2 border">{order.email}</td>
                                <td className="px-4 py-2 border">{order.product_name}</td>
                                <td className="px-4 py-2 border">{order.qty}</td>
                                <td className="px-4 py-2 border">Rs. {order.total_price}</td>
                                <td className="px-4 py-2 border font-semibold text-blue-600">{order.status}</td>
                                <td className="px-4 py-2 border">
                                    <select
                                        onChange={(e) => handleStatusUpdate(order.order_id, e.target.value)}
                                        defaultValue=""
                                        className="border rounded p-1"
                                    >
                                        <option value="" disabled>Change status</option>
                                        <option value="pending">Pending</option>
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="out for delivery">Out for Delivery</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>


        </>
    );
}
