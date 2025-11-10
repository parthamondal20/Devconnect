import { Link, NavLink } from "react-router-dom";
import { Menu, X, Moon, Sun, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { changeTheme } from "../features/themeSlice";
const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { user } = useSelector(state => state.auth);
    const { dark } = useSelector(state => state.theme);
    const dispatch = useDispatch();
    // 🌙 Toggle dark mode
    useEffect(() => {
        if (dark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [dark]);

    const navItems = [
        { label: "Home", path: "/" },
        { label: "Feed", path: "/feed" },
        { label: "Projects", path: "/projects" },
        { label: "Q&A 💬", path: "/questions" },
    ];

    return (
        <header className="sticky top-0 z-50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
                {/* 🔹 Logo */}
                <Link
                    to="/"
                    className="text-2xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text tracking-wide"
                >
                    DevConnect
                </Link>
                {/* 🌙 Right Section */}
                <div className="flex items-center gap-4">
                    {/* Dark Mode Toggle */}
                    <button
                        onClick={() => dispatch(changeTheme())}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    >
                        {dark ? <Sun size={20} className=" text-yellow-400" /> : <Moon size={20} />}
                    </button>

                    {/* Login/Profile Button */}
                    {user && <Link
                        to={`/profile/${user._id}`}
                        className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium hover:opacity-90 transition"
                    >
                        <User size={18} />
                        Profile
                    </Link>}
                </div>
            </div>

            {/* 📱 Mobile Dropdown */}
            {menuOpen && (
                <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-md">
                    <div className="flex flex-col py-3 space-y-2 px-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className="text-gray-700 dark:text-gray-300 hover:text-blue-500 transition py-1"
                                onClick={() => setMenuOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <Link
                            to={`/profile/${user._id}`}
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-2 mt-2 text-blue-600 dark:text-blue-400 font-medium"
                        >
                            <User size={18} /> Profile
                        </Link>

                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
