import { useState, useEffect, useCallback, useRef } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Image as ImageIcon,
  X,
  Send,
  Smile,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Download
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import PostModal from "../components/PostModal";
import { getPosts, deletePost } from "../services/post";
import { setPost, clearPost } from "../features/postSlice";
import Loader from "../components/Loader";
import ImageCarousel from "../components/ImageCarousel";
import { likeRequest } from "../services/like";
import debounce from "lodash/debounce";
import { toast } from "react-hot-toast";
import CommentModal from "../components/CommentModal";
import PostLoader from "../components/PostLoader";
import { SkeletonTheme } from 'react-loading-skeleton';
import FeedLoader from "../components/FeedLoader";
import ConfirmModal from "../components/ConfirmModal";
import PageLoader from "../components/PageLoader";
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

const Feed = ({ indivisual_post }) => {
  const [posts, setPosts] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const { post } = useSelector((state) => state.post);
  // eslint-disable-next-line no-unused-vars
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [allImages, setAllImages] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [menuOpen, setMenuOpen] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [openPostModal, setOpenPostModal] = useState(false);
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [message, setMessage] = useState("loading..");
  const [activePost, setActivePost] = useState(null);
  const [postloading, setPostLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const clientURL = import.meta.env.VITE_CLIENT_URL;
  // Placeholder for missing handleFollow function
  const handleFollow = async (userId) => {
    toast.success("Follow feature coming soon!");
    // Add actual API call logic here
  };

  // Enhanced fullscreen preview functions
  const openFullscreenImage = (images, index = 0) => {
    setAllImages(images);
    setSelectedImageIndex(index);
    setSelectedImage(images[index]);
    setZoomLevel(1);
  };

  const closeFullscreenImage = () => {
    setSelectedImage(null);
    setAllImages([]);
    setSelectedImageIndex(0);
    setZoomLevel(1);
  };

  const navigateImage = (direction) => {
    if (allImages.length === 0) return;
    const newIndex = direction === 'next'
      ? (selectedImageIndex + 1) % allImages.length
      : (selectedImageIndex - 1 + allImages.length) % allImages.length;
    setSelectedImageIndex(newIndex);
    setSelectedImage(allImages[newIndex]);
    setZoomLevel(1);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };

  const resetZoom = () => {
    setZoomLevel(1);
  };

  const downloadImage = () => {
    if (!selectedImage) return;
    const link = document.createElement('a');
    link.href = selectedImage;
    link.download = `image-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Image download started!');
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
    if (post?._id) {
      setPosts((prev) => [post, ...prev]);
      dispatch(clearPost());
    }
  }, [post, dispatch]);

  // ✅ Redirect to home if user state is cleared (session expired)
  useEffect(() => {
    if (!user) {
      console.log("User state is null, redirecting to home...");
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (indivisual_post) {
      setPosts([indivisual_post]);
      return;
    }
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
  }, []);

  const handleDeleteClick = (postId) => {
    setPostToDelete(postId);
    setShowDeleteModal(true);
    setMenuOpen(null);
  };

  const confirmDelete = async () => {
    await toast.promise(
      deletePost(postToDelete).then(() => {
        setPosts((prev) => prev.filter((p) => p._id !== postToDelete));
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
      if (e.key === "Escape") {
        closeFullscreenImage();
      } else if (e.key === "ArrowLeft" && allImages.length > 1) {
        navigateImage('prev');
      } else if (e.key === "ArrowRight" && allImages.length > 1) {
        navigateImage('next');
      }
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
  }, [selectedImage, allImages, selectedImageIndex]);

  const handleShare = async (postItem) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "DevConnect",
          text: postItem.about,
          url: `${clientURL}/post/${postItem._id}`,
        })
      } else {
        toast.error("Share feature not supported on this device");
      }
    } catch (error) {
      console.log(error);
    }
  }

  if (loading) {
    return <PageLoader loading={loading} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50/30 dark:bg-gradient-to-br dark:from-black dark:via-gray-950 dark:to-black text-gray-900 dark:text-gray-100">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
        {/* Adjusted Grid: No Left Sidebar, Just Feed + Right Suggestions */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 justify-center">

          {/* Main Feed Column */}
          <div className="w-full max-w-2xl mx-auto space-y-6">

            {/* Create Post Card */}
            {!indivisual_post && <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-5 shadow-md hover:shadow-lg border border-gray-200/50 dark:border-gray-800/50 backdrop-blur-sm transition-all duration-300">
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
                    className="w-full bg-gray-50 dark:bg-gray-800 rounded-2xl p-3.5 sm:p-4 cursor-text hover:bg-gradient-to-r hover:from-gray-100 hover:to-blue-50/50 dark:hover:from-gray-800 dark:hover:to-blue-900/10 transition-all duration-300 min-h-[44px] flex items-center"
                  >
                    <p className="text-gray-500 dark:text-gray-400 font-medium text-sm sm:text-base">What's happening?</p>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center justify-between mt-3 sm:mt-4 px-1">
                    <div className="flex gap-2 sm:gap-3 text-blue-500">
                      <button
                        onClick={() => setOpenPostModal(true)}
                        className="flex items-center gap-1.5 sm:gap-2 text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2.5 sm:px-3 py-2 rounded-lg transition-all min-h-[44px] active:scale-95"
                      >
                        <ImageIcon size={18} className="flex-shrink-0" />
                        <span className="hidden sm:inline">Media</span>
                      </button>
                      <button
                        onClick={() => setOpenPostModal(true)}
                        className="flex items-center gap-1.5 sm:gap-2 text-sm font-medium text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 px-2.5 sm:px-3 py-2 rounded-lg transition-all min-h-[44px] active:scale-95"
                      >
                        <Calendar size={18} className="flex-shrink-0" />
                        <span className="hidden sm:inline">Event</span>
                      </button>
                      <button
                        onClick={() => setOpenPostModal(true)}
                        className="flex items-center gap-1.5 sm:gap-2 text-sm font-medium text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 px-2.5 sm:px-3 py-2 rounded-lg transition-all min-h-[44px] active:scale-95"
                      >
                        <Smile size={18} className="flex-shrink-0" />
                        <span className="hidden sm:inline">Feeling</span>
                      </button>
                    </div>
                    <button
                      onClick={() => setOpenPostModal(true)}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full min-w-[44px] min-h-[44px] p-2 sm:px-5 sm:py-2 text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 flex items-center justify-center"
                    >
                      <Send size={18} className="sm:hidden" />
                      <span className="hidden sm:block">Post</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>}

            <PostModal
              isOpen={openPostModal}
              onClose={() => setOpenPostModal(false)}
              user={user}
            />

            {/* Feed Posts */}
            {posts.map((postItem) => (
              <div
                key={postItem._id}
                className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-200/60 dark:border-gray-800/60 shadow-lg hover:shadow-2xl hover:border-blue-200/40 dark:hover:border-blue-800/40 transition-all duration-500 overflow-hidden"
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
                            <button
                              onClick={() => handleDeleteClick(postItem._id)}
                              className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                              <span>Delete Post</span>
                            </button>
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
                    <div className="mt-4 rounded-xl overflow-hidden border border-gray-200/50 dark:border-gray-800/50 shadow-inner">
                      {postItem.images.length === 1 ? (
                        <div className="w-full bg-gray-50 dark:bg-gray-900/90 flex items-center justify-center" style={{ minHeight: '300px', maxHeight: '500px' }}>
                          <img
                            src={postItem.images[0].url}
                            alt="post"
                            loading="lazy"
                            onClick={() => openFullscreenImage(postItem.images.map(img => img.url), 0)}
                            className="w-full h-full object-contain cursor-pointer hover:opacity-95 transition-all duration-300"
                            style={{ maxHeight: '500px' }}
                          />
                        </div>
                      ) : (
                        <div className="aspect-video bg-gray-50 dark:bg-gray-800/30">
                          <ImageCarousel
                            images={postItem.images}
                            onImageClick={(url) => {
                              const imageUrls = postItem.images.map(img => img.url);
                              const index = imageUrls.indexOf(url);
                              openFullscreenImage(imageUrls, index);
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="px-4 sm:px-5 py-3.5 border-t border-gray-200/60 dark:border-gray-800/60 bg-gradient-to-b from-transparent to-gray-50/30 dark:to-gray-800/20">
                  <div className="flex items-center justify-around sm:justify-between max-w-md gap-2">
                    {/* Like */}
                    <button
                      onClick={() => handleLike(postItem._id)}
                      className="flex items-center gap-1.5 sm:gap-2 group focus:outline-none min-h-[44px] px-2 sm:px-3 py-2 rounded-lg hover:bg-red-50/50 dark:hover:bg-red-900/10 transition-all active:scale-95"
                    >
                      <div className={` transition-all duration-300 ${postItem.likedByCurrentUser ? "text-red-500 bg-red-50 dark:bg-red-900/20" : "text-gray-500 dark:text-gray-400 group-hover:bg-red-100 dark:group-hover:bg-red-900/30"
                        }`}>
                        <Heart
                          size={20}
                          className={`transition-all duration-300 ${postItem.likedByCurrentUser ? "fill-current scale-110" : "group-hover:scale-125"
                            }`}
                        />
                      </div>
                      <span className={`text-sm font-semibold transition-colors ${postItem.likedByCurrentUser ? "text-red-500" : "text-gray-600 dark:text-gray-400 group-hover:text-red-500"
                        }`}>
                        {postItem.likesCount || 0}
                      </span>
                    </button>

                    {/* Comment */}
                    <button
                      onClick={() => setActivePost(postItem)}
                      className="flex items-center gap-1.5 sm:gap-2 group min-h-[44px] px-2 sm:px-3 py-2 rounded-lg hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all active:scale-95"
                    >
                      <div className="p-1.5 sm:p-2 rounded-full text-gray-500 dark:text-gray-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 group-hover:text-blue-500 transition-all duration-300 group-hover:scale-110">
                        <MessageCircle size={20} />
                      </div>
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 group-hover:text-blue-500 transition-colors">
                        {postItem.commentsCount || 0}
                      </span>
                    </button>

                    {/* Share */}
                    <button
                      onClick={() => handleShare(postItem)}
                      className="flex items-center gap-1.5 sm:gap-2 group min-h-[44px] px-2 sm:px-3 py-2 rounded-lg hover:bg-green-50/50 dark:hover:bg-green-900/10 transition-all active:scale-95"
                    >
                      <div className="p-1.5 sm:p-2 rounded-full text-gray-500 dark:text-gray-400 group-hover:bg-green-100 dark:group-hover:bg-green-900/30 group-hover:text-green-500 transition-all duration-300 group-hover:scale-110">
                        <Share2 size={20} />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Post?"
        message="Are you sure you want to delete this post? This action cannot be undone."
      />
      {activePost && (
        <CommentModal
          post={activePost}
          onClose={() => setActivePost(null)}
        />
      )}

      {/* Premium Fullscreen Image Viewer */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[60] flex justify-center items-center bg-black/95 backdrop-blur-md transition-all duration-300 animate-in fade-in"
          onClick={(e) => e.target === e.currentTarget && closeFullscreenImage()}
        >
          {/* Top Control Bar */}
          <div className="absolute top-0 left-0 right-0 p-3 sm:p-4 md:p-6 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent z-50">
            <div className="flex items-center gap-2 sm:gap-3">
              {allImages.length > 1 && (
                <div className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-xs sm:text-sm font-semibold border border-white/20">
                  {selectedImageIndex + 1} / {allImages.length}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={downloadImage}
                className="p-2.5 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-all duration-300 hover:scale-110 active:scale-95 border border-white/20"
                title="Download image"
              >
                <Download size={20} className="sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={closeFullscreenImage}
                className="p-2.5 sm:p-3 rounded-full bg-white/10 hover:bg-red-500/80 backdrop-blur-md text-white transition-all duration-300 hover:scale-110 active:scale-95 border border-white/20"
                title="Close (ESC)"
              >
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>

          {/* Main Image Container */}
          <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-8 md:p-12">
            <img
              src={selectedImage}
              alt="fullscreen preview"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-transform duration-300 select-none"
              style={{ transform: `scale(${zoomLevel})` }}
              onDoubleClick={zoomLevel === 1 ? handleZoomIn : resetZoom}
            />
          </div>

          {/* Navigation Arrows */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={() => navigateImage('prev')}
                className="absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-all duration-300 hover:scale-110 active:scale-95 border border-white/20 z-50"
                title="Previous (←)"
              >
                <ChevronLeft size={24} className="sm:w-8 sm:h-8" />
              </button>
              <button
                onClick={() => navigateImage('next')}
                className="absolute right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-all duration-300 hover:scale-110 active:scale-95 border border-white/20 z-50"
                title="Next (→)"
              >
                <ChevronRight size={24} className="sm:w-8 sm:h-8" />
              </button>
            </>
          )}

          {/* Bottom Zoom Controls */}
          <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-md rounded-full p-2 sm:p-2.5 border border-white/20 z-50">
            <button
              onClick={handleZoomOut}
              disabled={zoomLevel <= 0.5}
              className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              title="Zoom out"
            >
              <ZoomOut size={18} className="sm:w-5 sm:h-5" />
            </button>

            <div className="px-3 sm:px-4 text-white text-xs sm:text-sm font-semibold min-w-[60px] sm:min-w-[70px] text-center">
              {Math.round(zoomLevel * 100)}%
            </div>

            <button
              onClick={handleZoomIn}
              disabled={zoomLevel >= 3}
              className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              title="Zoom in"
            >
              <ZoomIn size={18} className="sm:w-5 sm:h-5" />
            </button>

            {zoomLevel !== 1 && (
              <button
                onClick={resetZoom}
                className="ml-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full bg-blue-500/80 hover:bg-blue-600 text-white text-xs sm:text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95"
                title="Reset zoom"
              >
                Reset
              </button>
            )}
          </div>

          {/* Mobile swipe hint */}
          {allImages.length > 1 && (
            <div className="absolute bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 text-white/60 text-xs sm:text-sm text-center md:hidden">
              Swipe or use arrows to navigate
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Feed;