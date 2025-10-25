import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import githubLogo from "../assets/github.svg";
import Loader from "../components/Loader";
import { showError, showSuccess } from "../utils/toast";
import { getUser } from "../services/user";
import { setUser } from "../features/authSlice";
import { useDispatch } from "react-redux";
import { signin } from "../services/auth";
const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [message,setMessage]=useState("Logging in with github...");
    const dispatch = useDispatch();
    const handleEmailLogin = async(e) => {
        e.preventDefault();
        // TODO: call backend API for JWT login
        try {
            setLoading(true);
            setMessage(`Signing in to ${email}`);
            const user=await signin(email,password);
            dispatch(setUser(user));
            navigate("/feed",{
                replace:true
            })
        } catch (error) {
            console.log(error);
            showError(error?.response?.data?.message);
        }finally{
            setLoading(false);
        }
    };

    const handleOAuthLogin = (provider) => {
        setLoading(true);

        const width = 600;
        const height = 700;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;

        const popup = window.open(
            `http://localhost:5000/api/auth/${provider}`,
            "_blank",
            `width=${width},height=${height},top=${top},left=${left}`
        );

        // Poll for popup close
        const popupTick = setInterval(async () => {
            if (popup.closed) {
                clearInterval(popupTick);

                try {
                    const data = await getUser(); // backend reads cookie
                    dispatch(setUser(data));
                    showSuccess("Logged in successfully");
                    // Replace signin page in history and navigate to feed
                    window.history.replaceState({}, "", "/feed");
                    navigate("/feed", { replace: true });
                } catch (err) {
                    console.log(err);
                    showError(err?.response?.message || "Login failed. Please try again.");
                } finally {
                    setLoading(false);
                }
            }
        }, 500);
    };



    // Social login handlers
    const handleGithubLogin = () => {
        setLoading(true);
        window.location.href = "http://localhost:5000/api/auth/github";
    };
    const handleGoogleLogin = () => (window.location.href = "http://localhost:5000/auth/google");

    if (loading) {
        return <Loader message={message} loading={loading} />
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
            <div className="max-w-md w-full bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">
                    Sign in to DevConnect
                </h1>

                {/* Email/Password Form */}
                <form onSubmit={handleEmailLogin} className="space-y-4">
                    <div className="relative">
                        <Mail className="absolute top-3 left-3 text-gray-400" size={20} />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute top-3 left-3 text-gray-400" size={20} />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition"
                    >
                        Sign In
                    </button>
                </form>

                {/* Divider */}
                <div className="flex items-center my-4 gap-2 text-gray-400">
                    <span className="flex-grow border-t border-gray-300 dark:border-gray-700"></span>
                    <span>or continue with</span>
                    <span className="flex-grow border-t border-gray-300 dark:border-gray-700"></span>
                </div>

                {/* Social Login Buttons */}
                <div className="flex flex-col gap-3 cursor-pointer">
                    <button
                        onClick={() => handleOAuthLogin("github")}
                        className="flex items-center justify-center gap-2 py-2 rounded-lg bg-white text-gray-800 border border-gray-300 hover:bg-gray-100 transition"
                    >
                        <img
                            src={githubLogo}
                            alt="Github Logo"
                            className="w-5 h-5"
                        />
                        Sign in with Github
                    </button>



                    <button
                        onClick={() => handleOAuthLogin("google")}
                        className="flex items-center justify-center gap-2 py-2 rounded-lg bg-white text-gray-800 border border-gray-300 hover:bg-gray-100 transition"
                    >
                        <img
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                            alt="Google Logo"
                            className="w-5 h-5"
                        />
                        Sign in with Google
                    </button>

                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">
                    Don’t have an account?{" "}
                    <Link to="/signup" className="text-blue-500 hover:underline">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignIn;
