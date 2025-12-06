import { useEffect, useRef, useState } from "react";
import {
  Send,
  ArrowLeft,
  Phone,
  Video,
  MoreVertical,
  Image as ImageIcon,
  Paperclip,
  Smile,
  Check,
  CheckCheck
} from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import EmojiPickerComponent from "../components/EmojiPickerComponent";

export default function ChatRoom({ messages, onSendMessage, user: chatPartner }) {
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiRef = useRef(null);
  const chatEndRef = useRef(null);
  const navigate = useNavigate();
  console.log(chatPartner);
  // Logged in user from Redux
  const { user } = useSelector((state) => state.auth);

  // Scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Close emoji picker on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    <div className="flex flex-col h-screen bg-[#F0F2F5] dark:bg-[#0b141a] transition-colors duration-200">

      {/* --- Header --- */}
      <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-[#202c33] border-b border-gray-200 dark:border-gray-700 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="relative">
            <img
              src={chatPartner.avatar}
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-600"
            />
            {/* Online Indicator */}
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-[#202c33] rounded-full">
              <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></span>
            </span>
          </div>

          <div className="leading-tight">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100 text-base">
              {chatPartner.username}
            </h2>
            <p className="text-xs text-green-600 dark:text-green-400 font-medium">
              Online
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 text-blue-600 dark:text-blue-400">
          <button className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-gray-700 transition hidden sm:block">
            <Video className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-gray-700 transition hidden sm:block">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* --- Chat Area --- */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
        {/* Optional: Background Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

        {/* Date Separator Example */}
        <div className="flex justify-center my-4">
          <span className="px-3 py-1 bg-gray-200 dark:bg-[#202c33] rounded-lg text-xs text-gray-600 dark:text-gray-400 font-medium shadow-sm z-0">
            Today
          </span>
        </div>

        {messages.map((msg, index) => {
          const isSender = msg.sender.toString() === user._id.toString();
          // Check if the next message is from the same person to group styling
          const isNextSame = messages[index + 1]?.sender.toString() === msg.sender.toString();

          return (
            <div
              key={msg._id}
              className={`flex w-full ${isSender ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex max-w-[85%] md:max-w-[70%] gap-2 ${isSender ? "flex-row-reverse" : "flex-row"}`}>

                {/* Avatar for Receiver (Only show if next msg is NOT from same person) */}
                {!isSender && (
                  <div className="flex-shrink-0 w-8 flex items-end">
                    {!isNextSame ? (
                      <img src={chatPartner.avatar} alt="user" className="w-8 h-8 rounded-full object-cover" />
                    ) : <div className="w-8" />}
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`relative px-4 py-2 shadow-sm text-[15px] leading-relaxed break-words transition-all
                    ${isSender
                      ? "bg-blue-600 text-white rounded-2xl rounded-tr-sm"
                      : "bg-white dark:bg-[#202c33] text-gray-900 dark:text-gray-100 rounded-2xl rounded-tl-sm"
                    }
                    ${isNextSame ? "mb-1" : "mb-3"}
                  `}
                >
                  {msg.image && (
                    <div className="mb-2 rounded-lg overflow-hidden">
                      <img src={msg.image} alt="attachment" className="max-w-full max-h-60 object-cover" />
                    </div>
                  )}

                  <span>{msg.text}</span>

                  {/* Timestamp & Status */}
                  <div className={`flex items-center justify-end gap-1 text-[10px] mt-1 select-none
                    ${isSender ? "text-blue-100" : "text-gray-400"}
                  `}>
                    <span>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {isSender && (
                      <CheckCheck className="w-3 h-3 text-blue-200" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* --- Input Area --- */}
      <div className="bg-white dark:bg-[#202c33] px-3 py-3 border-t border-gray-200 dark:border-gray-700 flex items-end gap-2 z-20">

        {/* Attachments (Hidden on tiny screens) */}
        <div className="flex items-center gap-1 pb-2 text-gray-500 dark:text-gray-400">
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <ImageIcon className="w-6 h-6" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition hidden sm:block">
            <Paperclip className="w-5 h-5" />
          </button>
        </div>

        {/* Input Field */}
        <div className="flex-1 bg-gray-100 dark:bg-[#2a3942] rounded-2xl flex items-center px-4 py-2 border border-transparent focus-within:border-blue-500/50 transition-all">
          <textarea
            rows={1}
            className="flex-1 bg-transparent text-gray-900 dark:text-gray-100 resize-none focus:outline-none max-h-32 py-1"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ minHeight: '24px' }} // prevent collapse
          />
          <div className="relative" ref={emojiRef}>
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={`transition ml-2 ${showEmojiPicker ? "text-blue-500" : "text-gray-500 dark:text-gray-400 hover:text-blue-500"}`}
            >
              <Smile className="w-6 h-6" />
            </button>
            {showEmojiPicker && (
              <div className="absolute bottom-12 right-0 z-50 shadow-2xl rounded-2xl">
                <EmojiPickerComponent onEmojiClick={(emojiData) => setText((prev) => prev + emojiData.emoji)} />
              </div>
            )}
          </div>
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!text.trim()}
          className={`p-3 rounded-full flex items-center justify-center transition-all duration-200 shadow-md
            ${text.trim()
              ? "bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105"
              : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
        >
          <Send className="w-5 h-5 ml-0.5" /> {/* ml-0.5 to visually center the icon */}
        </button>
      </div>
    </div>
  );
}