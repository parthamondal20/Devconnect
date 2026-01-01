import { useState, useEffect } from "react";
import { getAllQuestions, createQuestion, deleteQuestion } from "../services/question";
import { PlusCircle, MessageSquare, ChevronDown, ChevronUp, Award, Calendar, Trash2, ThumbsUp, ThumbsDown } from "lucide-react";
import { showSuccess, showError } from "../utils/toast";
import DevChatbot from "../components/DevChatbot";
import ConfirmModal from "../components/ConfirmModal";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import PageLoader from "../components/PageLoader";

export default function QuestionsPage() {
    const [questions, setQuestions] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState("");
    const [showQuestionForm, setShowQuestionForm] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [questionToDelete, setQuestionToDelete] = useState(null);
    const [loading, setLoading] = useState(false);
    // Get logged-in user from Redux
    const { user } = useSelector((state) => state.auth);

    // Fetch all questions on page load
    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true);
            try {
                const data = await getAllQuestions();
                setQuestions(data);
            } catch (err) {
                console.error(err);
                showError("Failed to load questions");
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, []);

    // Handle posting new question
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !description.trim()) return showError("Please fill all fields");

        const loadingToast = toast.loading("Posting your question...");
        try {
            const payload = {
                title,
                description,
                tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
            };
            const res = await createQuestion(payload);
            console.log(res);
            toast.dismiss(loadingToast);
            toast.success("Question posted successfully!");
            setQuestions((prev) => [res, ...prev]); // update feed instantly
            setTitle("");
            setDescription("");
            setTags("");
            setShowQuestionForm(false); // Close form after submission
        } catch (err) {
            console.error(err);
            toast.dismiss(loadingToast);
            showError("Failed to post question");
        }
    };

    // Handle delete question
    const handleDeleteQuestion = (questionId) => {
        setQuestionToDelete(questionId);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        const loadingToast = toast.loading("Deleting question...");
        try {
            // TODO: Call delete API when backend is ready
            // await deleteQuestion(questionId);
            await deleteQuestion(questionToDelete);
            // Optimistic UI update
            setQuestions((prev) => prev.filter((q) => q._id !== questionToDelete));
            toast.dismiss(loadingToast);
            toast.success("Question deleted successfully!");
            setShowDeleteModal(false); // Close modal after successful deletion
            setQuestionToDelete(null); // Clear question to delete
        } catch (err) {
            console.error(err);
            toast.dismiss(loadingToast);
            toast.error("Failed to delete question");
        }
    };

    // Handle upvote/downvote
    const handleVote = async (questionId, voteType) => {
        try {
            // TODO: Call vote API when backend is ready
            // await voteQuestion(questionId, voteType);

            // Optimistic UI update
            setQuestions((prev) =>
                prev.map((q) => {
                    if (q._id === questionId) {
                        if (voteType === "upvote") {
                            return { ...q, Likes: (q.Likes || 0) + 1 };
                        } else {
                            return { ...q, Dislikes: (q.Dislikes || 0) + 1 };
                        }
                    }
                    return q;
                })
            );
            toast.success(`${voteType === "upvote" ? "Upvoted" : "Downvoted"} successfully!`);
        } catch (err) {
            console.error(err);
            showError("Failed to vote");
        }
    };

    if (loading) {
        return <PageLoader loading={loading} />;
    }
    return (
        <>
            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                title="Delete Question?"
                message="Are you sure you want to delete this question? This action cannot be undone."
            />
            <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white py-6 sm:py-10 px-4">
                <DevChatbot />
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <header className="mb-8 sm:mb-12">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-blue-600/20 rounded-xl">
                                <MessageSquare className="w-7 h-7 sm:w-8 sm:h-8 text-blue-400" />
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Developer Q&A
                            </h1>
                        </div>
                        <p className="text-gray-400 text-sm sm:text-base ml-0 sm:ml-14">
                            Ask questions, share knowledge, and get help from the community
                        </p>
                    </header>

                    {/* Ask Question Toggle Button */}
                    <button
                        onClick={() => setShowQuestionForm(!showQuestionForm)}
                        className="w-full mb-6 sm:mb-8 group"
                    >
                        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 hover:from-blue-600/20 hover:to-purple-600/20 border-2 border-blue-500/30 hover:border-blue-500/50 rounded-2xl p-4 sm:p-5 transition-all duration-300 shadow-lg hover:shadow-blue-500/20">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-600/20 rounded-lg group-hover:scale-110 transition-transform">
                                        <PlusCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                                    </div>
                                    <span className="text-base sm:text-lg font-semibold text-white">
                                        Ask a Question
                                    </span>
                                </div>
                                {showQuestionForm ? (
                                    <ChevronUp className="w-5 h-5 text-blue-400 transition-transform" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-blue-400 transition-transform" />
                                )}
                            </div>
                        </div>
                    </button>

                    {/* Collapsible Question Form */}
                    {showQuestionForm && (
                        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-5 sm:p-6 shadow-2xl mb-8 animate-in slide-in-from-top duration-300">
                            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Question Title
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="What's your question? Be specific..."
                                        className="w-full p-3 sm:p-4 rounded-xl bg-gray-800/50 text-gray-100 placeholder-gray-500 border border-gray-700/50 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent outline-none transition-all"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        rows="5"
                                        placeholder="Describe your problem in detail. Include what you've tried and error messages..."
                                        className="w-full p-3 sm:p-4 rounded-xl bg-gray-800/50 text-gray-100 placeholder-gray-500 border border-gray-700/50 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent outline-none transition-all resize-none"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Tags
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. react, node, mongodb (comma separated)"
                                        className="w-full p-3 sm:p-4 rounded-xl bg-gray-800/50 text-gray-100 placeholder-gray-500 border border-gray-700/50 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent outline-none transition-all"
                                        value={tags}
                                        onChange={(e) => setTags(e.target.value)}
                                    />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="submit"
                                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25"
                                    >
                                        <PlusCircle className="w-5 h-5" />
                                        Post Question
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowQuestionForm(false)}
                                        className="px-6 py-3 rounded-xl border border-gray-700 hover:bg-gray-800/50 text-gray-300 font-semibold transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Questions Feed */}
                    <div className="space-y-4 sm:space-y-5">
                        {questions.length === 0 ? (
                            <div className="text-center py-16 sm:py-20">
                                <div className="inline-flex p-4 bg-gray-800/50 rounded-full mb-4">
                                    <MessageSquare className="w-12 h-12 text-gray-600" />
                                </div>
                                <p className="text-gray-500 text-base sm:text-lg">
                                    No questions yet. Be the first to ask!
                                </p>
                            </div>
                        ) : (
                            questions.map((q) => {
                                const isOwner = user && q.user && (user._id === q.user._id || user._id === q.user);

                                return (
                                    <div
                                        key={q._id}
                                        className="group bg-gray-900/40 backdrop-blur-sm border border-gray-800/50 hover:border-blue-500/30 transition-all duration-300 rounded-2xl overflow-hidden shadow-lg hover:shadow-blue-500/10"
                                    >
                                        <div className="p-5 sm:p-6">
                                            {/* Question Header */}
                                            <div className="flex items-start gap-4 mb-4">
                                                <img
                                                    src={q.user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=default"}
                                                    alt={q.user?.username}
                                                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-gray-700/50"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors break-words">
                                                        {q.title}
                                                    </h3>
                                                    <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-400">
                                                        <span className="font-medium text-blue-400">
                                                            {q.user?.username || "Anonymous"}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {new Date(q.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Delete Button (Owner Only) */}
                                                {isOwner && (
                                                    <button
                                                        onClick={() => handleDeleteQuestion(q._id)}
                                                        className="p-2 rounded-lg bg-red-600/10 text-red-400 hover:bg-red-600/20 hover:text-red-300 transition-all border border-red-500/30 hover:border-red-500/50"
                                                        title="Delete question"
                                                    >
                                                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    </button>
                                                )}
                                            </div>

                                            {/* Question Description */}
                                            <p className="text-gray-300 mb-4 line-clamp-3 text-sm sm:text-base leading-relaxed">
                                                {q.description}
                                            </p>

                                            {/* Tags */}
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {q.tags.map((tag, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-3 py-1 text-xs sm:text-sm bg-blue-600/20 text-blue-300 rounded-full border border-blue-500/30 hover:bg-blue-600/30 transition-colors"
                                                    >
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Question Stats & Actions */}
                                            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-800/50">
                                                <div className="flex items-center gap-4 sm:gap-6">
                                                    {/* Voting Section */}
                                                    <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg px-2 py-1">
                                                        <button
                                                            onClick={() => handleVote(q._id, "upvote")}
                                                            className="p-1.5 rounded hover:bg-green-600/20 text-gray-400 hover:text-green-400 transition-all"
                                                            title="Upvote"
                                                        >
                                                            <ThumbsUp className="w-4 h-4" />
                                                        </button>
                                                        <span className="text-sm font-bold text-white min-w-[2rem] text-center">
                                                            {(q.Likes || 0) - (q.Dislikes || 0)}
                                                        </span>
                                                        <button
                                                            onClick={() => handleVote(q._id, "downvote")}
                                                            className="p-1.5 rounded hover:bg-red-600/20 text-gray-400 hover:text-red-400 transition-all"
                                                            title="Downvote"
                                                        >
                                                            <ThumbsDown className="w-4 h-4" />
                                                        </button>
                                                    </div>

                                                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                                                        <MessageSquare className="w-4 h-4" />
                                                        <span className="font-medium">
                                                            {q.answers?.length || 0} {q.answers?.length === 1 ? 'answer' : 'answers'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
