import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import ProfileHeader from '../components/profile/ProfileHeader';
import axios from 'axios';

const Profile = () => {
  const { user, activeRole, isAuthenticated } = useUser();
  const [userSkills, setUserSkills] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch user skills
        const skillsResponse = await axios.get('http://localhost:5003/api/skills/user', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });

        // Fetch user sessions based on active role
        const sessionsEndpoint = activeRole === 'learner' 
          ? 'http://localhost:5003/api/sessions/learner' 
          : activeRole === 'mentor'
            ? 'http://localhost:5003/api/sessions/mentor'
            : 'http://localhost:5003/api/sessions/user';

        const sessionsResponse = await axios.get(sessionsEndpoint, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });

        setUserSkills(skillsResponse.data.data || []);
        setSessions(sessionsResponse.data.data || []);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load profile data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated, activeRole]);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Please Login</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">You need to be logged in to view your profile.</p>
          <a 
            href="/login" 
            className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileHeader />

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded relative mb-6">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - User skills */}
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-primary-100 dark:bg-primary-900">
                <h2 className="text-xl font-semibold text-primary-800 dark:text-primary-200">
                  {activeRole === 'learner' ? 'Skills I Want to Learn' : 
                   activeRole === 'mentor' ? 'Skills I Teach' : 'My Skills'}
                </h2>
              </div>
              <div className="p-4">
                {userSkills.length > 0 ? (
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {userSkills.map(skill => (
                      <li key={skill._id} className="py-3">
                        <a 
                          href={`/skills/${skill._id}`}
                          className="flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-md transition-colors"
                        >
                          <div className="h-10 w-10 rounded-md overflow-hidden bg-gray-200 dark:bg-gray-600 mr-3">
                            <img 
                              src={skill.image === 'default-skill.jpg' ? '/images/default-skill.svg' : skill.image} 
                              alt={skill.title} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">{skill.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{skill.category} • {skill.level}</p>
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500 dark:text-gray-400">
                      {activeRole === 'learner' ? 'No skills added to your learning list yet.' : 
                       activeRole === 'mentor' ? 'You haven\'t added any skills to teach yet.' : 
                       'No skills found.'}
                    </p>
                    <a 
                      href="/skills" 
                      className="mt-3 inline-block text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      Browse Skills
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right column - Sessions */}
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-secondary-100 dark:bg-secondary-900">
                <h2 className="text-xl font-semibold text-secondary-800 dark:text-secondary-200">
                  {activeRole === 'learner' ? 'My Learning Sessions' : 
                   activeRole === 'mentor' ? 'My Teaching Sessions' : 'My Sessions'}
                </h2>
              </div>
              <div className="p-4">
                {sessions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Skill</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            {activeRole === 'learner' ? 'Mentor' : activeRole === 'mentor' ? 'Learner' : 'With'}
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {sessions.map(session => (
                          <tr key={session._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-8 w-8 rounded-md overflow-hidden bg-gray-200 dark:bg-gray-600 mr-3">
                                  <img 
                                    src={session.skill?.image === 'default-skill.jpg' ? '/images/default-skill.svg' : session.skill?.image} 
                                    alt={session.skill?.title} 
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {session.skill?.title}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600 mr-3">
                                  <img 
                                    src={
                                      activeRole === 'learner' 
                                        ? (session.mentor?.avatar === 'default-avatar.jpg' ? '/images/default-avatar.svg' : session.mentor?.avatar)
                                        : activeRole === 'mentor'
                                          ? (session.learner?.avatar === 'default-avatar.jpg' ? '/images/default-avatar.svg' : session.learner?.avatar)
                                          : (session.learner?._id === user._id 
                                              ? (session.mentor?.avatar === 'default-avatar.jpg' ? '/images/default-avatar.svg' : session.mentor?.avatar)
                                              : (session.learner?.avatar === 'default-avatar.jpg' ? '/images/default-avatar.svg' : session.learner?.avatar))
                                    } 
                                    alt="User" 
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="text-sm text-gray-900 dark:text-white">
                                  {activeRole === 'learner' 
                                    ? session.mentor?.name
                                    : activeRole === 'mentor'
                                      ? session.learner?.name
                                      : (session.learner?._id === user._id ? session.mentor?.name : session.learner?.name)}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(session.scheduledAt).toLocaleDateString()}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(session.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${session.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : ''}
                                ${session.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : ''}
                                ${session.status === 'completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : ''}
                                ${session.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : ''}
                              `}>
                                {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500 dark:text-gray-400">
                      {activeRole === 'learner' ? 'You haven\'t booked any learning sessions yet.' : 
                       activeRole === 'mentor' ? 'You don\'t have any teaching sessions yet.' : 
                       'No sessions found.'}
                    </p>
                    <a 
                      href="/skills" 
                      className="mt-3 inline-block text-secondary-600 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-300"
                    >
                      Find Skills
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;