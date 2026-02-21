import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';

const PREDEFINED_SKILLS = [
    'React', 'Node.js', 'JavaScript', 'Python', 'TypeScript',
    'MongoDB', 'Figma', 'Communication', 'Leadership', 'Project Management',
];

const CreateOpportunity = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        skillsRequired: [],
        location: '',
        deadline: ''
    });

    const [skillSearch, setSkillSearch] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const filteredSkills = PREDEFINED_SKILLS.filter(
        (skill) =>
            skill.toLowerCase().includes(skillSearch.toLowerCase()) &&
            !formData.skillsRequired.includes(skill)
    );

    // Custom skill (typed but not in predefined list)
    const customSkillValid =
        skillSearch.trim() &&
        !PREDEFINED_SKILLS.map(s => s.toLowerCase()).includes(skillSearch.trim().toLowerCase()) &&
        !formData.skillsRequired.map(s => s.toLowerCase()).includes(skillSearch.trim().toLowerCase());

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddSkill = (skill) => {
        const trimmed = skill.trim();
        if (trimmed && !formData.skillsRequired.includes(trimmed)) {
            setFormData({ ...formData, skillsRequired: [...formData.skillsRequired, trimmed] });
        }
        setSkillSearch('');
        setDropdownOpen(false);
    };

    const handleRemoveSkill = (skillToRemove) => {
        setFormData({
            ...formData,
            skillsRequired: formData.skillsRequired.filter(skill => skill !== skillToRemove)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.skillsRequired.length === 0) {
            toast.error('Please add at least one skill.');
            return;
        }
        try {
            await api.post('/opportunities', formData);
            toast.success('Opportunity created successfully!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create opportunity');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Navbar */}
            <div className="bg-white border-b px-8 py-4 flex items-center gap-2">
                <img src="/logo.jpeg" alt="Logo" className="h-8" />
                <span className="text-xl font-bold text-[#2F5373]">SkillBridge</span>
            </div>

            <div className="flex-1 flex justify-center py-10 px-4">
                <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
                    <h2 className="text-2xl font-bold text-[#2F5373] mb-6">Create New Opportunity</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#6CBBA2] outline-none"
                                placeholder="e.g. Website Redesign for Local Shelter"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows="4"
                                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#6CBBA2] outline-none"
                                placeholder="Describe the role and responsibilities..."
                            />
                        </div>

                        {/* Skills */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills</label>

                            {/* Search + Dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <input
                                    type="text"
                                    value={skillSearch}
                                    onChange={(e) => {
                                        setSkillSearch(e.target.value);
                                        setDropdownOpen(true);
                                    }}
                                    onFocus={() => setDropdownOpen(true)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            if (filteredSkills.length > 0) handleAddSkill(filteredSkills[0]);
                                            else if (customSkillValid) handleAddSkill(skillSearch);
                                        }
                                        if (e.key === 'Escape') setDropdownOpen(false);
                                    }}
                                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#6CBBA2] outline-none"
                                    placeholder="Search or type a skill (e.g. React, Communication)..."
                                />

                                {dropdownOpen && (skillSearch === '' ? PREDEFINED_SKILLS.filter(s => !formData.skillsRequired.includes(s)).length > 0 : filteredSkills.length > 0 || customSkillValid) && (
                                    <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-52 overflow-y-auto">
                                        {/* Custom skill option */}
                                        {customSkillValid && (
                                            <button
                                                type="button"
                                                onClick={() => handleAddSkill(skillSearch)}
                                                className="w-full text-left px-4 py-2 text-sm text-[#2F5373] font-medium hover:bg-blue-50 border-b"
                                            >
                                                + Add "<span className="font-semibold">{skillSearch}</span>"
                                            </button>
                                        )}

                                        {/* Predefined skills */}
                                        {(skillSearch === ''
                                            ? PREDEFINED_SKILLS.filter(s => !formData.skillsRequired.includes(s))
                                            : filteredSkills
                                        ).map((skill) => (
                                            <button
                                                key={skill}
                                                type="button"
                                                onClick={() => handleAddSkill(skill)}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#f0faf6] hover:text-[#2F5373]"
                                            >
                                                {skill}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Selected skill tags */}
                            <div className="flex flex-wrap gap-2 mt-3">
                                {formData.skillsRequired.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="bg-[#e8f5f1] text-[#2F5373] px-3 py-1 rounded-full text-sm flex items-center gap-2 font-medium"
                                    >
                                        {skill}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSkill(skill)}
                                            className="text-[#6CBBA2] hover:text-red-500 font-bold leading-none"
                                        >
                                            &times;
                                        </button>
                                    </span>
                                ))}
                                {formData.skillsRequired.length === 0 && (
                                    <p className="text-xs text-gray-400 mt-1">No skills added yet. Search or click to add.</p>
                                )}
                            </div>
                        </div>

                        {/* Location & Deadline */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#6CBBA2] outline-none"
                                    placeholder="e.g. Remote, New York, NY"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                                <input
                                    type="date"
                                    name="deadline"
                                    value={formData.deadline}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#6CBBA2] outline-none"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-4 py-2 bg-[#6CBBA2] text-white rounded-md hover:bg-[#5aa890] font-medium"
                            >
                                Create Opportunity
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateOpportunity;