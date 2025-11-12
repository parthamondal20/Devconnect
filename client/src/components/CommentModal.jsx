import { useEffect, useState } from "react";
import { Send, X, Heart, Trash2 } from "lucide-react";
import { addComment, getComments } from "../services/comment";
import CommentLoader from "./CommentLoader";
import { showError, showSuccess } from "../utils/toast";
import { useSelector } from "react-redux";
const CommentModal = ({ post, onClose }) => {
    const [commentText, setCommentText] = useState("");
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("No comments yet");
    const [likedComments, setLikedComments] = useState(new Set());
    const [replyingTo, setReplyingTo] = useState(null);
    const [showReplies, setShowReplies] = useState(new Set());
    const { user } = useSelector(state => state.auth);
    useEffect(() => {
        const fetchComments = async () => {
            try {
                setLoading(true);
                const allComments = await getComments(post._id);
                // Add replies array to each comment if it doesn't exist
                const commentsWithReplies = allComments.map(c => ({
                    ...c,
                    replies: c.replies || []
                }));
                setComments(commentsWithReplies);
            } catch (error) {
                setMessage("Failed to load comments! Try again");
            } finally {
                setLoading(false);
            }
        };
        fetchComments();
    }, [post._id]);

    const handleAddComment = async () => {
        if (!commentText.trim()) return;
        try {
            setLoading(true);
            const newComment = await addComment(post._id, commentText.trim());

            if (replyingTo) {
                // Add as reply to specific comment
                setComments(comments.map(c =>
                    c._id === replyingTo
                        ? { ...c, replies: [...(c.replies || []), { ...newComment, user: { username: "You", avatar: post.user.avatar } }] }
                        : c
                ));
                setReplyingTo(null);
            } else {
                // Add as new comment
                setComments([...comments, { ...newComment, replies: [] }]);
            }
            post.commentsCount += 1;
            setCommentText("");
        } catch (err) {
            showError("Failed to add comment! Try again");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleLike = (commentId) => {
        setLikedComments(prev => {
            const newSet = new Set(prev);
            if (newSet.has(commentId)) {
                newSet.delete(commentId);
            } else {
                newSet.add(commentId);
            }
            return newSet;
        });
    };

    const toggleReplies = (commentId) => {
        setShowReplies(prev => {
            const newSet = new Set(prev);
            if (newSet.has(commentId)) {
                newSet.delete(commentId);
            } else {
                newSet.add(commentId);
            }
            return newSet;
        });
    };

    const startReply = (commentId, username) => {
        setReplyingTo(commentId);
        setCommentText(`@${username} `);
    };

    const handleDeleteComment = (commentId) => {
        // Filter out the comment
        setComments(comments.filter(c => c._id !== commentId));
        showSuccess("Comment deleted");
    };

    const handleDeleteReply = (commentId, replyIndex) => {
        // Remove reply from specific comment
        setComments(comments.map(c =>
            c._id === commentId
                ? { ...c, replies: c.replies.filter((_, idx) => idx !== replyIndex) }
                : c
        ));
        showSuccess("Reply deleted");
    };

    return (
        <div
            className="fixed inset-0 z-50 flex justify-center items-center bg-black/70 backdrop-blur-sm p-4 md:p-6"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-white dark:bg-gray-900 w-full max-w-5xl h-[80vh] rounded-2xl flex flex-col md:flex-row overflow-hidden shadow-xl">
                {/* Left: Post Image */}
                <div className="md:w-1/2 bg-black flex items-center justify-center p-4 md:p-6">
                    <img
                        src={post.images[0]?.url}
                        alt="post"
                        className="object-contain max-h-full max-w-full rounded-lg"
                    />
                </div>

                {/* Right: Comments Section */}
                <div className="md:w-1/2 flex flex-col bg-gray-50 dark:bg-gray-800">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <img
                                src={post.user.avatar}
                                alt="avatar"
                                className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600"
                            />
                            <p className="text-sm text-gray-900 dark:text-gray-100">
                                <strong>{post.user.username}</strong> {post.about}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Comments List */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar">
                        {loading ? (
                            <CommentLoader />
                        ) : comments.length > 0 ? (
                            comments.map((c) => (
                                <div key={c._id} className="space-y-2">
                                    {/* Main Comment */}
                                    <div className="flex items-start gap-3 group hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 transition">
                                        <img
                                            src={c.user.avatar}
                                            alt="avatar"
                                            className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-900 dark:text-gray-100">
                                                <strong>{c.user.username}</strong> {c.text}
                                            </p>

                                            {/* Action buttons */}
                                            <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                <span>2h</span>
                                                {/* <button
                                                    className="font-semibold hover:text-gray-700 dark:hover:text-gray-200 transition"
                                                    onClick={() => toggleLike(c._id)}
                                                >
                                                    {likedComments.has(c._id) ? '1 like' : 'Like'}
                                                </button> */}
                                                <button
                                                    className="font-semibold hover:text-gray-700 dark:hover:text-gray-200 transition"
                                                    onClick={() => startReply(c._id, c.user.username)}
                                                >
                                                    Reply
                                                </button>
                                                {user._id === c.user._id && <button
                                                    className="font-semibold hover:text-red-500 dark:hover:text-red-400 transition "
                                                    onClick={() => handleDeleteComment(c._id)}
                                                >
                                                    Delete
                                                </button>}
                                            </div>

                                            {/* View replies button */}
                                            {c.replies && c.replies.length > 0 && (
                                                <button
                                                    onClick={() => toggleReplies(c._id)}
                                                    className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400 font-semibold hover:text-gray-700 dark:hover:text-gray-200 transition"
                                                >
                                                    <div className="w-8 h-px bg-gray-300 dark:bg-gray-600"></div>
                                                    {showReplies.has(c._id) ? 'Hide' : `View`} replies ({c.replies.length})
                                                </button>
                                            )}

                                            {/* Replies */}
                                            {showReplies.has(c._id) && c.replies && c.replies.length > 0 && (
                                                <div className="mt-3 space-y-3 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                                                    {c.replies.map((reply, idx) => (
                                                        <div key={idx} className="flex items-start gap-3 group">
                                                            <img
                                                                src={reply.user.avatar}
                                                                alt="avatar"
                                                                className="w-6 h-6 rounded-full border border-gray-300 dark:border-gray-600 flex-shrink-0"
                                                            />
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm text-gray-900 dark:text-gray-100">
                                                                    <strong>{reply.user.username}</strong> {reply.text}
                                                                </p>
                                                                <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                                    <span className="opacity-0 group-hover:opacity-100 transition">1h</span>
                                                                    <button
                                                                        className="font-semibold hover:text-gray-700 dark:hover:text-gray-200 transition"
                                                                        onClick={() => toggleLike(`${c._id}-${idx}`)}
                                                                    >
                                                                        {likedComments.has(`${c._id}-${idx}`) ? '1 like' : 'Like'}
                                                                    </button>
                                                                    <button
                                                                        className="font-semibold hover:text-gray-700 dark:hover:text-gray-200 transition"
                                                                        onClick={() => startReply(c._id, reply.user.username)}
                                                                    >
                                                                        Reply
                                                                    </button>
                                                                    <button
                                                                        className="font-semibold hover:text-red-500 dark:hover:text-red-400 transition opacity-0 group-hover:opacity-100"
                                                                        onClick={() => handleDeleteReply(c._id, idx)}
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Like heart icon */}
                                        <button
                                            onClick={() => toggleLike(c._id)}
                                            className="flex-shrink-0 mt-1"
                                        >
                                            <Heart
                                                size={12}
                                                className={`transition ${likedComments.has(c._id)
                                                    ? 'fill-red-500 text-red-500'
                                                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400">{message}</p>
                        )}
                    </div>

                    {/* Add Comment Input */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900">
                        {replyingTo && (
                            <div className="flex items-center justify-between mb-2 text-xs text-gray-500 dark:text-gray-400">
                                <span>Replying to comment</span>
                                <button
                                    onClick={() => { setReplyingTo(null); setCommentText(""); }}
                                    className="text-blue-500 hover:text-blue-600 font-semibold"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                        <div className="flex items-center gap-3">
                            <input
                                type="text"
                                placeholder="Add a comment..."
                                className="flex-1 bg-white dark:bg-gray-700 rounded-full px-4 py-2 text-sm text-gray-900 dark:text-gray-100 outline-none placeholder-gray-400 dark:placeholder-gray-500"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                            />
                            <button
                                onClick={handleAddComment}
                                className="text-blue-500 hover:text-blue-600 p-1 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!commentText.trim()}
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom scrollbar styles */}
            <style>
                {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: rgba(100,100,100,0.4);
            border-radius: 3px;
          }
        `}
            </style>
        </div>
    );
};

export default CommentModal;