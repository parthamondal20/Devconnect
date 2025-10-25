import { useState, useEffect } from "react";
import { getAllQuestions, createQuestion } from "../services/question";
import { PlusCircle, MessageSquare } from "lucide-react";
import { showSuccess, showError } from "../utils/toast";
import Loader from "../components/Loader";
import DevChatbot from "../components/DevChatbot";
export default function QuestionsPage() {
    const [questions, setQuestions] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("Posting question....")
    // Fetch all questions on page load
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const data = await getAllQuestions();
                setQuestions(data.reverse());
            } catch (err) {
                console.error(err);
                showError("Failed to load questions");
            }
        };
        fetchQuestions();
    }, []);

    // Handle posting new question
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !description.trim()) return showError("Please fill all fields");

        try {
            setLoading(true);
            const payload = {
                title,
                description,
                tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
            };
            const res = await createQuestion(payload);
            showSuccess("Question posted successfully!");
            setQuestions((prev) => [res, ...prev]); // update feed instantly
            setTitle("");
            setDescription("");
            setTags("");
        } catch (err) {
            console.error(err);
            showError("Failed to post question");
        } finally {
            setLoading(false);
        }
    };
    if (loading) {
        return <Loader loading={loading} message={message} />
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white py-10 px-4">
            <DevChatbot/>
            <div className="max-w-3xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold mb-2 text-white">Developer Q&A 💬</h1>
                    <p className="text-gray-400 text-sm">
                        Ask questions, share your challenges, and get help from other devs.
                    </p>
                </header>

                {/* Ask Question Section */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-lg mb-8 transition hover:border-blue-600">
                    <h2 className="text-xl font-semibold text-white mb-4">Ask a Question</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Enter your question title..."
                            className="w-full p-3 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-400 border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <textarea
                            rows="4"
                            placeholder="Describe your issue in detail (Markdown supported)..."
                            className="w-full p-3 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-400 border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Tags (comma separated, e.g. react, node, mongodb)"
                            className="w-full p-3 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-400 border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg transition disabled:opacity-50"
                        >
                            <PlusCircle className="w-5 h-5" /> Post Question
                        </button>
                    </form>
                </div>

                {/* Feed Section */}
                <div className="space-y-5">
                    {questions.length === 0 ? (
                        <p className="text-gray-500 text-center">No questions yet. Be the first to ask!</p>
                    ) : (
                        questions.map((q) => (
                            <div
                                key={q._id}
                                className="bg-gray-900 border border-gray-800 hover:border-blue-600 transition rounded-xl p-5 shadow-md"
                            >
                                <h3 className="text-lg font-semibold text-white mb-2">{q.title}</h3>
                                <p className="text-gray-400 mb-3 line-clamp-3">{q.description}</p>

                                <div className="flex flex-wrap gap-2 mb-3">
                                    {q.tags.map((tag, i) => (
                                        <span
                                            key={i}
                                            className="px-2 py-1 text-xs bg-blue-900/40 text-blue-300 rounded-md"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="text-gray-500 text-sm flex justify-between items-center">
                                    <div className="flex items-center gap-1">
                                        <MessageSquare size={14} /> {q.answers?.length || 0} answers
                                    </div>
                                    <span>by {q.user?.username || "Anonymous"}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
