import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import {
    LayoutDashboard, Search, FileText, MessageSquare,
    Bell, User, Plus, Briefcase, CheckCircle, Clock, Star
} from 'lucide-react';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const isNGO = user?.role === 'NGO';

    // NGO state
    const [ngoStats, setNgoStats] = useState({ activeOpportunities: 0, applications: 0, activeVolunteers: 0, pendingApplications: 0 });
    const [recentApplications, setRecentApplications] = useState([]);
    const [myNGOApplications, setMyNGOApplications] = useState([]);

    // Volunteer state
    const [volunteerStats, setVolunteerStats] = useState({ applied: 0, accepted: 0, inProgress: 0, completed: 0 });
    const [recommendedOpps, setRecommendedOpps] = useState([]);
    const [myApplications, setMyApplications] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (isNGO) {
                    const oppRes = await api.get('/opportunities/my-opportunities');
                    const opportunities = oppRes.data.data;
                    const appRes = await api.get('/applications/ngo');
                    const applications = appRes.data.data;
                    const sentRes = await api.get('/applications/my');
                    setMyNGOApplications(sentRes.data.data);
                    const pending = applications.filter(a => a.status === 'pending').length;
                    const accepted = applications.filter(a => a.status === 'accepted').length;
                    setNgoStats({ activeOpportunities: opportunities.length, applications: applications.length, activeVolunteers: accepted, pendingApplications: pending });
                    setRecentApplications(applications.slice(0, 5));
                } else {
                    const appRes = await api.get('/applications/my');
                    const applications = appRes.data.data;
                    setVolunteerStats({
                        applied: applications.length,
                        accepted: applications.filter(a => a.status === 'accepted').length,
                        inProgress: applications.filter(a => a.status === 'pending').length,
                        completed: applications.filter(a => a.status === 'rejected').length,
                    });
                    setMyApplications(applications);
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
        <div className="min-h-screen bg-[#f8f9fa] dark:bg-slate-900 transition-colors duration-300">
            <Navbar />

            <div className="max-w-[1400px] mx-auto mt-6 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-6 pb-10">

                {/* LEFT SIDEBAR */}
                <aside className="hidden md:block w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 h-fit sticky top-20">
                    <div className="text-center mb-8">
                        <div className="w-14 h-14 rounded-full bg-[#e8f5f1] dark:bg-teal-900/40 flex items-center justify-center text-[#2F5373] dark:text-teal-300 font-bold text-xl mx-auto mb-3">
                            {(isNGO ? user?.ngoName || user?.name : user?.name)?.charAt(0) || '?'}
                        </div>
                        <h2 className="text-base font-bold text-[#2F5373] dark:text-white leading-tight">
                            {isNGO ? (user?.ngoName || user?.name || 'Organization') : (user?.name || 'Volunteer')}
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-slate-400 uppercase font-semibold mt-1">{user?.role || 'User'}</p>
                    </div>
                    <nav className="space-y-1">
                        <SidebarItem icon={<LayoutDashboard size={18} />} label="Dashboard" active href="/dashboard" />
                        <SidebarItem icon={<Search size={18} />} label={isNGO ? 'Opportunities' : 'Browse Opportunities'} href="/opportunities" />
                        <SidebarItem icon={<FileText size={18} />} label={isNGO ? 'Applications' : 'My Applications'} href="#" />
                        <SidebarItem icon={<MessageSquare size={18} />} label="Messages" href="/messages" />
                    </nav>
                    <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                        <h3 className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-3">
                            {isNGO ? 'Organization Info' : 'Profile Info'}
                        </h3>
                        <div className="space-y-2 text-sm text-gray-600 dark:text-slate-400">
                            <p className="truncate">📧 {user?.email || '—'}</p>
                            {user?.location && <p>📍 {user.location}</p>}
                            {isNGO && user?.website && <p className="truncate">🌐 {user.website}</p>}
                            {!isNGO && user?.skills?.length > 0 && <p className="text-xs">🛠️ {user.skills.join(', ')}</p>}
                        </div>
                    </div>
                </aside>

                {/* MAIN CONTENT */}
                <main className="flex-1 space-y-6">
                    {isNGO ? (
                        <NGOContent stats={ngoStats} applications={recentApplications} myApplications={myNGOApplications} onStatusChange={(id, status) => {
                            setRecentApplications(prev => prev.map(a => a._id === id ? { ...a, status } : a));
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
const NGOContent = ({ stats, applications, myApplications = [], onStatusChange }) => {
    const navigate = useNavigate();
    return (
        <>
            <div>
                <h2 className="text-xl font-bold text-[#2F5373] dark:text-white mb-4">Overview</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard count={stats.activeOpportunities} label="Active Opportunities" color="bg-blue-50 dark:bg-blue-900/20" icon={<Briefcase size={20} />} />
                    <StatCard count={stats.applications} label="Total Applications" color="bg-green-50 dark:bg-green-900/20" icon={<FileText size={20} />} />
                    <StatCard count={stats.activeVolunteers} label="Accepted" color="bg-purple-50 dark:bg-purple-900/20" icon={<User size={20} />} />
                    <StatCard count={stats.pendingApplications} label="Pending" color="bg-yellow-50 dark:bg-yellow-900/20" icon={<Clock size={20} />} />
                </div>
            </div>

            {/* Applications Received */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="text-lg font-bold text-[#2F5373] dark:text-white mb-4">Applications Received</h3>
                {applications.length === 0 ? (
                    <p className="text-gray-500 dark:text-slate-400 text-sm text-center py-4">No applications received yet</p>
                ) : (
                    <div className="space-y-4">
                        {applications.map((app) => (
                            <NGOApplicationCard key={app._id} app={app} onStatusChange={onStatusChange} />
                        ))}
                    </div>
                )}
            </div>

            {/* My Applications */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="text-lg font-bold text-[#2F5373] dark:text-white mb-4">My Applications</h3>
                {myApplications.length === 0 ? (
                    <p className="text-gray-500 dark:text-slate-400 text-sm text-center py-4">You haven't applied to any opportunities yet</p>
                ) : (
                    <div className="space-y-4">
                        {myApplications.map((app) => <VolunteerApplicationCard key={app._id} app={app} />)}
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="text-lg font-bold text-[#2F5373] dark:text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button onClick={() => navigate('/create-opportunity')}
                        className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl hover:border-[#2F5373] dark:hover:border-[#6CBBA2] hover:bg-blue-50 dark:hover:bg-slate-700 transition group">
                        <Plus className="w-8 h-8 text-gray-400 dark:text-slate-400 group-hover:text-[#2F5373] dark:group-hover:text-[#6CBBA2] mb-2" />
                        <span className="font-medium text-gray-600 dark:text-slate-300 group-hover:text-[#2F5373] dark:group-hover:text-[#6CBBA2]">Create New Opportunity</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-6 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition">
                        <MessageSquare className="w-8 h-8 text-[#2F5373] dark:text-[#6CBBA2] mb-2" />
                        <span className="font-medium text-[#2F5373] dark:text-[#6CBBA2]">View Messages</span>
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
                <h2 className="text-xl font-bold text-[#2F5373] dark:text-white mb-4">My Progress</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard count={stats.applied} label="Applied" color="bg-blue-50 dark:bg-blue-900/20" icon={<FileText size={20} />} />
                    <StatCard count={stats.accepted} label="Accepted" color="bg-green-50 dark:bg-green-900/20" icon={<CheckCircle size={20} />} />
                    <StatCard count={stats.inProgress} label="Pending" color="bg-orange-50 dark:bg-orange-900/20" icon={<Clock size={20} />} />
                    <StatCard count={stats.completed} label="Rejected" color="bg-purple-50 dark:bg-purple-900/20" icon={<Star size={20} />} />
                </div>
            </div>

            {/* My Applications */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="text-lg font-bold text-[#2F5373] dark:text-white mb-4">My Applications</h3>
                {applications.length === 0 ? (
                    <p className="text-gray-500 dark:text-slate-400 text-sm text-center py-4">You haven't applied to any opportunities yet</p>
                ) : (
                    <div className="space-y-4">
                        {applications.map((app) => <VolunteerApplicationCard key={app._id} app={app} />)}
                    </div>
                )}
            </div>

            {/* Recommended Opportunities */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="text-lg font-bold text-[#2F5373] dark:text-white mb-4">Recommended Opportunities</h3>
                {recommendations.length === 0 ? (
                    <p className="text-gray-500 dark:text-slate-400 text-sm text-center py-4">No recommendations yet</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {recommendations.map((opp) => (
                            <div key={opp._id} onClick={() => navigate(`/opportunities/${opp._id}`)}
                                className="p-4 bg-gray-50 dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600 hover:shadow-md hover:border-[#6CBBA2] transition cursor-pointer">
                                <h4 className="font-semibold text-[#2F5373] dark:text-white">{opp.title}</h4>
                                <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">{opp.postedBy?.ngoName || 'NGO'}</p>
                                <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">📍 {opp.location}</p>
                                <p className="text-sm text-gray-500 dark:text-slate-400 mt-2 line-clamp-2">{opp.description}</p>
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
    const [showDetails, setShowDetails] = useState(false);
    const applicantSkills = app.applicant?.skills || [];
    const requiredSkills = app.opportunity?.skillsRequired || [];

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
        <>
            <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600">
                <div className="w-10 h-10 rounded-full bg-[#e8f5f1] dark:bg-teal-900/40 flex items-center justify-center text-[#2F5373] dark:text-teal-300 font-bold flex-shrink-0">
                    {app.applicant?.name?.charAt(0) || '?'}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                        <div>
                            <h4 className="font-semibold text-[#2F5373] dark:text-white">{app.applicant?.name || 'Applicant'}</h4>
                            <p className="text-sm text-gray-500 dark:text-slate-400">{app.applicant?.email}</p>
                            <p className="text-sm text-gray-600 dark:text-slate-400 mt-0.5">Applied for: <span className="font-medium">{app.opportunity?.title}</span></p>
                        </div>
                        <StatusBadge status={app.status} />
                    </div>
                    <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">{new Date(app.createdAt).toLocaleDateString()}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                        <button onClick={() => setShowDetails(true)}
                            className="px-4 py-1.5 bg-[#2F5373] dark:bg-[#6CBBA2] text-white text-xs font-medium rounded-md hover:bg-[#1a3b55] dark:hover:bg-[#5aaa91] transition">
                            Details
                        </button>
                        {app.status === 'pending' && (
                            <>
                                <button onClick={() => handleStatus('accepted')} disabled={loading}
                                    className="px-4 py-1.5 bg-green-600 text-white text-xs font-medium rounded-md hover:bg-green-700 disabled:opacity-50 transition">
                                    ✓ Accept
                                </button>
                                <button onClick={() => handleStatus('rejected')} disabled={loading}
                                    className="px-4 py-1.5 bg-red-500 text-white text-xs font-medium rounded-md hover:bg-red-600 disabled:opacity-50 transition">
                                    ✕ Reject
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Details Modal */}
            {showDetails && (
                <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 px-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-[#2F5373] dark:text-white">{app.applicant?.name}'s Application</h3>
                            <button onClick={() => setShowDetails(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 text-2xl font-bold leading-none">×</button>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">Applied for: <span className="font-medium text-[#2F5373] dark:text-white">{app.opportunity?.title}</span></p>
                        <div className="mb-5">
                            <h4 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">Cover Letter</h4>
                            {app.coverLetter ? (
                                <p className="text-sm text-gray-600 dark:text-slate-300 bg-gray-50 dark:bg-slate-700 rounded-lg p-3 italic">"{app.coverLetter}"</p>
                            ) : (
                                <p className="text-sm text-gray-400 dark:text-slate-500 italic">No cover letter provided.</p>
                            )}
                        </div>
                        <div className="mb-5">
                            <h4 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                                Skill Match — <span className="text-[#6CBBA2]">{applicantSkills.filter(s => requiredSkills.map(r => r.toLowerCase()).includes(s.toLowerCase())).length}</span> of {requiredSkills.length} required
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {requiredSkills.map((skill, idx) => {
                                    const matched = applicantSkills.map(s => s.toLowerCase()).includes(skill.toLowerCase());
                                    return (
                                        <span key={idx} className={`text-xs px-3 py-1 rounded-full font-medium ${matched ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 text-red-400 dark:text-red-400'
                                            }`}>
                                            {matched ? '✓' : '✕'} {skill}
                                        </span>
                                    );
                                })}
                                {requiredSkills.length === 0 && <p className="text-sm text-gray-400 dark:text-slate-500">No skills listed for this opportunity.</p>}
                            </div>
                        </div>
                        {applicantSkills.length > 0 && (
                            <div className="mb-5">
                                <h4 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">All Applicant Skills</h4>
                                <div className="flex flex-wrap gap-2">
                                    {applicantSkills.map((skill, idx) => (
                                        <span key={idx} className="text-xs px-3 py-1 rounded-full bg-[#e8f5f1] dark:bg-teal-900/30 text-[#2F5373] dark:text-teal-300 font-medium">{skill}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {app.status === 'pending' && (
                            <div className="flex gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <button onClick={() => { handleStatus('accepted'); setShowDetails(false); }} disabled={loading}
                                    className="flex-1 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition">✓ Accept</button>
                                <button onClick={() => { handleStatus('rejected'); setShowDetails(false); }} disabled={loading}
                                    className="flex-1 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 disabled:opacity-50 transition">✕ Reject</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

const VolunteerApplicationCard = ({ app }) => (
    <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600">
        <div className="w-10 h-10 rounded-full bg-[#e3f2fd] dark:bg-blue-900/30 flex items-center justify-center text-[#2F5373] dark:text-blue-300 font-bold flex-shrink-0">
            {app.opportunity?.title?.charAt(0) || '?'}
        </div>
        <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                <div>
                    <h4 className="font-semibold text-[#2F5373] dark:text-white">{app.opportunity?.title || 'Opportunity'}</h4>
                    <p className="text-sm text-gray-500 dark:text-slate-400">📍 {app.opportunity?.location}</p>
                    <p className="text-sm text-gray-500 dark:text-slate-400">{app.opportunity?.postedBy?.ngoName || 'NGO'}</p>
                </div>
                <StatusBadge status={app.status} />
            </div>
            {app.coverLetter && (
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-2 line-clamp-2 italic">"{app.coverLetter}"</p>
            )}
            <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">Applied: {new Date(app.createdAt).toLocaleDateString()}</p>
        </div>
    </div>
);

const StatusBadge = ({ status }) => (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
            status === 'accepted' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
        }`}>
        {status}
    </span>
);

const SidebarItem = ({ icon, label, active, href = '#' }) => (
    <a href={href} className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition ${active ? 'bg-[#f0f9ff] dark:bg-slate-700 text-[#2F5373] dark:text-white font-semibold border-l-4 border-[#2F5373] dark:border-[#6CBBA2]'
            : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-[#2F5373] dark:hover:text-white'
        }`}>
        {icon}
        <span className="text-sm">{label}</span>
    </a>
);

const StatCard = ({ count, label, color, icon }) => (
    <div className={`${color} rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-sm border border-slate-200/50 dark:border-slate-700`}>
        {icon && <div className="text-[#2F5373] dark:text-[#6CBBA2] mb-2">{icon}</div>}
        <h3 className="text-3xl font-bold text-[#2F5373] dark:text-white mb-1">{count}</h3>
        <p className="text-sm font-medium text-gray-600 dark:text-slate-400">{label}</p>
    </div>
);

export default Dashboard;