import React, { useState } from "react";
import Navbar from "../components/Navbar";

const Home = () => {
  const [activeSection, setActiveSection] = useState("home");

  return (
    <div className="min-h-screen bg-[#f5f7f6] dark:bg-slate-900 transition-colors duration-300">
      <Navbar />

      {/* ================= HOME CONTENT ================= */}
      {activeSection === "home" && (
        <>
          {/* HERO */}
          <div className="flex flex-col items-center text-center mt-14 px-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#2F5373] dark:text-white mb-4">
              Welcome to SkillBridge
            </h1>
            <p className="text-gray-600 dark:text-slate-300 text-base sm:text-lg max-w-2xl">
              A platform where volunteers connect with NGOs to contribute skills and make an impact.
            </p>

            {/* Nav Buttons */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {["about", "contact", "faq"].map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className="px-4 py-1.5 rounded-full border border-[#6CBBA2] text-[#6CBBA2] hover:bg-[#6CBBA2] hover:text-white dark:hover:text-white transition capitalize text-sm font-medium"
                >
                  {section === "faq" ? "FAQs" : `${section.charAt(0).toUpperCase() + section.slice(1)} Us`}
                </button>
              ))}
            </div>
          </div>

          {/* CARDS SECTION */}
          <div className="flex justify-center mt-10 px-4 pb-16">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md flex flex-col sm:flex-row w-full max-w-2xl overflow-hidden">

              {/* Find Opportunities */}
              <a href="/opportunities" className="flex-1 sm:border-r border-b sm:border-b-0 border-slate-200 dark:border-slate-700">
                <div className="p-6 sm:p-8 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                  <img
                    src="/search.png"
                    alt="Search"
                    className="w-16 h-12 mb-3 mx-auto object-contain rounded"
                  />
                  <h3 className="text-lg font-semibold text-[#2F5373] dark:text-white">
                    Find Opportunities
                  </h3>
                  <p className="text-gray-500 dark:text-slate-400 text-sm mt-2">
                    Search and explore volunteer opportunities easily.
                  </p>
                </div>
              </a>

              {/* Connect & Learn */}
              <a href="/NGOs" className="flex-1">
                <div className="p-6 sm:p-8 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                  <img
                    src="/handshake.png"
                    alt="Handshake"
                    className="w-16 h-12 mb-3 mx-auto object-contain rounded"
                  />
                  <h3 className="text-lg font-semibold text-[#2F5373] dark:text-white">
                    Connect &amp; Learn
                  </h3>
                  <p className="text-gray-500 dark:text-slate-400 text-sm mt-2">
                    Learn about NGOs and how you can contribute your skills.
                  </p>
                </div>
              </a>

            </div>
          </div>
        </>
      )}

      {/* ================= ABOUT ================= */}
      {activeSection === "about" && (
        <div className="flex justify-center mt-12 px-4 pb-16">
          <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-2xl shadow-md p-8 sm:p-10">
            <button onClick={() => setActiveSection("home")} className="text-[#6CBBA2] text-sm mb-4 hover:underline">&larr; Back</button>
            <h2 className="text-3xl font-bold text-[#2F5373] dark:text-white mb-4">
              About SkillBridge
            </h2>
            <p className="text-gray-600 dark:text-slate-300 leading-relaxed">
              SkillBridge connects passionate volunteers with NGOs to create real impact. Our mission is to bridge the gap between skills and social needs by providing a simple platform for collaboration.
            </p>
          </div>
        </div>
      )}

      {/* ================= CONTACT ================= */}
      {activeSection === "contact" && (
        <div className="flex justify-center mt-12 px-4 pb-16">
          <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-2xl shadow-md p-8 sm:p-10">
            <button onClick={() => setActiveSection("home")} className="text-[#6CBBA2] text-sm mb-4 hover:underline">&larr; Back</button>
            <h2 className="text-3xl font-bold text-[#2F5373] dark:text-white mb-4">
              Contact Us
            </h2>
            <p className="text-gray-600 dark:text-slate-300">📧 Email: <a href="mailto:support@skillbridge.com" className="text-[#6CBBA2] hover:underline">support@skillbridge.com</a></p>
          </div>
        </div>
      )}

      {/* ================= FAQ ================= */}
      {activeSection === "faq" && (
        <div className="flex justify-center mt-12 px-4 pb-16">
          <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-2xl shadow-md p-8 sm:p-10">
            <button onClick={() => setActiveSection("home")} className="text-[#6CBBA2] text-sm mb-4 hover:underline">&larr; Back</button>
            <h2 className="text-3xl font-bold text-[#2F5373] dark:text-white mb-6">FAQs</h2>
            {[
              { q: "Who can register as a volunteer?", a: "Anyone with a skill and willingness to contribute to social causes can register as a volunteer." },
              { q: "Is SkillBridge free to use?", a: "Yes, SkillBridge is completely free for both volunteers and NGOs." },
              { q: "How do I apply for an opportunity?", a: "After logging in, you can browse opportunities and apply directly through the platform." },
              { q: "Can NGOs post opportunities?", a: "Yes, registered NGOs can post volunteer opportunities and connect with skilled individuals." },
              { q: "Are opportunities remote or location-based?", a: "Both. Some opportunities are remote, while others may require in-person participation depending on the NGO." },
            ].map(({ q, a }) => (
              <div key={q} className="mb-5 border-b border-slate-100 dark:border-slate-700 pb-4 last:border-0">
                <h3 className="font-semibold text-[#2F5373] dark:text-white">{q}</h3>
                <p className="text-gray-600 dark:text-slate-300 mt-1 text-sm">{a}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
