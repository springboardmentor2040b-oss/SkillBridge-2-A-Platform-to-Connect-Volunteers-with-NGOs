 import React, { useEffect, useState } from "react";

function ViewApplications({ opportunityId }) {

  const [applications, setApplications] = useState([]);

  // Fetch applications for this opportunity
  useEffect(() => {

    fetch(`http://localhost:5000/api/applications/opportunity/${opportunityId}`)
      .then(res => res.json())
      .then(data => setApplications(data))
      .catch(err => console.log(err));

  }, [opportunityId]);


  // Accept / Reject function
  const updateStatus = async (id, status) => {

    try {

      await fetch(
        `http://localhost:5000/api/applications/update-status/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ status })
        }
      );

      // Update UI instantly
      setApplications(prev =>
        prev.map(app =>
          app._id === id ? { ...app, status } : app
        )
      );

    } catch (error) {
      console.log(error);
    }

  };


  return (
    <div className="mt-3">

      <h4 className="font-bold text-lg">Volunteer Applications</h4>

      {applications.length === 0 && (
        <p className="text-gray-500">No volunteers applied yet</p>
      )}

      {applications.map(app => (

        <div
          key={app._id}
          className="border p-3 mt-3 rounded shadow-sm"
        >

          <p><strong>Name:</strong> {app.volunteerId?.name}</p>
          <p><strong>Email:</strong> {app.volunteerId?.email}</p>
          <p><strong>Status:</strong> {app.status}</p>

          {/* Show buttons only if Pending */}

          {app.status === "pending" && (

            <div className="mt-2">

              <button
                onClick={() => updateStatus(app._id, "accepted")}
                className="bg-green-500 text-white px-3 py-1 mr-2 rounded"
              >
                Accept
              </button>

              <button
                onClick={() => updateStatus(app._id, "rejected")}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Reject
              </button>

            </div>

          )}

        </div>

      ))}

    </div>
  );
}

export default ViewApplications;
