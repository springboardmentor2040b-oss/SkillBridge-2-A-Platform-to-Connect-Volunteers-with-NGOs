import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import {
    LayoutDashboard, Search, FileText, MessageSquare,
    Bell, User, Plus, LogOut, Briefcase, CheckCircle, Clock, Star
} from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const isNGO = user?.role === 'NGO';

    // NGO state
    const [ngoStats, setNgoStats] = useState({ activeOpportunities: 0, applications: 0, activeVolunteers: 0, pendingApplications: 0 });
    const [recentApplications, setRecentApplications] = useState([]);

    // Volunteer state
    const [volunteerStats, setVolunteerStats] = useState({ applied: 0, accepted: 0, inProgress: 0, completed: 0 });
    const [recommendedOpps, setRecommendedOpps] = useState([]);
    const [myApplications, setMyApplications] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (isNGO) {
                    // Fetch NGO's opportunities
                    const oppRes = await api.get('/opportunities/my-opportunities');
                    const opportunities = oppRes.data.data;

                    // Fetch applications for NGO's opportunities
                    const appRes = await api.get('/applications/ngo');
                    const applications = appRes.data.data;

                    const pending = applications.filter(a => a.status === 'pending').length;
                    const accepted = applications.filter(a => a.status === 'accepted').length;

                    setNgoStats({
                        activeOpportunities: opportunities.length,
                        applications: applications.length,
                        activeVolunteers: accepted,
                        pendingApplications: pending,
                    });
                    setRecentApplications(applications.slice(0, 5));

                } else {
                    // Fetch volunteer's own applications
                    const appRes = await api.get('/applications/my');
                    const applications = appRes.data.data;

                    setVolunteerStats({
                        applied: applications.length,
                        accepted: applications.filter(a => a.status === 'accepted').length,
                        inProgress: applications.filter(a => a.status === 'pending').length,
                        completed: applications.filter(a => a.status === 'rejected').length,
                    });
                    setMyApplications(applications);

                    // Fetch recommended opportunities
                    const oppRes = await api.get('/opportunities');
                    setRecommendedOpps(oppRes.data.data.slice(0, 4));
                }
            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
            }
        };

        if (user) fetchData();
    }, [user, isNGO]);

    return (
        <div className="min-h-screen bg-[#f8f9fa]">

            {/* TOP NAVIGATION */}
            <nav className="bg-white border-b px-6 py-3 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2">
                        <img src="/logo.jpeg" alt="SkillBridge" className="w-10 h-10 object-contain" />
                        <span className="text-xl font-bold text-[#2F5373]">SkillBridge</span>
                    </div>
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
                        <a href="/dashboard" className="text-[#2F5373]">Dashboard</a>
                        <a href="/opportunities" className="hover:text-[#2F5373]">Opportunities</a>
                        <a href="#" className="hover:text-[#2F5373]">{isNGO ? 'Applications' : 'My Applications'}</a>
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

                {/* LEFT SIDEBAR */}
                <aside className="hidden md:block w-64 bg-white rounded-xl shadow-sm border p-6 h-fit sticky top-24">
                    <div className="text-center mb-8">
                        <h2 className="text-lg font-bold text-[#2F5373]">
                            {isNGO ? (user?.ngoName || user?.name || 'Organization') : (user?.name || 'Volunteer')}
                        </h2>
                        <p className="text-xs text-gray-500 uppercase font-semibold mt-1">{user?.role || 'User'}</p>
                    </div>
                    <nav className="space-y-1">
                        <SidebarItem icon={<LayoutDashboard size={18} />} label="Dashboard" active href="/dashboard" />
                        <SidebarItem icon={<Search size={18} />} label={isNGO ? 'Opportunities' : 'Browse Opportunities'} href="/opportunities" />
                        <SidebarItem icon={<FileText size={18} />} label={isNGO ? 'Applications' : 'My Applications'} href="#" />
                        <SidebarItem icon={<MessageSquare size={18} />} label="Messages" href="#" />
                    </nav>
                    <div className="mt-8 pt-6 border-t">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                            {isNGO ? 'Organization Info' : 'Profile Info'}
                        </h3>
                        <div className="space-y-2 text-sm text-gray-600">
                            <p>📧 {user?.email || '—'}</p>
                            {user?.location && <p>📍 {user.location}</p>}
                            {isNGO && user?.website && <p>🌐 {user.website}</p>}
                            {!isNGO && user?.skills?.length > 0 && <p>🛠️ {user.skills.join(', ')}</p>}
                        </div>
                    </div>
                </aside>

                {/* MAIN CONTENT */}
                <main className="flex-1 space-y-6 pb-10">
                    {isNGO ? (
                        <NGOContent stats={ngoStats} applications={recentApplications} onStatusChange={(id, status) => {
                            setRecentApplications(prev => prev.map(a => a._id === id ? { ...a, status } : a));
                            // Update stats counts
                            setNgoStats(prev => ({
                                ...prev,
                                pendingApplications: prev.pendingApplications - 1,
                                activeVolunteers: status === 'accepted' ? prev.activeVolunteers + 1 : prev.activeVolunteers,
                            }));
                        }} />
                    ) : (
                        <VolunteerContent stats={volunteerStats} recommendations={recommendedOpps} applications={myApplications} />
                    )}
                </main>
            </div>
        </div>
    );
};

