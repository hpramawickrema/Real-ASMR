// src/components/Navbar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

// Helper: read a cookie by name
const getCookie = (name) => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
};

export default function Navbar() {
  const isAdmin = !!getCookie('admin');
  const isUser  = !!getCookie('user'); // adjust if your login cookie name is different

  let navLinks = [];
  if (isAdmin) {
    navLinks = [
      { path: '/upload',    label: 'Manage Video' },
      { path: '/articles',  label: 'Manage Article' },
      { path: '/products/add', label: 'Manage Products' },
      { path: '/order/manage',     label: 'Manage Order' },
      { path: '/users',     label: 'Manage User' },
      { path: '/logout',    label: 'Logout', red: true }
    ];
  } else if (isUser) {
    navLinks = [
      { path: '/',          label: 'Home' },
      { path: '/item',   label: 'View Products' },
      { path: '/profile',   label: 'Profile' },
      { path: '/order',   label: 'Order' },
      { path: '/logout',    label: 'Logout', red: true }
    ];
  } else {
    navLinks = [
      { path: '/',         label: 'Home' },
      { path: '/register', label: 'Register' },
      { path: '/login',    label: 'Login' },
      { path: '/admin/login', label: 'Admin Login', isAdmin: true },
      { path: '/admin/register', label: 'Admin Register', isAdmin: true }
    ];
  }

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="text-xl font-bold text-blue-700 tracking-wide">
            {isAdmin ? 'Admin Panel' : isUser ? '' : 'My App'}
          </div>
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map(link => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? link.red
                        ? 'bg-red-100 text-red-700'
                        : link.isAdmin
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      : link.red
                        ? 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                        : link.isAdmin
                          ? 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
