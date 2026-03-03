import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Dashboard() {

  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/opportunities")
      .then(res => res.json())
      .then(data => setOpportunities(data));
  }, []);

  if (!user) {
    return <div className="p-8">Please login first</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Top Navbar */}
      <div className="bg-white shadow px-8 py-4 flex justify-between">
        <h1 className="font-bold text-xl">SkillBridge</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {user.role}
          </span>
          <button
            onClick={() => {
              localStorage.removeItem("user");
              navigate("/login");
            }}
            className="text-red-500"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex">

        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md p-6 min-h-screen">

          <h2 className="font-semibold mb-6">
            {user.name}
          </h2>

          <ul className="space-y-4">
            <li className="cursor-pointer font-medium">
              Dashboard
            </li>
            <li
              onClick={() => navigate("/view-opportunities")}
              className="cursor-pointer hover:text-blue-600"
            >
              Opportunities
            </li>
            <li className="cursor-pointer hover:text-blue-600">
              Applications
            </li>
            <li className="cursor-pointer hover:text-blue-600">
              Messages
            </li>
          </ul>

        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">

          <h2 className="text-2xl font-bold mb-6">
            Overview
          </h2>

          {/* Overview Cards */}
          <div className="grid grid-cols-4 gap-6 mb-8">

            <div className="bg-blue-100 p-6 rounded shadow">
              <p>Active Opportunities</p>
              <h3 className="text-2xl font-bold">
                {opportunities.length}
              </h3>
            </div>

            <div className="bg-green-100 p-6 rounded shadow">
              <p>Applications</p>
              <h3 className="text-2xl font-bold">1</h3>
            </div>

            <div className="bg-purple-100 p-6 rounded shadow">
              <p>Active Volunteers</p>
              <h3 className="text-2xl font-bold">0</h3>
            </div>

            <div className="bg-yellow-100 p-6 rounded shadow">
              <p>Pending Applications</p>
              <h3 className="text-2xl font-bold">0</h3>
            </div>

          </div>

          {/* Recent Applications */}
          <div className="bg-white p-6 rounded shadow mb-8">

            <div className="flex justify-between mb-4">
              <h3 className="font-semibold text-lg">
                Recent Applications
              </h3>
              <button className="text-blue-600 text-sm">
                View All
              </button>
            </div>

            <div className="border p-4 rounded mb-3">
              <p className="font-semibold">John Doe</p>
              <p className="text-sm text-gray-500">
                Applied for Web Development
              </p>
            </div>

          </div>

          {/* Quick Actions */}
          {user.role.toLowerCase() === "ngo" && (

            <div className="bg-white p-6 rounded shadow">

              <h3 className="font-semibold text-lg mb-4">
                Quick Actions
              </h3>

              <div className="flex gap-4">

                <button
                  onClick={() => navigate("/create-opportunity")}
                  className="border px-6 py-3 rounded hover:bg-gray-100"
                >
                  Create New Opportunity
                </button>

                <button
                  onClick={() => navigate("/view-opportunities")}
                  className="border px-6 py-3 rounded hover:bg-gray-100"
                >
                  View Opportunities
                </button>

              </div>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default Dashboard;