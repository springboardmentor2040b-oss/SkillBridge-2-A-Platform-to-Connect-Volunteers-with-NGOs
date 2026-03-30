import React, { useEffect, useState } from "react";

function VolunteerDashboard() {

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [applications, setApplications] = useState([]);

  useEffect(() => {

    if (!user) return;

    fetch(`http://localhost:5000/api/applications/user/${user._id}`)
      .then(res => res.json())
      .then(data => setApplications(data));

  }, [user]);

  return (
    <div className="p-8">

      <h2 className="text-2xl font-bold mb-6">
        My Applications
      </h2>

      {applications.length === 0 && (
        <p>No applications yet</p>
      )}

      {applications.map(app => (

        <div
          key={app._id}
          className="border p-4 mb-4 rounded shadow"
        >

          <p>
            <strong>Opportunity ID:</strong> {app.opportunityId}
          </p>

          <p>
            <strong>Status:</strong>

            <span className={`ml-2 px-2 py-1 rounded text-white ${
              app.status === "accepted"
                ? "bg-green-500"
                : app.status === "rejected"
                ? "bg-red-500"
                : "bg-yellow-500"
            }`}>
              {app.status}
            </span>

          </p>

        </div>

      ))}

    </div>
  );
}

export default VolunteerDashboard;