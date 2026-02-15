import React, { useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {

  const [query, setQuery] = useState("");
  const [searchClicked, setSearchClicked] = useState(false);

  const opportunities = [
    {
      title: "Teaching Assistant",
      ngo: "Helping Hands",
      skill: "Teaching",
      location: "Remote",
      desc: "Help rural students learn basic math and English."
    },
    {
      title: "Web Developer",
      ngo: "Green Earth",
      skill: "Web Development",
      location: "Remote",
      desc: "Build a website for an environmental NGO."
    },
    {
      title: "Graphic Designer",
      ngo: "Care Foundation",
      skill: "Design",
      location: "Hyderabad",
      desc: "Create posters and social media graphics."
    }
  ];

  const results = opportunities.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.skill.toLowerCase().includes(query.toLowerCase()) ||
    item.ngo.toLowerCase().includes(query.toLowerCase())
  );

  const handleSearch = () => {
    setSearchClicked(true);
  };

  return (
    <div className="min-h-screen bg-[#f5f7f6]">

      {/* NAVBAR */}
      <div className="flex justify-between items-center px-10 py-4 bg-white border-b">
        <div className="flex items-center gap-2">
          <img
            src="/logo.jpeg"
            alt="SkillBridge Logo"
            className="w-[90px] h-[45px] object-contain"
          />
          <span className="text-3xl font-semibold text-[#2F5373]">
            SkillBridge
          </span>
        </div>

        <div className="flex gap-8 items-center text-[#2F5373] font-medium">
          <a href="#">About Us</a>
          <a href="#">Contact Us</a>
          <a href="#">FAQs</a>

          <Link to="/login">
            <button className="bg-[#6CBBA2] px-5 py-1.5 rounded-md text-white hover:bg-[#2F5373]">
              Login
            </button>
          </Link>
        </div>
      </div>

      {/* HERO */}
      <div className="flex flex-col items-center text-center mt-14 px-4">
        <h1 className="text-4xl font-semibold text-[#2F5373] mb-4">
          Welcome to SkillBridge
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl">
          Discover volunteering opportunities based on your skills and interests.
        </p>
      </div>

      {/* CARDS */}
      <div className="flex justify-center mt-10 px-4">
        <div className="bg-white rounded-xl shadow-md flex w-[700px] overflow-hidden">

          <div className="flex-1 p-6 border-r text-center">
            <img src="/search.jpeg" alt="Search" className="w-[80px] h-[60px] mb-3 mx-auto" />
            <h3 className="text-lg font-semibold text-[#2F5373]">Find Opportunities</h3>
            <p className="text-gray-600 text-sm mt-2">
              Search and explore volunteer opportunities easily.
            </p>
          </div>

          <div className="flex-1 p-6 text-center">
            <img src="/handshake.jpeg" alt="Handshake" className="w-[80px] h-[60px] mb-3 mx-auto" />
            <h3 className="text-lg font-semibold text-[#2F5373]">Connect & Learn</h3>
            <p className="text-gray-600 text-sm mt-2">
              Learn about NGOs and how you can contribute your skills.
            </p>
          </div>

        </div>
      </div>

      {/* SEARCH */}
      <div className="flex justify-center mt-10 gap-4 px-4">
        <input
          type="text"
          placeholder="Search (Teaching, Web, Graphic...)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-[520px] px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CBBA2]"
        />

        <button
          onClick={handleSearch}
          className="bg-[#6CBBA2] px-6 py-2 rounded-md text-white hover:bg-[#2F5373]"
        >
          Search
        </button>
      </div>

      {/* RESULTS */}
      {searchClicked && (
        <div className="flex justify-center mt-8 px-4">
          <div className="w-[520px]">

            {results.length === 0 && (
              <p className="text-center text-gray-500">
                No opportunities found for "{query}"
              </p>
            )}

            {results.map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-md shadow mb-4">
                <h3 className="text-lg font-semibold text-[#2F5373]">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600">{item.ngo}</p>
                <p className="text-sm">Skill: {item.skill}</p>
                <p className="text-sm">Location: {item.location}</p>
                <p className="text-sm mt-1">{item.desc}</p>
              </div>
            ))}

          </div>
        </div>
      )}

    </div>
  );
};

export default Home;
