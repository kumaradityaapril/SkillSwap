import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, Users, Clock, Award, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import SessionBooking from '../components/sessions/SessionBooking';
import SkillCard from '../components/skills/SkillCard';

const dummySkills = [
  // Programming
  { _id: '1', name: 'JavaScript', category: 'Programming', level: 'Advanced', rating: 4.8, learners: 1250, duration: '3 months', icon: '💻', mentors: [{ _id: 'mentor1', name: 'Mentor One' }] },
  { _id: '2', name: 'Python', category: 'Programming', level: 'Beginner', rating: 4.9, learners: 2100, duration: '2 months', icon: '🐍', mentors: [{ _id: 'mentor2', name: 'Mentor Two' }] },
  { _id: '3', name: 'Java', category: 'Programming', level: 'Intermediate', rating: 4.6, learners: 890, duration: '4 months', icon: '☕', mentors: [{ _id: 'mentor1', name: 'Mentor One' }] },
  { _id: '4', name: 'C++', category: 'Programming', level: 'Advanced', rating: 4.5, learners: 650, duration: '5 months', icon: '⚡', mentors: [{ _id: 'mentor3', name: 'Mentor Three' }] },

  // Web Development
  { _id: '5', name: 'React', category: 'Web Development', level: 'Intermediate', rating: 4.7, learners: 1800, duration: '2 months', icon: '⚛️', mentors: [{ _id: 'mentor2', name: 'Mentor Two' }] },
  { _id: '6', name: 'Node.js', category: 'Web Development', level: 'Advanced', rating: 4.6, learners: 1200, duration: '3 months', icon: '🟢', mentors: [{ _id: 'mentor3', name: 'Mentor Three' }] },
  { _id: '7', name: 'HTML/CSS', category: 'Web Development', level: 'Beginner', rating: 4.8, learners: 3200, duration: '1 month', icon: '🎨', mentors: [{ _id: 'mentor1', name: 'Mentor One' }] },
  { _id: '8', name: 'Vue.js', category: 'Web Development', level: 'Intermediate', rating: 4.5, learners: 950, duration: '2 months', icon: '💚', mentors: [{ _id: 'mentor2', name: 'Mentor Two' }] },

  // Design
  { _id: '9', name: 'UI/UX Design', category: 'Design', level: 'Intermediate', rating: 4.7, learners: 1500, duration: '3 months', icon: '🎨', mentors: [{ _id: 'mentor3', name: 'Mentor Three' }] },
  { _id: '10', name: 'Figma', category: 'Design', level: 'Beginner', rating: 4.8, learners: 2200, duration: '1 month', icon: '🎯', mentors: [{ _id: 'mentor1', name: 'Mentor One' }] },
  { _id: '11', name: 'Adobe Photoshop', category: 'Design', level: 'Advanced', rating: 4.6, learners: 1100, duration: '4 months', icon: '🖼️', mentors: [{ _id: 'mentor2', name: 'Mentor Two' }] },
  { _id: '12', name: 'Graphic Design', category: 'Design', level: 'Intermediate', rating: 4.5, learners: 800, duration: '3 months', icon: '🎭', mentors: [{ _id: 'mentor3', name: 'Mentor Three' }] },

  // Data Science
  { _id: '13', name: 'Machine Learning', category: 'Data Science', level: 'Advanced', rating: 4.9, learners: 750, duration: '6 months', icon: '🤖', mentors: [{ _id: 'mentor1', name: 'Mentor One' }] },
  { _id: '14', name: 'Data Analysis', category: 'Data Science', level: 'Intermediate', rating: 4.7, learners: 1300, duration: '3 months', icon: '📊', mentors: [{ _id: 'mentor2', name: 'Mentor Two' }] },
  { _id: '15', name: 'SQL', category: 'Data Science', level: 'Beginner', rating: 4.8, learners: 2500, duration: '2 months', icon: '🗃️', mentors: [{ _id: 'mentor3', name: 'Mentor Three' }] },
  { _id: '16', name: 'Tableau', category: 'Data Science', level: 'Intermediate', rating: 4.6, learners: 900, duration: '2 months', icon: '📈', mentors: [{ _id: 'mentor1', name: 'Mentor One' }] },

  // Business
  { _id: '17', name: 'Digital Marketing', category: 'Business', level: 'Beginner', rating: 4.5, learners: 1800, duration: '2 months', icon: '📱', mentors: [{ _id: 'mentor2', name: 'Mentor Two' }] },
  { _id: '18', name: 'Project Management', category: 'Business', level: 'Intermediate', rating: 4.7, learners: 1400, duration: '3 months', icon: '📋', mentors: [{ _id: 'mentor3', name: 'Mentor Three' }] },
  { _id: '19', name: 'Financial Analysis', category: 'Business', level: 'Advanced', rating: 4.6, learners: 600, duration: '4 months', icon: '💰', mentors: [{ _id: 'mentor1', name: 'Mentor One' }] },
  { _id: '20', name: 'Leadership', category: 'Business', level: 'Intermediate', rating: 4.8, learners: 1100, duration: '2 months', icon: '👑', mentors: [{ _id: 'mentor2', name: 'Mentor Two' }] },

  // Creative
  { _id: '21', name: 'Photography', category: 'Creative', level: 'Beginner', rating: 4.6, learners: 1600, duration: '2 months', icon: '📸', mentors: [{ _id: 'mentor3', name: 'Mentor Three' }] },
  { _id: '22', name: 'Video Editing', category: 'Creative', level: 'Intermediate', rating: 4.7, learners: 1200, duration: '3 months', icon: '🎬', mentors: [{ _id: 'mentor1', name: 'Mentor One' }] },
  { _id: '23', name: 'Music Production', category: 'Creative', level: 'Advanced', rating: 4.5, learners: 700, duration: '5 months', icon: '🎵', mentors: [{ _id: 'mentor2', name: 'Mentor Two' }] },
  { _id: '24', name: 'Writing', category: 'Creative', level: 'Beginner', rating: 4.8, learners: 2000, duration: '1 month', icon: '✍️', mentors: [{ _id: 'mentor3', name: 'Mentor Three' }] },

  // Cloud & DevOps
  { _id: '25', name: 'AWS', category: 'Cloud & DevOps', level: 'Intermediate', rating: 4.7, learners: 1100, duration: '4 months', icon: '☁️', mentors: [{ _id: 'mentor1', name: 'Mentor One' }] },
  { _id: '26', name: 'Docker', category: 'Cloud & DevOps', level: 'Beginner', rating: 4.6, learners: 950, duration: '2 months', icon: '🐳', mentors: [{ _id: 'mentor2', name: 'Mentor Two' }] },
  { _id: '27', name: 'Kubernetes', category: 'Cloud & DevOps', level: 'Advanced', rating: 4.8, learners: 600, duration: '5 months', icon: '⚙️', mentors: [{ _id: 'mentor3', name: 'Mentor Three' }] },
  { _id: '28', name: 'CI/CD', category: 'Cloud & DevOps', level: 'Intermediate', rating: 4.5, learners: 800, duration: '3 months', icon: '🔄', mentors: [{ _id: 'mentor1', name: 'Mentor One' }] },
];

const SkillsPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [skills, setSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [levelFilter, setLevelFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [loadingSkillDetails, setLoadingSkillDetails] = useState(false);
  const [skillDetailsError, setSkillDetailsError] = useState(null);
  const [skillToBook, setSkillToBook] = useState(null);
  const [bookmarkedSkills, setBookmarkedSkills] = useState([]);

  const categories = ['All', ...new Set((skills.length > 0 ? skills : dummySkills).map(skill => skill.category))];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced', 'All Levels'];

  useEffect(() => {
    fetchSkills();
    fetchBookmarkedSkills();
  }, [isAuthenticated, user]);

  const fetchSkills = async () => {
    try {
      const response = await axios.get('/api/skills');
      console.log('Skills API response data:', response.data);
      // If backend returns an empty array, use dummy data as fallback
      if (response.data.data && response.data.data.length > 0) {
        console.log('Using backend skills:', response.data.data);
        setSkills(response.data.data);
      } else {
        console.log('Backend skills empty or null, using dummy data:', dummySkills);
        setSkills(dummySkills);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching skills:', err);
      setError('Failed to fetch skills');
      // Fallback to dummy data on error as well
      console.log('Error fetching skills, using dummy data:', dummySkills);
      setSkills(dummySkills);
      setLoading(false);
    }
  };

  const fetchBookmarkedSkills = async () => {
    if (isAuthenticated && user) {
      try {
        const response = await axios.get('/api/users/me');
        // Safely access and set bookmarked skills (just the IDs)
        setBookmarkedSkills(response.data.data?.bookmarkedSkills?.map(skill => skill._id || skill) || []);
      } catch (err) {
        console.error('Error fetching bookmarked skills:', err);
        setBookmarkedSkills([]); // Set to empty array on error
      }
    }
  };

  const fetchSkillDetails = async (skillId) => {
    setLoadingSkillDetails(true);
    setSkillDetailsError(null);
    try {
      const response = await axios.get(`/api/skills/${skillId}`);
      console.log('Skill details API response:', response.data);
      setSelectedSkill(response.data.data);
    } catch (err) {
      console.error('Error fetching skill details:', err);
      setSkillDetailsError('Failed to load skill details.');
    } finally {
      setLoadingSkillDetails(false);
    }
  };

  const handleSkillCardClick = async (skillId) => {
    await fetchSkillDetails(skillId);
  };

  const handleBookSessionClick = (skill) => {
    setSkillToBook(skill);
  };

  const filteredAndSortedSkills = (skills.length > 0 ? skills : dummySkills)
    .filter(skill => {
      const matchesSearch = searchTerm === '' || (skill.title || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || skill.category === categoryFilter;
      const matchesLevel = levelFilter === 'All' || skill.level === levelFilter;
      return matchesSearch && matchesCategory && matchesLevel;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'learners':
          return (b.learners || 0) - (a.learners || 0);
        case 'name':
        default:
          // Use skill.title for sorting by name
          return (a.title || '').localeCompare(b.title || '');
      }
    });

  console.log('Current skills state:', skills);
  console.log('Filtered and sorted skills:', filteredAndSortedSkills);

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-4">Skills Marketplace</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover and master new skills across various domains. From programming to creative arts,
            find the perfect skill to advance your career.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{(skills.length > 0 ? skills : dummySkills).length}</div>
            <div className="text-gray-600 dark:text-gray-300">Total Skills</div>
          </div>
          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{categories.length - 1}</div>
            <div className="text-gray-600 dark:text-gray-300">Categories</div>
          </div>
          {/* Note: Total Learners and Avg Rating require backend data */}
          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">N/A</div>
            <div className="text-gray-600 dark:text-gray-300">Total Learners</div>
          </div>
          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">N/A</div>
            <div className="text-gray-600 dark:text-gray-300">Avg Rating</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search skills..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white dark:bg-gray-600 dark:border-gray-600 dark:text-white dark:focus:ring-blue-600"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Level Filter */}
            <select
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:border-gray-600 dark:text-white dark:focus:ring-blue-600"
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
            >
              {levels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:border-gray-600 dark:text-white dark:focus:ring-blue-600"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Sort by Name</option>
              {/* Note: Sorting by rating/learners requires backend data */}
              {/* <option value="rating">Sort by Rating</option>
              <option value="learners">Sort by Popularity</option> */}
            </select>

            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden dark:border-gray-600">
              <button
                className={`px-4 py-3 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
                onClick={() => setViewMode('grid')}
              >
                Grid
              </button>
              <button
                className={`px-4 py-3 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
                onClick={() => setViewMode('list')}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-300">
            Showing {filteredAndSortedSkills.length} of {(skills.length > 0 ? skills : dummySkills).length} skills
          </p>
        </div>

        {/* Skills Grid/List */}
        <div className={viewMode === 'grid' ?
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" :
          "space-y-4"
        }>
          {filteredAndSortedSkills.map(skill => (
            viewMode === 'grid' ? (
              <div
                key={skill._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden cursor-pointer"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    {/* Use a default icon or logic to display icons based on skill data if available */}
                    <span className="text-3xl">💡</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(skill.level)}`}>
                      {skill.level || 'N/A'}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{skill.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{skill.category || 'N/A'}</p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                         {/* Note: Rating requires backend data */}
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm font-medium">{skill.rating || 'N/A'}</span>
                      </div>
                      <div className="flex items-center text-gray-500 dark:text-gray-400">
                         {/* Note: Learners count requires backend data */}
                        <Users className="w-4 h-4 mr-1" />
                        <span className="text-sm">{skill.learners?.toLocaleString() || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                       {/* Note: Duration requires backend data */}
                      <Clock className="w-4 h-4 mr-1" />
                      <span className="text-sm">{skill.duration || 'N/A'}</span>
                    </div>
                  </div>

                  <SkillCard skill={skill} onBookSessionClick={handleBookSessionClick} isBookmarked={bookmarkedSkills.includes(skill._id)} />

                </div>
              </div>
            ) : (
              <div
                 key={skill._id}
                 className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center justify-between hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              >
                <SkillCard skill={skill} onBookSessionClick={handleBookSessionClick} isBookmarked={bookmarkedSkills.includes(skill._id)} />
              </div>
            )
          ))}
        </div>

        {filteredAndSortedSkills.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">No skills found</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Try adjusting your search criteria or filters</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('All');
                setLevelFilter('All');
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Skill Details Modal */}
        {selectedSkill && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedSkill.title}
                </h2>
                <button
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  onClick={() => setSelectedSkill(null) /* Close modal */}
                >
                  ✕
                </button>
              </div>

              {loadingSkillDetails ? (
                <div className="text-center text-gray-600 dark:text-gray-300">Loading details...</div>
              ) : skillDetailsError ? (
                <div className="text-center text-red-500">{skillDetailsError}</div>
              ) : (
                <>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {selectedSkill.description || 'No description available.'}
                  </p>

                  {/* Display Mentor Name (Skill Owner) */}
                  {selectedSkill.owner && selectedSkill.owner.name && (
                    <div className="text-gray-700 dark:text-gray-200 mb-4">
                      Posted by: <span className="font-semibold">{selectedSkill.owner.name}</span>
                    </div>
                  )}

                   {/* Note: Session booking is now handled by the button on the card */}

                </>
              )}
            </div>
          </div>
        )}

         {/* Booking Modal (using skillToBook state) */}
         {skillToBook && user && user.role === 'learner' && (
           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
             <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Book Session</h2>
                   <button
                     className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                     onClick={() => setSkillToBook(null) /* Close booking modal */}
                   >
                     ✕
                   </button>
                </div>

                {/* Display Skill and Mentor Info in Booking Modal */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{skillToBook.title}</h3>
                   {/* Determine which mentor to book with */}
                   {skillToBook.mentors && skillToBook.mentors.length > 0 ? (
                     // If multiple mentors, you might need a selection mechanism here
                     // For now, let's just show the first mentor as an example
                      <p className="text-gray-600 dark:text-gray-300">Booking with: <span className="font-semibold">{skillToBook.mentors[0].name || 'Mentor N/A'}</span></p>
                   ) : skillToBook.owner ? (
                     <p className="text-gray-600 dark:text-gray-300">Booking with: <span className="font-semibold">{skillToBook.owner.name || 'Mentor N/A'}</span> (Skill Owner)</p>
                   ) : (
                     <p className="text-red-500">Error: No mentor information available for booking.</p>
                   )}
                </div>

                {/* Session Booking Component */}
                 {((skillToBook.mentors && skillToBook.mentors.length > 0) || skillToBook.owner) && (
                   <SessionBooking
                     skillId={skillToBook._id}
                      mentorId={skillToBook.mentors && skillToBook.mentors.length > 0 ? skillToBook.mentors[0]._id : skillToBook.owner._id}
                      onClose={() => setSkillToBook(null) /* Close booking modal after booking */}
                   />
                 )}
             </div>
           </div>
        )}

      </div>
    </div>
  );
};

export default SkillsPage;