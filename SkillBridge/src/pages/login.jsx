import React from "react";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="min-h-screen bg-white">

     
      <div className="flex justify-between items-center px-10 py-4 bg-white border-b">
        <div className="flex items-center gap-2">
          <img
          src="/logo.jpeg"
          alt="SkillBridge Logo"
          className="w-[90px] h-[45px] object-contain"/>
         <span className="text-3xl font-semibold text-[#2F5373]">
          SkillBridge
         </span>
         </div>

        <div className="flex gap-6 text-[#2F5373] font-medium">
          <a href="#" className="hover:text-[#6CBBA2] transition">
            About Us
          </a>
          <a href="#" className="hover:text-[#6CBBA2] transition">
            Contact Us
          </a>
          <a href="#" className="hover:text-[#6CBBA2] transition">
            FAQs
          </a>
        </div>
      </div>

     
      <div className="flex justify-center items-center h-[85vh]">
        <div className="bg-white p-8 w-[360px] rounded-xl shadow-lg text-center">

          <h2 className="text-2xl font-semibold text-[#2F5373] mb-6">
            Login
          </h2>

          <input
            type="email"
            placeholder="Email"
            className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CBBA2]"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CBBA2]"
          />

          <button className="w-full bg-[#6CBBA2] text-white py-2 rounded-md font-medium hover:bg-[#2F5373] transition">
            Login
          </button>

          <p className="mt-4 text-sm">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-[#6CBBA2] font-medium hover:underline"
            >
              Register
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;