// ==================== NGO DASHBOARD ====================
const NGOContent = ({ stats, applications, onStatusChange }) => {
    const navigate = useNavigate();
    return (
        <>
            <div>
                <h2 className="text-xl font-bold text-[#2F5373] mb-4">Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard count={stats.activeOpportunities} label="Active Opportunities" color="bg-[#e3f2fd]" icon={<Briefcase size={20} />} />
                    <StatCard count={stats.applications} label="Total Applications" color="bg-[#e8f5e9]" icon={<FileText size={20} />} />
                    <StatCard count={stats.activeVolunteers} label="Accepted Volunteers" color="bg-[#f3e5f5]" icon={<User size={20} />} />
                    <StatCard count={stats.pendingApplications} label="Pending" color="bg-[#fffde7]" icon={<Clock size={20} />} />
                </div>
            </div>

            {/* Recent Applications */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-[#2F5373]">Recent Applications</h3>
                </div>
                {applications.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-4">No applications received yet</p>
                ) : (
                    <div className="space-y-4">
                        {applications.map((app) => (
                            <NGOApplicationCard key={app._id} app={app} onStatusChange={onStatusChange} />
                        ))}
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-bold text-[#2F5373] mb-6">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                        onClick={() => navigate('/create-opportunity')}
                        className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#2F5373] hover:bg-blue-50 transition group"
                    >
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
};

// ==================== VOLUNTEER DASHBOARD ====================
const VolunteerContent = ({ stats, recommendations, applications }) => {
    const navigate = useNavigate();
    return (
    <>
        <div>
            <h2 className="text-xl font-bold text-[#2F5373] mb-4">My Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard count={stats.applied} label="Applied" color="bg-[#e3f2fd]" icon={<FileText size={20} />} />
                <StatCard count={stats.accepted} label="Accepted" color="bg-[#e8f5e9]" icon={<CheckCircle size={20} />} />
                <StatCard count={stats.inProgress} label="Pending" color="bg-[#fff3e0]" icon={<Clock size={20} />} />
                <StatCard count={stats.completed} label="Rejected" color="bg-[#f3e5f5]" icon={<Star size={20} />} />
            </div>
        </div>

        {/* My Applications */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-bold text-[#2F5373] mb-6">My Applications</h3>
            {applications.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">You haven't applied to any opportunities yet</p>
            ) : (
                <div className="space-y-4">
                    {applications.map((app) => (
                        <VolunteerApplicationCard key={app._id} app={app} />
                    ))}
                </div>
            )}
        </div>

        {/* Recommended Opportunities */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-bold text-[#2F5373] mb-6">Recommended Opportunities</h3>
            {recommendations.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">No recommendations yet</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {recommendations.map((opp) => (
                        <div
                            key={opp._id}
                            onClick={() => navigate(`/opportunities/${opp._id}`)}
                            className="p-4 bg-gray-50 rounded-lg border hover:shadow-md hover:border-[#6CBBA2] transition cursor-pointer"
                        >
                            <h4 className="font-semibold text-[#2F5373]">{opp.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{opp.postedBy?.ngoName || 'NGO'}</p>
                            <p className="text-xs text-gray-500 mt-1">📍 {opp.location}</p>
                            <p className="text-sm text-gray-500 mt-2 line-clamp-2">{opp.description}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </>
    );
};

// ==================== APPLICATION CARDS ====================

const NGOApplicationCard = ({ app, onStatusChange }) => {
    const [loading, setLoading] = useState(false);

    const handleStatus = async (status) => {
        setLoading(true);
        try {
            await api.patch(`/applications/${app._id}/status`, { status });
            onStatusChange(app._id, status);
        } catch (error) {
            console.error('Failed to update status', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border">
            <div className="w-10 h-10 rounded-full bg-[#e8f5f1] flex items-center justify-center text-[#2F5373] font-bold flex-shrink-0">
                {app.applicant?.name?.charAt(0) || '?'}
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <div>
                        <h4 className="font-semibold text-[#2F5373]">{app.applicant?.name || 'Volunteer'}</h4>
                        <p className="text-sm text-gray-500">{app.applicant?.email}</p>
                        <p className="text-sm text-gray-600 mt-0.5">Applied for: <span className="font-medium">{app.opportunity?.title}</span></p>
                    </div>
                    <StatusBadge status={app.status} />
                </div>
                {app.coverLetter && (
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2 italic">"{app.coverLetter}"</p>
                )}
                <p className="text-xs text-gray-400 mt-1">{new Date(app.createdAt).toLocaleDateString()}</p>

                {/* Accept / Reject buttons — only show if still pending */}
                {app.status === 'pending' && (
                    <div className="flex gap-2 mt-3">
                        <button
                            onClick={() => handleStatus('accepted')}
                            disabled={loading}
                            className="px-4 py-1.5 bg-green-600 text-white text-xs font-medium rounded-md hover:bg-green-700 disabled:opacity-50 transition"
                        >
                            ✓ Accept
                        </button>
                        <button
                            onClick={() => handleStatus('rejected')}
                            disabled={loading}
                            className="px-4 py-1.5 bg-red-500 text-white text-xs font-medium rounded-md hover:bg-red-600 disabled:opacity-50 transition"
                        >
                            ✕ Reject
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const VolunteerApplicationCard = ({ app }) => (
    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border">
        <div className="w-10 h-10 rounded-full bg-[#e3f2fd] flex items-center justify-center text-[#2F5373] font-bold flex-shrink-0">
            {app.opportunity?.title?.charAt(0) || '?'}
        </div>
        <div className="flex-1">
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-semibold text-[#2F5373]">{app.opportunity?.title || 'Opportunity'}</h4>
                    <p className="text-sm text-gray-500">📍 {app.opportunity?.location}</p>
                    <p className="text-sm text-gray-500">{app.opportunity?.postedBy?.ngoName || 'NGO'}</p>
                </div>
                <StatusBadge status={app.status} />
            </div>
            {app.coverLetter && (
                <p className="text-sm text-gray-500 mt-2 line-clamp-2 italic">"{app.coverLetter}"</p>
            )}
            <p className="text-xs text-gray-400 mt-1">Applied: {new Date(app.createdAt).toLocaleDateString()}</p>
        </div>
    </div>
);

const StatusBadge = ({ status }) => (
    <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${
        status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
        status === 'accepted' ? 'bg-green-100 text-green-700' :
        'bg-red-100 text-red-700'
    }`}>
        {status}
    </span>
);

const SidebarItem = ({ icon, label, active, href = '#' }) => (
    <a href={href} className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition ${
        active ? 'bg-[#f0f9ff] text-[#2F5373] font-semibold border-l-4 border-[#2F5373]' : 'text-gray-600 hover:bg-gray-50 hover:text-[#2F5373]'
    }`}>
        {icon}
        <span className="text-sm">{label}</span>
    </a>
);

const StatCard = ({ count, label, color, icon }) => (
    <div className={`${color} rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-sm border border-opacity-50 border-gray-200`}>
        {icon && <div className="text-[#2F5373] mb-2">{icon}</div>}
        <h3 className="text-3xl font-bold text-[#2F5373] mb-1">{count}</h3>
        <p className="text-sm font-medium text-gray-600">{label}</p>
    </div>
);

export default Dashboard;