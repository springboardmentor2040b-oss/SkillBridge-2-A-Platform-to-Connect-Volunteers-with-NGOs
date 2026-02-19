import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { MapPin, Clock } from "lucide-react";

const Opportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const res = await api.get('/opportunities');
        setOpportunities(res.data.data);
      } catch (error) {
        console.error("Failed to fetch opportunities", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-[#2F5373] mb-2">
          Volunteer Opportunities
        </h1>
        <p className="text-gray-600 mb-8">
          Find meaningful projects and contribute your skills to causes you care about.
        </p>

        {loading ? (
          <div className="text-center py-10">Loading opportunities...</div>
        ) : opportunities.length === 0 ? (
          <div className="text-center py-10 text-gray-500">No active opportunities found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opp) => (
              <div key={opp._id} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#2F5373]">{opp.title}</h3>
                    <p className="text-sm text-gray-600 font-medium">{opp.postedBy?.ngoName || 'NGO'}</p>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    {opp.status}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {opp.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {opp.skillsRequired.map((skill, idx) => (
                    <span key={idx} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center text-gray-500 text-xs mb-6 gap-4">
                  <span className="flex items-center gap-1">
                    <MapPin size={14} /> {opp.location}
                  </span>
                  {opp.deadline && (
                    <span className="flex items-center gap-1">
                      <Clock size={14} /> {new Date(opp.deadline).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <button className="w-full bg-[#2F5373] text-white py-2 rounded hover:bg-[#1a3b55] transition">
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
