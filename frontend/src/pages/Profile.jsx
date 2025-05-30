import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Calendar, Award, BookOpen, Clock, Star, Users, LogIn, ChevronRight, Shield, Zap, Trophy, ThumbsUp } from 'lucide-react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, isAuthenticated, sessionBookedFlag } = useAuth();
  const navigate = useNavigate();
  const [userSkills, setUserSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    skillsLearned: 0,
    hoursSpent: 0,
    certificatesEarned: 0,
    currentStreak: 0
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated && user) {
        setLoading(true);
        setError(null);
        try {
          const skillsResponse = await axios.get('/api/users/me/skills');
          setUserSkills(skillsResponse.data.data);

          const statsResponse = await axios.get('/api/users/me/stats');
          setStats(statsResponse.data.data);

        } catch (err) {
          console.error('Error fetching user data:', err);
          setError('Failed to load profile data.');
        } finally {
          setLoading(false);
        }
      } else if (!isAuthenticated) {
        setLoading(false);
        setUserSkills([]);
        setStats({
          skillsLearned: 0,
          hoursSpent: 0,
          certificatesEarned: 0,
          currentStreak: 0
        });
      }
    };

    fetchUserData();
  }, [isAuthenticated, user, sessionBookedFlag]);

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="dark:text-gray-300">Loading profile...</p>
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
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="overflow-hidden relative p-8 mx-4 w-full max-w-md bg-white rounded-2xl shadow-xl dark:bg-gray-700">
          <div className="relative z-10 text-center">
            <div className="flex justify-center items-center p-4 mx-auto mb-6 w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-lg">
              <LogIn className="w-12 h-12 text-white" />
            </div>
            <h2 className="mb-4 text-3xl font-bold text-transparent text-gray-800 bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:text-white dark:bg-gradient-to-r dark:from-blue-400 dark:to-indigo-400">Sign In Required</h2>
            <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
              Please sign in to view your profile.
            </p>
            <Link
              to="/login"
              className="flex justify-center items-center px-6 py-4 space-x-3 w-full font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] transform"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container px-4 py-8 mx-auto max-w-6xl">
        {/* Profile Header */}
        <div className="overflow-hidden relative p-8 mb-8 bg-white rounded-2xl shadow-xl dark:bg-gray-800 dark:shadow-2xl">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 -mt-32 -mr-32 w-64 h-64 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full opacity-50 dark:from-gray-700 dark:to-gray-600 dark:opacity-30"></div>
          <div className="absolute bottom-0 left-0 -mb-24 -ml-24 w-48 h-48 bg-gradient-to-tr from-purple-50 to-pink-100 rounded-full opacity-50 dark:from-gray-700 dark:to-gray-600 dark:opacity-30"></div>
          
          <div className="flex relative z-10 flex-col items-center space-y-6 md:flex-row md:items-start md:space-y-0 md:space-x-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full opacity-75 blur transition duration-300 group-hover:opacity-100"></div>
              <div className="relative">
                <img
                  src={user.picture || '/images/default-avatar.jpg'}
                  alt={user.name || 'User'}
                  className="object-cover w-36 h-36 rounded-full border-4 border-white shadow-lg dark:border-gray-600"
                />
                <div className="absolute -right-2 -bottom-2 p-2 text-white bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-lg transition-transform duration-300 transform hover:scale-110">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="mb-3 text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:text-white dark:bg-gradient-to-r dark:from-blue-400 dark:to-indigo-400">{user.name || 'User'}</h1>
              <div className="flex justify-center items-center mb-4 space-x-3 text-gray-600 transition-colors duration-200 md:justify-start group hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                <Mail className="w-5 h-5 text-blue-500 dark:text-blue-300" />
                <span>{user.email || 'N/A'}</span>
              </div>
              <div className="flex justify-center items-center mb-4 space-x-3 text-gray-600 transition-colors duration-200 md:justify-start group hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                <Users className="w-5 h-5 text-blue-500 dark:text-blue-300" />
                <span className="capitalize">{user.role || 'N/A'}</span>
              </div>
              <div className="flex justify-center items-center mb-6 space-x-3 text-gray-600 transition-colors duration-200 md:justify-start group hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                <Calendar className="w-5 h-5 text-blue-500 dark:text-blue-300" />
                <span>Member since {new Date().getFullYear()}</span>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                <div className="p-4 text-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm transition-transform duration-300 transform hover:scale-105 hover:shadow-md dark:from-gray-700 dark:to-gray-600 dark:shadow-2xl">
                  <div className="flex justify-center mb-2">
                    <BookOpen className="w-6 h-6 text-blue-500 dark:text-blue-300" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.skillsLearned}</div>
                  <div className="text-sm font-medium text-blue-800 dark:text-blue-200">Skills Learned</div>
                </div>
                <div className="p-4 text-center bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm transition-transform duration-300 transform hover:scale-105 hover:shadow-md dark:from-gray-700 dark:to-gray-600 dark:shadow-2xl">
                  <div className="flex justify-center mb-2">
                    <Clock className="w-6 h-6 text-green-500 dark:text-green-300" />
                  </div>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.hoursSpent}</div>
                  <div className="text-sm font-medium text-green-800 dark:text-green-200">Hours Spent</div>
                </div>
                <div className="p-4 text-center bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm transition-transform duration-300 transform hover:scale-105 hover:shadow-md dark:from-gray-700 dark:to-gray-600 dark:shadow-2xl">
                  <div className="flex justify-center mb-2">
                    <Award className="w-6 h-6 text-purple-500 dark:text-purple-300" />
                  </div>
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.certificatesEarned}</div>
                  <div className="text-sm font-medium text-purple-800 dark:text-purple-200">Certificates</div>
                </div>
                {user.role === 'mentor' || user.role === 'both' || user.role === 'admin' ? (
                  <div className="p-4 text-center bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-sm transition-transform duration-300 transform hover:scale-105 hover:shadow-md dark:from-gray-700 dark:to-gray-600 dark:shadow-2xl">
                    <div className="flex justify-center mb-2">
                      <Trophy className="w-6 h-6 text-orange-500 dark:text-orange-300" />
                    </div>
                    <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{user.postsCount || 0}</div>
                    <div className="text-sm font-medium text-orange-800 dark:text-orange-200">Skills Posted</div>
                  </div>
                ) : (
                  <div className="p-4 text-center bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-sm transition-transform duration-300 transform hover:scale-105 hover:shadow-md dark:from-gray-700 dark:to-gray-600 dark:shadow-2xl">
                    <div className="flex justify-center mb-2">
                      <Zap className="w-6 h-6 text-orange-500 dark:text-orange-300" />
                    </div>
                    <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{stats.currentStreak}</div>
                    <div className="text-sm font-medium text-orange-800 dark:text-orange-200">Day Streak</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Skills Section */}
          <div className="overflow-hidden relative p-6 bg-white rounded-2xl shadow-xl dark:bg-gray-800 dark:shadow-2xl">
            {/* Decorative element */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-40 h-40 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full opacity-50 dark:from-gray-700 dark:to-gray-600 dark:opacity-30"></div>
            
            <div className="relative z-10">
              <div className="flex items-center mb-6 space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900">
                  <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">My Skills</h2>
              </div>
              
              <div className="space-y-5">
                {userSkills.length > 0 ? (
                  userSkills.map((skill, index) => (
                    <div 
                      key={skill.id}
                      className="p-5 rounded-xl border border-gray-200 transition-all duration-300 transform hover:border-blue-300 hover:shadow-md hover:-translate-y-1 dark:border-gray-600 dark:hover:border-blue-700 dark:hover:shadow-2xl"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{skill.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(skill.level)}`}>
                          {skill.level}
                        </span>
                      </div>
                      <div className="flex items-center mb-3 text-sm text-gray-600 dark:text-gray-300">
                        <Shield className="mr-2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                        {skill.category}
                      </div>
                      <div className="overflow-hidden w-full h-3 bg-gray-100 rounded-full shadow-inner dark:bg-gray-600">
                        <div 
                          className={`h-3 rounded-full transition-all duration-1000 ease-out ${skill.progress > 75 ? 'bg-gradient-to-r from-blue-500 to-indigo-600' : 'bg-gradient-to-r from-blue-400 to-blue-500'}`}
                          style={{ width: `${skill.progress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Progress</span>
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{skill.progress}%</span>
                      </div>
                    </div>
                  ))
                ) : (
                  null
                )}
              </div>
              
              {user.role === 'mentor' || user.role === 'both' || user.role === 'admin' ? (
                <button
                  className="px-5 py-3 mt-6 w-full font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] transform flex items-center justify-center space-x-2"
                  onClick={() => navigate('/post-skill')}
                >
                  <span>Add New Skill</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : null}
            </div>
          </div>

          {/* Sessions Section */}
          <div className="overflow-hidden relative p-6 bg-white rounded-2xl shadow-xl dark:bg-gray-800 dark:shadow-2xl">
            {/* Decorative element */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-40 h-40 bg-gradient-to-br from-green-50 to-teal-100 rounded-full opacity-50 dark:from-gray-700 dark:to-gray-600 dark:opacity-30"></div>
            
            <div className="relative z-10">
              <div className="flex items-center mb-6 space-x-3">
                <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900">
                  <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">My Sessions</h2>
              </div>
              
              {/* Button to view all sessions */}
              <button
                className="px-4 py-2 mb-6 text-sm font-medium text-blue-600 bg-blue-100 rounded-lg transition-colors duration-200 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
                onClick={() => navigate('/my-sessions')}
              >
                View All Sessions
              </button>
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="overflow-hidden relative p-6 bg-white rounded-2xl shadow-xl dark:bg-gray-800 dark:shadow-2xl">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-40 h-40 bg-gradient-to-br from-yellow-50 to-amber-100 rounded-full opacity-50 dark:from-gray-700 dark:to-gray-600 dark:opacity-30"></div>
          <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-32 h-32 bg-gradient-to-tr from-yellow-50 to-amber-100 rounded-full opacity-40 dark:from-gray-700 dark:to-gray-600 dark:opacity-30"></div>
          
          <div className="relative z-10">
            <div className="flex items-center mb-6 space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg dark:bg-yellow-900">
                <Trophy className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Achievements</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Achievement cards with enhanced styling */}
              <div className="p-5 bg-gradient-to-br from-white to-yellow-50 rounded-xl border border-gray-200 transition-all duration-300 transform hover:shadow-md hover:border-yellow-300 hover:-translate-y-1 dark:from-gray-700 dark:to-gray-800 dark:border-gray-600 dark:hover:border-yellow-700 dark:shadow-2xl">
                <div className="flex items-center mb-3 space-x-3">
                  <div className="p-2.5 bg-yellow-100 rounded-full shadow-inner dark:bg-yellow-900">
                    <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Skill Master</h3>
                </div>
                <p className="ml-11 text-sm text-gray-600 dark:text-gray-300">Shared 5+ skills with the community</p>
                <div className="mt-3 ml-11">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    <Zap className="mr-1 w-3 h-3" />
                    500 XP
                  </span>
                </div>
              </div>
              
              <div className="p-5 bg-gradient-to-br from-white to-blue-50 rounded-xl border border-gray-200 transition-all duration-300 transform hover:shadow-md hover:border-blue-300 hover:-translate-y-1 dark:from-gray-700 dark:to-gray-800 dark:border-gray-600 dark:hover:border-blue-700 dark:shadow-2xl">
                <div className="flex items-center mb-3 space-x-3">
                  <div className="p-2.5 bg-blue-100 rounded-full shadow-inner dark:bg-blue-900">
                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Connector</h3>
                </div>
                <p className="ml-11 text-sm text-gray-600 dark:text-gray-300">Completed 10+ sessions with others</p>
                <div className="mt-3 ml-11">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    <Zap className="mr-1 w-3 h-3" />
                    750 XP
                  </span>
                </div>
              </div>
              
              <div className="p-5 bg-gradient-to-br from-white to-green-50 rounded-xl border border-gray-200 transition-all duration-300 transform hover:shadow-md hover:border-green-300 hover:-translate-y-1 dark:from-gray-700 dark:to-gray-800 dark:border-gray-600 dark:hover:border-green-700 dark:shadow-2xl">
                <div className="flex items-center mb-3 space-x-3">
                  <div className="p-2.5 bg-green-100 rounded-full shadow-inner dark:bg-green-900">
                    <ThumbsUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Highly Rated</h3>
                </div>
                <p className="ml-11 text-sm text-gray-600 dark:text-gray-300">Maintained a 4.5+ star rating</p>
                <div className="mt-3 ml-11">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    <Zap className="mr-1 w-3 h-3" />
                    600 XP
                  </span>
                </div>
              </div>
              
              <div className="p-5 bg-gradient-to-br from-white to-purple-50 rounded-xl border border-gray-200 transition-all duration-300 transform hover:shadow-md hover:border-purple-300 hover:-translate-y-1 dark:from-gray-700 dark:to-gray-800 dark:border-gray-600 dark:hover:border-purple-700 dark:shadow-2xl">
                <div className="flex items-center mb-3 space-x-3">
                  <div className="p-2.5 bg-purple-100 rounded-full shadow-inner dark:bg-purple-900">
                    <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Dedicated</h3>
                </div>
                <p className="ml-11 text-sm text-gray-600 dark:text-gray-300">Active member for 6+ months</p>
                <div className="mt-3 ml-11">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    <Zap className="mr-1 w-3 h-3" />
                    800 XP
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-4 mt-6 bg-gradient-to-r from-amber-50 to-yellow-100 rounded-lg border border-yellow-200 dark:from-gray-700 dark:to-gray-800 dark:border-gray-600">
              <div className="flex items-center">
                <Zap className="mr-2 w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Total XP: <span className="font-bold text-yellow-700 dark:text-yellow-400">2,650</span></p>
                <div className="ml-auto">
                  <button className="flex items-center text-xs font-medium text-blue-600 transition-colors duration-200 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                    View all achievements
                    <ChevronRight className="ml-1 w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
                          