import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { showError, showSuccess } from "../utils/toast";
import { signup, verifyOTP, resendOTP } from "../services/auth";
import { setUser } from "../features/authSlice";
import { useDispatch } from "react-redux";

const OTPPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("Verifying OTP...");
    const [userDetails, setUserDetails] = useState(null);
    const [countdown, setCountdown] = useState(0);
    const [resending, setResending] = useState(false);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("TempUser"));
        if (data) {
            setUserDetails(data);
        } else {
            showError("Session expired. Please sign up again.");
            navigate("/signup", { replace: true });
        }
    }, [navigate]);

    // Countdown timer for resend button
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!otp || otp.length !== 6) {
            showError("Please enter a valid 6-digit OTP");
            return;
        }

        try {
            setLoading(true);
            setMessage("Verifying OTP...");
            const { email, password, username } = userDetails;

            await verifyOTP(email, otp);

            setMessage("Creating account...");
            const user = await signup(username, email, password);
            dispatch(setUser(user));

            showSuccess("Account created successfully!");
            localStorage.removeItem("TempUser");

            setTimeout(() => {
                setLoading(false);
                navigate("/feed", {
                    replace: true
                });
            }, 1000);
        } catch (error) {
            console.log(error);
            setLoading(false);
            showError(error?.response?.data?.message || "Invalid OTP. Please try again.");
        }
    };

    const handleResend = async () => {
        if (countdown > 0 || !userDetails) return;

        try {
            setResending(true);
            const { email } = userDetails;
            await resendOTP(email);
            showSuccess(`New OTP sent to ${email}`);
            setCountdown(60); // Start 60 second countdown
            setOtp(""); // Clear OTP input
        } catch (error) {
            console.log(error);
            showError(error?.response?.data?.message || "Failed to resend OTP");
        } finally {
            setResending(false);
        }
    };

    if (loading || resending) {
        return <Loader message={message} loading={loading || resending} />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
            <div className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">
                    Verify Your Email
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                    Enter the 6-digit code sent to {userDetails?.email || "your email"}
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="flex justify-center">
                        <input
                            type="text"
                            maxLength="6"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                            placeholder="000000"
                            autoFocus
                            className="w-64 text-center tracking-widest text-2xl text-gray-900 dark:text-white py-3 rounded-xl 
                            bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 
                            shadow-md transition-all duration-200 placeholder-gray-400"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={otp.length !== 6}
                        className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium 
                        hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Verify OTP
                    </button>
                </form>

                <p className="text-gray-600 dark:text-gray-400 text-center mt-4">
                    Didn't receive the code?{" "}
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={countdown > 0}
                        className={`${countdown > 0
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-blue-500 hover:underline cursor-pointer"
                            }`}
                    >
                        {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default OTPPage;
