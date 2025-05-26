import React, { useState } from 'react';
import { Search, Filter, Star, Users, Clock, Award } from 'lucide-react';

const dummySkills = [
  // Programming
  { id: 1, name: 'JavaScript', category: 'Programming', level: 'Advanced', rating: 4.8, learners: 1250, duration: '3 months', icon: '💻' },
  { id: 2, name: 'Python', category: 'Programming', level: 'Beginner', rating: 4.9, learners: 2100, duration: '2 months', icon: '🐍' },
  { id: 3, name: 'Java', category: 'Programming', level: 'Intermediate', rating: 4.6, learners: 890, duration: '4 months', icon: '☕' },
  { id: 4, name: 'C++', category: 'Programming', level: 'Advanced', rating: 4.5, learners: 650, duration: '5 months', icon: '⚡' },
  
  // Web Development
  { id: 5, name: 'React', category: 'Web Development', level: 'Intermediate', rating: 4.7, learners: 1800, duration: '2 months', icon: '⚛️' },
  { id: 6, name: 'Node.js', category: 'Web Development', level: 'Advanced', rating: 4.6, learners: 1200, duration: '3 months', icon: '🟢' },
  { id: 7, name: 'HTML/CSS', category: 'Web Development', level: 'Beginner', rating: 4.8, learners: 3200, duration: '1 month', icon: '🎨' },
  { id: 8, name: 'Vue.js', category: 'Web Development', level: 'Intermediate', rating: 4.5, learners: 950, duration: '2 months', icon: '💚' },
  
  // Design
  { id: 9, name: 'UI/UX Design', category: 'Design', level: 'Intermediate', rating: 4.7, learners: 1500, duration: '3 months', icon: '🎨' },
  { id: 10, name: 'Figma', category: 'Design', level: 'Beginner', rating: 4.8, learners: 2200, duration: '1 month', icon: '🎯' },
  { id: 11, name: 'Adobe Photoshop', category: 'Design', level: 'Advanced', rating: 4.6, learners: 1100, duration: '4 months', icon: '🖼️' },
  { id: 12, name: 'Graphic Design', category: 'Design', level: 'Intermediate', rating: 4.5, learners: 800, duration: '3 months', icon: '🎭' },
  
  // Data Science
  { id: 13, name: 'Machine Learning', category: 'Data Science', level: 'Advanced', rating: 4.9, learners: 750, duration: '6 months', icon: '🤖' },
  { id: 14, name: 'Data Analysis', category: 'Data Science', level: 'Intermediate', rating: 4.7, learners: 1300, duration: '3 months', icon: '📊' },
  { id: 15, name: 'SQL', category: 'Data Science', level: 'Beginner', rating: 4.8, learners: 2500, duration: '2 months', icon: '🗃️' },
  { id: 16, name: 'Tableau', category: 'Data Science', level: 'Intermediate', rating: 4.6, learners: 900, duration: '2 months', icon: '📈' },
  
  // Business
  { id: 17, name: 'Digital Marketing', category: 'Business', level: 'Beginner', rating: 4.5, learners: 1800, duration: '2 months', icon: '📱' },
  { id: 18, name: 'Project Management', category: 'Business', level: 'Intermediate', rating: 4.7, learners: 1400, duration: '3 months', icon: '📋' },
  { id: 19, name: 'Financial Analysis', category: 'Business', level: 'Advanced', rating: 4.6, learners: 600, duration: '4 months', icon: '💰' },
  { id: 20, name: 'Leadership', category: 'Business', level: 'Intermediate', rating: 4.8, learners: 1100, duration: '2 months', icon: '👑' },
  
  // Creative
  { id: 21, name: 'Photography', category: 'Creative', level: 'Beginner', rating: 4.6, learners: 1600, duration: '2 months', icon: '📸' },
  { id: 22, name: 'Video Editing', category: 'Creative', level: 'Intermediate', rating: 4.7, learners: 1200, duration: '3 months', icon: '🎬' },
  { id: 23, name: 'Music Production', category: 'Creative', level: 'Advanced', rating: 4.5, learners: 700, duration: '5 months', icon: '🎵' },
  { id: 24, name: 'Writing', category: 'Creative', level: 'Beginner', rating: 4.8, learners: 2000, duration: '1 month', icon: '✍️' },
  
  // Cloud & DevOps
  { id: 25, name: 'AWS', category: 'Cloud & DevOps', level: 'Intermediate', rating: 4.7, learners: 1100, duration: '4 months', icon: '☁️' },
  { id: 26, name: 'Docker', category: 'Cloud & DevOps', level: 'Beginner', rating: 4.6, learners: 950, duration: '2 months', icon: '🐳' },
  { id: 27, name: 'Kubernetes', category: 'Cloud & DevOps', level: 'Advanced', rating: 4.8, learners: 600, duration: '5 months', icon: '⚙️' },
  { id: 28, name: 'CI/CD', category: 'Cloud & DevOps', level: 'Intermediate', rating: 4.5, learners: 800, duration: '3 months', icon: '🔄' },
];

const SkillsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [levelFilter, setLevelFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');

  const categories = ['All', ...new Set(dummySkills.map(skill => skill.category))];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredAndSortedSkills = dummySkills
    .filter(skill => {
      const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || skill.category === categoryFilter;
      const matchesLevel = levelFilter === 'All' || skill.level === levelFilter;
      return matchesSearch && matchesCategory && matchesLevel;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'learners':
          return b.learners - a.learners;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Skills Marketplace</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover and master new skills across various domains. From programming to creative arts, 
            find the perfect skill to advance your career.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-blue-600">{dummySkills.length}</div>
            <div className="text-gray-600">Total Skills</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-green-600">{categories.length - 1}</div>
            <div className="text-gray-600">Categories</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-purple-600">
              {dummySkills.reduce((sum, skill) => sum + skill.learners, 0).toLocaleString()}
            </div>
            <div className="text-gray-600">Total Learners</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-orange-600">
              {(dummySkills.reduce((sum, skill) => sum + skill.rating, 0) / dummySkills.length).toFixed(1)}
            </div>
            <div className="text-gray-600">Avg Rating</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search skills..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
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
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
            >
              {levels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Sort by Name</option>
              <option value="rating">Sort by Rating</option>
              <option value="learners">Sort by Popularity</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                className={`px-4 py-3 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
                onClick={() => setViewMode('grid')}
              >
                Grid
              </button>
              <button
                className={`px-4 py-3 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
                onClick={() => setViewMode('list')}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredAndSortedSkills.length} of {dummySkills.length} skills
          </p>
        </div>

        {/* Skills Grid/List */}
        <div className={viewMode === 'grid' ? 
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : 
          "space-y-4"
        }>
          {filteredAndSortedSkills.map(skill => (
            viewMode === 'grid' ? (
              <div key={skill.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{skill.icon}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(skill.level)}`}>
                      {skill.level}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{skill.name}</h3>
                  <p className="text-gray-600 mb-4">{skill.category}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm font-medium">{skill.rating}</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Users className="w-4 h-4 mr-1" />
                        <span className="text-sm">{skill.learners.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      <span className="text-sm">{skill.duration}</span>
                    </div>
                  </div>
                  
                  <button className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                    Start Learning
                  </button>
                </div>
              </div>
            ) : (
              <div key={skill.id} className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-between hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center space-x-4">
                  <span className="text-3xl">{skill.icon}</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{skill.name}</h3>
                    <p className="text-gray-600">{skill.category}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(skill.level)}`}>
                    {skill.level}
                  </span>
                  
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm font-medium">{skill.rating}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-500">
                    <Users className="w-4 h-4 mr-1" />
                    <span className="text-sm">{skill.learners.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="text-sm">{skill.duration}</span>
                  </div>
                  
                  <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200">
                    Start Learning
                  </button>
                </div>
              </div>
            )
          ))}
        </div>

        {filteredAndSortedSkills.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No skills found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria or filters</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('All');
                setLevelFilter('All');
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillsPage;