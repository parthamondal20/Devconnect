import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import githubLogo from "../assets/github.svg";
import { sendOTP } from "../services/auth";
import Loader from "../components/Loader";
import { useSelector, useDispatch } from "react-redux";
import { showError, showSuccess } from "../utils/toast";
import { setUser } from "../features/authSlice";
import { getUser } from "../services/user";
const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("Loading...")
    const { user } = useSelector(state => state.auth);
    const serverURL = import.meta.env.VITE_BACKEND_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) {
            showError("Please enter email properly");
        }
        try {
            setLoading(true);
            setMessage(`sending otp to ${email}`)
            await sendOTP(email);
            const userDetails = { email, username, password };
            localStorage.setItem("TempUser", JSON.stringify(userDetails));
            navigate("/verify-otp", {
                replace: true
            })
        } catch (error) {
            console.log(error);
            showError(error?.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            // already logged in → redirect to feed
            navigate("/feed", { replace: true });
        }
    }, [user, navigate]);

    const handleOAuthLogin = (provider) => {
        // For mobile, use full-page redirect instead of popup
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        if (isMobile) {
            // Mobile: full-page redirect
            window.location.href = `${serverURL}/auth/${provider}`;
        } else {
            // Desktop: popup window
            setLoading(true);
            const width = 600;
            const height = 700;
            const left = window.screen.width / 2 - width / 2;
            const top = window.screen.height / 2 - height / 2;

            const popup = window.open(
                `${serverURL}/auth/${provider}`,
                "_blank",
                `width=${width},height=${height},top=${top},left=${left}`
            );

            // Poll for popup close
            const popupTick = setInterval(async () => {
                if (popup.closed) {
                    clearInterval(popupTick);
                    try {
                        const data = await getUser();
                        dispatch(setUser(data));
                        showSuccess("Logged in successfully");
                        navigate("/feed", { replace: true });
                    } catch (err) {
                        console.log(err);
                        showError(err?.response?.message || "Login failed. Please try again.");
                    } finally {
                        setLoading(false);
                    }
                }
            }, 500);
        }
    };


    if (loading) {
        return <Loader message={message} loading={loading} />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-8">
            <div className="max-w-md w-full bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                    Create account
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                    Join DevConnect today
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="johndoe"
                            required
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                            placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                            outline-none transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                            placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                            outline-none transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            Password
                        </label>
                        <input
                            type={show ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Create a password"
                            required
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                            placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                            outline-none transition"
                        />
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer select-none text-gray-600 dark:text-gray-400 text-sm">
                        <input
                            type="checkbox"
                            checked={show}
                            onChange={() => setShow(!show)}
                            className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                        />
                        Show password
                    </label>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium 
                        hover:bg-blue-700 transition-colors 
                        disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Create Account
                    </button>
                </form>

                {/* Divider */}
                <div className="flex items-center my-6 gap-2">
                    <span className="flex-grow border-t border-gray-200 dark:border-gray-800"></span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">OR</span>
                    <span className="flex-grow border-t border-gray-200 dark:border-gray-800"></span>
                </div>

                {/* OAuth Buttons */}
                <div className="space-y-2.5">
                    <button
                        onClick={() => handleOAuthLogin("github")}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg 
                        border border-gray-300 dark:border-gray-700 
                        hover:bg-gray-50 dark:hover:bg-gray-800 
                        text-gray-700 dark:text-gray-300 transition-colors"
                    >
                        <img src={githubLogo} alt="GitHub" className="w-5 h-5" />
                        <span className="text-sm font-medium">Continue with GitHub</span>
                    </button>
                    <button
                        onClick={() => handleOAuthLogin("google")}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg 
                        border border-gray-300 dark:border-gray-700 
                        hover:bg-gray-50 dark:hover:bg-gray-800 
                        text-gray-700 dark:text-gray-300 transition-colors"
                    >
                        <img
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                            alt="Google"
                            className="w-5 h-5"
                        />
                        <span className="text-sm font-medium">Continue with Google</span>
                    </button>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mt-6 text-center">
                    Already have an account?{" "}
                    <Link to="/signin" className="text-blue-600 dark:text-blue-500 font-medium hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignUp;
