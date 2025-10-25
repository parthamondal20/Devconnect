import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { showError } from "../utils/toast";
import { signup, verifyOTP } from "../services/auth";
import { setUser } from "../features/authSlice";
import { useDispatch } from "react-redux";
const OTPPage = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("Verifying OTP...");
    const [userDetails, setUserDetails] = useState(null);
    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("TempUser"));
        if (data) {
            setUserDetails(data);
        }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { email, password, username } = userDetails;
            await verifyOTP(email, otp);
            setMessage("Creating account...");
            const user = await signup(username, email, password);
            dispatch(setUser(user));
            setTimeout(() => {
                setLoading(false);
                navigate("/feed", {
                    replace: true
                });
            }, 1000);
            localStorage.removeItem("TempUser");
        } catch (error) {
            console.log(error);
            showError(error?.response?.data?.message);
        } finally {
            setLoading(false);
        }
        // TODO: call backend to verify OTP

    };

    const handleResend = async() => {
        try {
            const {email}=userDetails;
            
        } catch (error) {
            
        }
        console.log("Resend OTP clicked");
        // TODO: call backend to resend OTP
    };
    if (loading) {
        return <Loader message={message} loading={loading} />;
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
            <div className="w-full max-w-md bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-800">
                <h1 className="text-2xl font-bold text-white text-center mb-6">
                    Enter OTP
                </h1>
                <p className="text-gray-400 text-center mb-6">
                    Enter the 6-digit code sent to your email or phone
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="flex justify-center">
                        <input
                            type="text"
                            maxLength="6"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} // only digits
                            placeholder="Enter 6-digit OTP"
                            className="w-64 text-center tracking-widest text-2xl text-white py-3 rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 shadow-md transition-all duration-200 placeholder-gray-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition"
                    >
                        Verify OTP
                    </button>
                </form>

                <p className="text-gray-400 text-center mt-4">
                    Didn't receive the code?{" "}
                    <button
                        type="button"
                        onClick={handleResend}
                        className="text-blue-500 hover:underline"
                    >
                        Resend OTP
                    </button>
                </p>
            </div>
        </div>
    );
};

export default OTPPage;
