import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Clock, User, Calendar as CalendarIcon, Star } from 'lucide-react';
import ReviewForm from '../components/reviews/ReviewForm';

const MySessionsPage = () => {
  const { user, isAuthenticated, sessionBookedFlag } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      if (isAuthenticated && user) {
        setLoading(true);
        setError(null);
        try {
          const sessionsResponse = await axios.get('https://skillswap-3-ko34.onrender.com/api/users/me/sessions');
          const sortedSessions = sessionsResponse.data.data.sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.startTime}`);
            const dateB = new Date(`${b.date}T${b.startTime}`);
            return dateB - dateA;
          });
          setSessions(sortedSessions);
        } catch (err) {
          console.error('Error fetching sessions:', err);
          setError('Failed to load sessions.');
        } finally {
          setLoading(false);
        }
      } else if (!isAuthenticated) {
        setLoading(false);
        setSessions([]);
      }
    };

    fetchSessions();
  }, [isAuthenticated, user, sessionBookedFlag]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'upcoming':
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleLeaveReviewClick = (session) => {
    setSelectedSession(session);
    setShowReviewModal(true);
  };

  const handleReviewSubmitted = () => {
    setShowReviewModal(false);
    setSelectedSession(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="dark:text-gray-300">Loading sessions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="dark:text-gray-300">Please sign in to view sessions.</p>
      </div>
    );
  }

  const displayedSessions = sessions;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container px-4 py-8 mx-auto max-w-6xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">My Sessions</h1>

        <div className="space-y-6">
          {displayedSessions.length > 0 ? (
            displayedSessions.map(session => (
              <div
                key={session._id}
                className="p-5 bg-white rounded-xl shadow-md border border-gray-200 dark:bg-gray-800 dark:border-gray-600 dark:shadow-lg"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{session.skill?.title || 'N/A'}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                    {session.status}
                  </span>
                </div>

                <div className="flex items-center mb-2 text-sm text-gray-600 dark:text-gray-300">
                  <CalendarIcon className="mr-2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                  {session.date ? new Date(session.date).toLocaleDateString() : 'N/A'} at {session.startTime || 'N/A'} - {session.endTime || 'N/A'}
                </div>

                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <User className="mr-2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                  {user.role === 'learner' ?
                    `with ${session.mentor?.name || 'Mentor'}` :
                    `with ${session.learner?.name || 'Learner'}`
                  }
                </div>

                {session.status === 'completed' && user.role === 'learner' && !session.learnerFeedback && (
                  <div className="mt-4">
                    <button
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg transition-colors duration-200 hover:bg-green-700 flex items-center"
                      onClick={() => handleLeaveReviewClick(session)}
                    >
                      <Star className="mr-2 w-4 h-4" />
                      Leave Review
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-gray-600 dark:text-gray-300">
              No upcoming or past sessions.
            </div>
          )}
        </div>
      </div>

      {showReviewModal && selectedSession && user && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Leave Review</h2>
              <button
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={() => setShowReviewModal(false)}
              >
                ✕
              </button>
            </div>

            <ReviewForm
              session={selectedSession}
              learnerId={user._id}
              mentorId={user._id === selectedSession.learner._id ? selectedSession.mentor._id : selectedSession.learner._id}
              onReviewSubmitted={handleReviewSubmitted}
              onClose={() => setShowReviewModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MySessionsPage; 