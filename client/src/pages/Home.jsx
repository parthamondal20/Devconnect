import { Link, Navigate } from "react-router-dom";
import { Code2, Users, Rocket, Sparkles } from "lucide-react";
import { useSelector } from "react-redux";
const Home = () => {
    const { user } = useSelector((state) => state.auth);

    // ✅ Additional safeguard: check if localStorage actually has user data
    const hasValidSession = user && localStorage.getItem("appStore");

    if (hasValidSession) {
        // if already logged in, redirect to feed
        return <Navigate to="/feed" replace />;
    }
    return (
        <section className="flex flex-col items-center justify-center text-center px-6 py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
            {/* Hero Section */}
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-4">
                Welcome to{" "}
                <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
                    DevConnect
                </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mb-8">
                A social platform where developers connect, share projects, and
                collaborate on innovative ideas 🚀 created by <b>Partha Mondal</b>
            </p>

            {/* CTA Buttons */}
            <div className="flex gap-4">
                <Link
                    to="/signup"
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:opacity-90 transition"
                >
                    Sign up
                </Link>
                <Link
                    to="/signin"
                    className="px-6 py-3 rounded-full border border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800 transition font-medium"
                >
                    Sign in
                </Link>
            </div>

            {/* Features Section */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl w-full">
                <FeatureCard
                    icon={<Users className="text-blue-500" size={36} />}
                    title="Connect with Devs"
                    desc="Find and follow developers who share your interests and skills."
                />
                <FeatureCard
                    icon={<Code2 className="text-purple-500" size={36} />}
                    title="Showcase Projects"
                    desc="Share your GitHub projects and get feedback from the community."
                />
                <FeatureCard
                    icon={<Rocket className="text-pink-500" size={36} />}
                    title="Collaborate & Grow"
                    desc="Join forces on open-source ideas and level up your skills together."
                />
            </div>

            {/* Sparkles Section */}
            <div className="mt-20 flex flex-col items-center">
                <Sparkles className="text-yellow-400 mb-2" size={28} />
                <p className="text-gray-700 dark:text-gray-300 text-lg font-medium">
                    Let’s build something amazing together 💻✨
                </p>
            </div>
        </section>
    );
};

// 🧩 Small reusable card component
const FeatureCard = ({ icon, title, desc }) => {
    return (
        <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow hover:shadow-lg transition border border-gray-100 dark:border-gray-800">
            <div className="flex flex-col items-center text-center gap-3">
                {icon}
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{desc}</p>
            </div>
        </div>
    );
};

export default Home;
