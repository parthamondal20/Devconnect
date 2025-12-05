import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Moon, Sun, Search, MessageCircle, LogIn } from "lucide-react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { changeTheme } from "../features/themeSlice";
import { searchUser } from "../services/user";
import useDebounce from "../hooks/useDebounce";
const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const { user } = useSelector(state => state.auth);
    const { dark } = useSelector(state => state.theme);
    const [autoSuggestions, setAutoSuggestions] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    // Debounce the search query for efficient API calls
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    // 🌙 Toggle dark mode effect
    useEffect(() => {
        if (dark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [dark]);

    // 🔥 Live Search Suggestions (Desktop)
    useEffect(() => {
        setLoading(true);
        const fetchSuggestions = async () => {
            if (debouncedSearchQuery.trim()) {
                try {
                    const suggestions = await searchUser(debouncedSearchQuery);
                    console.log(suggestions);
                    setAutoSuggestions(suggestions);
                } catch (error) {
                    console.error("Search failed:", error);
                    setAutoSuggestions([]);
                } finally {
                    setLoading(false);
                }
            } else {
                setAutoSuggestions([]); // Clear suggestions if query is empty
            }
        };

        if (user && debouncedSearchQuery.length >= 1) {
            fetchSuggestions();
        } else if (debouncedSearchQuery.length <= 1) {
            setAutoSuggestions([]);
        }
    }, [debouncedSearchQuery, user]);

    // Fixed: Mobile search submission (navigates to search results page)
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${searchQuery.trim()}`);
            setMenuOpen(false);
            setSearchQuery(""); // Clear input after submission
        }
    };

    const navItems = [
        { label: "Home", path: "/feed" },
        { label: "Projects", path: "/projects" },
        { label: "Q&A", path: "/questions" },
        { label: <MessageCircle size={18} />, path: "/messages" },
    ];

    return (
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 gap-4">

                    {/* 🔹 1. Logo (Fixed Link Logic) */}
                    <Link to="/feed" className="flex-shrink-0 flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-105 transition-transform">
                            D
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent tracking-tight hidden sm:block">
                            DevConnect
                        </span>
                    </Link>

                    {/* 🔍 2. Search Bar (Desktop) */}
                    {user && <div className="hidden md:flex flex-1 max-w-md mx-auto">
                        <div className="relative w-full group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-full leading-5 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all sm:text-sm"
                                placeholder="Search developers, posts..."
                            />

                            {/* 🔥 Suggestions Dropdown */}
                            {(autoSuggestions.length > 0 || searchQuery.trim()) && (
                                <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl overflow-hidden z-20">

                                    {/* Case 1: Results Found (Display Suggestions) */}
                                    {autoSuggestions.length > 0 ? (
                                        <>
                                            <div className="py-1">
                                                {autoSuggestions.slice(0, 5).map(suggestion => (
                                                    <Link
                                                        key={suggestion._id}
                                                        to={`/profile/${suggestion._id}`}
                                                        onClick={() => {
                                                            setSearchQuery("");
                                                            setAutoSuggestions([]);
                                                        }}
                                                        className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                                                    >
                                                        <img
                                                            src={suggestion.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=user"}
                                                            alt={suggestion.username}
                                                            className="w-9 h-9 rounded-full object-cover mr-3 border border-gray-100 dark:border-gray-700"
                                                        />
                                                        <div>
                                                            <span className="block font-semibold text-gray-900 dark:text-gray-100">{suggestion.username}</span>
                                                            {/* Optional: Add secondary info like a title or short description */}
                                                            <span className="block text-xs text-gray-500 dark:text-gray-400 truncate">Developer</span>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>

                                            {/* View All Results Link */}
                                            <hr className="border-gray-100 dark:border-gray-700" />
                                            <Link
                                                to={`/search?q=${searchQuery.trim()}`}
                                                onClick={() => {
                                                    setSearchQuery("");
                                                    setAutoSuggestions([]);
                                                }}
                                                className="block w-full text-center py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700/30 transition-colors"
                                            >
                                                View all results for "{searchQuery.substring(0, 20)}..."
                                            </Link>
                                        </>
                                    ) : !loading && (

                                        /* Case 2: No Results Found (Display Message) */
                                        <div className="p-4 flex flex-col items-center justify-center text-center">
                                            <Search className="w-6 h-6 text-gray-400 mb-2" />
                                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                                No users found
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                Try refining your search for **"{searchQuery}"**.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>}

                    {/* 🔗 3. Navigation (Desktop) */}
                    {
                        user && <nav className="hidden lg:flex items-center gap-1">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) => `
                                        px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                                        ${isActive
                                            ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/10"
                                            : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                                        }
                                    `}
                                >
                                    {item.label}
                                </NavLink>
                            ))}
                        </nav>

                    }


                    {/* ⚙️ 4. Actions */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <button
                            onClick={() => dispatch(changeTheme())}
                            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none"
                            aria-label="Toggle Dark Mode"
                        >
                            {dark ? <Sun size={20} className="text-yellow-400 fill-yellow-400" /> : <Moon size={20} />}
                        </button>

                        {user &&
                            <Link
                                to={`/profile/${user._id}`}
                                className="hidden sm:flex items-center gap-2 p-1 pr-3 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                            >
                                <img
                                    src={user.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                                    alt="Profile"
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[100px] truncate">
                                    {user.username}
                                </span>
                            </Link>
                        }


                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            {menuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* 📱 Mobile Menu Dropdown */}
            {menuOpen && (
                <div className="lg:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 animate-in slide-in-from-top-2 duration-200">
                    <div className="px-4 pt-4 pb-6 space-y-4">

                        {/* Mobile Search - Now submits a search and navigates */}
                        {user && <form onSubmit={handleSearch} className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                                placeholder="Search..."
                            />
                        </form>}

                        {/* Mobile Nav Links */}
                        <div className="space-y-1">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setMenuOpen(false)}
                                    className={({ isActive }) => `
                                        block px-3 py-2.5 rounded-md text-base font-medium transition-colors
                                        ${isActive
                                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                            : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                                        }
                                    `}
                                >
                                    {item.label}
                                </NavLink>
                            ))}
                        </div>

                        {/* Mobile User Profile Section */}
                        {user ? (
                            <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                                <Link
                                    to={`/profile/${user._id}`}
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                                >
                                    <img
                                        src={user.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                                        alt="Profile"
                                        className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700 group-hover:border-blue-500 transition-colors"
                                    />
                                    <div>
                                        <div className="text-sm font-bold text-gray-900 dark:text-white">{user.username}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
                                    </div>
                                </Link>
                            </div>
                        ) : (
                            <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                                <Link
                                    to="/signin"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                                >
                                    <LogIn size={18} /> Sign In
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;

