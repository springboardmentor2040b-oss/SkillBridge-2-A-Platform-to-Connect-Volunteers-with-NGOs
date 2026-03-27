import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import Navbar from '../components/Navbar';
import { Bell, MessageCircle, Star, CheckCheck } from 'lucide-react';

function timeAgo(dateStr) {
    const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

const Notifications = () => {
    const { notifications, unreadCount, markRead, markAllRead } = useNotification();
    const navigate = useNavigate();

    const handleClick = (n) => {
        if (!n.read) markRead(n._id);
        navigate(n.link || '/');
    };

    return (
        <div className="min-h-screen bg-[#f8f9fa] dark:bg-slate-900 transition-colors duration-300">
            <Navbar />

            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Bell className="text-[#2F5373] dark:text-[#6CBBA2]" size={24} />
                        <h1 className="text-2xl font-bold text-[#2F5373] dark:text-white">Notifications</h1>
                        {unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{unreadCount} new</span>
                        )}
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllRead}
                            className="flex items-center gap-1.5 text-sm text-[#6CBBA2] hover:text-[#2F5373] dark:hover:text-white font-medium transition"
                        >
                            <CheckCheck size={16} />
                            Mark all read
                        </button>
                    )}
                </div>

                {/* List */}
                {notifications.length === 0 ? (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-12 text-center">
                        <Bell size={40} className="mx-auto text-gray-300 dark:text-slate-600 mb-3" />
                        <p className="text-gray-500 dark:text-slate-400 font-medium">You're all caught up!</p>
                        <p className="text-sm text-gray-400 dark:text-slate-500 mt-1">No notifications yet.</p>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden divide-y divide-slate-100 dark:divide-slate-700">
                        {notifications.map(n => (
                            <div
                                key={n._id}
                                onClick={() => handleClick(n)}
                                className={`flex items-start gap-4 px-5 py-4 cursor-pointer transition hover:bg-slate-50 dark:hover:bg-slate-700/60 ${!n.read ? 'bg-blue-50/60 dark:bg-blue-900/10' : ''}`}
                            >
                                {/* Icon */}
                                <div className={`mt-0.5 flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${n.type === 'message' ? 'bg-[#e8f5f1] dark:bg-teal-900/30' : 'bg-yellow-50 dark:bg-yellow-900/20'}`}>
                                    {n.type === 'message'
                                        ? <MessageCircle size={18} className="text-[#2F5373] dark:text-[#6CBBA2]" />
                                        : <Star size={18} className="text-yellow-500" />
                                    }
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm leading-snug ${!n.read ? 'font-semibold text-[#2F5373] dark:text-white' : 'text-gray-700 dark:text-slate-300'}`}>
                                        {n.message}
                                    </p>
                                    <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">{timeAgo(n.createdAt)}</p>
                                </div>

                                {/* Unread dot */}
                                {!n.read && <span className="mt-2 w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0" />}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
