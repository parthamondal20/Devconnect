import { useEffect, useState } from "react";
import { Send, X, Heart, Trash2 } from "lucide-react";
import { addComment, getComments, deleteComment } from "../services/comment";
import CommentLoader from "./CommentLoader";
import InstagramLoader from "./InstagramLoader";
import { showError, showSuccess } from "../utils/toast";
import { useSelector } from "react-redux";
import ImageCarousel from "./ImageCarousel";
const CommentModal = ({ post, onClose }) => {
    const [commentText, setCommentText] = useState("");
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false); // For add/delete operations
    const [message, setMessage] = useState("No comments yet");
    const [likedComments, setLikedComments] = useState(new Set());
    const [replyingTo, setReplyingTo] = useState(null);
    const [showReplies, setShowReplies] = useState(new Set());
    const { user } = useSelector(state => state.auth);
    console.log("post is ", post);
    // Prevent body scroll when modal is open
    useEffect(() => {
        // Save original overflow style
        const originalOverflow = document.body.style.overflow;
        // Disable scroll
        document.body.style.overflow = 'hidden';

        // Re-enable scroll on cleanup
        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, []);

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
            setActionLoading(true);
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
            setActionLoading(false);
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

    const handleDeleteComment = async (commentId) => {
        try {
            setActionLoading(true);
            await deleteComment(commentId);
            // Filter out the comment
            setComments(comments.filter(c => c._id !== commentId));
            post.commentsCount -= 1;
        } catch (err) {
            showError("Failed to delete comment");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteReply = async (commentId, replyIndex) => {
        try {
            setActionLoading(true);
            // Simulate API call delay (replace with actual API call when available)
            await new Promise(resolve => setTimeout(resolve, 500));
            // Remove reply from specific comment
            setComments(comments.map(c =>
                c._id === commentId
                    ? { ...c, replies: c.replies.filter((_, idx) => idx !== replyIndex) }
                    : c
            ));
            showSuccess("Reply deleted");
        } catch (err) {
            showError("Failed to delete reply");
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <>
            {/* Instagram-style loader for add/delete operations */}
            <InstagramLoader show={actionLoading} />

            <div
                className="fixed inset-0 z-50 flex justify-center max-md:items-end md:items-center bg-black/70 backdrop-blur-sm max-md:p-0 md:p-6"
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <div className="bg-white dark:bg-gray-900 w-full max-w-5xl max-md:h-[92vh] md:h-[80vh] max-md:rounded-t-3xl md:rounded-2xl flex flex-col md:flex-row overflow-hidden shadow-xl mobile-modal-slide">
                    {/* Mobile: Swipe indicator */}
                    <div className="md:hidden flex justify-center pt-3 pb-2 bg-gray-50 dark:bg-gray-800">
                        <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    </div>

                    {/* Left: Post Image - Hidden on mobile */}
                    <div className="max-md:hidden md:w-1/2 bg-black flex items-center justify-center p-4 md:p-6">
                        <ImageCarousel images={post.images} />
                    </div>

                    {/* Right: Comments Section */}
                    <div className="max-md:flex-1 md:w-1/2 flex flex-col bg-gray-50 dark:bg-gray-800">
                        {/* Header */}
                        <div className="flex items-center justify-between max-md:p-3 md:p-4 border-b border-gray-200 dark:border-gray-700 max-md:sticky max-md:top-0 max-md:bg-gray-50 max-md:dark:bg-gray-800 max-md:z-10">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <img
                                    src={post.user.avatar}
                                    alt="avatar"
                                    className="max-md:w-9 max-md:h-9 md:w-10 md:h-10 rounded-full border border-gray-300 dark:border-gray-600 flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-900 dark:text-gray-100 max-md:truncate">
                                        <strong>{post.user.username}</strong> <span className="max-md:hidden">{post.about}</span>
                                    </p>
                                    <p className="md:hidden text-xs text-gray-500 dark:text-gray-400 truncate">
                                        {post.about}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="max-md:p-2 md:p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition max-md:active:scale-95 flex-shrink-0"
                                aria-label="Close"
                            >
                                <X className="max-md:w-5 max-md:h-5 md:w-5 md:h-5" />
                            </button>
                        </div>

                        {/* Comments List */}
                        <div className="flex-1 max-md:px-3 max-md:py-4 md:p-4 overflow-y-auto space-y-3 custom-scrollbar max-md:overscroll-contain">
                            {loading ? (
                                <CommentLoader loading={loading} />
                            ) : comments.length > 0 ? (
                                comments.map((c) => (
                                    <div key={c._id} className="space-y-2">
                                        {/* Main Comment */}
                                        <div className="flex items-start max-md:gap-2 md:gap-3 group max-md:active:bg-gray-100 max-md:dark:active:bg-gray-700 md:hover:bg-gray-100 md:dark:hover:bg-gray-700 rounded-lg p-2 transition">
                                            <img
                                                src={c.user.avatar}
                                                alt="avatar"
                                                className="max-md:w-9 max-md:h-9 md:w-8 md:h-8 rounded-full border border-gray-300 dark:border-gray-600 flex-shrink-0"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-gray-900 dark:text-gray-100 max-md:break-words">
                                                    <strong className="font-semibold">{c.user.username}</strong> {c.text}
                                                </p>

                                                {/* Action buttons */}
                                                <div className="flex items-center max-md:gap-3 md:gap-4 max-md:mt-1.5 md:mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                    <span>2h</span>
                                                    {/* <button
                                                    className="font-semibold hover:text-gray-700 dark:hover:text-gray-200 transition"
                                                    onClick={() => toggleLike(c._id)}
                                                >
                                                    {likedComments.has(c._id) ? '1 like' : 'Like'}
                                                </button> */}
                                                    <button
                                                        className="font-semibold hover:text-gray-700 dark:hover:text-gray-200 transition max-md:active:scale-95 max-md:py-1"
                                                        onClick={() => startReply(c._id, c.user.username)}
                                                    >
                                                        Reply
                                                    </button>
                                                    {user._id === c.user._id && <button
                                                        className="font-semibold hover:text-red-500 dark:hover:text-red-400 transition max-md:active:scale-95 max-md:py-1"
                                                        onClick={() => handleDeleteComment(c._id)}
                                                    >
                                                        Delete
                                                    </button>}
                                                </div>

                                                {/* View replies button */}
                                                {c.replies && c.replies.length > 0 && (
                                                    <button
                                                        onClick={() => toggleReplies(c._id)}
                                                        className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400 font-semibold hover:text-gray-700 dark:hover:text-gray-200 transition max-md:active:scale-95 max-md:py-1"
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
                        <div className="max-md:p-3 md:p-4 border-t border-gray-200 dark:border-gray-700 max-md:bg-white md:bg-gray-100 dark:bg-gray-900 max-md:sticky max-md:bottom-0 mobile-safe-bottom">
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
                            <div className="flex items-center max-md:gap-2 md:gap-3">
                                <input
                                    type="text"
                                    placeholder="Add a comment..."
                                    className="flex-1 max-md:bg-gray-100 md:bg-white dark:bg-gray-700 max-md:border max-md:border-gray-300 max-md:dark:border-gray-600 rounded-full px-4 max-md:py-2.5 md:py-2 text-sm text-gray-900 dark:text-gray-100 outline-none max-md:focus:border-blue-500 max-md:dark:focus:border-blue-400 placeholder-gray-400 dark:placeholder-gray-500 transition"
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                                />
                                <button
                                    onClick={handleAddComment}
                                    className="text-blue-500 hover:text-blue-600 max-md:p-2 md:p-1 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed max-md:active:scale-95"
                                    disabled={!commentText.trim()}
                                >
                                    <Send className="max-md:w-5 max-md:h-5 md:w-[18px] md:h-[18px]" />
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
          
          /* Mobile-only styles */
          @media (max-width: 767px) {
            .mobile-modal-slide {
              animation: slideUpMobile 0.3s ease-out;
            }
            
            @keyframes slideUpMobile {
              from {
                transform: translateY(100%);
              }
              to {
                transform: translateY(0);
              }
            }
            
            .mobile-safe-bottom {
              padding-bottom: max(0.75rem, env(safe-area-inset-bottom));
            }
          }
        `}
                </style>
            </div>
        </>
    );
};

export default CommentModal;