import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

const MOCK_MESSAGES = [
    { id: 1, author: "Alice", text: "Welcome to the community!", time: "10:02 AM" },
    { id: 2, author: "Bob", text: "Hey everyone — excited to be here.", time: "10:05 AM" },
    { id: 3, author: "You", text: "Happy to join. Looking forward to discussions.", time: "10:08 AM" },
];

export default function CommunityChatPage() {
    const { community_id } = useParams();
    const [messages, setMessages] = useState(MOCK_MESSAGES);
    const [text, setText] = useState("");
    const scrollRef = useRef(null);

    useEffect(() => {
        // scroll to bottom when messages update
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    function handleSend(e) {
        e.preventDefault();
        if (!text.trim()) return;
        const next = { id: Date.now(), author: "You", text: text.trim(), time: new Date().toLocaleTimeString() };
        setMessages((s) => [...s, next]);
        setText("");
    }

    return (
        <div className="min-h-screen md:ml-60 bg-gray-50 dark:bg-[#0d1117] text-gray-900 dark:text-gray-100">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <header className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-extrabold">Community Chat</h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{`Community ID: ${community_id || 'general'}`}</p>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-gray-600 dark:text-gray-400">Members: <span className="font-medium">1.2k</span></div>
                        <Link to="/community" className="text-xs text-blue-500">Back to communities</Link>
                    </div>
                </header>

                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                    <div ref={scrollRef} className="h-[60vh] md:h-[60vh] overflow-y-auto p-4 space-y-4">
                        {messages.map((m) => (
                            <div key={m.id} className={`flex ${m.author === 'You' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`${m.author === 'You' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'} max-w-[80%] px-4 py-2 rounded-2xl`}>
                                    <div className="text-xs font-semibold">{m.author}</div>
                                    <div className="mt-1 text-sm">{m.text}</div>
                                    <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 text-right">{m.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSend} className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
                        <div className="flex gap-2">
                            <input
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Write a message..."
                                className="flex-1 px-3 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none text-sm"
                            />
                            <button type="submit" className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm">Send</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

