import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to add the token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ============================================
// NGO TEAM MANAGEMENT APIs
// ============================================

export const ngoApi = {
    // Invite a member to NGO
    inviteMember: (email, role) => 
        api.post('/ngo/invite', { email, role }),
    
    // Get all NGO members
    getMembers: () => 
        api.get('/ngo/members'),
    
    // Update member role
    updateMemberRole: (userId, role) => 
        api.put(`/ngo/member/${userId}?role=${role}`),
    
    // Remove member from NGO
    removeMember: (userId) => 
        api.delete(`/ngo/member/${userId}`),
    
    // Get NGO info
    getNGOInfo: () => 
        api.get('/ngo/info'),
};

export default api;
