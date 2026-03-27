import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { Settings, Users, Plus, Trash2, Building2 } from 'lucide-react';
import { toast } from 'react-toastify';

const NgoSettings = () => {
    const { user } = useContext(AuthContext);
    const [ngo, setNgo] = useState(null);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [newMember, setNewMember] = useState({ name: '', email: '', password: '' });
    const [isAddingMode, setIsAddingMode] = useState(false);

    const fetchDetails = async () => {
        try {
            const res = await api.get('/ngo');
            if (res.data?.data) {
                setNgo(res.data.data.ngo);
                setMembers(res.data.data.members);
            }
        } catch (error) {
            toast.error('Failed to load NGO details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.role === 'NGO') {
            fetchDetails();
        }
    }, [user]);

    const handleAddMember = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/ngo/members', newMember);
            toast.success('Member added successfully!');
            setMembers([...members, res.data.data.member]);
            setNewMember({ name: '', email: '', password: '' });
            setIsAddingMode(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add member');
        }
    };

    const handleRemoveMember = async (id) => {
        if (!window.confirm('Are you sure you want to remove this member?')) return;
        try {
            await api.delete(`/ngo/members/${id}`);
            toast.success('Member removed');
            setMembers(members.filter(m => m._id !== id));
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to remove member');
        }
    };

    if (loading) return <div className="text-center mt-20">Loading...</div>;

    const isAdmin = user?.isNgoAdmin;

    return (
        <div className="min-h-screen bg-[#f8f9fa] dark:bg-slate-900 transition-colors duration-300">
            <Navbar />
            <div className="max-w-[1200px] mx-auto mt-6 px-4 py-8">
                <div className="flex items-center gap-3 mb-8">
                    <Building2 className="w-8 h-8 text-[#2F5373] dark:text-[#6CBBA2]" />
                    <h1 className="text-3xl font-bold text-[#2F5373] dark:text-white">Organization Settings</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* NGO Details */}
                    <div className="md:col-span-1 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm h-fit">
                        <h2 className="text-xl font-bold flex items-center gap-2 mb-4 text-[#2F5373] dark:text-white">
                            <Settings size={20} /> Details
                        </h2>
                        <div className="space-y-4 text-sm">
                            <div>
                                <p className="text-gray-500 font-medium">Organization Name</p>
                                <p className="font-semibold text-gray-800 dark:text-slate-200">{ngo?.name}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 font-medium">Description</p>
                                <p className="text-gray-800 dark:text-slate-200">{ngo?.description || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 font-medium">Website</p>
                                <p className="text-gray-800 dark:text-slate-200">{ngo?.website || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Team Members */}
                    <div className="md:col-span-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2 text-[#2F5373] dark:text-white">
                                <Users size={20} /> Team Members
                            </h2>
                            {isAdmin && !isAddingMode && (
                                <button
                                    onClick={() => setIsAddingMode(true)}
                                    className="flex items-center gap-2 bg-[#6CBBA2] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#5aa38d] transition"
                                >
                                    <Plus size={16} /> Add Member
                                </button>
                            )}
                        </div>

                        {isAdmin && isAddingMode && (
                            <form onSubmit={handleAddMember} className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-xl mb-6 border border-slate-200 dark:border-slate-600">
                                <h3 className="text-sm font-bold mb-3 text-gray-700 dark:text-slate-200">New Member Details</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                    <input
                                        type="text" required placeholder="Full Name"
                                        value={newMember.name} onChange={e => setNewMember({ ...newMember, name: e.target.value })}
                                        className="px-3 py-2 border rounded-md dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                                    />
                                    <input
                                        type="email" required placeholder="Email Address"
                                        value={newMember.email} onChange={e => setNewMember({ ...newMember, email: e.target.value })}
                                        className="px-3 py-2 border rounded-md dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                                    />
                                    <input
                                        type="password" required placeholder="Temporary Password"
                                        value={newMember.password} onChange={e => setNewMember({ ...newMember, password: e.target.value })}
                                        className="px-3 py-2 border rounded-md dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <button type="submit" className="bg-[#2F5373] dark:bg-[#6CBBA2] text-white px-4 py-2 rounded-lg text-sm font-semibold">
                                        Create Member
                                    </button>
                                    <button type="button" onClick={() => setIsAddingMode(false)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}

                        <div className="space-y-3">
                            {members.map(member => (
                                <div key={member._id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[#e8f5f1] dark:bg-teal-900/40 font-bold flex items-center justify-center text-[#2F5373] dark:text-teal-300">
                                            {member.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                                                {member.name}
                                                {member.isNgoAdmin && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">Admin</span>}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-slate-400">{member.email}</p>
                                        </div>
                                    </div>
                                    {isAdmin && !member.isNgoAdmin && (
                                        <button onClick={() => handleRemoveMember(member._id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition">
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NgoSettings;
