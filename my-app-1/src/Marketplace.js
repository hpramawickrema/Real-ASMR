// src/components/Marketplace.jsx
import React from 'react';
import { motion } from 'framer-motion';
import Navigation from './navigation';

const products = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1618436210414-9722c3e87d8f?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Ceramic Coffee Mug',
    description: 'Hand-painted ceramic mug with 350ml capacity.',
    price: 'RS5000',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1618436210414-9722c3e87d8f?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Wireless Headphones',
    description: 'Noise-cancelling over-ear headphones.',
    price: 'RS5000',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1618436210414-9722c3e87d8f?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Leather Notebook',
    description: 'A5 journal with genuine leather cover.',
    price: 'RS5000',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1618436210414-9722c3e87d8f?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'LED Desk Lamp',
    description: 'Adjustable brightness with USB charging port.',
    price: 'RS5000',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1618436210414-9722c3e87d8f?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Stainless Steel Bottle',
    description: 'Keeps drinks hot or cold for 12 hours.',
    price: 'RS5000',
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1618436210414-9722c3e87d8f?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Urban Backpack',
    description: 'Water-resistant with laptop compartment.',
    price: 'RS5000',
  },
];

export default function Marketplace() {
  return (
    <>
    <Navigation/>
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">Marketplace</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
            className="bg-white rounded-lg shadow hover:shadow-lg overflow-hidden transition"
          >
            <img
              src={p.image}
              alt={p.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 space-y-2">
              <h3 className="text-xl font-semibold text-gray-800">{p.title}</h3>
              <p className="text-gray-600 text-sm">{p.description}</p>
              <div className="mt-4 text-lg font-bold text-blue-600">{p.price}</div>
              <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                Add to Cart
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
    
    </>
  );
}
