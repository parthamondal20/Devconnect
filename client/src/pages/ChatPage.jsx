import { useEffect, useState, useRef } from "react";
import ChatRoom from "./ChatRoom";
import socket, { connectSocket } from "../api/socket.js";
import { useParams } from "react-router-dom";
import { getConversationById, sendMessage } from "../services/message.js";
import { useSelector } from "react-redux";
export default function ChatPage() {
    const [messages, setMessages] = useState([]);
    const { conversation_id } = useParams();
    const listenerAttachedRef = useRef(false);
    const messageIdsRef = useRef(new Set());
    const chatPartner = useSelector((state) => state.chat.chatPartner);
    const currentUser = useSelector((state) => state.auth.user);

    // Clean up old listeners on hot-reload (dev mode)
    useEffect(() => {
        // Connect socket with CURRENT USER's ID, not chat partner's ID
        if (currentUser?._id) {
            if (!socket.connected) {
                connectSocket(currentUser._id);
            }
        }
        return () => {
            // Reset the flag on unmount so new listeners can attach
            listenerAttachedRef.current = false;
        };
    }, [currentUser?._id]);

    // Load initial messages
    useEffect(() => {
        const loadMessages = async () => {
            try {
                const res = await getConversationById(conversation_id);
                setMessages(res);
                // Populate the Set with existing message IDs
                messageIdsRef.current = new Set(res.map((msg) => msg._id.toString()));
            } catch (err) {
                console.error("Error loading messages:", err);
            }
        };
        loadMessages();
    }, [conversation_id]);

    // Connect socket ONCE and attach listener
    useEffect(() => {
        if (!socket.connected) {
            connectSocket(currentUser._id);
        }

        // Attach newMessage listener ONCE - never remove it
        if (!listenerAttachedRef.current) {
            socket.on("newMessage", (msg) => {
                // O(1) deduplication using Set
                console.log("new message received", msg);
                const msgId = msg._id.toString();
                if (messageIdsRef.current.has(msgId)) {
                    console.log("message already exists");
                    return; // Message already exists, skip
                }
                messageIdsRef.current.add(msgId);
                setMessages((prev) => [...prev, msg]);
            });
            listenerAttachedRef.current = true;
        }

        return () => {
            // Keep socket alive for other components
        };
    }, []);

    // Join/leave conversation room when conversation_id changes
    useEffect(() => {
        if (socket.connected) {
            socket.emit("joinConversation", conversation_id);
        } else {
            socket.once("connect", () => {
                socket.emit("joinConversation", conversation_id);
            });
        }

        const handleJoinedRoom = (data) => {
            console.log("✅ Successfully joined room:", data);
        };
        socket.on("joinedRoom", handleJoinedRoom);

        return () => {
            socket.off("joinedRoom", handleJoinedRoom);
        };
    }, [conversation_id]);

    // Handle sending a message
    const sendMessageHandler = async (text) => {
        if (!text.trim()) return;
        try {
            await sendMessage(conversation_id, text, chatPartner._id);
        } catch (err) {
            console.error("Error sending message:", err);
        }
    };

    return (
        <ChatRoom
            messages={messages}
            onSendMessage={sendMessageHandler}
            user={chatPartner}
        />
    );
}
