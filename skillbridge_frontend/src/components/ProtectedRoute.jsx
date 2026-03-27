import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, role, requireNGO, ngoRole }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    if (!user) {
        return <Navigate to="/login" />;
    }

    // If requireNGO is true, allow access if user has ngo_id (either role='ngo' or invited volunteer)
    if (requireNGO && !user.ngo_id) {
        return <Navigate to="/volunteer-dashboard" />;
    }

    // Standard role check
    if (role && user.role !== role && !requireNGO) {
        return <Navigate to={user.ngo_id ? '/ngo-dashboard' : '/volunteer-dashboard'} />;
    }

    // NGO-specific role check (owner, admin, member)
    // Allow access if user has ngo_id (either role='ngo' or invited volunteer)
    if (ngoRole && user.ngo_id) {
        const userNgoRole = user.role_in_ngo;
        
        if (ngoRole === 'owner' && userNgoRole !== 'owner') {
            return <Navigate to="/ngo-dashboard" />;
        }
        
        if (ngoRole === 'owner-admin' && !['owner', 'admin'].includes(userNgoRole)) {
            return <Navigate to="/ngo-dashboard" />;
        }
    }

    return children;
};

export default ProtectedRoute;
