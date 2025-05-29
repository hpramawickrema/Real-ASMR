import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import Navigation from "./navigation";
export default function ViewArticlePage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/articles/${id}`);
      if (res.data.success) {
        setArticle(res.data.article);
      } else {
        setError('Article not found.');
      }
    } catch (err) {
      setError('Failed to load article.');
    }
  };

  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;
  if (!article) return <p className="text-center text-gray-600 mt-10">Loading article...</p>;

  return (
    <>
    <Navigation/>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow-md rounded-lg p-6"
        >
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4 border-b pb-2">{article.title}</h1>
          <div className="flex justify-between text-sm text-gray-500 mb-6">
            <span>By <span className="font-medium text-blue-700">{article.author}</span></span>
            <span>{new Date(article.created_at).toLocaleString()}</span>
          </div>
          <div
              className="prose prose-lg max-w-none text-gray-800"
              dangerouslySetInnerHTML={{ __html: article.body }}
          />
          <div className="mt-10 border-t pt-6 text-sm text-gray-500">Thanks for reading 💙</div>
        </motion.div>
      </div>
    </>
  );
}