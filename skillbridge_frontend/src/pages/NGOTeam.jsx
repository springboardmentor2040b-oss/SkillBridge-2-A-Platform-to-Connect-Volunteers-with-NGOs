import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, Trash2, Shield, LogOut } from 'lucide-react';
import { ngoApi } from '../services/api';
import api from '../services/api';
import Badge from '../components/common/Badge';

const NGOTeam = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    const [members, setMembers] = useState([]);
    const [ngoInfo, setNgoInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [inviteOpen, setInviteOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState('member');
    const [invitingId, setInvitingId] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [roleChangeId, setRoleChangeId] = useState(null);
    const [newRole, setNewRole] = useState('member');

    // Check if user is NGO owner
    const isOwner = user?.role_in_ngo === 'owner';

    useEffect(() => {
        // Allow access if user has ngo_id (owner or member)
        if (!user?.ngo_id) {
            navigate('/volunteer-dashboard');
            return;
        }
        fetchTeamData();
    }, [user, navigate]);

    const fetchTeamData = async () => {
        try {
            setLoading(true);
            const membersRes = await ngoApi.getMembers();
            const infoRes = await ngoApi.getNGOInfo();
            
            setMembers(membersRes.data.members || []);
            setNgoInfo(infoRes.data);
            setError('');
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to load team data');
        } finally {
            setLoading(false);
        }
    };

    const handleInviteMember = async () => {
        if (!inviteEmail.trim()) {
            setError('Please enter an email');
            return;
        }

        try {
            setInvitingId(true);
            await ngoApi.inviteMember(inviteEmail, inviteRole);
            setSuccess(`User invited as ${inviteRole}!`);
            setInviteEmail('');
            setInviteRole('member');
            setInviteOpen(false);
            
            // Refresh members list
            setTimeout(() => {
                fetchTeamData();
                setSuccess('');
            }, 1000);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to invite user');
        } finally {
            setInvitingId(false);
        }
    };

    const handleChangeRole = async (memberId) => {
        try {
            await ngoApi.updateMemberRole(memberId, newRole);
            setSuccess('Role updated successfully');
            setRoleChangeId(null);
            
            // Refresh members list
            setTimeout(() => {
                fetchTeamData();
                setSuccess('');
            }, 1000);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to update role');
        }
    };

    const handleRemoveMember = async (memberId) => {
        if (!window.confirm('Are you sure you want to remove this member?')) return;

        try {
            await ngoApi.removeMember(memberId);
            setSuccess('Member removed');
            
            // Refresh members list
            setTimeout(() => {
                fetchTeamData();
                setSuccess('');
            }, 1000);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to remove member');
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="text-center">Loading team data...</div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 bg-slate-50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Team Management</h1>
                    <p className="text-slate-500 mt-1">{ngoInfo?.name} • {members.length} members</p>
                </div>
                <button
                    onClick={() => { logout(); navigate('/'); }}
                    className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-6 py-2.5 rounded-lg font-medium hover:bg-slate-50 transition"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>

            {/* Messages */}
            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    {error}
                </div>
            )}
            {success && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                    {success}
                </div>
            )}

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    {/* Invite Section (Owner Only) */}
                    {isOwner && (
                        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-8">
                            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Plus size={20} />
                                Invite Member
                            </h2>
                            
                            {!inviteOpen ? (
                                <button
                                    onClick={() => setInviteOpen(true)}
                                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                                >
                                    + Add Team Member
                                </button>
                            ) : (
                                <div className="space-y-4">
                                    <input
                                        type="email"
                                        placeholder="Enter volunteer email"
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Role
                                        </label>
                                        <select
                                            value={inviteRole}
                                            onChange={(e) => setInviteRole(e.target.value)}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="member">Member (Read-only)</option>
                                            <option value="admin">Admin (Can manage opportunities)</option>
                                        </select>
                                    </div>
                                    
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleInviteMember}
                                            disabled={invitingId}
                                            className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
                                        >
                                            {invitingId ? 'Inviting...' : 'Send Invite'}
                                        </button>
                                        <button
                                            onClick={() => setInviteOpen(false)}
                                            className="flex-1 py-2 px-4 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 transition"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Members List */}
                    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-200">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <Users size={20} />
                                Team Members ({members.length})
                            </h2>
                        </div>

                        <div className="divide-y divide-slate-200">
                            {members.length === 0 ? (
                                <div className="p-6 text-center text-slate-500">
                                    No team members yet
                                </div>
                            ) : (
                                members.map((member) => (
                                    <div key={member.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div>
                                                    <h3 className="font-semibold text-slate-900">{member.name}</h3>
                                                    <p className="text-sm text-slate-500">{member.email}</p>
                                                </div>
                                            </div>
                                            <Badge 
                                                text={member.role_in_ngo.charAt(0).toUpperCase() + member.role_in_ngo.slice(1)}
                                                color={member.role_in_ngo === 'owner' ? 'gold' : member.role_in_ngo === 'admin' ? 'blue' : 'gray'}
                                            />
                                        </div>

                                        {/* Actions (Owner Only) */}
                                        {isOwner && member.role_in_ngo !== 'owner' && (
                                            <div className="flex gap-2">
                                                {roleChangeId === member.id ? (
                                                    <div className="flex gap-2">
                                                        <select
                                                            value={newRole}
                                                            onChange={(e) => setNewRole(e.target.value)}
                                                            className="px-3 py-1 border border-slate-300 rounded text-sm"
                                                        >
                                                            <option value="member">Member</option>
                                                            <option value="admin">Admin</option>
                                                        </select>
                                                        <button
                                                            onClick={() => handleChangeRole(member.id)}
                                                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={() => setRoleChangeId(null)}
                                                            className="px-3 py-1 bg-slate-200 text-slate-700 rounded text-sm hover:bg-slate-300"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => {
                                                                setRoleChangeId(member.id);
                                                                setNewRole(member.role_in_ngo);
                                                            }}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                                            title="Change role"
                                                        >
                                                            <Shield size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleRemoveMember(member.id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                                                            title="Remove member"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    {/* NGO Info Card */}
                    {ngoInfo && (
                        <div className="bg-white rounded-lg border border-slate-200 p-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">NGO Info</h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-slate-500">Name</p>
                                    <p className="font-semibold text-slate-900">{ngoInfo.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Owner Email</p>
                                    <p className="font-semibold text-slate-900">{ngoInfo.owner_email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Your Role</p>
                                    <Badge
                                        text={user?.role_in_ngo?.charAt(0).toUpperCase() + user?.role_in_ngo?.slice(1)}
                                        color={user?.role_in_ngo === 'owner' ? 'gold' : user?.role_in_ngo === 'admin' ? 'blue' : 'gray'}
                                    />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Team Size</p>
                                    <p className="text-3xl font-bold text-blue-600">{members.length}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Role Info Card */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
                        <h3 className="text-lg font-bold text-blue-900 mb-4">Roles & Permissions</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="font-semibold text-blue-900">👑 Owner</p>
                                <p className="text-sm text-blue-800 mt-1">Full control - invite, manage roles, create opportunities</p>
                            </div>
                            <div>
                                <p className="font-semibold text-blue-900">⚙️ Admin</p>
                                <p className="text-sm text-blue-800 mt-1">Create & manage opportunities</p>
                            </div>
                            <div>
                                <p className="font-semibold text-blue-900">👤 Member</p>
                                <p className="text-sm text-blue-800 mt-1">View-only access</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NGOTeam;
