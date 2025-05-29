import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../../context/AuthContext';
import { Bookmark } from 'lucide-react';

const SkillCard = ({ skill, onBookSessionClick, isBookmarked }) => {
  const { user } = useAuth();
  // Get the base URL (protocol, hostname, port) from the API URL
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5000/api';
  const backendUrl = apiUrl.replace('/api', '');

  console.log('SkillCard - User:', user);
  console.log('SkillCard - backendUrl:', backendUrl);
  console.log('SkillCard - User Role:', user?.role);
  console.log('SkillCard - Skill Mentors:', skill?.mentors);
  console.log('SkillCard - Skill Owner:', skill?.owner);
  console.log('SkillCard - Can Book:', user && user.role === 'learner' && (skill.mentors?.length > 0 || skill.owner));

  const canBook = user && (user.role === 'learner' || user.role === 'both') && (skill.mentors?.length > 0 || skill.owner);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 rounded-t-lg overflow-hidden">
        <img 
          src={skill.image === 'default-skill.jpg' ? '/images/default-skill.svg' : `${backendUrl}/uploads/${skill.image}`}
          alt={skill.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            skill.level === 'beginner' ? 'bg-green-100 text-green-800' :
            skill.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {skill.level}
          </span>
        </div>
        {isBookmarked && (
          <div className="absolute top-2 left-2 bg-white p-1 rounded-full shadow-md">
            <Bookmark className="w-5 h-5 text-blue-500 fill-current" />
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{skill.title}</h3>
          <span className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded">
            {skill.category}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{skill.description}</p>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex items-center">
              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <span className="text-gray-700 text-sm ml-1">
                {skill.averageRating > 0 ? skill.averageRating.toFixed(1) : 'New'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Link to={`/skills/${skill._id}`} className="btn-primary text-sm py-1 px-3">
              View Details
            </Link>
            {canBook && (
              <button
                className="btn-secondary text-sm py-1 px-3"
                onClick={() => onBookSessionClick(skill)}
              >
                Book Session
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

SkillCard.propTypes = {
  skill: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    level: PropTypes.string.isRequired,
    image: PropTypes.string,
    averageRating: PropTypes.number,
    mentors: PropTypes.array,
    owner: PropTypes.object
  }).isRequired,
  onBookSessionClick: PropTypes.func,
  isBookmarked: PropTypes.bool
};

export default SkillCard;