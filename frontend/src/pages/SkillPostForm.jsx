import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SkillPostForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    level: 'Beginner',
    // Add other relevant fields like estimated duration, etc.
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [mentorInfo, setMentorInfo] = useState(null);
  const [loadingMentorInfo, setLoadingMentorInfo] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);

  const categories = [
    'Programming',
    'Design',
    'Marketing',
    'Business',
    'Music',
    'Language',
    'Cooking',
    'Fitness',
    'Academic',
    'Other'
  ];

  const fetchMentorInfo = async () => {
    try {
      setLoadingMentorInfo(true);
      const response = await axios.get(`https://skillswap-3-ko34.onrender.com/api/users/me`);
      setMentorInfo(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching mentor info:', err);
      setError('Failed to load mentor information');
    } finally {
      setLoadingMentorInfo(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMentorInfo();
    }
  }, [user]);

  // Redirect if user is not a mentor
  if (!user || (user.role !== 'mentor' && user.role !== 'admin' && user.role !== 'both')) {
    navigate('/');
    return null;
  }

  const { title, category, description, level } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    // Handle file change
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('level', formData.level);
      if (selectedFile) {
        formDataToSend.append('image', selectedFile);
      }

      const response = await axios.post('https://skillswap-3-ko34.onrender.com/skills', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess(true);
      setFormData({
        title: '',
        description: '',
        category: '',
        level: 'beginner',
      });
      setSelectedFile(null);
      navigate('/skills');
    } catch (err) {
      setError(err.response?.data?.message || 'Error posting skill');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 dark:bg-gray-900 min-h-screen">
      <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Post a New Skill</h1>
        
        {loadingMentorInfo ? (
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
          </div>
        ) : mentorInfo ? (
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Mentor Information</h2>
            <div className="space-y-1">
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-medium">Name:</span> {mentorInfo.name}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-medium">Total Posts:</span> {mentorInfo.postsCount}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-medium">Role:</span> {mentorInfo.role}
              </p>
            </div>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Skill Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-600 dark:focus:border-blue-600"
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Skill Image</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
            <select
              id="category"
              name="category"
              value={category}
              onChange={handleChange}
              required
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-600 dark:focus:border-blue-600 sm:text-sm"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={handleChange}
              required
              rows="4"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-600 dark:focus:border-blue-600"
            ></textarea>
          </div>

          <div>
            <label htmlFor="level" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Level</label>
            <select
              id="level"
              name="level"
              value={level}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-600 dark:focus:border-blue-600 sm:text-sm"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative dark:bg-red-900 dark:text-red-300 dark:border-red-700" role="alert">
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative dark:bg-green-900 dark:text-green-300 dark:border-green-700" role="alert">
              <strong className="font-bold">Success:</strong>
              <span className="block sm:inline"> Skill posted successfully!</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-700 dark:hover:bg-blue-800 dark:focus:ring-offset-gray-800"
          >
            {loading ? 'Posting...' : 'Post Skill'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SkillPostForm; 