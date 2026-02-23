import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { PREDEFINED_SKILLS } from "../constants/skills";

const Register = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    skills: [],
    location: "",
    ngoName: "",
    organizationDescription: "",
    website: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSkillChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({ ...formData, skills: [...formData.skills, value] });
    } else {
      setFormData({ ...formData, skills: formData.skills.filter((skill) => skill !== value) });
    }
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Enter a valid email address";

    if (!formData.role) newErrors.role = "Select a role";

    if (formData.role === "Volunteer") {
      if (formData.skills.length === 0) newErrors.skills = "Select at least one skill";
      if (!formData.location.trim()) newErrors.location = "Location is required";
    }

    if (formData.role === "NGO") {
      if (!formData.ngoName.trim()) newErrors.ngoName = "Organization name is required";
      if (!formData.organizationDescription.trim()) newErrors.organizationDescription = "Description is required";
      if (!formData.location.trim()) newErrors.location = "Location is required";
      if (formData.website && !/^https?:\/\/.+\..+/.test(formData.website)) newErrors.website = "Enter a valid website URL";
    }

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    else if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(formData.password))
      newErrors.password = "Password must contain 1 uppercase, 1 number & 1 special character";

    if (!formData.confirmPassword) newErrors.confirmPassword = "Confirm password is required";
    else if (formData.confirmPassword !== formData.password) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (validate()) {
      const success = await register(formData);
      if (success) navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-white">

      {/* Navbar */}
      <div className="flex justify-between items-center px-10 py-4 bg-white border-b">
        <div className="flex items-center gap-2">
          <img src="/logo.jpeg" alt="SkillBridge Logo" className="w-[90px] h-[45px] object-contain" />
          <span className="text-2xl sm:text-3xl font-semibold text-[#2F5373]">SkillBridge</span>
        </div>
      </div>

      {/* Register Box */}
      <div className="flex justify-center items-center min-h-[85vh]">
        <div className="bg-white p-6 sm:p-8 w-full max-w-md mx-4 rounded-xl shadow-lg">

          <h2 className="text-2xl font-semibold text-[#2F5373] mb-6 text-center">Register</h2>

          {/* Name */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-[#2F5373] mb-1">Full Name</label>
            <input type="text" name="name" placeholder="Enter your name" value={formData.name} onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CBBA2]" />
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-[#2F5373] mb-1">Email</label>
            <input type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CBBA2]" />
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          </div>

          {/* Role */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-[#2F5373] mb-1">Select Role</label>
            <select name="role" value={formData.role} onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CBBA2]">
              <option value="">Choose role</option>
              <option value="Volunteer">Volunteer</option>
              <option value="NGO">NGO</option>
            </select>
            <p className="text-red-500 text-sm mt-1">{errors.role}</p>
          </div>

          {/* Volunteer Fields */}
          {formData.role === "Volunteer" && (
            <>
              <div className="mb-3">
                <label className="block text-sm font-medium text-[#2F5373] mb-2">Select Skills</label>
                <div className="grid grid-cols-2 gap-2">
                  {PREDEFINED_SKILLS.map((skill) => (
                    <label key={skill} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        value={skill}
                        checked={formData.skills.includes(skill)}
                        onChange={handleSkillChange}
                        className="accent-[#6CBBA2]"
                      />
                      {skill}
                    </label>
                  ))}
                </div>
                <p className="text-red-500 text-sm mt-1">{errors.skills}</p>
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-[#2F5373] mb-1">Location</label>
                <input type="text" name="location" placeholder="Enter your location" value={formData.location} onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CBBA2]" />
                <p className="text-red-500 text-sm mt-1">{errors.location}</p>
              </div>
            </>
          )}

          {/* NGO Fields */}
          {formData.role === "NGO" && (
            <>
              <div className="mb-3">
                <label className="block text-sm font-medium text-[#2F5373] mb-1">Organization Name</label>
                <input type="text" name="ngoName" placeholder="Enter organization name" value={formData.ngoName} onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CBBA2]" />
                <p className="text-red-500 text-sm mt-1">{errors.ngoName}</p>
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-[#2F5373] mb-1">Organization Description</label>
                <textarea name="organizationDescription" placeholder="Briefly describe your organization" value={formData.organizationDescription} onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CBBA2]" />
                <p className="text-red-500 text-sm mt-1">{errors.organizationDescription}</p>
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-[#2F5373] mb-1">Location</label>
                <input type="text" name="location" placeholder="Enter your location" value={formData.location} onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CBBA2]" />
                <p className="text-red-500 text-sm mt-1">{errors.location}</p>
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-[#2F5373] mb-1">Website <span className="text-gray-400 text-xs">(optional)</span></label>
                <input type="text" name="website" placeholder="https://yourwebsite.com" value={formData.website} onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CBBA2]" />
                <p className="text-red-500 text-sm mt-1">{errors.website}</p>
              </div>
            </>
          )}

          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#2F5373] mb-1">Password</label>
            <input type="password" name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CBBA2]" />
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#2F5373] mb-1">Confirm Password</label>
            <input type="password" name="confirmPassword" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CBBA2]" />
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
          </div>

          <button onClick={handleRegister}
            className="w-full bg-[#6CBBA2] text-white py-2 rounded-md font-medium hover:bg-[#2F5373] transition">
            Register
          </button>

          <p className="mt-4 text-sm text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-[#6CBBA2] font-medium hover:underline">Login</Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Register;