import api from "../api/axios";

const getComments = async (post_id) => {
    try {
        const res = await api.get(`/comment/${post_id}`);
        console.log(res);
        return res.data.data;
    } catch (error) {
        throw error;
    }
}

const addComment = async (post_id, text) => {
    try {
        const res = await api.post("/comment/add", {
            post_id,
            text
        });
        console.log(res);
        return res.data.data;
    } catch (error) {
        throw error;
    }
}
const deleteComment = async (commentId) => {
    try {
        await api.delete(`/comment/${commentId}`);
    } catch (error) {
        throw error;
    }
}
export { getComments, addComment, deleteComment };