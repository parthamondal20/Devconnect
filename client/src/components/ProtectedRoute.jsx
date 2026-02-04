import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { clearUser } from "../features/authSlice";

const ProtectedRoute = ({ children }) => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    // If user is not authenticated, redirect to home/signin
    if (!user) {
        dispatch(clearUser());
        return <Navigate to="/" replace />;
    }
    return children;
};

export default ProtectedRoute;
