import React, { useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [query, setQuery] = useState("");
  const [searchClicked, setSearchClicked] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

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
    desc: "Write blogs, newsletters, and website content for awareness campaigns."
  },
  {
    title: "Teaching Mentor",
    ngo: "EduServe",
    skill: "Teaching & Mentoring",
    location: "On-site",
    desc: "Support students with academic mentoring and skill development."
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

  return (
    <div className="min-h-screen bg-[#f5f7f6]">

      {/* ================= NAVBAR ================= */}
       <div className="flex justify-between items-center px-6 sm:px-10 py-4 bg-white border-b">

  <div
  onClick={() => setActiveSection("home")}
  className="flex items-center gap-2 cursor-pointer min-w-0"
>
  <img
    src="/logo.jpeg"
    alt="SkillBridge Logo"
    className="w-[70px] sm:w-[90px] h-auto object-contain"
  />
  <span className="text-2xl sm:text-3xl font-semibold text-[#2F5373]">
    SkillBridge
  </span>
</div>


  {/* Desktop Menu */}
  <div className="hidden md:flex gap-8 items-center text-[#2F5373] font-medium">
    <button
      onClick={() => setActiveSection("about")}
      className="hover:text-[#6CBBA2] transition"
    >
      About Us
    </button>

    <button
      onClick={() => setActiveSection("contact")}
      className="hover:text-[#6CBBA2] transition"
    >
      Contact Us
    </button>

    <button
      onClick={() => setActiveSection("faq")}
      className="hover:text-[#6CBBA2] transition"
    >
      FAQs
    </button>

    <Link to="/login">
      <button className="bg-[#6CBBA2] px-5 py-1.5 rounded-md text-white hover:bg-[#2F5373] transition">
        Login
      </button>
    </Link>
  </div>

  {/* Mobile Login Button */}
  <div className="md:hidden">
    <Link to="/login">
      <button className="bg-[#6CBBA2] px-4 py-1.5 rounded-md text-white hover:bg-[#2F5373] transition">
        Login
      </button>
    </Link>
  </div>

</div>

      {/* ================= HOME CONTENT ================= */}
      {activeSection === "home" && (
        <>
          {/* HERO */}
          <div className="flex flex-col items-center text-center mt-14 px-4">
            <h1 className="text-4xl font-semibold text-[#2F5373] mb-4">
              Welcome to SkillBridge
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl">
              A platform where volunteers connect with NGOs to contribute skills and make an impact.
            </p>
          </div>

          {/* CARDS SECTION */}
<div className="flex justify-center mt-8 px-4">
  <div className="bg-white rounded-xl shadow-md 
                  flex flex-col md:flex-row 
                  w-full md:w-[700px] 
                  overflow-hidden">

    {/* Find Opportunities */}
    <Link to="/opportunities" className="flex-1 md:border-r">
      <div className="p-6 text-center cursor-pointer hover:shadow-lg transition">
        <img
          src="/search.jpeg"
          alt="Search"
          className="w-[70px] h-[55px] mb-3 mx-auto"
        />
        <h3 className="text-lg font-semibold text-[#2F5373]">
          Find Opportunities
        </h3>
        <p className="text-gray-600 text-sm mt-2">
          Search and explore volunteer opportunities easily.
        </p>
      </div>
    </Link>

    {/* Connect & Learn */}
    <Link to="/ngos" className="flex-1">
      <div className="p-6 text-center cursor-pointer hover:shadow-lg transition">
        <img
          src="/handshake.jpeg"
          alt="Handshake"
          className="w-[70px] h-[55px] mb-3 mx-auto"
        />
        <h3 className="text-lg font-semibold text-[#2F5373]">
          Connect & Learn
        </h3>
        <p className="text-gray-600 text-sm mt-2">
          Learn about NGOs and how you can contribute your skills.
        </p>
      </div>
    </Link>

  </div>
</div>


          {/* SEARCH */}
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
        </>
      )}

      {/* ================= ABOUT ================= */}
      {activeSection === "about" && (
        <div className="flex justify-center mt-20 px-4">
          <div className="bg-white w-[700px] rounded-xl shadow-md p-10">
            <h2 className="text-3xl font-semibold text-[#2F5373] mb-4">
              About SkillBridge
            </h2>
            <p className="text-gray-600">
              SkillBridge connects passionate volunteers with NGOs to create
              real impact. Our mission is to bridge the gap between skills and
              social needs by providing a simple platform for collaboration.
            </p>
          </div>
        </div>
      )}

      {/* ================= CONTACT ================= */}
      {activeSection === "contact" && (
        <div className="flex justify-center mt-20 px-4">
          <div className="bg-gray-50 w-[700px] rounded-xl shadow-md p-10">
            <h2 className="text-3xl font-semibold text-[#2F5373] mb-4">
              Contact Us
            </h2>
            <p className="text-gray-600">Email: support@skillbridge.com</p>
          </div>
        </div>
      )}

      {/* ================= FAQ ================= */}
      {activeSection === "faq" && (
  <div className="flex justify-center mt-20 px-4">
    <div className="bg-white w-[700px] rounded-xl shadow-md p-10">
      <h2 className="text-3xl font-semibold text-[#2F5373] mb-6">
        FAQs
      </h2>

      <div className="mb-5">
        <h3 className="font-semibold text-[#2F5373]">
          Who can register as a volunteer?
        </h3>
        <p className="text-gray-600 mt-1">
          Anyone with a skill and willingness to contribute to social causes
          can register as a volunteer.
        </p>
      </div>

      <div className="mb-5">
        <h3 className="font-semibold text-[#2F5373]">
          Is SkillBridge free to use?
        </h3>
        <p className="text-gray-600 mt-1">
          Yes, SkillBridge is completely free for both volunteers and NGOs.
        </p>
      </div>

      <div className="mb-5">
        <h3 className="font-semibold text-[#2F5373]">
          How do I apply for an opportunity?
        </h3>
        <p className="text-gray-600 mt-1">
          After logging in, you can browse opportunities and apply directly
          through the platform.
        </p>
      </div>

      <div className="mb-5">
        <h3 className="font-semibold text-[#2F5373]">
          Can NGOs post opportunities?
        </h3>
        <p className="text-gray-600 mt-1">
          Yes, registered NGOs can post volunteer opportunities and connect
          with skilled individuals.
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-[#2F5373]">
          Are opportunities remote or location-based?
        </h3>
        <p className="text-gray-600 mt-1">
          Both. Some opportunities are remote, while others may require
          in-person participation depending on the NGO.
        </p>
      </div>
    </div>
  </div>
)}


    </div>
  );
};

export default Home;