import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LogoutPage() {
    const navigate = useNavigate();

    useEffect(() => {
        // Clear localStorage
        localStorage.clear();

        // Clear all cookies
        document.cookie.split(';').forEach((cookie) => {
            const name = cookie.split('=')[0].trim();
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        });

        // Redirect after 2 seconds
        const timer = setTimeout(() => {
            navigate('/');
        }, 2000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white rounded-lg shadow p-8 text-center max-w-md w-full animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">You’ve been logged out</h2>
                <p className="text-gray-600">Redirecting to home page...</p>
            </div>
        </div>
    );
}
