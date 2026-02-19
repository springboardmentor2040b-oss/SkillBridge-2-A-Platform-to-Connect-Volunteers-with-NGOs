import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';

const CreateOpportunity = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        skillsRequired: [],
        location: '',
        deadline: ''
    });

    const [skillInput, setSkillInput] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddSkill = () => {
        if (skillInput.trim() && !formData.skillsRequired.includes(skillInput.trim())) {
            setFormData({
                ...formData,
                skillsRequired: [...formData.skillsRequired, skillInput.trim()]
            });
            setSkillInput('');
        }
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
            {/* Navbar Placeholder - improved real implementation would import a Navbar component */}
            <div className="bg-white border-b px-8 py-4 flex items-center gap-2">
                <img src="/logo.jpeg" alt="Logo" className="h-8" />
                <span className="text-xl font-bold text-[#2F5373]">SkillBridge</span>
            </div>

            <div className="flex-1 flex justify-center py-10 px-4">
                <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
                    <h2 className="text-2xl font-bold text-[#2F5373] mb-6">Create New Opportunity</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
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

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills</label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    className="flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#6CBBA2] outline-none"
                                    placeholder="Add a skill (e.g. React, Python)"
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddSkill}
                                    className="px-4 py-2 bg-[#2F5373] text-white rounded-md hover:bg-[#1a3b55]"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.skillsRequired.map((skill, index) => (
                                    <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                        {skill}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSkill(skill)}
                                            className="text-red-500 hover:text-red-700 font-bold"
                                        >
                                            &times;
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

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
