import React, { useState, useContext, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useNotification } from "../context/NotificationContext";
import { Bell, MessageCircle, Star } from "lucide-react";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [bellOpen, setBellOpen] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const { isDark, toggleTheme } = useTheme();
    const { notifications, unreadCount, markRead, markAllRead } = useNotification();
    const navigate = useNavigate();
    const location = useLocation();
    const bellRef = useRef(null);

    // Close bell dropdown when clicking outside
    useEffect(() => {
        const handler = (e) => {
            if (bellRef.current && !bellRef.current.contains(e.target)) {
                setBellOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/");
        setMenuOpen(false);
    };

    const handleNotificationClick = (n) => {
        if (!n.read) markRead(n._id);
        setBellOpen(false);
        navigate(n.link || "/");
    };

    const navLink = (to, label) => (
        <Link
            to={to}
            onClick={() => setMenuOpen(false)}
            className={`hover:text-[#6CBBA2] transition font-medium ${location.pathname === to ? "text-[#6CBBA2]" : "text-[#2F5373] dark:text-slate-200"
                }`}
        >
            {label}
        </Link>
    );

    const recent5 = notifications.slice(0, 5);

    const BellButton = ({ mobile = false }) => (
        user ? (
            <div className={`relative ${mobile ? '' : ''}`} ref={mobile ? null : bellRef}>
                <button
                    onClick={() => setBellOpen(prev => !prev)}
                    className="relative p-2 rounded-full text-[#2F5373] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                    aria-label="Notifications"
                >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </button>

                {/* Dropdown */}
                {bellOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 z-[100] overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                            <span className="font-bold text-sm text-[#2F5373] dark:text-white">Notifications</span>
                            {unreadCount > 0 && (
                                <button
                                    onClick={() => { markAllRead(); }}
                                    className="text-xs text-[#6CBBA2] hover:underline font-medium"
                                >
                                    Mark all read
                                </button>
                            )}
                        </div>

                        {recent5.length === 0 ? (
                            <p className="text-sm text-gray-400 dark:text-slate-500 text-center py-6">No notifications yet</p>
                        ) : (
                            <ul>
                                {recent5.map(n => (
                                    <li
                                        key={n._id}
                                        onClick={() => handleNotificationClick(n)}
                                        className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition hover:bg-slate-50 dark:hover:bg-slate-700 ${!n.read ? 'bg-blue-50 dark:bg-slate-700/60' : ''}`}
                                    >
                                        <div className="mt-0.5 flex-shrink-0">
                                            {n.type === 'message'
                                                ? <MessageCircle size={16} className="text-[#2F5373] dark:text-[#6CBBA2]" />
                                                : <Star size={16} className="text-yellow-500" />
                                            }
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-700 dark:text-slate-200 leading-snug">{n.message}</p>
                                            <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{timeAgo(n.createdAt)}</p>
                                        </div>
                                        {!n.read && <span className="mt-1.5 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />}
                                    </li>
                                ))}
                            </ul>
                        )}

                        <div className="border-t border-slate-200 dark:border-slate-700 px-4 py-2.5">
                            <Link
                                to="/notifications"
                                onClick={() => setBellOpen(false)}
                                className="text-xs text-[#6CBBA2] hover:underline font-medium"
                            >
                                See all notifications →
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        ) : null
    );

    return (
        <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 min-w-0">
                        <img
                            src="/logo.png"
                            alt="SkillBridge Logo"
                            className="w-[60px] sm:w-[75px] h-auto object-contain"
                        />
                        <span className="text-xl sm:text-2xl font-bold text-[#2F5373] dark:text-white">
                            SkillBridge
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-4">
                        {navLink("/", "Home")}
                        {navLink("/opportunities", "Opportunities")}
                        {navLink("/NGOs", "NGOs")}
                        {user && navLink("/dashboard", "Dashboard")}

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                            className="p-2 rounded-full text-[#2F5373] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                        >
                            {isDark ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14A7 7 0 0012 5z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
                                </svg>
                            )}
                        </button>

                        {/* Bell */}
                        <BellButton />

                        {user ? (
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 text-white px-4 py-1.5 rounded-md hover:bg-red-600 transition text-sm font-medium"
                            >
                                Logout
                            </button>
                        ) : (
                            <Link to="/login">
                                <button className="bg-[#6CBBA2] px-5 py-1.5 rounded-md text-white hover:bg-[#2F5373] transition text-sm font-medium">
                                    Login
                                </button>
                            </Link>
                        )}
                    </div>

                    {/* Mobile: Theme Toggle + Bell + Hamburger */}
                    <div className="md:hidden flex items-center gap-2">
                        <button
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                            className="p-2 rounded-full text-[#2F5373] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                        >
                            {isDark ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14A7 7 0 0012 5z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
                                </svg>
                            )}
                        </button>
                        {/* Mobile Bell */}
                        <div ref={bellRef}>
                            <BellButton mobile />
                        </div>
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="p-2 text-[#2F5373] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition"
                            aria-label="Open menu"
                        >
                            {menuOpen ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>

                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {menuOpen && (
                <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 px-4 py-4 flex flex-col gap-4">
                    {navLink("/", "Home")}
                    {navLink("/opportunities", "Opportunities")}
                    {navLink("/NGOs", "NGOs")}
                    {user && navLink("/dashboard", "Dashboard")}
                    {user && navLink("/notifications", "Notifications")}
                    {user ? (
                        <button
                            onClick={handleLogout}
                            className="text-left text-red-500 hover:text-red-600 font-medium transition"
                        >
                            Logout
                        </button>
                    ) : (
                        <Link to="/login" onClick={() => setMenuOpen(false)}>
                            <button className="bg-[#6CBBA2] px-5 py-2 rounded-md text-white hover:bg-[#2F5373] transition text-sm font-medium w-full">
                                Login
                            </button>
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
};

// Helper: relative time
function timeAgo(dateStr) {
    const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

export default Navbar;
