import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { PREDEFINED_SKILLS } from '../constants/skills';
import Navbar from '../components/Navbar';

const EditOpportunity = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '', description: '', skillsRequired: [], location: '', deadline: ''
    });
    const [skillSearch, setSkillSearch] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const dropdownRef = useRef(null);

    const today = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];

    // Prefill form with existing opportunity data
    useEffect(() => {
        const fetchOpportunity = async () => {
            try {
                const res = await api.get(`/opportunities/${id}`);
                const opp = res.data.data;
                setFormData({
                    title: opp.title || '',
                    description: opp.description || '',
                    skillsRequired: opp.skillsRequired || [],
                    location: opp.location || '',
                    deadline: opp.deadline ? opp.deadline.split('T')[0] : '',
                });
            } catch {
                toast.error('Failed to load opportunity');
                navigate('/opportunities');
            } finally {
                setLoading(false);
            }
        };
        fetchOpportunity();
    }, [id]);

    const filteredSkills = PREDEFINED_SKILLS.filter(
        (skill) => skill.toLowerCase().includes(skillSearch.toLowerCase()) && !formData.skillsRequired.includes(skill)
    );
    const customSkillValid =
        skillSearch.trim() &&
        !PREDEFINED_SKILLS.map(s => s.toLowerCase()).includes(skillSearch.trim().toLowerCase()) &&
        !formData.skillsRequired.map(s => s.toLowerCase()).includes(skillSearch.trim().toLowerCase());

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleAddSkill = (skill) => {
        const trimmed = skill.trim();
        if (trimmed && !formData.skillsRequired.includes(trimmed))
            setFormData({ ...formData, skillsRequired: [...formData.skillsRequired, trimmed] });
        setSkillSearch('');
        setDropdownOpen(false);
    };

    const handleRemoveSkill = (skillToRemove) =>
        setFormData({ ...formData, skillsRequired: formData.skillsRequired.filter(s => s !== skillToRemove) });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.skillsRequired.length === 0) { toast.error('Please add at least one skill.'); return; }
        if (formData.deadline && formData.deadline < today) { toast.error('Deadline cannot be in the past.'); return; }
        try {
            await api.put(`/opportunities/${id}`, formData);
            toast.success('Opportunity updated successfully!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update opportunity');
        }
    };

    const inputClass = "w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#6CBBA2] outline-none bg-white dark:bg-slate-700 text-slate-800 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 transition";
    const labelClass = "block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1";

    if (loading) return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
            <Navbar />
            <div className="flex justify-center items-center h-[80vh]">
                <p className="text-gray-400 dark:text-slate-500">Loading...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
            <Navbar />
            <div className="flex justify-center py-10 px-4">
                <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-2xl">
                    <h2 className="text-2xl font-bold text-[#2F5373] dark:text-white mb-6">Edit Opportunity</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className={labelClass}>Title</label>
                            <input type="text" name="title" value={formData.title} onChange={handleChange} required
                                className={inputClass} placeholder="e.g. Website Redesign for Local Shelter" />
                        </div>

                        {/* Description */}
                        <div>
                            <label className={labelClass}>Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} required rows="4"
                                className={`${inputClass} resize-none`} placeholder="Describe the role and responsibilities..." />
                        </div>

                        {/* Skills */}
                        <div>
                            <label className={labelClass}>Required Skills</label>
                            <div className="relative" ref={dropdownRef}>
                                <input type="text" value={skillSearch}
                                    onChange={(e) => { setSkillSearch(e.target.value); setDropdownOpen(true); }}
                                    onFocus={() => setDropdownOpen(true)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            if (filteredSkills.length > 0) handleAddSkill(filteredSkills[0]);
                                            else if (customSkillValid) handleAddSkill(skillSearch);
                                        }
                                        if (e.key === 'Escape') setDropdownOpen(false);
                                    }}
                                    className={inputClass}
                                    placeholder="Search or type a skill..."
                                />
                                {dropdownOpen && (skillSearch === ''
                                    ? PREDEFINED_SKILLS.filter(s => !formData.skillsRequired.includes(s)).length > 0
                                    : filteredSkills.length > 0 || customSkillValid) && (
                                        <div className="absolute z-10 w-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg shadow-lg mt-1 max-h-52 overflow-y-auto">
                                            {customSkillValid && (
                                                <button type="button" onClick={() => handleAddSkill(skillSearch)}
                                                    className="w-full text-left px-4 py-2 text-sm text-[#2F5373] dark:text-[#6CBBA2] font-medium hover:bg-blue-50 dark:hover:bg-slate-600 border-b border-slate-200 dark:border-slate-600">
                                                    + Add "<span className="font-semibold">{skillSearch}</span>"
                                                </button>
                                            )}
                                            {(skillSearch === ''
                                                ? PREDEFINED_SKILLS.filter(s => !formData.skillsRequired.includes(s))
                                                : filteredSkills
                                            ).map((skill) => (
                                                <button key={skill} type="button" onClick={() => handleAddSkill(skill)}
                                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-[#f0faf6] dark:hover:bg-slate-600 hover:text-[#2F5373] dark:hover:text-white">
                                                    {skill}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {formData.skillsRequired.map((skill, index) => (
                                    <span key={index} className="bg-[#e8f5f1] dark:bg-teal-900/30 text-[#2F5373] dark:text-teal-300 px-3 py-1 rounded-full text-sm flex items-center gap-2 font-medium">
                                        {skill}
                                        <button type="button" onClick={() => handleRemoveSkill(skill)}
                                            className="text-[#6CBBA2] dark:text-teal-400 hover:text-red-500 font-bold leading-none">&times;</button>
                                    </span>
                                ))}
                                {formData.skillsRequired.length === 0 && (
                                    <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">No skills added yet.</p>
                                )}
                            </div>
                        </div>

                        {/* Location & Deadline */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Location</label>
                                <input type="text" name="location" value={formData.location} onChange={handleChange} required
                                    className={inputClass} placeholder="e.g. Remote, New York, NY" />
                            </div>
                            <div>
                                <label className={labelClass}>Deadline</label>
                                <input type="date" name="deadline" value={formData.deadline} onChange={handleChange}
                                    min={today} className={inputClass} />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 pt-2">
                            <button type="button" onClick={() => navigate('/dashboard')}
                                className="flex-1 px-4 py-2.5 border border-slate-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition">
                                Cancel
                            </button>
                            <button type="submit"
                                className="flex-1 px-4 py-2.5 bg-[#6CBBA2] text-white rounded-lg hover:bg-[#5aa890] font-semibold transition">
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditOpportunity;
