import React from 'react';

const ApplicationCard = ({ application, userRole, onAccept, onReject, onDelete, onMessage }) => {
  const statusColors = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Accepted: 'bg-green-100 text-green-800',
    Rejected: 'bg-red-100 text-red-800',
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (userRole === 'ngo') {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md mb-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{application.volunteerName}</h3>
            <p className="text-gray-600">{application.opportunityTitle}</p>
            <p className="text-sm text-gray-500">Applied on: {formatDate(application.appliedDate)}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[application.status]}`}>
            {application.status}
          </span>
        </div>
        <div className="flex gap-2">
          {application.status === 'Pending' && (
            <>
              <button
                onClick={() => onAccept(application._id)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              >
                Accept
              </button>
              <button
                onClick={() => onReject(application._id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Reject
              </button>
              <button
                onClick={() => onMessage(application._id)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Message
              </button>
              <button
                onClick={() => onDelete(application._id)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
              >
                Delete Request
              </button>
            </>
          )}
        </div>
      </div>
    );
  } else if (userRole === 'volunteer') {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md mb-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{application.ngoName}</h3>
            <p className="text-gray-600">{application.opportunityTitle}</p>
            <p className="text-sm text-gray-500">Applied on: {formatDate(application.appliedDate)}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[application.status]}`}>
            {application.status}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onMessage(application._id)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Message
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default ApplicationCard;