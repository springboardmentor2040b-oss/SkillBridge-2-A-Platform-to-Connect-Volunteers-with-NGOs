import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { MapPin, Clock, ArrowLeft, User, X } from 'lucide-react';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';

const OpportunityDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [opportunity, setOpportunity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [coverLetter, setCoverLetter] = useState('');
    const [alreadyApplied, setAlreadyApplied] = useState(false);

    useEffect(() => {
        const fetchOpportunity = async () => {
            try {
                const res = await api.get(`/opportunities/${id}`);
                setOpportunity(res.data.data);
            } catch (error) {
                console.error('Failed to fetch opportunity', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOpportunity();
    }, [id]);

    const handleApply = async () => {
        if (!user) { toast.error('Please log in to apply.'); navigate('/login'); return; }
        try {
            setApplying(true);
            await api.post(`/applications/${id}`, { coverLetter });
            toast.success('Application submitted successfully!');
            setAlreadyApplied(true);
            setShowModal(false);
        } catch (error) {
            const msg = error.response?.data?.message || 'Failed to submit application';
            if (msg.includes('already applied')) setAlreadyApplied(true);
            toast.error(msg);
        } finally {
            setApplying(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
            <Navbar />
            <div className="flex items-center justify-center min-h-[80vh]">
                <p className="text-gray-500 dark:text-slate-400">Loading opportunity...</p>
            </div>
        </div>
    );

    if (!opportunity) return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
            <Navbar />
            <div className="flex items-center justify-center min-h-[80vh]">
                <p className="text-gray-500 dark:text-slate-400">Opportunity not found.</p>
            </div>
        </div>
    );

    const isCreator = user?.id === opportunity.postedBy?._id || user?._id === opportunity.postedBy?._id;
    const canApply = user && !isCreator;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
            <Navbar />
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Back Button */}
                <div className="flex items-center gap-3 mb-6">
                    <button onClick={() => navigate('/opportunities')}
                        className="flex items-center gap-2 text-gray-500 dark:text-slate-400 hover:text-[#2F5373] dark:hover:text-white transition text-sm">
                        <ArrowLeft size={16} /> Back to Opportunities
                    </button>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 sm:p-8">

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-6">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-[#2F5373] dark:text-white mb-1">{opportunity.title}</h1>
                            <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400 text-sm mt-1">
                                <User size={14} />
                                <span>{opportunity.postedBy?.ngoName || opportunity.postedBy?.name || 'NGO'}</span>
                            </div>
                        </div>
                        <span className={`self-start text-sm px-3 py-1 rounded-full font-medium whitespace-nowrap ${opportunity.status === 'Open'
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                            }`}>
                            {opportunity.status}
                        </span>
                    </div>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-4 text-gray-500 dark:text-slate-400 text-sm mb-6">
                        <span className="flex items-center gap-1"><MapPin size={15} /> {opportunity.location}</span>
                        {opportunity.deadline && (
                            <span className="flex items-center gap-1"><Clock size={15} /> Deadline: {new Date(opportunity.deadline).toLocaleDateString()}</span>
                        )}
                    </div>

                    <hr className="border-slate-200 dark:border-slate-700 mb-6" />

                    {/* Description */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-[#2F5373] dark:text-white mb-2">About this Opportunity</h2>
                        <p className="text-gray-600 dark:text-slate-300 leading-relaxed">{opportunity.description}</p>
                    </div>

                    {/* Skills */}
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-[#2F5373] dark:text-white mb-3">Skills Required</h2>
                        <div className="flex flex-wrap gap-2">
                            {opportunity.skillsRequired.map((skill, idx) => (
                                <span key={idx} className="bg-[#e8f5f1] dark:bg-teal-900/30 text-[#2F5373] dark:text-teal-300 px-3 py-1 rounded-full text-sm font-medium">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Apply Button */}
                    {canApply && (
                        <button onClick={() => !alreadyApplied && setShowModal(true)}
                            disabled={alreadyApplied || opportunity.status === 'Closed'}
                            className={`w-full py-3 rounded-xl font-semibold text-base transition ${alreadyApplied
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 cursor-default'
                                    : opportunity.status === 'Closed'
                                        ? 'bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-slate-500 cursor-not-allowed'
                                        : 'bg-[#2F5373] dark:bg-[#6CBBA2] text-white hover:bg-[#1a3b55] dark:hover:bg-[#5aaa91]'
                                }`}>
                            {alreadyApplied ? '✓ Already Applied' : opportunity.status === 'Closed' ? 'Applications Closed' : 'Apply Now'}
                        </button>
                    )}
                    {isCreator && (
                        <p className="text-center text-sm text-gray-400 dark:text-slate-500 mt-2">You created this opportunity</p>
                    )}
                    {!user && (
                        <button onClick={() => navigate('/login')}
                            className="w-full py-3 rounded-xl font-semibold text-base bg-[#2F5373] dark:bg-[#6CBBA2] text-white hover:bg-[#1a3b55] dark:hover:bg-[#5aaa91] transition">
                            Login to Apply
                        </button>
                    )}
                </div>
            </div>

            {/* Apply Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 px-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-[#2F5373] dark:text-white">Apply for "{opportunity.title}"</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-200">
                                <X size={20} />
                            </button>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">Add an optional cover letter to introduce yourself.</p>
                        <textarea value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} rows="5"
                            placeholder="Tell the NGO why you're a great fit (optional)..."
                            className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#6CBBA2] outline-none text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-white placeholder-gray-400 dark:placeholder-slate-500"
                        />
                        <div className="flex gap-3 mt-4">
                            <button onClick={() => setShowModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition">
                                Cancel
                            </button>
                            <button onClick={handleApply} disabled={applying}
                                className="flex-1 px-4 py-2 bg-[#2F5373] dark:bg-[#6CBBA2] text-white rounded-lg hover:bg-[#1a3b55] dark:hover:bg-[#5aaa91] font-medium disabled:opacity-60 transition">
                                {applying ? 'Submitting...' : 'Submit Application'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OpportunityDetail;