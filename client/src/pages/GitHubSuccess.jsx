import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { setUser } from "../features/authSlice";
import { useDispatch } from "react-redux";
import { getUser } from "../services/user";
import { showError, showSuccess } from "../utils/toast";
const GitHubSuccess = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const effectRun = useRef(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("Logging you in..");
    useEffect(() => {
        if (effectRun.current) return; // skip second run
        effectRun.current = true;
        const fetchAndNavigate = async () => {
            setLoading(true);
            try {
                const data = await getUser();
                console.log(data);
                dispatch(setUser(data));
                setMessage(`signing in ${data.email}`);
                await new Promise((resolve) => setTimeout(resolve, 2000));
                showSuccess("Logged in successfully");
                navigate("/feed", { replace: true });
            } catch (error) {
                console.log(error);
                showError("Failed to fetch user data.");
            } finally {
                setLoading(false);
            }
        };

        fetchAndNavigate();
    }, []);
    return <Loader message={message} loading={loading} />;
};

export default GitHubSuccess;
