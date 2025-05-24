import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import StartChatButton from '../profile/StartChatButton';

const SkillDetail = () => {
  const { id } = useParams();
  const [skill, setSkill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSkillDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5003/api/skills/${id}`);
        setSkill(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch skill details. Please try again later.');
        setLoading(false);
        console.error('Error fetching skill details:', err);
      }
    };

    fetchSkillDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md w-full">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!skill) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative max-w-md w-full">
          <strong className="font-bold">Not Found!</strong>
          <span className="block sm:inline"> The skill you're looking for doesn't exist or has been removed.</span>
        </div>
        <Link to="/skills" className="mt-4 btn-primary">
          Back to Skills
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/skills" className="text-primary-600 hover:text-primary-700 flex items-center">
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Skills
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Skill Header */}
        <div className="relative h-64 md:h-80">
          <img 
            src={skill.image === 'default-skill.jpg' ? '/images/default-skill.svg' : skill.image} 
            alt={skill.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                {skill.category}
              </span>
              <span className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm font-medium">
                {skill.level}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">{skill.title}</h1>
          </div>
        </div>

        {/* Skill Content */}
        <div className="p-6">
          <div className="flex items-center mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <span className="text-gray-700 ml-1">
                {skill.averageRating > 0 ? skill.averageRating.toFixed(1) : 'New'}
              </span>
              {skill.ratingsCount > 0 && (
                <span className="text-gray-500 ml-1">({skill.ratingsCount} reviews)</span>
              )}
            </div>
            <div className="ml-6 flex items-center">
              <svg className="w-5 h-5 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span className="text-gray-500">{new Date(skill.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{skill.description}</p>
          </div>

          {skill.tags && skill.tags.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {skill.tags.map((tag, index) => (
                  <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {skill.availability && skill.availability.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Availability</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {skill.availability.map((slot, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <div className="font-medium text-gray-800">{slot.day}</div>
                    <div className="text-gray-600">{slot.startTime} - {slot.endTime}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button className="btn-primary">
              Book a Session
            </button>
            {skill.user && (
              <StartChatButton userId={skill.user._id} userName={skill.user.name || 'Provider'} />
            )}
            <button className="btn-outline flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
              </svg>
              Save for Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillDetail;