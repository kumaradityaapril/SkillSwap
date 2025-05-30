import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import StartChatButton from '../profile/StartChatButton';
import SessionBooking from '../sessions/SessionBooking';
import { useAuth } from '../../context/AuthContext';
import { Star, Bookmark as BookmarkIcon } from 'lucide-react';

const SkillDetail = () => {
  const { id } = useParams();
  const [skill, setSkill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchSkillDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/skills/${id}`);
        setSkill(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch skill details. Please try again later.');
        setLoading(false);
        console.error('Error fetching skill details:', err);
      }
    };

    const fetchSkillReviews = async () => {
      try {
        setReviewsLoading(true);
        const response = await axios.get(`/api/reviews/skill/${id}`);
        setReviews(response.data.data);
        setReviewsLoading(false);
      } catch (err) {
        setReviewsError('Failed to fetch reviews.');
        setReviewsLoading(false);
        console.error('Error fetching reviews:', err);
      }
    };

    const checkBookmarkStatus = async () => {
      if (isAuthenticated && user) {
        try {
          const response = await axios.get('/api/users/me');
          const bookmarkedSkills = response.data.data?.bookmarkedSkills?.map(skill => skill._id || skill) || [];
          setIsBookmarked(bookmarkedSkills.includes(id));
        } catch (err) {
          console.error('Error checking bookmark status:', err);
          setIsBookmarked(false);
        }
      }
    };

    fetchSkillDetails();
    fetchSkillReviews();
    checkBookmarkStatus();
  }, [id, isAuthenticated, user]);

  const handleBookSessionClick = () => {
    if (user && user.role === 'learner' && (skill.mentors?.length > 0 || skill.owner)) {
      setShowBookingModal(true);
    } else if (!user) {
      alert('Please log in to book a session.');
    } else if (user.role !== 'learner') {
      alert('Only learners can book sessions.');
    } else if (!skill.mentors?.length > 0 && !skill.owner) {
      alert('This skill is not currently available for booking sessions.');
    }
  };

  const handleCloseBookingModal = () => {
    setShowBookingModal(false);
  };

  const handleBookmarkToggle = async () => {
    if (!isAuthenticated || !user) {
      alert('Please log in to bookmark skills.');
      return;
    }

    setBookmarkLoading(true);
    try {
      if (isBookmarked) {
        await axios.delete(`/api/users/me/bookmark/${id}`);
        setIsBookmarked(false);
        alert('Skill removed from bookmarks!');
      } else {
        await axios.post('/api/users/me/bookmark', { skillId: id });
        setIsBookmarked(true);
        alert('Skill bookmarked!');
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
      alert('Failed to toggle bookmark.');
    } finally {
      setBookmarkLoading(false);
    }
  };

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

  const canBook = user && (user.role === 'learner' || user.role === 'both') && (skill.mentors?.length > 0 || skill.owner);

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

          <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center">
            {canBook && (
              <button className="btn-primary" onClick={handleBookSessionClick}>
                Book a Session
              </button>
            )}
            {skill.user && (
              <StartChatButton userId={skill.user._id} userName={skill.user.name || 'Provider'} />
            )}

            {isAuthenticated && user && (
              <button
                className={`btn-outline flex items-center justify-center ${bookmarkLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleBookmarkToggle}
                disabled={bookmarkLoading}
              >
                {bookmarkLoading ? (
                  '...'
                ) : (
                  <>
                    <BookmarkIcon className={`w-5 h-5 mr-2 ${isBookmarked ? 'text-blue-500 fill-current' : ''}`} />
                    {isBookmarked ? 'Bookmarked' : 'Save for Later'}
                  </>
                )}
              </button>
            )}

            {/* Star Rating Display */}
            {skill.averageRating > 0 && (
              <div className="flex items-center ml-0 sm:ml-4 mt-4 sm:mt-0">
                {[...Array(5)].map((_, index) => (
                  <svg
                    key={index}
                    className={`w-5 h-5 ${index < skill.averageRating ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
                {skill.ratingsCount > 0 && (
                  <span className="ml-2 text-gray-700 text-sm">({skill.ratingsCount})</span>
                )}
              </div>
            )}
          </div>

          {/* Reviews Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Reviews</h2>
            {reviewsLoading ? (
              <p>Loading reviews...</p>
            ) : reviewsError ? (
              <p className="text-red-500">{reviewsError}</p>
            ) : reviews.length === 0 ? (
              <p>No reviews yet for this skill.</p>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review._id} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <div className="flex items-center mb-2">
                      <div className="font-semibold text-gray-800">{review.reviewer?.name || 'Anonymous'}</div>
                      <div className="ml-4 flex items-center">
                        <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <span className="text-gray-700 text-sm">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                    <p className="text-gray-500 text-sm mt-2">Reviewed on: {new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {showBookingModal && skill && user && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Book Session</h2>
              <button
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={handleCloseBookingModal}
              >
                ✕
              </button>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{skill.title}</h3>
              {skill.mentors && skill.mentors.length > 0 ? (
                <p className="text-gray-600 dark:text-gray-300">Booking with: <span className="font-semibold">{skill.mentors[0].name || 'Mentor N/A'}</span></p>
              ) : skill.owner ? (
                <p className="text-gray-600 dark:text-gray-300">Booking with: <span className="font-semibold">{skill.owner.name || 'Mentor N/A'}</span> (Skill Owner)</p>
              ) : (
                <p className="text-red-500">Error: No mentor information available for booking.</p>
              )}
            </div>

            {((skill.mentors && skill.mentors.length > 0) || skill.owner) && (
              <SessionBooking
                skillId={skill._id}
                mentorId={skill.mentors && skill.mentors.length > 0 ? skill.mentors[0]._id : skill.owner._id}
                onClose={handleCloseBookingModal}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillDetail;