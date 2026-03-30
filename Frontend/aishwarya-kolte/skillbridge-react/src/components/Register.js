import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Register() {

  const navigate = useNavigate();

  const [role, setRole] = useState("volunteer");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    organizationName: "",
    location: "",
    organizationDescription: "",
    websiteUrl: ""
  });

  const [errors, setErrors] = useState({});

  const skillsList = [
    "Web Development",
    "UI/UX Design",
    "Graphic Design",
    "Content Writing",
    "Digital Marketing",
    "Data Analysis",
    "Mobile App Development",
    "Teaching",
    "Translation",
    "Event Management"
  ];

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Strong password validation
  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Validation
  const validate = () => {

    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Enter valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(formData.password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase, number, special character and 8+ characters";
    }

    if (role === "volunteer" && selectedSkills.length === 0) {
      newErrors.skills = "Select at least one skill";
    }

    if (role === "ngo") {

      if (!formData.organizationName.trim())
        newErrors.organizationName = "Organization name required";

      if (!formData.location.trim())
        newErrors.location = "Location required";

      if (!formData.organizationDescription.trim())
        newErrors.organizationDescription = "Description required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = async () => {

    if (!validate()) return;

    try {
      const response = await fetch(
        "http://localhost:5000/api/users/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            role,
            skills: selectedSkills
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful");
        navigate("/login");
      } else {
        alert(data.message);
      }

    } catch {
      alert("Backend connection error");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">

      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">

        <h2 className="text-2xl font-bold text-center mb-6">
          Register
        </h2>

        {/* Name */}
        <div className="mb-4">
          <label>Name *</label>
          <input
            name="name"
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
          />
          <p className="text-red-500 text-sm">{errors.name}</p>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label>Email *</label>
          <input
            name="email"
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
          />
          <p className="text-red-500 text-sm">{errors.email}</p>
        </div>

        {/* Password */}
        <div className="mb-4">
          <label>Password *</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <p className="text-red-500 text-sm">{errors.password}</p>
        </div>

        {/* Role */}
        <div className="mb-4">
          <label>Register as *</label>
          <select
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setSelectedSkills([]);
            }}
            className="w-full border px-3 py-2 rounded-lg"
          >
            <option value="volunteer">Volunteer</option>
            <option value="ngo">NGO</option>
          </select>
        </div>

        {/* Skills */}
        {role === "volunteer" && (
          <div className="mb-4">
            <label className="block mb-2 font-semibold">
              Skills *
            </label>

            <div className="flex flex-wrap gap-2">
              {skillsList.map((skill) => {
                const isSelected = selectedSkills.includes(skill);

                return (
                  <button
                    type="button"
                    key={skill}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedSkills(
                          selectedSkills.filter((s) => s !== skill)
                        );
                      } else {
                        setSelectedSkills([...selectedSkills, skill]);
                      }
                    }}
                    className={`px-3 py-1 rounded-full border text-sm transition-all duration-200
                      ${
                        isSelected
                          ? "bg-green-600 text-white border-green-600"
                          : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-green-100"
                      }`}
                  >
                    {skill}
                  </button>
                );
              })}
            </div>

            <p className="text-red-500 text-sm mt-2">
              {errors.skills}
            </p>
          </div>
        )}

        {/* NGO Fields */}
        {role === "ngo" && (
          <>
            <input
              name="organizationName"
              placeholder="Organization Name *"
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg mb-2"
            />
            <p className="text-red-500 text-sm">
              {errors.organizationName}
            </p>

            <input
              name="location"
              placeholder="Location *"
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg mb-2"
            />
            <p className="text-red-500 text-sm">
              {errors.location}
            </p>

            <textarea
              name="organizationDescription"
              placeholder="Description *"
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg mb-2"
            />
            <p className="text-red-500 text-sm">
              {errors.organizationDescription}
            </p>
          </>
        )}

        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-all"
        >
          Register
        </button>

        {/* Bottom Login Link */}
        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-green-600 font-semibold cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}

export default Register;