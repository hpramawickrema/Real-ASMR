import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Navigation from './navigation';

export default function RegisterPage() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/register', formData);
            setResponse({ success: true, message: res.data.message });
            setFormData({ username: '', email: '', password: '' });
        } catch (error) {
            setResponse({ success: false, message: error.response?.data?.message || error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navigation/>

            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <motion.div
                    className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg"
                    initial={{opacity: 0, y: 30}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5}}
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create Account</h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Username</label>
                            <input
                                type="text"
                                name="username"
                                className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring focus:ring-blue-300"
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
                                className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring focus:ring-blue-300"
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
                                className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring focus:ring-blue-300"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <motion.button
                            type="submit"
                            whileTap={{scale: 0.95}}
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-all duration-300"
                        >
                            {loading ? 'Creating...' : 'Register'}
                        </motion.button>
                    </form>

                    {response && (
                        <div
                            className={`mt-4 p-3 rounded-md ${response.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {response.message}
                        </div>
                    )}
                </motion.div>
            </div>
        </>
    );
}
