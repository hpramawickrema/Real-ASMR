import React from 'react';
import Navigation from './navigation';

export default function UserProfile() {
    const userId = localStorage.getItem('user_id');
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');

    const isLoggedIn = userId && username && email;

    if (!isLoggedIn) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="text-center text-red-600 text-lg font-medium">
                    You are not logged in.
                </div>
            </div>
        );
    }

    return (

        <>
            <Navigation/>

            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
                <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-y-6">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-800">👤 Profile Overview</h2>
                        <p className="text-gray-500 text-sm mt-1">Your saved session details</p>
                    </div>

                    <div className="space-y-4 text-gray-700 text-base">
                        <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-600">User ID</span>
                            <span className="text-blue-700 font-semibold">{userId}</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-600">Name</span>
                            <span className="text-blue-700 font-semibold">{username}</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-600">Email</span>
                            <span className="text-blue-700 font-semibold">{email}</span>
                        </div>
                    </div>

                    <div className="text-center pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-400">Your session is currently active</p>
                    </div>
                </div>
            </div>

        </>
    );
}
