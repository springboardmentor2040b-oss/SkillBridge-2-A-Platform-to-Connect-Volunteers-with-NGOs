import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
    LayoutDashboard,
    Search,
    FileText,
    MessageSquare,
    Bell,
    User,
    Plus,
    LogOut,
    Briefcase,
    CheckCircle,
    Clock,
    Star
} from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const isNGO = user?.role === 'NGO';

    console.log('Dashboard - User data:', user);
    console.log('Dashboard - isNGO:', isNGO);

    // NGO stats
    const [ngoStats] = useState({
        activeOpportunities: 0,
        applications: 0,
        activeVolunteers: 0,
        pendingApplications: 0,
    });
    const [recentApplications] = useState([]);

    // Volunteer stats
    const [volunteerStats] = useState({
        applied: 0,
        accepted: 0,
        inProgress: 0,
        completed: 0,
    });
    const [recommendedOpps] = useState([]);
    const [myApplications] = useState([]);

    return (
        <div className="min-h-screen bg-[#f8f9fa]">

            {/* ================= TOP NAVIGATION ================= */}
            <nav className="bg-white border-b px-6 py-3 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2">
                        <img src="/logo.jpeg" alt="SkillBridge" className="w-10 h-10 object-contain" />
                        <span className="text-xl font-bold text-[#2F5373]">SkillBridge</span>
                    </div>
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
                        <a href="#" className="text-[#2F5373]">Dashboard</a>
                        <a href="#" className="hover:text-[#2F5373]">Opportunities</a>
                        <a href="#" className="hover:text-[#2F5373]">
                            {isNGO ? 'Applications' : 'My Applications'}
                        </a>
                        <a href="#" className="hover:text-[#2F5373]">Messages</a>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:block text-right">
                        <h3 className="text-sm font-semibold text-[#2F5373]">{user?.name || 'User'}</h3>
                        <p className="text-xs text-gray-500">{user?.role || 'Guest'}</p>
                    </div>
                    <Bell className="w-5 h-5 text-gray-500 cursor-pointer hover:text-[#2F5373]" />
                    <div className="cursor-pointer" title="Profile">
                        <User className="w-8 h-8 text-gray-400 bg-gray-100 rounded-full p-1" />
                    </div>
                    <div className="cursor-pointer hover:bg-gray-100 p-2 rounded-full transition" title="Logout" onClick={logout}>
                        <LogOut className="w-5 h-5 text-red-500" />
                    </div>
                </div>
            </nav>

            <div className="flex max-w-[1400px] mx-auto mt-6 px-6 gap-6">

                {/* ================= LEFT SIDEBAR ================= */}
                <aside className="hidden md:block w-64 bg-white rounded-xl shadow-sm border p-6 h-fit sticky top-24">
                    <div className="text-center mb-8">
                        <h2 className="text-lg font-bold text-[#2F5373]">
                            {isNGO ? (user?.ngoName || user?.name || 'Organization') : (user?.name || 'Volunteer')}
                        </h2>
                        <p className="text-xs text-gray-500 uppercase font-semibold mt-1">
                            {user?.role || 'User'}
                        </p>
                    </div>

                    <nav className="space-y-1">
                        <SidebarItem icon={<LayoutDashboard size={18} />} label="Dashboard" active />
                        <SidebarItem
                            icon={<Search size={18} />}
                            label={isNGO ? 'Opportunities' : 'Browse Opportunities'}
                        />
                        <SidebarItem
                            icon={<FileText size={18} />}
                            label={isNGO ? 'Applications' : 'My Applications'}
                        />
                        <SidebarItem icon={<MessageSquare size={18} />} label="Messages" />
                    </nav>

                    <div className="mt-8 pt-6 border-t">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                            {isNGO ? 'Organization Info' : 'Profile Info'}
                        </h3>
                        <div className="space-y-2 text-sm text-gray-600">
                            <p>📧 {user?.email || '—'}</p>
                            {user?.location && <p>📍 {user.location}</p>}
                            {isNGO && user?.website && <p>🌐 {user.website}</p>}
                            {!isNGO && user?.skills && <p>🛠️ {user.skills}</p>}
                        </div>
                    </div>
                </aside>

                {/* ================= MAIN CONTENT ================= */}
                <main className="flex-1 space-y-6 pb-10">
                    {isNGO ? (
                        <NGOContent stats={ngoStats} applications={recentApplications} />
                    ) : (
                        <VolunteerContent stats={volunteerStats} recommendations={recommendedOpps} applications={myApplications} />
                    )}
                </main>
            </div>
        </div>
    );
};

