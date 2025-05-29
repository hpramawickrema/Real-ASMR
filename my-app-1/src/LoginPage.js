import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Navigation from './navigation';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResponse(null);

        try {
            const res = await axios.post('http://localhost:5000/api/login', formData);
            const data = res.data;

            if (data.success) {
                // ✅ Save user ID
                localStorage.setItem('user_id', data.user_id);
                document.cookie = `user=${data.user_id}; Max-Age=${7 * 24 * 60 * 60}; Path=/; SameSite=Lax`;

                // ✅ Save name
                localStorage.setItem('username', data.name);
                document.cookie = `username=${encodeURIComponent(data.name)}; Max-Age=${7 * 24 * 60 * 60}; Path=/; SameSite=Lax`;

                // ✅ Save email
                localStorage.setItem('email', data.email);
                document.cookie = `email=${encodeURIComponent(data.email)}; Max-Age=${7 * 24 * 60 * 60}; Path=/; SameSite=Lax`;

                // ✅ Save JWT token
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    document.cookie = `token=${data.token}; Max-Age=${7 * 24 * 60 * 60}; Path=/; SameSite=Lax`;
                }

                // ✅ Admin flag
                if (data.isAdmin) {
                    document.cookie = `admin=true; Max-Age=${7 * 24 * 60 * 60}; Path=/; SameSite=Lax`;
                }

                // Log to console
                console.log('Logged in user:', data.name, `<${data.email}>`);

                setResponse({ success: true, message: 'Logged in successfully!' });
                setTimeout(() => navigate('/'), 500); // redirect after 0.5s

            } else {
                setResponse({ success: false, message: data.message || 'Login failed.' });
            }
        } catch (err) {
            console.error(err);
            setResponse({
                success: false,
                message: err.response?.data?.message || 'Server error.',
            });
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
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login to Account</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
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
                        {loading ? 'Logging in...' : 'Login'}
                    </motion.button>
                </form>

                {response && (
                    <div
                        className={`mt-4 p-3 rounded-md transition-all duration-300 ${
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
