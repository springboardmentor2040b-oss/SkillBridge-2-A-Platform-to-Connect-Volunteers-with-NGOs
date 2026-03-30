import React from 'react';

const NotificationPanel = ({ notifications, setNotifications, onClose }) => {
  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-semibold text-gray-800">Notifications</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">&times;</button>
      </div>
      <div className="max-h-64 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="p-4 text-gray-500">No notifications</p>
        ) : (
          notifications.map(notification => (
            <div
              key={notification.id}
              className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                !notification.read ? 'bg-blue-50' : ''
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <p className="text-sm text-gray-700">{notification.message}</p>
              {!notification.read && (
                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-1"></span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;