import React, { useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [activeSection, setActiveSection] = useState("home");

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
              <Link to="/connect" className="flex-1">
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
