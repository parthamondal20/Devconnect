import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { useSelector } from "react-redux";
export default function ChatRoom({ messages, onSendMessage, user: currentUser }) {
  const [text, setText] = useState("");
  const chatEndRef = useRef(null);
  // console.log("other user in ChatRoom:", currentUser);
  const user = useSelector((state) => state.auth.user);
  // Scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!text.trim()) return;
    onSendMessage(text);
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-md">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">{currentUser.username}</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Online</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => {
          const isSender = msg.sender.toString() === user._id.toString();
          return (
            <div
              key={msg._id}
              className={`flex ${isSender ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-xl break-words 
                  ${isSender ? "bg-blue-600 text-white rounded-br-none" : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-bl-none"}`}
              >
                {msg.text}
                {msg.image && <img src={msg.image} className="mt-2 max-h-60 rounded-md" />}
                <div className="text-xs mt-1 text-gray-300 dark:text-gray-400 text-right">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef}></div>
      </div>

      {/* Input */}
      <div className="p-4 bg-white dark:bg-gray-800 flex gap-2 items-center border-t border-gray-200 dark:border-gray-700">
        <textarea
          rows={1}
          className="flex-1 p-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleSend}
          className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
