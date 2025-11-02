import { useState, useRef, useEffect } from "react";
import { Send, Bot, X, Loader2, Minimize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { askAI } from "../services/chatbot";

export default function DevChatbot() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { role: "user", text: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");

        try {
            setLoading(true);
            const reply = await askAI(input);
            const botMsg = { role: "bot", text: reply };
            setMessages((prev) => [...prev, botMsg]);
        } catch (error) {
            console.error(error);
            setMessages((prev) => [
                ...prev,
                { role: "bot", text: "⚠️ Sorry, something went wrong. Try again later." },
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <>
            {/* Floating Button */}
            {!open && (
                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    onClick={() => setOpen(true)}
                    className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-full shadow-lg hover:shadow-blue-500/40 transition-all"
                >
                    <Bot size={26} />
                </motion.button>
            )}

            {/* Chatbot Modal */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            transition={{ type: "spring", duration: 0.6 }}
                            className="w-full max-w-2xl h-[70vh] bg-[#111827]/80 backdrop-blur-2xl border border-gray-700/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                        >
                            {/* Header */}
                            <div className="flex justify-between items-center px-5 py-3 border-b border-gray-700/40 bg-[#1f2937]/70">
                                <h3 className="text-gray-100 font-semibold flex items-center gap-2 text-lg">
                                    <Bot size={22} /> Dev Assistant
                                </h3>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setOpen(false)}
                                        className="text-gray-400 hover:text-gray-200 transition"
                                    >
                                        <Minimize2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => setOpen(false)}
                                        className="text-gray-400 hover:text-red-500 transition"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Chat Section */}
                            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                                {messages.length === 0 ? (
                                    <p className="text-gray-400 text-center mt-20 text-sm">
                                        💬 Ask your coding question here. I can help debug, explain, or guide you.
                                    </p>
                                ) : (
                                    messages.map((msg, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
                                                }`}
                                        >
                                            <div
                                                className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === "user"
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-gray-800 text-gray-100 border border-gray-700"
                                                    }`}
                                            >
                                                {msg.text}
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                                {loading && (
                                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                                        <Loader2 className="animate-spin w-4 h-4" />
                                        Thinking...
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Section */}
                            <form
                                onSubmit={handleSend}
                                className="flex items-center gap-3 p-4 border-t border-gray-700/40 bg-[#1f2937]/70"
                            >
                                <input
                                    type="text"
                                    placeholder="Ask your question..."
                                    className="flex-1 bg-gray-900/80 text-gray-100 text-sm rounded-xl px-4 py-3 border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90 text-white p-3 rounded-xl transition disabled:opacity-50"
                                >
                                    <Send size={18} />
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
