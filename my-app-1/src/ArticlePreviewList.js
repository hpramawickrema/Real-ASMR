import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function ArticlePreviewList() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/articles');
            if (res.data.success) {
                setArticles(res.data.articles);
            }
        } catch (err) {
            console.error('Error fetching articles:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p className="text-center text-gray-600 mt-10">Loading articles...</p>;

    return (
        <div className="max-w-6xl mx-auto py-12 px-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Latest Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map(article => (
                    <div key={article.id} className="bg-white rounded-lg shadow hover:shadow-md p-6 transition">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{article.title}</h3>
                        <p className="text-sm text-gray-500 mb-2">By {article.author}</p>
                        <p className="text-sm text-gray-400 mb-4">
                            {new Date(article.created_at).toLocaleDateString()}
                        </p>
                        <Link
                            to={`/view/articles/${article.id}`}
                            className="inline-block mt-auto text-indigo-600 font-medium hover:underline"
                        >
                            Read More →
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
