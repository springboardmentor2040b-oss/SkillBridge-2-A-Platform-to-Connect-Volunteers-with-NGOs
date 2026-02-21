import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { MapPin, Clock, ArrowLeft, User, X } from 'lucide-react';
import { toast } from 'react-toastify';

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
        if (!user) {
            toast.error('Please log in to apply.');
            navigate('/login');
            return;
        }
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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <p className="text-gray-500">Loading opportunity...</p>
        </div>
    );

    if (!opportunity) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <p className="text-gray-500">Opportunity not found.</p>
        </div>
    );

    const isNGO = user?.role === 'NGO';

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-3xl mx-auto">

                {/* Back Button */}
                <button
                    onClick={() => navigate('/opportunities')}
                    className="flex items-center gap-2 text-gray-500 hover:text-[#2F5373] mb-6 transition"
                >
                    <ArrowLeft size={18} /> Back to Opportunities
                </button>

                <div className="bg-white rounded-xl shadow-sm border p-8">

                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-[#2F5373] mb-1">{opportunity.title}</h1>
                            <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                                <User size={14} />
                                <span>{opportunity.postedBy?.ngoName || opportunity.postedBy?.name || 'NGO'}</span>
                            </div>
                        </div>
                        <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                            opportunity.status === 'Open'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-600'
                        }`}>
                            {opportunity.status}
                        </span>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-6 text-gray-500 text-sm mb-6">
                        <span className="flex items-center gap-1">
                            <MapPin size={15} /> {opportunity.location}
                        </span>
                        {opportunity.deadline && (
                            <span className="flex items-center gap-1">
                                <Clock size={15} /> Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
                            </span>
                        )}
                    </div>

                    <hr className="mb-6" />

                    {/* Description */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-[#2F5373] mb-2">About this Opportunity</h2>
                        <p className="text-gray-600 leading-relaxed">{opportunity.description}</p>
                    </div>

                    {/* Skills */}
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-[#2F5373] mb-3">Skills Required</h2>
                        <div className="flex flex-wrap gap-2">
                            {opportunity.skillsRequired.map((skill, idx) => (
                                <span key={idx} className="bg-[#e8f5f1] text-[#2F5373] px-3 py-1 rounded-full text-sm font-medium">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Apply Button — hidden for NGO users */}
                    {!isNGO && (
                        <button
                            onClick={() => !alreadyApplied && setShowModal(true)}
                            disabled={alreadyApplied || opportunity.status === 'Closed'}
                            className={`w-full py-3 rounded-lg font-medium text-lg transition ${
                                alreadyApplied
                                    ? 'bg-green-100 text-green-700 cursor-default'
                                    : opportunity.status === 'Closed'
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-[#2F5373] text-white hover:bg-[#1a3b55]'
                            }`}
                        >
                            {alreadyApplied ? '✓ Already Applied' : opportunity.status === 'Closed' ? 'Applications Closed' : 'Apply Now'}
                        </button>
                    )}
                </div>
            </div>

            {/* Apply Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-[#2F5373]">Apply for "{opportunity.title}"</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>

                        <p className="text-sm text-gray-500 mb-4">Add an optional cover letter to introduce yourself.</p>

                        <textarea
                            value={coverLetter}
                            onChange={(e) => setCoverLetter(e.target.value)}
                            rows="5"
                            placeholder="Tell the NGO why you're a great fit (optional)..."
                            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#6CBBA2] outline-none text-sm"
                        />

                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleApply}
                                disabled={applying}
                                className="flex-1 px-4 py-2 bg-[#2F5373] text-white rounded-md hover:bg-[#1a3b55] font-medium disabled:opacity-60"
                            >
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