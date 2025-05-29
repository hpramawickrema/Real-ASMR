import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Navigation from './navigation';

export default function CreateArticle() {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [articles, setArticles] = useState([]);
    const editorRef = useRef(null);

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
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess('');
        setError('');

        const htmlBody = editorRef.current.innerHTML;

        if (!title || !author || !htmlBody.trim()) {
            setError('All fields are required.');
            return;
        }

        try {
            const res = await axios.post('http://localhost:5000/api/articles', {
                title,
                body: htmlBody,
                author
            });

            if (res.data.success) {
                setSuccess(res.data.message);
                setTitle('');
                setAuthor('');
                editorRef.current.innerHTML = '';
                fetchArticles();
            } else {
                setError(res.data.message);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to submit the article.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this article?')) {
            return;
        }

        try {
            const res = await axios.delete(`http://localhost:5000/api/articles/${id}`);
            if (res.data.success) {
                setSuccess('Article deleted successfully');
                fetchArticles();
            } else {
                setError(res.data.message);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to delete article.');
        }
    };

    const formatText = (command) => {
        document.execCommand(command, false, null);
    };

    return (
      <><Navigation/>
        <div className="max-w-4xl mx-auto py-10 px-4">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Create New Article</h2>

            <form onSubmit={handleSubmit} className="bg-white shadow rounded p-6 space-y-4">
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full border p-2 rounded"
                />

                <input
                    type="text"
                    placeholder="Author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    required
                    className="w-full border p-2 rounded"
                />

                <div className="mb-2 space-x-2">
                    <button type="button" onClick={() => formatText('bold')} className="px-3 py-1 bg-gray-200 rounded">Bold</button>
                    <button type="button" onClick={() => formatText('italic')} className="px-3 py-1 bg-gray-200 rounded">Italic</button>
                    <button type="button" onClick={() => formatText('underline')} className="px-3 py-1 bg-gray-200 rounded">Underline</button>
                </div>

                <div
                    ref={editorRef}
                    contentEditable
                    placeholder="Write article body here..."
                    className="border min-h-[150px] p-3 rounded bg-white focus:outline-none"
                    style={{ whiteSpace: 'pre-wrap' }}
                />

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
                >
                    Submit Article
                </button>

                {success && <p className="text-green-600">{success}</p>}
                {error && <p className="text-red-600">{error}</p>}
            </form>

            <div className="mt-12">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">All Articles</h3>
                <div className="space-y-4">
                    {articles.map(article => (
                        <div key={article.id} className="bg-white shadow rounded p-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-800">{article.title}</h4>
                                    <p className="text-sm text-gray-500">By {article.author}</p>
                                    <p className="text-sm text-gray-400">
                                        {new Date(article.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDelete(article.id)}
                                    className="text-red-600 hover:text-red-800 font-medium"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </>
    );
}
