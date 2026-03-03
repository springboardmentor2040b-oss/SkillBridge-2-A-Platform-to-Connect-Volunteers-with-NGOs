import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    try {

      const response = await fetch(
        "http://localhost:5000/api/users/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        }
      );

      const data = await response.json();

      console.log("LOGIN RESPONSE:", data);

      if (response.ok && data.user) {

        localStorage.setItem("user", JSON.stringify(data.user));

        alert("Login Successful");

        navigate("/dashboard");

      } else {

        alert(data.message || "Login failed");

      }

    } catch (error) {

      alert("Backend connection error");

    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

      <h2 className="text-2xl font-bold text-center mb-6">
        Login
      </h2>

      <div className="mb-4">
        <label>Email</label>
        <input
          className="w-full border px-3 py-2 rounded-lg"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label>Password</label>
        <input
          type="password"
          className="w-full border px-3 py-2 rounded-lg"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button
        onClick={handleLogin}
        className="w-full bg-green-600 text-white py-2 rounded-lg"
      >
        Login
      </button>

    </div>
  );
}

export default Login;