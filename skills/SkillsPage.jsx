import { useState, useEffect } from 'react';
import axios from 'axios';
import SkillCard from './SkillCard';

const SkillsPage = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    level: '',
    searchTerm: ''
  });

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5003/api/skills');
        setSkills(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch skills. Please try again later.');
        setLoading(false);
        console.error('Error fetching skills:', err);
      }
    };

    fetchSkills();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearchChange = (e) => {
    setFilters(prev => ({
      ...prev,
      searchTerm: e.target.value
    }));
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      level: '',
      searchTerm: ''
    });
  };

  // Filter skills based on selected filters and search term
  const filteredSkills = skills.filter(skill => {
    const matchesCategory = filters.category ? skill.category === filters.category : true;
    const matchesLevel = filters.level ? skill.level === filters.level : true;
    const matchesSearch = filters.searchTerm
      ? skill.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        skill.description.toLowerCase().includes(filters.searchTerm.toLowerCase())
      : true;

    return matchesCategory && matchesLevel && matchesSearch;
  });

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Explore Skills</h1>
        <p className="text-gray-600 max-w-2xl">Discover skills taught by experts in our community. Filter by category, level, or search for specific skills.</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search skills..."
              className="form-input w-full"
              value={filters.searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              id="category"
              name="category"
              className="form-input w-full"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="">All Categories</option>
              <option value="Programming">Programming</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Business">Business</option>
              <option value="Music">Music</option>
              <option value="Language">Language</option>
              <option value="Cooking">Cooking</option>
              <option value="Fitness">Fitness</option>
              <option value="Academic">Academic</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">Level</label>
            <select
              id="level"
              name="level"
              className="form-input w-full"
              value={filters.level}
              onChange={handleFilterChange}
            >
              <option value="">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="All Levels">All Levels</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button 
              onClick={resetFilters}
              className="btn-outline w-full"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {filteredSkills.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-medium text-gray-700 mb-2">No skills found</h3>
          <p className="text-gray-500">Try adjusting your filters or search term</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map(skill => (
            <SkillCard key={skill._id} skill={skill} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SkillsPage;