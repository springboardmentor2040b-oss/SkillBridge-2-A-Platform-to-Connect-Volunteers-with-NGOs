import React, { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate("/");
        setMenuOpen(false);
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
                    <div className="hidden md:flex items-center gap-6">
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
                                /* Sun icon */
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14A7 7 0 0012 5z" />
                                </svg>
                            ) : (
                                /* Moon icon */
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
                                </svg>
                            )}
                        </button>

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

                    {/* Mobile: Theme Toggle + Hamburger */}
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

export default Navbar;
