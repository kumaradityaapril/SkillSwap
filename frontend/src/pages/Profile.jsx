import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Calendar, Award, BookOpen, Clock, Star, Users, LogIn, ChevronRight, Shield, Zap, Trophy, ThumbsUp } from 'lucide-react';
import axios from 'axios';

const Profile = () => {
  const { user, isAuthenticated, signInWithGoogle } = useAuth();
  const [userSkills, setUserSkills] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    skillsLearned: 12,
    hoursSpent: 48,
    certificatesEarned: 3,
    currentStreak: 7
  });

  // Mock data for demonstration
  const mockSkills = [
    { id: 1, name: 'React.js', level: 'Advanced', progress: 85, category: 'Programming' },
    { id: 2, name: 'Node.js', level: 'Intermediate', progress: 70, category: 'Programming' },
    { id: 3, name: 'UI/UX Design', level: 'Beginner', progress: 40, category: 'Design' },
    { id: 4, name: 'Python', level: 'Advanced', progress: 90, category: 'Programming' },
  ];

  const mockSessions = [
    { id: 1, title: 'Advanced React Patterns', date: '2024-01-15', duration: '2 hours', status: 'completed' },
    { id: 2, title: 'Node.js Best Practices', date: '2024-01-12', duration: '1.5 hours', status: 'completed' },
    { id: 3, title: 'Design Systems Workshop', date: '2024-01-18', duration: '3 hours', status: 'upcoming' },
  ];

  useEffect(() => {
    if (isAuthenticated) {
      setUserSkills(mockSkills);
      setSessions(mockSessions);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="overflow-hidden relative p-8 mx-4 w-full max-w-md bg-white rounded-2xl shadow-xl">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full opacity-70"></div>
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-24 h-24 bg-gradient-to-tr from-purple-100 to-pink-200 rounded-full opacity-70"></div>
          
          <div className="relative z-10 text-center">
            <div className="flex justify-center items-center p-4 mx-auto mb-6 w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-lg">
              <LogIn className="w-12 h-12 text-white" />
            </div>
            <h2 className="mb-4 text-3xl font-bold text-transparent text-gray-800 bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Sign In Required</h2>
            <p className="mb-8 text-lg text-gray-600">
              Please sign in with your Google account to view your profile and track your learning progress.
            </p>
            <button
              onClick={signInWithGoogle}
              className="flex justify-center items-center px-6 py-4 space-x-3 w-full font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] transform"
            >
              <svg className="flex-shrink-0 w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-lg">Sign in with Google</span>
            </button>
            
            <div className="pt-6 mt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500">New to SkillTrae? Sign in to start your learning journey today.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container px-4 py-8 mx-auto max-w-6xl">
        {/* Profile Header */}
        <div className="overflow-hidden relative p-8 mb-8 bg-white rounded-2xl shadow-xl">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 -mt-32 -mr-32 w-64 h-64 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full opacity-50"></div>
          <div className="absolute bottom-0 left-0 -mb-24 -ml-24 w-48 h-48 bg-gradient-to-tr from-purple-50 to-pink-100 rounded-full opacity-50"></div>
          
          <div className="flex relative z-10 flex-col items-center space-y-6 md:flex-row md:items-start md:space-y-0 md:space-x-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full opacity-75 blur transition duration-300 group-hover:opacity-100"></div>
              <div className="relative">
                <img
                  src={user.picture}
                  alt={user.name}
                  className="object-cover w-36 h-36 rounded-full border-4 border-white shadow-lg"
                />
                <div className="absolute -right-2 -bottom-2 p-2 text-white bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-lg transition-transform duration-300 transform hover:scale-110">
                  <Trophy className="w-6 h-6" />
                </div>
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="mb-3 text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{user.name}</h1>
              <div className="flex justify-center items-center mb-4 space-x-3 text-gray-600 transition-colors duration-200 md:justify-start group hover:text-blue-600">
                <Mail className="w-5 h-5 text-blue-500" />
                <span>{user.email}</span>
              </div>
              <div className="flex justify-center items-center mb-6 space-x-3 text-gray-600 transition-colors duration-200 md:justify-start group hover:text-blue-600">
                <Calendar className="w-5 h-5 text-blue-500" />
                <span>Member since {new Date().getFullYear()}</span>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                <div className="p-4 text-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm transition-transform duration-300 transform hover:scale-105 hover:shadow-md">
                  <div className="flex justify-center mb-2">
                    <BookOpen className="w-6 h-6 text-blue-500" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600">{stats.skillsLearned}</div>
                  <div className="text-sm font-medium text-blue-800">Skills Learned</div>
                </div>
                <div className="p-4 text-center bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm transition-transform duration-300 transform hover:scale-105 hover:shadow-md">
                  <div className="flex justify-center mb-2">
                    <Clock className="w-6 h-6 text-green-500" />
                  </div>
                  <div className="text-3xl font-bold text-green-600">{stats.hoursSpent}</div>
                  <div className="text-sm font-medium text-green-800">Hours Spent</div>
                </div>
                <div className="p-4 text-center bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm transition-transform duration-300 transform hover:scale-105 hover:shadow-md">
                  <div className="flex justify-center mb-2">
                    <Award className="w-6 h-6 text-purple-500" />
                  </div>
                  <div className="text-3xl font-bold text-purple-600">{stats.certificatesEarned}</div>
                  <div className="text-sm font-medium text-purple-800">Certificates</div>
                </div>
                <div className="p-4 text-center bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-sm transition-transform duration-300 transform hover:scale-105 hover:shadow-md">
                  <div className="flex justify-center mb-2">
                    <Zap className="w-6 h-6 text-orange-500" />
                  </div>
                  <div className="text-3xl font-bold text-orange-600">{stats.currentStreak}</div>
                  <div className="text-sm font-medium text-orange-800">Day Streak</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Skills Section */}
          <div className="overflow-hidden relative p-6 bg-white rounded-2xl shadow-xl">
            {/* Decorative element */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-40 h-40 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full opacity-50"></div>
            
            <div className="relative z-10">
              <div className="flex items-center mb-6 space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">My Skills</h2>
              </div>
              
              <div className="space-y-5">
                {userSkills.map((skill, index) => (
                  <div 
                    key={skill.id} 
                    className="p-5 rounded-xl border border-gray-200 transition-all duration-300 transform hover:border-blue-300 hover:shadow-md hover:-translate-y-1"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-semibold text-gray-800">{skill.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(skill.level)}`}>
                        {skill.level}
                      </span>
                    </div>
                    <div className="flex items-center mb-3 text-sm text-gray-600">
                      <Shield className="mr-2 w-4 h-4 text-gray-400" />
                      {skill.category}
                    </div>
                    <div className="overflow-hidden w-full h-3 bg-gray-100 rounded-full shadow-inner">
                      <div 
                        className={`h-3 rounded-full transition-all duration-1000 ease-out ${skill.progress > 75 ? 'bg-gradient-to-r from-blue-500 to-indigo-600' : 'bg-gradient-to-r from-blue-400 to-blue-500'}`}
                        style={{ width: `${skill.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">Progress</span>
                      <span className="text-sm font-medium text-blue-600">{skill.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="px-5 py-3 mt-6 w-full font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] transform flex items-center justify-center space-x-2">
                <span>Add New Skill</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Recent Sessions Section */}
          <div className="overflow-hidden relative p-6 bg-white rounded-2xl shadow-xl">
            {/* Decorative element */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-40 h-40 bg-gradient-to-br from-purple-50 to-indigo-100 rounded-full opacity-50"></div>
            
            <div className="relative z-10">
              <div className="flex items-center mb-6 space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Recent Sessions</h2>
              </div>
              
              <div className="space-y-5">
                {sessions.map((session, index) => (
                  <div 
                    key={session.id} 
                    className="p-5 rounded-xl border border-gray-200 transition-all duration-300 transform hover:border-purple-300 hover:shadow-md hover:-translate-y-1"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-semibold text-gray-800">{session.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                        {session.status}
                      </span>
                    </div>
                    <div className="flex items-center mb-3 text-sm text-gray-600">
                      <Calendar className="mr-2 w-4 h-4 text-gray-400" />
                      <span>{session.date}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="mr-2 w-4 h-4 text-gray-400" />
                      <span>{session.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              {sessions.length === 0 && (
                <div className="p-8 text-center">
                  <div className="flex justify-center items-center mx-auto mb-4 w-16 h-16 bg-purple-100 rounded-full">
                    <Calendar className="w-8 h-8 text-purple-500" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium text-gray-800">No sessions yet</h3>
                  <p className="mb-6 text-gray-500">Schedule your first skill-sharing session to get started</p>
                </div>
              )}
              
              <button className="px-5 py-3 mt-6 w-full font-medium text-white bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] transform flex items-center justify-center space-x-2">
                <span>Schedule New Session</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="overflow-hidden relative p-6 bg-white rounded-2xl shadow-xl">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-40 h-40 bg-gradient-to-br from-yellow-50 to-amber-100 rounded-full opacity-50"></div>
          <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-32 h-32 bg-gradient-to-tr from-yellow-50 to-amber-100 rounded-full opacity-40"></div>
          
          <div className="relative z-10">
            <div className="flex items-center mb-6 space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Trophy className="w-6 h-6 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Achievements</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Achievement cards with enhanced styling */}
              <div className="p-5 bg-gradient-to-br from-white to-yellow-50 rounded-xl border border-gray-200 transition-all duration-300 transform hover:shadow-md hover:border-yellow-300 hover:-translate-y-1">
                <div className="flex items-center mb-3 space-x-3">
                  <div className="p-2.5 bg-yellow-100 rounded-full shadow-inner">
                    <Star className="w-5 h-5 text-yellow-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Skill Master</h3>
                </div>
                <p className="ml-11 text-sm text-gray-600">Shared 5+ skills with the community</p>
                <div className="mt-3 ml-11">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <Zap className="mr-1 w-3 h-3" />
                    500 XP
                  </span>
                </div>
              </div>
              
              <div className="p-5 bg-gradient-to-br from-white to-blue-50 rounded-xl border border-gray-200 transition-all duration-300 transform hover:shadow-md hover:border-blue-300 hover:-translate-y-1">
                <div className="flex items-center mb-3 space-x-3">
                  <div className="p-2.5 bg-blue-100 rounded-full shadow-inner">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Connector</h3>
                </div>
                <p className="ml-11 text-sm text-gray-600">Completed 10+ sessions with others</p>
                <div className="mt-3 ml-11">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <Zap className="mr-1 w-3 h-3" />
                    750 XP
                  </span>
                </div>
              </div>
              
              <div className="p-5 bg-gradient-to-br from-white to-green-50 rounded-xl border border-gray-200 transition-all duration-300 transform hover:shadow-md hover:border-green-300 hover:-translate-y-1">
                <div className="flex items-center mb-3 space-x-3">
                  <div className="p-2.5 bg-green-100 rounded-full shadow-inner">
                    <ThumbsUp className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Highly Rated</h3>
                </div>
                <p className="ml-11 text-sm text-gray-600">Maintained a 4.5+ star rating</p>
                <div className="mt-3 ml-11">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <Zap className="mr-1 w-3 h-3" />
                    600 XP
                  </span>
                </div>
              </div>
              
              <div className="p-5 bg-gradient-to-br from-white to-purple-50 rounded-xl border border-gray-200 transition-all duration-300 transform hover:shadow-md hover:border-purple-300 hover:-translate-y-1">
                <div className="flex items-center mb-3 space-x-3">
                  <div className="p-2.5 bg-purple-100 rounded-full shadow-inner">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Dedicated</h3>
                </div>
                <p className="ml-11 text-sm text-gray-600">Active member for 6+ months</p>
                <div className="mt-3 ml-11">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    <Zap className="mr-1 w-3 h-3" />
                    800 XP
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-4 mt-6 bg-gradient-to-r from-amber-50 to-yellow-100 rounded-lg border border-yellow-200">
              <div className="flex items-center">
                <Zap className="mr-2 w-5 h-5 text-yellow-600" />
                <p className="text-sm font-medium text-gray-700">Total XP: <span className="font-bold text-yellow-700">2,650</span></p>
                <div className="ml-auto">
                  <button className="flex items-center text-xs font-medium text-blue-600 transition-colors duration-200 hover:text-blue-800">
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
                          