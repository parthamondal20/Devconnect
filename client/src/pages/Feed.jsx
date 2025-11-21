import { useState, useEffect, useCallback } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Image as ImageIcon,
  X,
  Send,
  Smile,
  Calendar
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import PostModal from "../components/PostModal";
import { getPosts, deletePost } from "../services/post";
import { setPost } from "../features/postSlice";
import Loader from "../components/Loader";
import ImageCarousel from "../components/ImageCarousel";
import { likeRequest } from "../services/like";
import debounce from "lodash/debounce";
import { toast } from "react-hot-toast";
import CommentModal from "../components/CommentModal";
// Sidebar import removed per request

// Helper for relative time (Simple version)
const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m";
  return "Just now";
};

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const { post } = useSelector((state) => state.post);
  // eslint-disable-next-line no-unused-vars
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [openPostModal, setOpenPostModal] = useState(false);
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [message, setMessage] = useState("loading..");
  const [activePost, setActivePost] = useState(null);

  // Placeholder for missing handleFollow function
  const handleFollow = async (userId) => {
    toast.success("Follow feature coming soon!");
    // Add actual API call logic here
  };

  const sendLikeRequest = useCallback(
    debounce(async (postId) => {
      try {
        const res = await likeRequest(postId);
        if (res && typeof res === "object") {
          setPosts((prev) =>
            prev.map((p) =>
              p._id === postId ? { ...p, likesCount: res.likesCount, likedByCurrentUser: res.liked } : p
            )
          );
        }
      } catch (err) {
        console.error(err);
      }
    }, 300),
    []
  );

  const handleLike = (post_id) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p._id !== post_id) return p;
        const currentlyLiked = Boolean(p.likedByCurrentUser);
        return {
          ...p,
          likedByCurrentUser: !currentlyLiked,
          likesCount: currentlyLiked ? (p.likesCount || 0) - 1 : (p.likesCount || 0) + 1,
        };
      })
    );
    sendLikeRequest(post_id);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await getPosts();
        setPosts(res);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load feed");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [post]);

  const handleDelete = async (postId) => {
    await toast.promise(
      deletePost(postId).then(() => {
        setPosts((prev) => prev.filter((p) => p._id !== postId));
      }),
      {
        loading: "Deleting post...",
        success: "Post deleted successfully!",
        error: "Failed to delete post.",
      },
      { duration: 2500 }
    );
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") setSelectedImage(null);
    };
    if (selectedImage) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKey);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [selectedImage]);

  if (loading) {
    return <Loader message={message} loading={loading} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Adjusted Grid: No Left Sidebar, Just Feed + Right Suggestions */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 justify-center">

          {/* Main Feed Column */}
          <div className="w-full max-w-2xl mx-auto space-y-6">

            {/* Create Post Card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="flex gap-4">
                <img
                  src={user?.avatar}
                  onClick={() => navigate(`/profile/${user?._id}`)}
                  alt="avatar"
                  className="w-12 h-12 rounded-full object-cover cursor-pointer hover:opacity-90 transition"
                />
                <div className="flex-1">
                  <div
                    onClick={() => setOpenPostModal(true)}
                    className="w-full bg-gray-50 dark:bg-gray-800 rounded-2xl p-3 cursor-text hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
                  >
                    <p className="text-gray-500 dark:text-gray-400 font-medium">What's happening?</p>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center justify-between mt-3 px-2">
                    <div className="flex gap-4 text-blue-500">
                      <button
                        onClick={() => setOpenPostModal(true)}
                        className="flex items-center gap-2 text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2 py-1.5 rounded-lg transition"
                      >
                        <ImageIcon size={18} />
                        <span className="hidden sm:inline">Media</span>
                      </button>
                      <button
                        onClick={() => setOpenPostModal(true)}
                        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1.5 rounded-lg transition"
                      >
                        <Calendar size={18} />
                        <span className="hidden sm:inline">Event</span>
                      </button>
                      <button
                        onClick={() => setOpenPostModal(true)}
                        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1.5 rounded-lg transition"
                      >
                        <Smile size={18} />
                        <span className="hidden sm:inline">Feeling</span>
                      </button>
                    </div>
                    <button
                      onClick={() => setOpenPostModal(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 sm:px-4 sm:py-1.5 text-sm font-semibold shadow-md transition-all"
                    >
                      <Send size={16} className="sm:hidden" />
                      <span className="hidden sm:block">Post</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <PostModal
              isOpen={openPostModal}
              onClose={() => setOpenPostModal(false)}
              user={user}
            />

            {/* Feed Posts */}
            {posts.map((postItem) => (
              <div
                key={postItem._id}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                {/* Header */}
                <div className="flex justify-between items-start p-4 sm:p-5 pb-0">
                  <div className="flex gap-3">
                    <div className="relative group cursor-pointer" onClick={() => navigate(`/profile/${postItem.user._id}`)}>
                      <img
                        src={postItem.user?.avatar}
                        alt="avatar"
                        className="w-11 h-11 rounded-full object-cover ring-2 ring-transparent group-hover:ring-blue-500 transition-all"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3
                          onClick={() => navigate(`/profile/${postItem.user._id}`)}
                          className="font-bold text-gray-900 dark:text-white text-[15px] cursor-pointer hover:underline decoration-gray-400"
                        >
                          {postItem.user?.username}
                        </h3>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 hover:underline cursor-pointer">
                          {timeAgo(postItem.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">@{postItem.user?.username?.toLowerCase().replace(/\s/g, '')}</p>
                    </div>
                  </div>

                  {/* Actions Menu (Follow & More) */}
                  <div className="flex items-center gap-2">
                    {user?._id !== postItem.user?._id && (
                      <button
                        onClick={() => handleFollow(postItem.user?._id)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${user?.following.includes(postItem.user?._id)
                          ? "text-gray-500 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                          : "text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          }`}
                      >
                        {user?.following.includes(postItem.user?._id) ? "Following" : "Follow"}
                      </button>
                    )}

                    <div className="relative">
                      <button
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        onClick={() => setMenuOpen(menuOpen === postItem._id ? null : postItem._id)}
                      >
                        <MoreHorizontal size={18} />
                      </button>

                      {menuOpen === postItem._id && (
                        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in duration-200">
                          {postItem.user?._id === user?._id ? (
                            deleteConfirmId === postItem._id ? (
                              <div className="p-2 bg-red-50 dark:bg-red-900/20">
                                <p className="text-xs text-red-600 dark:text-red-400 font-medium mb-2 px-1">Confirm delete?</p>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => { setDeleteConfirmId(null); setMenuOpen(null); }}
                                    className="flex-1 px-2 py-1 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-sm"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => { handleDelete(postItem._id); setDeleteConfirmId(null); setMenuOpen(null); }}
                                    className="flex-1 px-2 py-1 text-xs bg-red-500 text-white rounded-md shadow-sm hover:bg-red-600"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirmId(postItem._id)}
                                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                              >
                                <span>Delete Post</span>
                              </button>
                            )
                          ) : (
                            <button className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700">
                              Report Post
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="px-4 sm:px-5 py-3">
                  <p className="text-gray-800 dark:text-gray-200 text-[15px] leading-relaxed whitespace-pre-wrap">
                    {postItem.about}
                  </p>

                  {postItem.images && postItem.images.length > 0 && (
                    <div className="mt-4 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800">
                      {postItem.images.length === 1 ? (
                        <img
                          src={postItem.images[0].url}
                          alt="post"
                          onClick={() => setSelectedImage(postItem.images[0].url)}
                          className="w-full max-h-[500px] object-cover cursor-pointer hover:opacity-95 transition"
                        />
                      ) : (
                        <div className="aspect-video bg-black">
                          <ImageCarousel
                            images={postItem.images}
                            onImageClick={(url) => setSelectedImage(url)}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="px-4 sm:px-5 py-3 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between max-w-md">
                    {/* Like */}
                    <button
                      onClick={() => handleLike(postItem._id)}
                      className="flex items-center gap-2 group focus:outline-none"
                    >
                      <div className={`p-2 rounded-full group-hover:bg-red-50 dark:group-hover:bg-red-900/20 transition-colors ${postItem.likedByCurrentUser ? "text-red-500" : "text-gray-500 dark:text-gray-400"
                        }`}>
                        <Heart
                          size={20}
                          className={`transition-transform duration-300 ${postItem.likedByCurrentUser ? "fill-current scale-110" : "group-hover:scale-110"
                            }`}
                        />
                      </div>
                      <span className={`text-sm font-medium ${postItem.likedByCurrentUser ? "text-red-500" : "text-gray-500 dark:text-gray-400 group-hover:text-red-500"
                        }`}>
                        {postItem.likesCount || 0}
                      </span>
                    </button>

                    {/* Comment */}
                    <button
                      onClick={() => setActivePost(postItem)}
                      className="flex items-center gap-2 group"
                    >
                      <div className="p-2 rounded-full text-gray-500 dark:text-gray-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-blue-500 transition-colors">
                        <MessageCircle size={20} />
                      </div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400 group-hover:text-blue-500">
                        {postItem.commentsCount || 0}
                      </span>
                    </button>

                    {/* Share */}
                    <button className="flex items-center gap-2 group">
                      <div className="p-2 rounded-full text-gray-500 dark:text-gray-400 group-hover:bg-green-50 dark:group-hover:bg-green-900/20 group-hover:text-green-500 transition-colors">
                        <Share2 size={20} />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column - Suggestions */}
          <div className="hidden lg:block sticky top-24 h-fit space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Who to follow</h3>
              <div className="text-sm text-gray-500">Suggestions feature coming soon...</div>
            </div>
          </div>

        </div>
      </div>

      {/* Modals */}
      {activePost && (
        <CommentModal
          post={activePost}
          onClose={() => setActivePost(null)}
        />
      )}

      {/* Fullscreen Image Viewer */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[60] flex justify-center items-center bg-black/90 backdrop-blur-sm transition-opacity p-4"
          onClick={(e) => e.target === e.currentTarget && setSelectedImage(null)}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-50 p-3 rounded-full bg-gray-800/50 hover:bg-gray-700 text-white transition-colors"
            >
              <X size={24} />
            </button>
            <img
              src={selectedImage}
              alt="fullscreen"
              className="max-w-full max-h-full object-contain rounded-md shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;