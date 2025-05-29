import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import Navigation from "./navigation";

const reactionsList = [
  { type: 'like', icon: '👍' },
  { type: 'happy', icon: '😄' },
  { type: 'angry', icon: '😠' },
];

export default function ShowVideoPage() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [error, setError] = useState('');
  const [reactions, setReactions] = useState({});
  const [userReaction, setUserReaction] = useState('');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const userId = localStorage.getItem('user_id');
  const username = localStorage.getItem('username') || 'Anonymous';

  useEffect(() => {
    fetchVideo();
    fetchReactions();
    fetchComments();
  }, [id]);

  const fetchVideo = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/videos/${id}`);
      if (res.data && res.data.id) setVideo(res.data);
      else setError('Video not found.');
    } catch {
      setError('Failed to load video.');
    }
  };

  const fetchReactions = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/reactions?video_id=${id}`);
      const grouped = {};
      let self = '';
      res.data.forEach(r => {
        grouped[r.reaction] = (grouped[r.reaction] || 0) + 1;
        if (r.user_id === userId) self = r.reaction;
      });
      setReactions(grouped);
      setUserReaction(self);
    } catch (e) {
      console.error(e);
    }
  };

  const handleReact = async (type) => {
    if (userReaction) return;
    try {
      await axios.post('http://localhost:5000/api/save-reaction', {
        user_id: userId,
        video_id: id,
        reaction: type,
      });
      setReactions(prev => ({ ...prev, [type]: (prev[type] || 0) + 1 }));
      setUserReaction(type);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/videos/${id}/comments`);
      setComments(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const res = await axios.post(`http://localhost:5000/api/videos/${id}/comments`, {
        user_id: userId,
        username,
        body: newComment.trim(),
      });
      setComments(prev => [res.data, ...prev]);
      setNewComment('');
    } catch (e) {
      console.error(e);
    }
  };

  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;
  if (!video) return <p className="text-center text-gray-600 mt-10">Loading...</p>;

  return (
      <>
        <Navigation/>
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
          {/* Video Player */}
          <motion.div
              initial={{opacity: 0, y: 15}}
              animate={{opacity: 1, y: 0}}
              className="rounded-xl overflow-hidden shadow-md"
          >
            <video
                controls
                className="w-full aspect-video bg-black"
                poster={video.cover_url && `http://localhost:5000${video.cover_url}`}
            >
              <source src={`http://localhost:5000${video.video_url}`} type="video/mp4"/>
              Your browser does not support the video tag.
            </video>
          </motion.div>

          {/* Video Info */}
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-gray-800">{video.title}</h1>
            <p className="text-gray-600">{video.description}</p>
            <div className="text-sm text-gray-500 space-x-6">
              <span><strong>Tags:</strong> {video.tags || '—'}</span>
              <span><strong>Uploaded:</strong> {new Date(video.created_at).toLocaleString()}</span>
            </div>
          </div>

          {/* Reactions */}
          <div className="flex items-center gap-6">
            {reactionsList.map(r => (
                <motion.button
                    key={r.type}
                    onClick={() => handleReact(r.type)}
                    disabled={!!userReaction}
                    whileHover={!userReaction ? {scale: 1.2} : {}}
                    className={`text-4xl transition-transform ${
                        userReaction === r.type
                            ? 'scale-110 text-blue-600'
                            : !userReaction
                                ? 'hover:text-blue-500'
                                : 'opacity-40 cursor-not-allowed'
                    }`}
                    title={r.type}
                >
                  {r.icon}
                  <span className="ml-2 text-lg align-middle text-gray-700">{reactions[r.type] || 0}</span>
                </motion.button>
            ))}
          </div>

          {/* Comment Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">Comments</h2>

            {/* New Comment */}
            <form onSubmit={submitComment} className="flex flex-col gap-2">
          <textarea
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Write your comment..."
              className="w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              rows={3}
          />
              <div className="flex justify-end">
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition"
                >
                  Submit Comment
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((c, i) => {
                const author = c.username ?? username;
                return (
                    <motion.div
                        key={c.id || i}
                        initial={{opacity: 0, y: 5}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: i * 0.03}}
                        className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-gray-800 font-medium">{author}</p>
                        <span className="text-sm text-gray-500">
                    {new Date(c.created_at).toLocaleString()}
                  </span>
                      </div>
                      <p className="text-gray-700">{c.body}</p>
                    </motion.div>
                );
              })}
              {comments.length === 0 && <p className="text-gray-500 italic">No comments yet.</p>}
            </div>
          </div>
        </div>

      </>
  );
}
