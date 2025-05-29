import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // ✅ Add this
import Navigation from "./navigation";

const reactionsList = [
    { type: 'like', icon: '👍' },
    { type: 'happy', icon: '😄' },
    { type: 'angry', icon: '😠' }
];

export default function VideoGallery() {
    const [videos, setVideos] = useState([]);
    const [reactions, setReactions] = useState({});
    const [userReactions, setUserReactions] = useState({});
    const navigate = useNavigate(); // ✅

    const userId = localStorage.getItem('user_id');

    useEffect(() => {
        fetchVideos();
        fetchReactions();
    }, []);

    const fetchVideos = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/videos');
            const data = res.data;
            setVideos(Array.isArray(data) ? data : data.videos || []);
        } catch (error) {
            console.error('Error fetching videos:', error);
        }
    };

    const fetchReactions = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/reactions');
            const data = res.data;
            const grouped = {};
            if (Array.isArray(data)) {
                data.forEach(r => {
                    if (!grouped[r.video_id]) grouped[r.video_id] = {};
                    grouped[r.video_id][r.reaction] = (grouped[r.video_id][r.reaction] || 0) + 1;
                    if (r.user_id == userId) {
                        setUserReactions(prev => ({ ...prev, [r.video_id]: r.reaction }));
                    }
                });
                setReactions(grouped);
            }
        } catch (error) {
            console.error('Error fetching reactions:', error);
        }
    };

    const handleReact = async (videoId, type) => {
        if (userReactions[videoId]) {
            alert('You have already reacted to this video.');
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/save-reaction', {
                user_id: userId,
                video_id: videoId,
                reaction: type
            });

            setReactions(prev => {
                const videoReactions = prev[videoId] || {};
                return {
                    ...prev,
                    [videoId]: {
                        ...videoReactions,
                        [type]: (videoReactions[type] || 0) + 1
                    }
                };
            });

            setUserReactions(prev => ({ ...prev, [videoId]: type }));

        } catch (error) {
            console.error('Error saving reaction:', error);
        }
    };

    const goToVideoDetail = (videoId) => {
        navigate(`/show/${videoId}`);
    };

    return (
       <>
       <Navigation/>

        <div className="max-w-6xl mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">All Videos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map(video => (
                    <motion.div
                        key={video.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white border shadow rounded-md overflow-hidden hover:shadow-lg transition cursor-pointer"
                        onClick={() => goToVideoDetail(video.id)} // ✅ Navigate on click
                    >
                        <img
                            src={video.cover_url ? `http://localhost:5000${video.cover_url}` : '/default-preview.jpg'}
                            alt={video.title}
                            className="w-full h-48 object-cover"
                            onError={(e) => (e.target.src = '/default-preview.jpg')}
                        />
                        <div className="p-4">
                            <h3 className="font-bold text-gray-800 text-lg mb-1">{video.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">{video.description}</p>

                            <div className="flex items-center gap-4 mb-2">
                                {reactionsList.map(r => (
                                    <button
                                        key={r.type}
                                        onClick={(e) => {
                                            e.stopPropagation(); // ✅ Prevent card click
                                            handleReact(video.id, r.type);
                                        }}
                                        disabled={!!userReactions[video.id]}
                                        className={`text-2xl ${userReactions[video.id] ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'} transform transition-transform`}
                                        title={r.type}
                                    >
                                        {r.icon}
                                    </button>
                                ))}
                            </div>

                            <div className="text-sm text-gray-500">
                                {Object.entries(reactions[video.id] || {}).map(([type, count]) => (
                                    <span key={type} className="mr-3">
                                        {reactionsList.find(r => r.type === type)?.icon} {count}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
       
       </>
    );
}
