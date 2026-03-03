import React from "react";
import hero from "../Screenshot 2026-02-13 133552.png";

function Home({ goToLogin, goToRegister }) {

  return (

    <div>

      {/* HERO */}
      <section className="px-10 py-16 grid md:grid-cols-2 gap-10 items-center">

        <div>

          <h2 className="text-4xl font-bold text-gray-800 leading-snug">
            Connect Volunteers <br/>
            with NGOs Easily
          </h2>

          <p className="mt-4 text-gray-500">
            SkillBridge helps volunteers find meaningful opportunities and NGOs connect with skilled people to make real impact.
          </p>

          <div className="mt-6 space-x-4">

            <button
              onClick={goToRegister}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Get Started
            </button>

            <button
              onClick={goToLogin}
              className="border border-blue-600 text-blue-600 px-6 py-2 rounded-md hover:bg-blue-600 hover:text-white"
            >
              Browse Opportunities
            </button>

          </div>

        </div>


        <div className="flex justify-center">
          <img src={hero} alt="hero" className="w-[400px]" />
        </div>

      </section>


      {/* HOW IT WORKS */}
      <section className="px-10 pb-16">

        <h3 className="text-center text-xl font-semibold bg-gray-300 inline-block px-6 py-2 rounded-md mx-auto block w-fit">
          How SkillBridge Works
        </h3>

        <div className="grid md:grid-cols-3 gap-8 mt-10">

          <div className="bg-white p-6 rounded-xl shadow text-center">
            <div className="text-5xl">👤</div>
            <h4 className="font-semibold text-lg mt-3">Create Profile</h4>
            <p className="text-gray-500 text-sm mt-2">
              Register as volunteer or NGO
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow text-center">
            <div className="text-5xl">🔍</div>
            <h4 className="font-semibold text-lg mt-3">
              Find Opportunities
            </h4>
            <p className="text-gray-500 text-sm mt-2">
              Search and apply easily
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow text-center">
            <div className="text-5xl">🤝</div>
            <h4 className="font-semibold text-lg mt-3">
              Connect & Collaborate
            </h4>
            <p className="text-gray-500 text-sm mt-2">
              Communicate and work together
            </p>
          </div>

        </div>

      </section>


      {/* FOOTER */}
      <footer className="bg-gray-900 text-white text-center py-4">
        © 2026 SkillBridge. All rights reserved.
      </footer>

    </div>

  );

}

export default Home;
