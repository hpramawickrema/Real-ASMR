import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Navigation from './navigation';
import { motion } from 'framer-motion';

export default function VideoUploadForm() {
  const [formData, setFormData] = useState({ title: '', description: '', tags: '' });
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [response, setResponse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loadingPreviews, setLoadingPreviews] = useState({});

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/videos');
      setVideos(res.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('tags', formData.tags);
    if (videoFile) data.append('video', videoFile);

    try {
      let res;
      if (editId) {
        res = await axios.put(`http://localhost:5000/api/videos/${editId}`, formData);
      } else {
        res = await axios.post('http://localhost:5000/api/upload-video', data);
      }
      setResponse(res.data);
      setFormData({ title: '', description: '', tags: '' });
      setVideoFile(null);
      setEditId(null);
      fetchVideos();
    } catch (err) {
      setResponse({ success: false, message: err.message });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this video?')) {
      return;
    }

    try {
      const res = await axios.delete(`http://localhost:5000/api/videos/${id}`);
      if (res.data.success) {
        setResponse({ success: true, message: 'Video deleted successfully' });
        fetchVideos();
      } else {
        setResponse({ success: false, message: res.data.message });
      }
    } catch (err) {
      console.error('Delete error:', err);
      setResponse({ success: false, message: 'Failed to delete video' });
    }
  };

  const handleEdit = (video) => {
    setEditId(video.id);
    setFormData({ title: video.title, description: video.description, tags: video.tags });
    setVideoFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const captureThumbnail = (videoUrl, videoId) => {
    setLoadingPreviews(prev => ({ ...prev, [videoId]: true }));
    const video = document.createElement('video');
    video.src = `http://localhost:5000${videoUrl}`;
    video.crossOrigin = 'anonymous';
    video.currentTime = 5;

    video.onloadeddata = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 320;
      canvas.height = 180;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      const imgElement = document.getElementById(`preview-${videoId}`);
      if (imgElement) imgElement.src = dataUrl;
      setLoadingPreviews(prev => ({ ...prev, [videoId]: false }));
    };
  };

  return (
      <>
        <Navigation />
        <motion.div
            className="max-w-4xl mx-auto p-6 bg-[#f9f9fb] shadow rounded-xl mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {editId ? 'Update Video' : 'Upload New Video'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                  type="text"
                  name="title"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-indigo-300"
                  value={formData.title}
                  onChange={handleChange}
                  required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                  name="description"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-indigo-300"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  required
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
              <input
                  type="text"
                  name="tags"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-indigo-300"
                  value={formData.tags}
                  onChange={handleChange}
                  required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Video File</label>
              <input
                  type="file"
                  accept="video/*"
                  className="mt-1 block w-full"
                  onChange={handleFileChange}
                  required={!editId}
              />
            </div>
            <motion.button
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={uploading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition-all duration-300"
            >
              {uploading ? 'Saving...' : editId ? 'Update Video' : 'Upload Video'}
            </motion.button>
          </form>

          {response && (
              <div
                  className={`mt-4 p-3 rounded-md transition-all duration-300 ${response.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
              >
                {response.message}
              </div>
          )}
        </motion.div>

        <div className="max-w-6xl mx-auto mt-10 px-4">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">All Uploaded Videos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
                <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white shadow hover:shadow-lg rounded-lg overflow-hidden border transition-all"
                    onMouseEnter={() => captureThumbnail(video.video_url, video.id)}
                >
                  {loadingPreviews[video.id] ? (
                      <div className="w-full h-48 flex items-center justify-center bg-gray-100 animate-pulse text-sm text-gray-500">
                        Loading preview...
                      </div>
                  ) : (
                      <img
                          id={`preview-${video.id}`}
                          src="/default-preview.jpg"
                          alt="Preview"
                          className="w-full h-48 object-cover border-b"
                      />
                  )}
                  <div className="p-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-1">{video.title}</h4>
                    <p className="text-sm text-gray-600 mb-1">{video.description}</p>
                    <p className="text-sm text-gray-400 mb-3">Tags: {video.tags}</p>
                    <div className="flex justify-between">
                      <button
                          onClick={() => handleEdit(video)}
                          className="text-sm text-white bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded-md"
                      >
                        Edit
                      </button>
                      <button
                          onClick={() => handleDelete(video.id)}
                          className="text-sm text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
            ))}
          </div>
        </div>
      </>
  );
}
