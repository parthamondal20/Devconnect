import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import githubLogo from "../assets/github.svg"
import linkedinLogo from "../assets/linkedin.svg"
import { githubLogin, sendOTP } from "../services/auth";
import Loader from "../components/Loader";
import { useSelector } from "react-redux";
import { setUser } from "../features/authSlice";
import { showError, showSuccess } from "../utils/toast";
import { useDispatch } from "react-redux";
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



    if (loading) {
        return <Loader message={message} loading={loading} />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
            <div className="max-w-md w-full bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">
                    Create your account
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4 mb-3">
                    <div className="relative">

                        <p className="dark:text-white">Username<span className="text-red-500">*</span></p>
                        <input
                            type="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full pl-4 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div className="relative">

                        <p className="dark:text-white">Email <span className="text-red-500">*</span></p>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full pl-4 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>


                    <div className="relative">
                        <p className="dark:text-white">Password <span className="text-red-500">*</span></p>
                        <input
                            type={show ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full pl-4 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>


                    <label className="flex items-center gap-2 cursor-pointer select-none text-gray-700 dark:text-gray-300 text-sm mt-2">
                        <input
                            type="checkbox"
                            checked={show}
                            onChange={() => setShow(!show)}
                            className="w-4 h-4 accent-blue-500 rounded focus:ring-2 focus:ring-blue-400 cursor-pointer"
                        />
                        Show Password
                    </label>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 bg-gradient-to-r cursor-pointer from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition"
                    >
                        Sign Up
                    </button>
                    <div className="flex items-center my-4 gap-2 text-gray-400">
                        <span className="flex-grow border-t border-gray-300 dark:border-gray-700"></span>
                        <span>or continue with</span>
                        <span className="flex-grow border-t border-gray-300 dark:border-gray-700"></span>
                    </div>

                </form>
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
                        Continue with Github
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
                        Continue with Google
                    </button>

                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">
                    Already have an account?{" "}
                    <Link to="/signin" className="text-blue-500 hover:underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignUp;
