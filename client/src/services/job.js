import api from "../api/axios";
const getJobs = async (location, role) => {
    try {
        const res = await api.get(`/jobs/list/?location=${location}&role=${role}`);
        return res.data.data;
    } catch (error) {
        console.error("Error fetching jobs:", error);
        throw error;
    }
};

export default getJobs;
