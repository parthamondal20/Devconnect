import { Link, NavLink, useNavigate } from "react-router-dom";
import {
    Moon,
    Sun,
    Search,
    MessageCircle,
    Bell,
    LogIn,
    ArrowLeft,
    Home,
    Layers3,
    ClipboardList
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { changeTheme } from "../features/themeSlice";
import { searchUser } from "../services/user";
import useDebounce from "../hooks/useDebounce";
import { connectSocket } from "../api/socket";
import { useNotifications } from "../context/NotificationContext";

import { addToSearchHistory, deleteSearchHistoryItem, clearSearchHistory, getSearchHistory } from "../services/user";
import SearchHistoryDropdown from "./SearchHistoryDropdown";
const Header = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchingMobile, setIsSearchingMobile] = useState(false);

    const { user } = useSelector(state => state.auth);
    const { dark } = useSelector(state => state.theme);
    const { unreadCount } = useNotifications();
    const [autoSuggestions, setAutoSuggestions] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const debouncedSearchQuery = useDebounce(searchQuery, 300);
    const mobileSearchInputRef = useRef(null);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const searchContainerRef = useRef(null);

    // 🌙 Dark Mode Effect
    useEffect(() => {
        if (dark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [dark]);

    useEffect(() => {
        if (user) {
            connectSocket(user._id);
        }
    }, [user]);
    // 🔥 Live Search Suggestions
    useEffect(() => {
        if (!user) {
            setAutoSuggestions([]);
            return;
        }

        const term = debouncedSearchQuery.trim();
        if (!term || term.length < 1) {
            setLoading(false);
            setAutoSuggestions([]);
            return;
        }

        setLoading(true);
        const fetchSuggestions = async () => {
            try {
                const suggestions = await searchUser(term);
                setAutoSuggestions(suggestions);
            } catch (error) {
                console.error("Search failed:", error);
                setAutoSuggestions([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSuggestions();
    }, [debouncedSearchQuery, user]);

    // UX: Focus mobile search input
    useEffect(() => {
        if (isSearchingMobile && mobileSearchInputRef.current) {
            mobileSearchInputRef.current.focus();
        }
    }, [isSearchingMobile]);

    // Handle click outside to close search dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setIsSearchFocused(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    // Search submission logic
    const handleSearch = (e) => {
        e.preventDefault();
        const query = searchQuery.trim();
        if (query) {
            navigate(`/search?q=${query}`);
            setIsSearchingMobile(false);
            setSearchQuery("");
            setAutoSuggestions([]);
        }
    };

    // Handler for selecting a suggestion item
    const handleSuggestionClick = async (path, user = null) => {
        // Add to search history if userId is provided
        if (user) {
            try {
                await addToSearchHistory(user);
            } catch (error) {
                console.error("Failed to add to search history:", error);
            }
        }

        navigate(path);
        setSearchQuery("");
        setAutoSuggestions([]);
        setIsSearchingMobile(false);
        setIsSearchFocused(false);
    }

    const toggleMobileSearch = () => {
        setIsSearchingMobile(prev => !prev);
        setSearchQuery("");
        setAutoSuggestions([]);
    }

    // Navigation Items with Icons (Desktop only)
    const navItems = [
        { label: "Feed", path: "/feed", Icon: Home },
        { label: "Q&A", path: "/questions", Icon: ClipboardList },
    ];

    // Tailwind classes for consistent styling
    const iconButtonClasses = "p-2 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none";
    const activeNavClasses = "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/10";
    const inactiveNavClasses = "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800";

    // The main Header component structure
    return (
        <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 gap-6">

                    {/* 1. LEFT SECTION: Logo */}
                    <div className={`flex items-center gap-4 ${isSearchingMobile ? 'hidden md:flex' : 'flex'}`}>
                        {/* Logo */}
                        <div className="flex-shrink-0 flex items-center gap-2 group">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-extrabold text-lg shadow-md group-hover:scale-105 transition-transform">
                                D
                            </div>
                            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight hidden sm:block">
                                DevConnect
                            </span>
                        </div>
                    </div>

                    {/* 2. CENTER SECTION: Search Bar */}
                    {user &&
                        <div className="hidden md:block flex-1 max-w-xl mx-auto">
                            <div ref={searchContainerRef} className="relative w-full group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setIsSearchFocused(true)}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg leading-5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all sm:text-sm shadow-inner"
                                    placeholder="Search developers..."
                                />

                                {/* Desktop Suggestions/History Dropdown */}
                                {isSearchFocused && (
                                    searchQuery.trim() ? (
                                        /* Show search suggestions when there's a query */
                                        (autoSuggestions.length > 0 || searchQuery.trim()) && (
                                            <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden z-20">
                                                {autoSuggestions.length > 0 ? (
                                                    <>
                                                        <div className="py-1">
                                                            {autoSuggestions.slice(0, 5).map(suggestion => (
                                                                <div
                                                                    key={suggestion._id}
                                                                    onClick={() => handleSuggestionClick(`/profile/${suggestion._id}`, suggestion)}
                                                                    className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                                                                >
                                                                    <img
                                                                        src={suggestion.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=user"}
                                                                        alt={suggestion.username}
                                                                        className="w-9 h-9 rounded-full object-cover mr-3 border border-gray-100 dark:border-gray-700"
                                                                    />
                                                                    <div>
                                                                        <span className="block font-semibold text-gray-900 dark:text-gray-100">{suggestion.username}</span>
                                                                        <span className="block text-xs text-gray-500 dark:text-gray-400 truncate">Developer</span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <hr className="border-gray-100 dark:border-gray-700" />
                                                        <Link
                                                            to={`/search?q=${searchQuery.trim()}`}
                                                            onClick={() => handleSuggestionClick(`/search?q=${searchQuery.trim()}`)}
                                                            className="block w-full text-center py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700/30 transition-colors"
                                                        >
                                                            View all results
                                                        </Link>
                                                    </>
                                                ) : !loading && (
                                                    <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                                        No users found for "{searchQuery}".
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    ) : (
                                        /* Show search history when focused but no query */
                                        <SearchHistoryDropdown
                                            open={isSearchFocused}
                                            onSelectUser={() => setIsSearchFocused(false)}
                                            isMobile={false}
                                        />
                                    )
                                )}
                            </div>
                        </div>
                    }

                    {/* 3. RIGHT SECTION: Navigation and Actions */}
                    <div className="flex items-center gap-1 sm:gap-2 shrink-0">

                        {/* Desktop Nav Links */}
                        {user &&
                            <nav className="hidden lg:flex items-center gap-1 mr-2">
                                {navItems.map((item) => (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        className={({ isActive }) => `
                                            px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                                            ${isActive ? activeNavClasses : inactiveNavClasses}
                                        `}
                                    >
                                        <div className="flex items-center gap-1">
                                            <item.Icon size={18} className="mr-0.5" />
                                            {item.label}
                                        </div>
                                    </NavLink>
                                ))}
                            </nav>
                        }

                        {/* Notifications Link with Label */}
                        {user &&
                            <NavLink
                                to="/notifications"
                                className={({ isActive }) => `hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 relative ${isActive ? activeNavClasses : inactiveNavClasses}`}
                            >
                                <div className="relative">
                                    <Bell size={18} />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 min-w-4 flex items-center justify-center px-1">
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    )}
                                </div>
                                <span>Notifications</span>
                            </NavLink>
                        }

                        {/* Message Link with Label */}
                        {user &&
                            <NavLink
                                to="/messages"
                                className={({ isActive }) => `hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive ? activeNavClasses : inactiveNavClasses}`}
                            >
                                <MessageCircle size={18} />
                                <span>Messages</span>
                            </NavLink>
                        }

                        {/* Notifications Icon - Mobile (moved from menu) */}
                        {user && (
                            <NavLink
                                to="/notifications"
                                className={({ isActive }) => `lg:hidden relative ${iconButtonClasses} ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`}
                                aria-label="Notifications"
                            >
                                <Bell size={20} />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 min-w-4 flex items-center justify-center px-1">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </NavLink>
                        )}

                        {/* Mobile Search Toggle */}
                        {user && !isSearchingMobile && (
                            <button
                                onClick={toggleMobileSearch}
                                className={`${iconButtonClasses} md:hidden`}
                                aria-label="Open Search"
                            >
                                <Search size={20} />
                            </button>
                        )}

                        {/* Theme Toggle */}
                        <button
                            onClick={() => dispatch(changeTheme())}
                            className={iconButtonClasses}
                            aria-label="Toggle Dark Mode"
                        >
                            {dark ? <Sun size={20} className="text-yellow-400 fill-yellow-400" /> : <Moon size={20} />}
                        </button>

                        {/* User Profile Link / Sign In - Desktop only, moved to bottom nav on mobile */}
                        {user && (
                            <Link
                                to={`/profile/${user._id}`}
                                className="hidden lg:flex items-center p-0.5 rounded-full hover:ring-2 hover:ring-blue-500 transition-shadow ml-1"
                            >
                                <img
                                    src={user.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                                    alt="Profile"
                                    className="w-9 h-9 rounded-full object-cover border-2 border-transparent"
                                />
                            </Link>
                        )}



                    </div>
                </div>

                {/* 📱 Mobile Search View Overlay (Retains previous good logic) */}
                {user && isSearchingMobile && (
                    <div className="md:hidden absolute inset-0 bg-white dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 h-16 flex items-center px-4 sm:px-6 z-50">
                        <button
                            onClick={toggleMobileSearch}
                            className={`${iconButtonClasses} mr-2 shrink-0`}
                            aria-label="Close Search"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <form onSubmit={handleSearch} className="relative flex-1">
                            <input
                                ref={mobileSearchInputRef}
                                type="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full pl-4 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm shadow-inner"
                                placeholder="Search..."
                            />
                        </form>
                    </div>
                )}
            </div>

            {/* 🔥 Mobile Suggestions Dropdown (Retains previous good logic) */}
            {user && isSearchingMobile && (autoSuggestions.length > 0 || searchQuery.trim()) && (
                <div className="md:hidden w-full bg-white dark:bg-gray-900 absolute top-16 border-t border-gray-200 dark:border-gray-800 shadow-xl z-40">
                    <div className="p-2 max-h-[80vh] overflow-y-auto">
                        {autoSuggestions.length > 0 ? (
                            <>
                                <div className="py-1">
                                    {autoSuggestions.slice(0, 10).map(suggestion => (
                                        <div
                                            key={suggestion._id}
                                            onClick={() => handleSuggestionClick(`/profile/${suggestion._id}`)}
                                            className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer rounded-lg"
                                        >
                                            <img
                                                src={suggestion.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=user"}
                                                alt={suggestion.username}
                                                className="w-10 h-10 rounded-full object-cover mr-3 border border-gray-100 dark:border-gray-700"
                                            />
                                            <div>
                                                <div className="text-sm font-semibold text-gray-900 dark:text-white">{suggestion.username}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">Developer</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <hr className="border-gray-100 dark:border-gray-700 mx-3" />
                                <Link
                                    to={`/search?q=${searchQuery.trim()}`}
                                    onClick={() => handleSuggestionClick(`/search?q=${searchQuery.trim()}`)}
                                    className="block w-full text-center py-3 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700/30 transition-colors rounded-lg"
                                >
                                    View all results
                                </Link>
                            </>
                        ) : !loading && (
                            <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
                                No users found for "{searchQuery}".
                            </div>
                        )}
                    </div>
                </div>
            )}

        </header>
    );
};

export default Header;