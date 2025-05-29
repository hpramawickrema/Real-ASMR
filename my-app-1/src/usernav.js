import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function UserNavigation() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem('user_id');
        setIsLoggedIn(!!userId);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user_id');
        setIsLoggedIn(false);
        navigate('/login');
    };

    const navLinks = isLoggedIn
        ? [
            { path: '/', label: 'Home' },
            { path: '/logout', label: 'Logout', red: true },
        ]
        : [
            { path: '/', label: 'Home' },
            { path: '/login', label: 'Login' },
            { path: '/register', label: 'Register' },
        ];

    return (
        <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Left side title */}
                    <div className="text-xl font-bold text-blue-700 tracking-wide">
                        ASMR World
                    </div>

                    {/* Right side menu */}
                    <div className="hidden md:flex items-center space-x-6">
                        {navLinks.map((link) =>
                            link.label === 'Logout' ? (
                                <button
                                    key={link.path}
                                    onClick={handleLogout}
                                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
                                >
                                    {link.label}
                                </button>
                            ) : (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    className={({ isActive }) =>
                                        `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                            isActive
                                                ? link.red
                                                    ? 'bg-red-100 text-red-700'
                                                    : 'bg-blue-100 text-blue-700'
                                                : link.red
                                                    ? 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                                                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                                        }`
                                    }
                                >
                                    {link.label}
                                </NavLink>
                            )
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
