import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import Loader from "../components/Loader";
import { showError } from "../utils/toast";
import { setUser } from "../features/authSlice";
import { useDispatch } from "react-redux";
import { signin } from "../services/auth";
const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("Signing in...");
    const dispatch = useDispatch();

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setMessage(`Signing in to ${email}`);
            const user = await signin(email, password);
            dispatch(setUser(user));
            navigate("/feed", {
                replace: true
            })
        } catch (error) {
            console.log(error);
            showError(error?.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loader message={message} loading={loading} />
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
            <div className="max-w-md w-full bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                    Sign in
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                    Welcome back to DevConnect
                </p>

                {/* Email/Password Form */}
                <form onSubmit={handleEmailLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute top-2.5 left-3 text-gray-400" size={18} />
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                                bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                                placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                outline-none transition"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute top-2.5 left-3 text-gray-400" size={18} />
                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                                bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                                placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                outline-none transition"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium 
                        hover:bg-blue-700 transition-colors 
                        disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Sign In
                    </button>
                </form>

                <p className="text-sm text-gray-600 dark:text-gray-400 mt-6 text-center">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-blue-600 dark:text-blue-500 font-medium hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignIn;
