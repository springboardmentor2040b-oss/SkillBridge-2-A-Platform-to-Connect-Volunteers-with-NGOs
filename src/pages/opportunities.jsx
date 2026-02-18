import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Opportunities = () => {
  const [query, setQuery] = useState("");
  const [searchClicked, setSearchClicked] = useState(false);
  const navigate = useNavigate();

  const isLoggedIn = Boolean(localStorage.getItem("token")); // update if you use context

  const opportunities = [
    {
      title: "Web Developer",
      ngo: "Helping Hands",
      skill: "Web Development",
      location: "Remote",
      desc: "Develop and maintain websites for NGO initiatives."
    },
    {
      title: "Graphic Designer",
      ngo: "Creative Care",
      skill: "Graphic Design",
      location: "Remote",
      desc: "Design posters, social media graphics, and campaign materials."
    },
    {
      title: "Content Writer",
      ngo: "Bright Future",
      skill: "Content Writing",
      location: "Remote",
      desc: "Write blogs and newsletters for awareness campaigns."
    },
    {
      title: "Teaching Mentor",
      ngo: "EduServe",
      skill: "Teaching & Mentoring",
      location: "On-site",
      desc: "Support students with academic mentoring."
    },
    {
      title: "Event Coordinator",
      ngo: "Community Connect",
      skill: "Event Management",
      location: "Hyderabad",
      desc: "Plan and manage fundraising and community engagement events."
    },
    {
      title: "Fundraising Volunteer",
      ngo: "Hope Foundation",
      skill: "Fundraising",
      location: "Remote",
      desc: "Assist in organizing fundraising campaigns and donor outreach."
    },
    {
      title: "Photographer / Videographer",
      ngo: "Vision Impact",
      skill: "Photography & Videography",
      location: "On-site",
      desc: "Capture photos and videos to document NGO activities."
    },
    {
      title: "Language Support Volunteer",
      ngo: "Global Aid",
      skill: "Translation & Language Support",
      location: "Remote",
      desc: "Translate documents and provide multilingual communication support."
    },
    {
      title: "Administrative Assistant",
      ngo: "Care Alliance",
      skill: "Data Entry & Administration",
      location: "On-site",
      desc: "Maintain records, manage databases, and assist with administrative tasks."
    },
    {
      title: "Community Outreach Volunteer",
      ngo: "Social Impact Trust",
      skill: "Community Outreach",
      location: "Hyderabad",
      desc: "Engage with local communities to promote awareness programs."
    }
  ];

  const results = opportunities.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.skill.toLowerCase().includes(query.toLowerCase()) ||
    item.ngo.toLowerCase().includes(query.toLowerCase())
  );

  const handleSearch = () => {
    if (query.trim() !== "") {
      setSearchClicked(true);
    }
  };

  const handleApply = () => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      navigate("/apply-form"); 
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7f6] px-4 py-10">

     
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#2F5373] mb-6">
          Volunteer Opportunities
        </h1>
        <p className="text-gray-600 mt-2">
          Browse and apply to opportunities posted by NGOs.
        </p>
      </div>

      {/* SEARCH BAR */}
      <div className="flex justify-center mt-8 px-4">
        <div className="flex flex-col sm:flex-row w-full md:w-[700px] gap-3">

          <input
            type="text"
            placeholder="Search (Teaching, Web, Graphic...)"
            value={query}
            onChange={(e) => {
              const value = e.target.value;
              setQuery(value);
              if (value.trim() === "") {
                setSearchClicked(false);
              }
            }}
            className="flex-1 px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CBBA2]"
          />

          <button
            onClick={handleSearch}
            className="bg-[#6CBBA2] px-6 py-3 rounded-md text-white hover:bg-[#2F5373] transition"
          >
            Search
          </button>

        </div>
      </div>

      {/* LIST */}
      <div className="max-w-3xl mx-auto space-y-6 mt-8">

        {searchClicked && results.length === 0 && (
          <p className="text-center text-gray-500">No opportunities found.</p>
        )}

        {searchClicked &&
          results.map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold text-[#2F5373]">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm mt-1">{item.ngo}</p>

              <div className="mt-2 text-sm text-gray-700">
                <p><strong>Skill:</strong> {item.skill}</p>
                <p><strong>Location:</strong> {item.location}</p>
              </div>

              <p className="text-gray-600 mt-3">{item.desc}</p>

              <button
                onClick={handleApply}
                className="mt-4 bg-[#6CBBA2] px-5 py-2 rounded-md text-white hover:bg-[#2F5373] transition"
              >
                Apply Now
              </button>
            </div>
          ))
        }
      </div>

    </div>
  );
};

export default Opportunities;
