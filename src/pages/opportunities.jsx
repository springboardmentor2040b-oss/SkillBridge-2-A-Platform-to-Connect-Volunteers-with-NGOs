import React, { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";
import { MapPin, Clock, Search, X, SlidersHorizontal, ArrowLeft } from "lucide-react";
import { PREDEFINED_SKILLS } from "../constants/skills";

const Opportunities = () => {

  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [locationFilter, setLocationFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [myApplications, setMyApplications] = useState({});

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Fetch opportunities
  const fetchOpportunities = useCallback(async () => {
    setLoading(true);

    try {
      const params = {};

      if (search) params.search = search;
      if (selectedSkills.length > 0) params.skills = selectedSkills.join(",");
      if (locationFilter) params.location = locationFilter;
      if (statusFilter) params.status = statusFilter;

      const res = await api.get("/opportunities", { params });

      setOpportunities(res.data.data);

      // Show application status for volunteers
      if (user && user.role !== "NGO") {
        const appRes = await api.get("/applications/my");

        const appMap = {};

        appRes.data.data.forEach((app) => {
          appMap[app.opportunity._id] = app.status;
        });

        setMyApplications(appMap);
      }

    } catch (error) {
      console.error("Failed to fetch opportunities", error);
    } finally {
      setLoading(false);
    }

  }, [search, selectedSkills, locationFilter, statusFilter, user]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOpportunities();
    }, 350);

    return () => clearTimeout(timer);

  }, [fetchOpportunities]);

  // Delete opportunity (NGO)
  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this opportunity?"
    );

    if (!confirmDelete) return;

    try {

      await api.delete(`/opportunities/${id}`);

      setOpportunities((prev) =>
        prev.filter((opp) => opp._id !== id)
      );

    } catch (error) {
      console.error("Delete failed", error);
    }

  };

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    );
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedSkills([]);
    setLocationFilter("");
    setStatusFilter("");
  };

  const hasFilters =
    search ||
    selectedSkills.length > 0 ||
    locationFilter ||
    statusFilter;

  return (
    <div className="min-h-screen bg-gray-50 p-8">

      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-6">

          <div>
            <button
              onClick={() => navigate("/")}
              className="text-sm text-gray-400 hover:text-[#2F5373] mb-2 flex items-center gap-1 transition"
            >
              <ArrowLeft size={15} /> Back to Home
            </button>

            <h1 className="text-3xl font-bold text-[#2F5373] mb-1">
              Volunteer Opportunities
            </h1>

            <p className="text-gray-600">
              Find meaningful projects and contribute your skills.
            </p>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-white hover:shadow-sm transition"
          >
            <SlidersHorizontal size={16} />
            {showFilters ? "Hide" : "Show"} Filters
          </button>

        </div>

        {/* Search */}
        <div className="relative mb-4">

          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, description..."
            className="w-full pl-10 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#6CBBA2] outline-none bg-white shadow-sm"
          />

          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              <X size={16} />
            </button>
          )}

        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white border rounded-lg p-4 mb-6 shadow-sm space-y-4">

            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                Skills
              </p>

              <div className="flex flex-wrap gap-2">

                {PREDEFINED_SKILLS.map((skill) => (

                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1 rounded-full text-xs border ${
                      selectedSkills.includes(skill)
                        ? "bg-[#2F5373] text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    {skill}
                  </button>

                ))}

              </div>
            </div>

          </div>
        )}

        {/* Cards */}
        {loading ? (

          <div className="text-center py-20 text-gray-400">
            Loading opportunities...
          </div>

        ) : opportunities.length === 0 ? (

          <div className="text-center py-20 text-gray-400">
            <Search size={48} className="mx-auto mb-4 opacity-20" />
            <p>No opportunities found</p>
          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {opportunities.map((opp) => {

              const isOwner =
                user &&
                user.role === "NGO" &&
                opp.postedBy?._id === user.id;

              return (

                <div
                  key={opp._id}
                  className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition flex flex-col"
                >

                  <h3 className="text-lg font-bold text-[#2F5373]">
                    {opp.title}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {opp.postedBy?.ngoName || "NGO"}
                  </p>

                  <p className="text-gray-600 text-sm my-4">
                    {opp.description}
                  </p>

                  <div className="flex items-center text-gray-400 text-xs gap-4 mt-auto mb-4">

                    <span className="flex items-center gap-1">
                      <MapPin size={13} /> {opp.location}
                    </span>

                    {opp.deadline && (
                      <span className="flex items-center gap-1">
                        <Clock size={13} />
                        {new Date(opp.deadline).toLocaleDateString()}
                      </span>
                    )}

                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2">

                    <button
                      onClick={() =>
                        navigate(`/opportunities/${opp._id}`)
                      }
                      className="flex-1 bg-[#2F5373] text-white py-2 rounded"
                    >
                      View Details
                    </button>

                    {isOwner && (
                      <>
                    <button
                      onClick={() => navigate(`/edit-opportunity/${opp._id}`)}
                      className="px-3 bg-yellow-500 text-white rounded">
                       Edit
                    </button>

                        <button
                          onClick={() => handleDelete(opp._id)}
                          className="px-3 bg-red-500 text-white rounded"
                        >
                          Delete
                        </button>
                      </>
                    )}

                  </div>

                </div>

              );

            })}

          </div>

        )}

      </div>

    </div>
  );
};

export default Opportunities;