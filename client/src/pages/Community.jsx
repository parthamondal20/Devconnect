import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Plus, Users, TrendingUp, Sparkles } from "lucide-react";
import { createCommunity } from "../services/community";
const MOCK_COMMUNITIES = [
    { id: "1", name: "React Developers", description: "A place to discuss React and patterns.", members: 1245, trending: true },
    { id: "2", name: "Node.js Enthusiasts", description: "Backend engineering, Node, and APIs.", members: 812 },
    { id: "3", name: "Design Systems", description: "Design tokens, components and accessibility.", members: 423 },
    { id: "4", name: "Open Source", description: "Contribute, maintain and learn from OSS projects.", members: 2300, trending: true },
];

export default function Community() {
    const [query, setQuery] = useState("");
    const [communities, setCommunities] = useState(MOCK_COMMUNITIES);
    const [joined, setJoined] = useState(["1", "4"]); // mock joined ids
    const [showCreate, setShowCreate] = useState(false);
    const [newName, setNewName] = useState("");
    const [newDesc, setNewDesc] = useState("");
    const navigate = useNavigate();
    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return communities;
        return communities.filter((c) => c.name.toLowerCase().includes(q));
    }, [query, communities]);

    function toggleJoin(id) {
        setJoined((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    }

    async function createCommunityGroup(e) {
        e.preventDefault();
        if (!newName.trim()) return;
        try {
            const res = await createCommunity(newName.trim(), newDesc.trim());
            // mock adding
            navigate(`/community/${res._id}`);
        } catch (error) {
            console.error("Error creating community:", error);
        }
    }

    return (
        <div className="min-h-screen md:ml-60 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 dark:from-[#0d1117] dark:via-[#0d1117] dark:to-[#161b22] text-gray-900 dark:text-gray-100">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-12">
                {/* Header Section */}
                <div className="mb-6 sm:mb-8 md:mb-12">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                                Communities
                            </h1>
                            <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1.5 sm:mt-2">
                                Connect with like-minded individuals and explore shared interests
                            </p>
                        </div>

                        <button
                            onClick={() => setShowCreate(true)}
                            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/30 active:scale-95 sm:hover:scale-105"
                        >
                            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span>Create Community</span>
                        </button>
                    </div>
                </div>

                {/* search + your communities */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                        {/* Search Bar */}
                        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                            <div className="relative">
                                <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                <input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search communities..."
                                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        {/* Communities List */}
                        <div className="space-y-3 sm:space-y-4">
                            {filtered.length === 0 ? (
                                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-8 sm:p-12 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-800 text-center">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">No communities found matching your search.</p>
                                </div>
                            ) : (
                                filtered.map((c) => (
                                    <div
                                        key={c.id}
                                        className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200 group"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1.5 sm:mb-2 flex-wrap">
                                                    <Link
                                                        to={`/community/${c.id}`}
                                                        className="text-base sm:text-lg font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                                    >
                                                        {c.name}
                                                    </Link>
                                                    {c.trending && (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-medium rounded-full">
                                                            <TrendingUp className="w-3 h-3" />
                                                            <span className="hidden xs:inline">Trending</span>
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 sm:mb-3 line-clamp-2">
                                                    {c.description}
                                                </p>
                                                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                                    <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                    <span className="font-medium">{c.members.toLocaleString()}</span>
                                                    <span>members</span>
                                                </div>
                                            </div>

                                            <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-2 shrink-0">
                                                <button
                                                    onClick={() => toggleJoin(c.id)}
                                                    className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${joined.includes(c.id)
                                                        ? "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                                        : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg"
                                                        }`}
                                                >
                                                    {joined.includes(c.id) ? "Joined" : "Join"}
                                                </button>
                                                <Link
                                                    to={`/community/${c.id}`}
                                                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium whitespace-nowrap"
                                                >
                                                    View details →
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <aside className="hidden lg:block space-y-6">
                        {/* Your Communities */}
                        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm sticky top-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                <h3 className="text-base font-semibold">Your Communities</h3>
                            </div>
                            <div className="space-y-3">
                                {communities.filter((c) => joined.includes(c.id)).length === 0 ? (
                                    <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">
                                        <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                        <p>No communities yet</p>
                                        <p className="text-xs mt-1">Join one to get started!</p>
                                    </div>
                                ) : (
                                    communities
                                        .filter((c) => joined.includes(c.id))
                                        .map((c) => (
                                            <div
                                                key={c.id}
                                                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors group"
                                            >
                                                <Link
                                                    to={`/community/${c.id}`}
                                                    className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex-1 truncate"
                                                >
                                                    {c.name}
                                                </Link>
                                                <button
                                                    onClick={() => toggleJoin(c.id)}
                                                    className="text-xs text-red-500 hover:text-red-600 dark:hover:text-red-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                                                >
                                                    Leave
                                                </button>
                                            </div>
                                        ))
                                )}
                            </div>
                        </div>
                    </aside>

                    {/* Mobile Your Communities - Fixed Bottom Sheet */}
                    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 shadow-lg">
                        <div className="px-3 py-2 overflow-x-auto">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                                <h3 className="text-sm font-semibold">Your Communities</h3>
                            </div>
                            <div className="flex gap-2 pb-safe">
                                {communities.filter((c) => joined.includes(c.id)).length === 0 ? (
                                    <div className="text-xs text-gray-500 dark:text-gray-400 py-2">
                                        No communities joined yet
                                    </div>
                                ) : (
                                    communities
                                        .filter((c) => joined.includes(c.id))
                                        .map((c) => (
                                            <Link
                                                key={c.id}
                                                to={`/community/${c.id}`}
                                                className="shrink-0 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-medium whitespace-nowrap"
                                            >
                                                {c.name}
                                            </Link>
                                        ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Create modal */}
                {showCreate && (
                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
                        <div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setShowCreate(false)}
                        />
                        <form
                            onSubmit={createCommunityGroup}
                            className="relative bg-white dark:bg-gray-900 p-5 sm:p-6 md:p-8 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg border-t sm:border border-gray-200 dark:border-gray-800 shadow-2xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="mb-5 sm:mb-6">
                                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                                    Create a Community
                                </h2>
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    Build a space for your community to connect
                                </p>
                            </div>

                            <div className="space-y-4 mb-5 sm:mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Community Name
                                    </label>
                                    <input
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        placeholder="e.g., Web3 Developers"
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        autoFocus
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={newDesc}
                                        onChange={(e) => setNewDesc(e.target.value)}
                                        placeholder="What's your community about?"
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                        rows={4}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowCreate(false)}
                                    className="flex-1 sm:flex-none px-4 sm:px-5 py-2.5 rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium transition-colors text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!newName.trim()}
                                    className="flex-1 sm:flex-none px-4 sm:px-5 py-2.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg shadow-blue-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                >
                                    Create Community
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}