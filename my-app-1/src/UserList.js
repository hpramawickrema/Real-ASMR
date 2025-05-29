import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Navigation from './navigation';

export default function UserList() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/users');
            if (res.data.success) {
                setUsers(res.data.users);
            } else {
                console.error('Failed to fetch users:', res.data.message);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    return (
       <>
       <Navigation/>
       <div className="max-w-6xl mx-auto px-4 py-10">
            <h2 className="text-4xl font-bold mb-10 text-gray-800 text-center">All Registered Users</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {users.map((user, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex items-center gap-4"
                    >
                        <div className="flex-shrink-0">
                            <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-lg">
                                {user.username?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">{user.username}</h3>
                            <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
       
       </>
    );
}
