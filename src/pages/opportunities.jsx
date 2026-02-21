import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { MapPin, Clock, Search, X, SlidersHorizontal } from "lucide-react";

const PREDEFINED_SKILLS = [
  'React', 'Node.js', 'JavaScript', 'Python', 'TypeScript',
  'MongoDB', 'Figma', 'Communication', 'Leadership', 'Project Management',
];

const Opportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [locationFilter, setLocationFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const navigate = useNavigate();

  const fetchOpportunities = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (selectedSkills.length > 0) params.skills = selectedSkills.join(',');
      if (locationFilter) params.location = locationFilter;
      if (statusFilter) params.status = statusFilter;

      const res = await api.get('/opportunities', { params });
      setOpportunities(res.data.data);
    } catch (error) {
      console.error("Failed to fetch opportunities", error);
    } finally {
      setLoading(false);
    }
  }, [search, selectedSkills, locationFilter, statusFilter]);

  // Debounce fetch so we don't spam API on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOpportunities();
    }, 350);
    return () => clearTimeout(timer);
  }, [fetchOpportunities]);

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedSkills([]);
    setLocationFilter('');
    setStatusFilter('');
  };

  const hasFilters = search || selectedSkills.length > 0 || locationFilter || statusFilter;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#2F5373] mb-1">Volunteer Opportunities</h1>
            <p className="text-gray-600">Find meaningful projects and contribute your skills to causes you care about.</p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-white hover:shadow-sm transition"
          >
            <SlidersHorizontal size={16} />
            {showFilters ? 'Hide' : 'Show'} Filters
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, description..."
            className="w-full pl-10 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#6CBBA2] outline-none bg-white shadow-sm"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white border rounded-lg p-4 mb-6 shadow-sm space-y-4">
            {/* Skills */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Skills</p>
              <div className="flex flex-wrap gap-2">
                {PREDEFINED_SKILLS.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
                      selectedSkills.includes(skill)
                        ? 'bg-[#2F5373] text-white border-[#2F5373]'
                        : 'bg-gray-100 text-gray-700 border-gray-200 hover:border-[#6CBBA2]'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            {/* Location + Status + Clear */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  placeholder="Filter by location..."
                  className="w-full pl-9 pr-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-[#6CBBA2] outline-none"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-[#6CBBA2] outline-none text-gray-700"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="closed">Closed</option>
                <option value="paused">Paused</option>
              </select>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 px-4 py-2 text-sm text-red-500 border border-red-200 rounded-md hover:bg-red-50 transition"
                >
                  <X size={14} /> Clear All
                </button>
              )}
            </div>
          </div>
        )}

        {/* Results Count */}
        {!loading && (
          <p className="text-sm text-gray-500 mb-4">
            <span className="font-semibold text-[#2F5373]">{opportunities.length}</span> opportunit{opportunities.length === 1 ? 'y' : 'ies'} found
            {hasFilters && <span className="text-[#6CBBA2] ml-1">(filtered)</span>}
          </p>
        )}

        {/* Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm border animate-pulse">
                <div className="h-5 bg-gray-200 rounded mb-3 w-3/4" />
                <div className="h-3 bg-gray-100 rounded mb-2 w-1/2" />
                <div className="h-16 bg-gray-100 rounded mb-4" />
                <div className="flex gap-2 mb-4">
                  <div className="h-5 w-16 bg-gray-100 rounded-full" />
                  <div className="h-5 w-20 bg-gray-100 rounded-full" />
                </div>
                <div className="h-8 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : opportunities.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Search size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium text-gray-500">No opportunities match your filters.</p>
            {hasFilters && (
              <button onClick={clearFilters} className="mt-3 text-sm text-[#6CBBA2] hover:underline">
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opp) => (
              <div key={opp._id} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-[#2F5373] leading-tight">{opp.title}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{opp.postedBy?.ngoName || 'NGO'}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ml-2 ${
                    opp.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : opp.status === 'closed'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {opp.status}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{opp.description}</p>

                {/* Skill tags — clickable to add as filter */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {opp.skillsRequired.map((skill, idx) => (
                    <span
                      key={idx}
                      onClick={() => toggleSkill(skill)}
                      title="Click to filter by this skill"
                      className={`text-xs px-2 py-1 rounded cursor-pointer transition ${
                        selectedSkills.includes(skill)
                          ? 'bg-[#2F5373] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-[#e8f5f1]'
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center text-gray-400 text-xs gap-4 mt-auto mb-4">
                  <span className="flex items-center gap-1">
                    <MapPin size={13} /> {opp.location}
                  </span>
                  {opp.deadline && (
                    <span className="flex items-center gap-1">
                      <Clock size={13} /> {new Date(opp.deadline).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => navigate(`/opportunities/${opp._id}`)}
                  className="w-full bg-[#2F5373] text-white py-2 rounded hover:bg-[#1a3b55] transition text-sm font-medium">
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Opportunities;