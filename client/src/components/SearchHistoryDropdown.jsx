import { X, Clock, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { getSearchHistory, deleteSearchHistoryItem, clearSearchHistory, addToSearchHistory } from "../services/user";
import { useNavigate } from "react-router-dom";

const SearchHistoryDropdown = ({ open, onSelectUser, isMobile = false }) => {
    const [searchHistory, setSearchHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch search history on mount
    useEffect(() => {
        if (!open) return;
        fetchSearchHistory();
    }, [open]);

    const fetchSearchHistory = async () => {
        try {
            setLoading(true);
            const history = await getSearchHistory();
            console.log(history);
            setSearchHistory(history || []);
        } catch (error) {
            console.error("Failed to fetch search history:", error);
            setSearchHistory([]);
        } finally {
            setLoading(false);
        }
    };

    const handleClearAll = async () => {
        try {
            await clearSearchHistory();
            setSearchHistory([]);
        } catch (error) {
            console.error("Failed to clear search history:", error);
        }
    };

    const handleDeleteItem = async (e, historyId) => {
        e.stopPropagation(); // Prevent triggering the user click
        try {
            await deleteSearchHistoryItem(historyId);
            setSearchHistory(prev => prev.filter(item => item._id !== historyId));
        } catch (error) {
            console.error("Failed to delete search history item:", error);
        }
    };

    const handleUserClick = async (user) => {
        // Add to search history when clicked
        try {
            await addToSearchHistory(user);
        } catch (error) {
            console.error("Failed to add to search history:", error);
        }

        // Navigate to user profile
        navigate(`/profile/${user.userId._id}`);

        // Call parent callback to close dropdown
        if (onSelectUser) {
            onSelectUser();
        }
    };

    // If no history, show nothing
    if (loading || searchHistory.length === 0) {
        return null;
    }

    return (
        <div className={`absolute ${isMobile ? 'top-full mt-2 left-0 right-0' : 'top-full mt-2 w-full'} bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden z-20`}>

            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Recent
                </h3>
                <button
                    onClick={handleClearAll}
                    className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                    Clear All
                </button>
            </div>

            <div className="py-1 max-h-80 overflow-y-auto">
                {searchHistory.map((item) => (
                    <div
                        key={item._id}
                        onClick={() => handleUserClick(item)}
                        className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group"
                    >
                        <div className="flex items-center flex-1 min-w-0">

                            <img
                                src={item.userId?.avatar || item.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=user"}
                                alt={item.userId?.username || item.username}
                                className="w-10 h-10 rounded-full object-cover mr-3 border border-gray-100 dark:border-gray-700 flex-shrink-0"
                            />

                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                    {item.userId?.username || item.username}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={(e) => handleDeleteItem(e, item._id)}
                            className="ml-2 p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all opacity-0 group-hover:opacity-100 flex-shrink-0"
                            aria-label="Remove from history"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchHistoryDropdown;
