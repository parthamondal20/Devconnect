import { useState, useEffect, useMemo } from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { Search, MoreVertical, CheckCheck, Plus } from "lucide-react";
import { getConversations } from "../services/message";
import { useSelector } from "react-redux";

// Helper function remains the same
const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m";
    return "Just now";
};

// Mock Data for Active Users Section
const MOCK_ACTIVE_USERS = [
    { id: "au1", username: "Alex", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" },
    { id: "au2", username: "Jessica", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica" },
    { id: "au3", username: "David", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David" },
    { id: "au4", username: "Mike", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike" },
    { id: "au5", username: "Sophie", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie" },
    { id: "au6", username: "Ryan", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ryan" },
];

const Messages = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [conversations, setConversations] = useState([]);
    // New state to hold the results when searching
    const [filteredConversations, setFilteredConversations] = useState([]);

    // user state from Redux
    const user = useSelector((state) => state.auth.user);

    // 1. Initial Data Fetch
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                // Replace with actual API call
                const data = await getConversations();
                setConversations(data);
                // Initialize filteredConversations with all conversations
                setFilteredConversations(data);
            } catch (error) {
                console.error("Error fetching conversations:", error);
            }
        };
        fetchConversations();
    }, [user._id]) // Dependency added to re-fetch if user changes (good practice)

    // 2. Search Logic (Filtering)
    useEffect(() => {
        const term = searchTerm.trim().toLowerCase();

        if (!term) {
            // If the search term is empty, display all conversations
            setFilteredConversations(conversations);
            return;
        }

        const searchResult = conversations.filter(convo => {
            // Determine the chat partner based on the current user
            // We use the same logic as in the render section to find the partner object
            const partner = convo.members.find(member => member._id !== user._id);

            // Safety check for partner existence
            if (!partner) return false;

            const partnerUsername = partner.username.toLowerCase();
            const termLength = term.length;

            // Perform prefix match (autocomplete) on the partner's username
            // .substring(0, termLength) extracts the prefix
            return partnerUsername.substring(0, termLength) === term;
        });

        // Update the filtered list with the search results
        setFilteredConversations(searchResult);
        console.log("Search Results:", searchResult);

    }, [searchTerm, conversations, user._id]); // dependencies must include conversations and user._id

    // Determine which list to render: the filtered list or the full list
    // This is managed within the useEffect now, so we just use filteredConversations
    const listToRender = filteredConversations;

    // Add a check to handle the `user` object being potentially undefined on initial load
    if (!user) {
        return <div className="text-center py-20">Loading user data...</div>;
    }


    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 py-6">
            <div className="max-w-2xl mx-auto px-4 sm:px-6">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">Messages</h1>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition">
                        <MoreVertical size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Search */}
                <div className="relative mb-8">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search messages..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-shadow shadow-sm"
                    />
                </div>

                {/* Active Users Section (Remaining unchanged) */}
                <div className="mb-8">
                    <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">
                        Active Now
                    </h2>
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                        {/* Add Story Button (Optional UX enhancement) */}
                        <div className="flex flex-col items-center gap-2 min-w-[64px] cursor-pointer group">
                            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 group-hover:border-blue-500 transition-colors">
                                <Plus size={24} className="text-gray-400 group-hover:text-blue-500" />
                            </div>
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Your Story</span>
                        </div>

                        {/* Active User List */}
                        {MOCK_ACTIVE_USERS.map((activeUser) => ( // Renamed to activeUser to avoid confusion
                            <div key={activeUser.id} className="flex flex-col items-center gap-2 min-w-[64px] cursor-pointer group">
                                <div className="relative">
                                    <img
                                        src={activeUser.avatar}
                                        alt={activeUser.username}
                                        className="w-16 h-16 rounded-full object-cover border-2 border-transparent group-hover:border-blue-500 transition-all p-0.5 bg-white dark:bg-gray-900"
                                    />
                                    <div className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-green-500 border-[3px] border-white dark:border-black rounded-full"></div>
                                </div>
                                <span className="text-xs font-medium text-gray-600 dark:text-gray-300 group-hover:text-blue-500 transition-colors">
                                    {activeUser.username}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Conversations List */}
                <div>
                    <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">
                        Chats
                    </h2>
                    <div className="space-y-2">
                        {/* Use listToRender (filtered or full) */}
                        {listToRender.length > 0 ? (
                            listToRender.map((convo) => {
                                // Determine chat partner using .find() for clarity and safety
                                const partner = convo.members.find(member => member._id !== user._id);

                                // Skip rendering if a partner cannot be determined
                                if (!partner) return null;

                                return (
                                    <Link
                                        key={convo._id}
                                        to={`/chat/${convo._id}`}
                                        // The state prop is for sending data to the chat route
                                        state={{ currentUser: partner }}
                                        className="group flex items-center gap-4 p-4 bg-white dark:bg-gray-900 hover:bg-blue-50 dark:hover:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm transition-all cursor-pointer"
                                    >
                                        {/* Avatar */}
                                        <div className="relative shrink-0">
                                            <img
                                                src={partner.avatar}
                                                alt={partner.username}
                                                className="w-14 h-14 rounded-full object-cover bg-gray-200 dark:bg-gray-800"
                                            />
                                            {partner.isOnline && (
                                                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></span>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h3 className="font-semibold text-gray-900 dark:text-white truncate pr-2">
                                                    {partner.username}
                                                </h3>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">
                                                    {timeAgo(convo.updatedAt)}
                                                </span>
                                            </div>

                                            <p
                                                className={`text-sm truncate pr-4 ${convo.lastMessage && convo.lastMessage.status === "sent" // Added null check for lastMessage
                                                    ? "text-gray-900 dark:text-gray-100 font-medium"
                                                    : "text-gray-500 dark:text-gray-400"
                                                    }`}
                                            >
                                                {convo.lastMessage && convo.lastMessage.status !== "sent" && (
                                                    <CheckCheck size={14} className="inline mr-1 text-blue-500" />
                                                )}
                                                {convo.lastMessage ? convo.lastMessage.text : "Start a conversation"}
                                            </p>
                                        </div>

                                        {/* Unread Badge (Assuming lastMessage.status is unread count) */}
                                        {convo.lastMessage && convo.lastMessage.status > 0 && (
                                            <div className="shrink-0">
                                                <span className="flex items-center justify-center w-5 h-5 bg-blue-600 text-white text-xs font-bold rounded-full">
                                                    {convo.lastMessage.status}
                                                </span>
                                            </div>
                                        )}
                                    </Link>
                                );
                            })
                        ) : (
                            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                {searchTerm ? "No results found for your search." : "No conversations found."}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Messages;