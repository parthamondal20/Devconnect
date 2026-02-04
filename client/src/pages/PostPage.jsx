import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import PageLoader from "../components/PageLoader";
import { getPostById } from "../services/post";
import Feed from "./Feed";
export default function PostPage() {
    const { post_id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchPost = async () => {
        try {
            setLoading(true);
            const fetchedPost = await getPostById(post_id);
            console.log(fetchedPost);
            setPost(fetchedPost);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to load post");
            navigate(-1);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPost();
    }, [post_id]);
    if (loading) return <PageLoader />;
    if (!post) return null;
    return <Feed indivisual_post={post} />
}