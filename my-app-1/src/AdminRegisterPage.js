import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Navigation from './navigation';
import { useNavigate } from 'react-router-dom';

export default function AdminRegisterPage() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResponse(null);

        try {
            const res = await axios.post('http://localhost:5000/api/admin/register', formData);
            if (res.data.success) {
                setResponse({ success: true, message: 'Admin registered successfully!' });
                setFormData({ username: '', email: '', password: '' });
                // Redirect to admin login page after successful registration
                setTimeout(() => navigate('/admin/login'), 1500);
            } else {
                setResponse({ success: false, message: res.data.message || 'Registration failed.' });
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Registration failed';
            setResponse({ success: false, message: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navigation />
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <motion.div
                    className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Register New Admin</h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Username</label>
                            <input
                                type="text"
                                name="username"
                                className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring focus:ring-indigo-300"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring focus:ring-indigo-300"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                name="password"
                                className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring focus:ring-indigo-300"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <motion.button
                            type="submit"
                            whileTap={{ scale: 0.95 }}
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition-all duration-300"
                        >
                            {loading ? 'Registering...' : 'Register Admin'}
                        </motion.button>
                    </form>

                    {response && (
                        <div
                            className={`mt-4 p-3 rounded-md transition-all duration-300 text-center font-medium ${
                                response.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}
                        >
                            {response.message}
                        </div>
                    )}
                </motion.div>
            </div>
        </>
    );
} 