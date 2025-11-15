import api from "../api/axios";

// Stubbed service functions. Replace with real API endpoints later.
const createCommunity = async (name, description) => {
    try {
        const res = await api.post("/community/create", { name, description });
        return res.data.data;
    } catch (error) {
        throw error;
    }
};

const searchCommunities = async (query) => {
    // return await api.get(`/community?search=${query}`)
    // stubbed
    return { data: [] };
};

const getJoinedCommunities = async (userId) => {
    // return await api.get(`/community/joined/${userId}`)
    return { data: [] };
};

export { createCommunity, searchCommunities, getJoinedCommunities };
