import React from 'react';
import Navbar from '../components/Navbar';

const NGOs = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
            <Navbar />
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold text-[#2F5373] dark:text-white mb-3">NGOs Directory</h1>
                <p className="text-gray-500 dark:text-slate-400 mb-8">Explore registered NGOs on SkillBridge.</p>
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-10 text-center">
                    <span className="text-5xl mb-4 block">🏗️</span>
                    <p className="text-gray-500 dark:text-slate-400 text-lg font-medium">NGO Directory — Coming Soon</p>
                    <p className="text-gray-400 dark:text-slate-500 text-sm mt-2">We're building a comprehensive directory of NGOs. Check back soon!</p>
                </div>
            </div>
        </div>
    );
};

export default NGOs;