// ==================== NGO DASHBOARD CONTENT ====================
const NGOContent = ({ stats, applications }) => (
    <>
        {/* Overview */}
        <div>
            <h2 className="text-xl font-bold text-[#2F5373] mb-4">Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard count={stats.activeOpportunities} label="Active Opportunities" color="bg-[#e3f2fd]" icon={<Briefcase size={20} />} />
                <StatCard count={stats.applications} label="Applications" color="bg-[#e8f5e9]" icon={<FileText size={20} />} />
                <StatCard count={stats.activeVolunteers} label="Active Volunteers" color="bg-[#f3e5f5]" icon={<User size={20} />} />
                <StatCard count={stats.pendingApplications} label="Pending" color="bg-[#fffde7]" icon={<Clock size={20} />} />
            </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-[#2F5373]">Recent Applications</h3>
                <button className="text-sm font-medium text-gray-500 hover:text-[#2F5373] border px-3 py-1 rounded-md">View All</button>
            </div>
            {applications.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">No applications received yet</p>
            ) : (
                <div className="space-y-4">
                    {applications.map((app) => (
                        <ApplicationCard key={app.id} app={app} />
                    ))}
                </div>
            )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-bold text-[#2F5373] mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#2F5373] hover:bg-blue-50 transition group">
                    <Plus className="w-8 h-8 text-gray-400 group-hover:text-[#2F5373] mb-2" />
                    <span className="font-medium text-gray-600 group-hover:text-[#2F5373]">Create New Opportunity</span>
                </button>
                <button className="flex flex-col items-center justify-center p-6 border rounded-xl hover:bg-gray-50 transition group">
                    <MessageSquare className="w-8 h-8 text-[#2F5373] mb-2" />
                    <span className="font-medium text-[#2F5373]">View Messages</span>
                </button>
            </div>
        </div>
    </>
);

// ==================== VOLUNTEER DASHBOARD CONTENT ====================
const VolunteerContent = ({ stats, recommendations, applications }) => (
    <>
        {/* Overview */}
        <div>
            <h2 className="text-xl font-bold text-[#2F5373] mb-4">My Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard count={stats.applied} label="Applied" color="bg-[#e3f2fd]" icon={<FileText size={20} />} />
                <StatCard count={stats.accepted} label="Accepted" color="bg-[#e8f5e9]" icon={<CheckCircle size={20} />} />
                <StatCard count={stats.inProgress} label="In Progress" color="bg-[#fff3e0]" icon={<Clock size={20} />} />
                <StatCard count={stats.completed} label="Completed" color="bg-[#f3e5f5]" icon={<Star size={20} />} />
            </div>
        </div>

        {/* Recommended Opportunities */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-[#2F5373]">Recommended Opportunities</h3>
                <button className="text-sm font-medium text-gray-500 hover:text-[#2F5373] border px-3 py-1 rounded-md">Browse All</button>
            </div>
            {recommendations.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">No recommendations yet — check back soon!</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {recommendations.map((opp) => (
                        <div key={opp.id} className="p-4 bg-gray-50 rounded-lg border hover:shadow-md transition">
                            <h4 className="font-semibold text-[#2F5373]">{opp.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{opp.ngoName}</p>
                            <p className="text-xs text-gray-500 mt-1">📍 {opp.location}</p>
                            <p className="text-sm text-gray-500 mt-2 line-clamp-2">{opp.description}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* My Applications */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-[#2F5373]">My Applications</h3>
                <button className="text-sm font-medium text-gray-500 hover:text-[#2F5373] border px-3 py-1 rounded-md">View All</button>
            </div>
            {applications.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">You haven't applied to any opportunities yet</p>
            ) : (
                <div className="space-y-4">
                    {applications.map((app) => (
                        <ApplicationCard key={app.id} app={app} />
                    ))}
                </div>
            )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-bold text-[#2F5373] mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#6CBBA2] hover:bg-green-50 transition group">
                    <Search className="w-8 h-8 text-gray-400 group-hover:text-[#6CBBA2] mb-2" />
                    <span className="font-medium text-gray-600 group-hover:text-[#6CBBA2]">Browse Opportunities</span>
                </button>
                <button className="flex flex-col items-center justify-center p-6 border rounded-xl hover:bg-gray-50 transition group">
                    <MessageSquare className="w-8 h-8 text-[#2F5373] mb-2" />
                    <span className="font-medium text-[#2F5373]">View Messages</span>
                </button>
            </div>
        </div>
    </>
);

// ==================== SHARED SUB-COMPONENTS ====================

const ApplicationCard = ({ app }) => (
    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border">
        <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0"></div>
        <div className="flex-1">
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-semibold text-[#2F5373]">{app.applicantName || app.opportunityTitle}</h4>
                    <p className="text-sm text-gray-600">
                        {app.applicantName ? `Applied for: ${app.opportunityTitle}` : app.ngoName}
                    </p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                    }`}>
                    {app.status}
                </span>
            </div>
            {app.coverLetter && (
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">{app.coverLetter}</p>
            )}
        </div>
    </div>
);

const SidebarItem = ({ icon, label, active }) => (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition ${active ? 'bg-[#f0f9ff] text-[#2F5373] font-semibold border-l-4 border-[#2F5373]' : 'text-gray-600 hover:bg-gray-50 hover:text-[#2F5373]'
        }`}>
        {icon}
        <span className="text-sm">{label}</span>
    </div>
);

const StatCard = ({ count, label, color, icon }) => (
    <div className={`${color} rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-sm border border-opacity-50 border-gray-200`}>
        {icon && <div className="text-[#2F5373] mb-2">{icon}</div>}
        <h3 className="text-3xl font-bold text-[#2F5373] mb-1">{count}</h3>
        <p className="text-sm font-medium text-gray-600">{label}</p>
    </div>
);

export default Dashboard;
