import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Connect = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  // Dummy NGO Data (Replace with backend later)
  const ngos = [
    {
      id: 1,
      name: "Helping Hands",
      category: "Education",
      location: "Bangalore",
      description: "Empowering underprivileged students through education.",
      skills: ["Teaching", "Web Development"],
    },
    {
      id: 2,
      name: "Care for Life",
      category: "Healthcare",
      location: "Chennai",
      description: "Providing healthcare support in rural communities.",
      skills: ["Medical Support", "Graphic Design"],
    },
    {
      id: 3,
      name: "Green Earth",
      category: "Environment",
      location: "Hyderabad",
      description: "Promoting sustainability and environmental awareness.",
      skills: ["Marketing", "Event Management"],
    },
  ];

  // Filter Logic
  const filteredNGOs = ngos.filter((ngo) => {
    const matchesSearch =
      ngo.name.toLowerCase().includes(search.toLowerCase()) ||
      ngo.location.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || ngo.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white p-10">
      {/* Header */}
      <h1 className="text-3xl font-bold text-[#2F5373] mb-2">
        Connect & Learn
      </h1>
      <p className="text-gray-600 mb-6">
        Discover NGOs and explore how your skills can create impact.
      </p>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search by NGO name or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded-md w-full md:w-1/2"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded-md w-full md:w-1/4"
        >
          <option value="All">All Categories</option>
          <option value="Education">Education</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Environment">Environment</option>
        </select>
      </div>

      {/* NGO Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {filteredNGOs.length > 0 ? (
          filteredNGOs.map((ngo) => (
            <div
              key={ngo.id}
              className="bg-gray-100 p-6 rounded-lg shadow hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold text-[#2F5373] mb-2">
                {ngo.name}
              </h2>
              <p className="text-sm text-gray-500 mb-2">
                {ngo.category} | {ngo.location}
              </p>
              <p className="text-gray-700 mb-3">{ngo.description}</p>

              <p className="text-sm font-medium mb-2">Skills Needed:</p>
              <ul className="text-sm text-gray-600 mb-4 list-disc list-inside">
                {ngo.skills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>

              <button
               onClick={() => navigate("/login")}
               className="bg-[#6CBBA2] px-6 py-3 rounded-md text-white hover:bg-[#2F5373] transition">
                View Profile
              </button>

            </div>
          ))
        ) : (
          <p className="text-gray-500">No NGOs found.</p>
        )}
      </div>
    </div>
  );
};

export default Connect;