import { useState, useEffect, useCallback } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Download,
  ImagePlus,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import PostModal from "../components/PostModal";
import { getPosts, deletePost } from "../services/post";
import { setPost } from "../features/postSlice";
import Loader from "../components/Loader";
import Slider from "react-slick";
import ImageCarousel from "../components/ImageCarousel";
import { likeRequest } from "../services/like";
import debounce from "lodash/debounce";
const Feed = () => {
  const [posts, setPosts] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const { post } = useSelector((state) => state.post);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const [openPostModal, setOpenPostModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("loading..");
  const [animate, setAnimate] = useState(false);
  // Add new post to feed
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(post.likes.includes(user?._id));
  // Fetch all posts initially

  const sendLikeRequest = useCallback(
    debounce(async (postId) => {
      try {
        const res = await likeRequest(postId);
        setLikes(res);
        // setLiked(res.data.liked);
      } catch (err) {
        console.error(err);
      }
    }, 300), // 300ms debounce
    []
  );

  const handleLike = (post_id) => {
    // Optimistic UI update
    setLiked(!liked);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));

    // Send debounced request
    sendLikeRequest(post_id);
    if (!liked) {
      // Trigger pop animation
      setAnimate(true);
      setTimeout(() => setAnimate(false), 300);
    }
  };


  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await getPosts();
        setPosts(res);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [post]);

  // Delete post
  const handleDelete = async (postId) => {
    try {
      setLoading(true);
      setMessage("deleting post...");
      await deletePost(postId);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      console.error("Failed to delete post:", err);
    } finally {
      setLoading(false);
    }
  };

  // Download image
  const handleDownload = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = "image";
    link.click();
  };
  if (loading) {
    return <Loader message={message} loading={loading} />
  }
  const heartClass = liked
    ? 'text-red-500 fill-red-500 animate-pulseHeart'
    : 'text-gray-400';
  return (
    <div className="max-w-2xl mx-auto mt-6 p-4 space-y-6">
      {/* Create Post Section */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
        <div className="flex gap-3 mb-4">
          <img
            src={user?.avatar}
            onClick={() => navigate("/profile")}
            alt="avatar"
            className="w-14 h-14 rounded-full border border-gray-300 dark:border-gray-700 cursor-pointer"
          />
          <textarea
            onClick={() => setOpenPostModal(true)}
            placeholder="Start a post..."
            className="w-full bg-gray-100 dark:bg-gray-800 rounded-xl p-3 text-gray-900 dark:text-gray-100 resize-none outline-none placeholder-gray-400"
            rows={2}
          />
        </div>
        <div className="flex justify-between items-center">
          <label className="flex items-center gap-2 cursor-pointer text-blue-500 hover:text-blue-600">
            <ImagePlus size={18} />
            <span className="text-sm font-medium">Photo</span>
            <input type="file" accept="image/*" className="hidden" />
          </label>
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
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 relative"
        >
          {/* Header */}
          <div className="flex justify-between items-start p-5">
            <div className="flex gap-3">
              <img
                src={postItem.user?.avatar}
                alt="avatar"
                className="w-12 h-12 rounded-full border border-gray-300 dark:border-gray-700"
              />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {postItem.user?.username}
                </h3>
                <p className="text-sm text-gray-500">@{postItem.user?.username}</p>
              </div>
            </div>
            {user?._id === postItem.user?._id && (
              <button
                onClick={() => handleFollow(postItem.user?._id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border
              ${user?.following.includes(postItem.user?._id)
                    ? "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 border-gray-400"
                    : "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                  }`}
              >
                {user?.following.includes(postItem.user?._id) ? "Following" : "Follow"}
              </button>
            )}
            {/* Three Dots Menu */}
            <div className="relative">
              <button
                className="text-gray-400 hover:text-gray-600"
                onClick={() =>
                  setMenuOpen(menuOpen === postItem._id ? null : postItem._id)
                }
              >
                <MoreHorizontal size={20} />
              </button>

              {menuOpen === postItem._id && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md z-20">
                  {postItem.user?._id === user?._id && (
                    <button
                      onClick={() => handleDelete(postItem._id)}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Delete
                    </button>
                  )}
                  {postItem.images?.length > 0 && (
                    <button
                      onClick={() => handleDownload(postItem.images[0].url)}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Download size={16} /> Download
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="px-5 pb-4">
            <p className="text-gray-800 dark:text-gray-200 text-[15px] leading-relaxed">
              {postItem.about}
            </p>

            {postItem.images && postItem.images.length > 0 && (
              <div className="mt-4">
                {postItem.images.length === 1 ? (
                  // --- SINGLE IMAGE (Full width) ---
                  <div
                    className="overflow-hidden rounded-xl cursor-pointer group"
                    onClick={() => setSelectedImage(postItem.images[0].url)}
                  >
                    <img
                      src={postItem.images[0].url}
                      alt="post"
                      className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    />
                  </div>
                ) : (
                  // --- MULTIPLE IMAGES (Carousel / Slider) ---
                  <div className="w-full aspect-[16/9]">
                    <ImageCarousel
                      images={postItem.images}
                      onImageClick={(url) => setSelectedImage(url)}
                      className="rounded-xl"
                    />
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="flex justify-between items-center px-5 py-3 border-t border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 text-sm">
            <span>{new Date(postItem.createdAt).toLocaleString()}</span>
            <div className="flex gap-6">
              <button
                onClick={() => handleLike(postItem._id)}
                className={`flex items-center gap-1 p-2 transition-colors duration-200 ${postItem.likes.includes(user?._id) || liked ?
                  'text-red-500 fill-red-500 animate-pulseHeart'
                  : 'text-gray-400'}`}>
                <Heart size={18} /> <span>{postItem.likes?.length || likes}</span> </button>
              <button className="flex items-center gap-1 hover:text-blue-500 transition">
                <MessageCircle size={18} />
                <span>{postItem.comments?.length || 0}</span>
              </button>
              <button className="flex items-center gap-1 hover:text-green-500 transition">
                <Share2 size={18} />
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Fullscreen Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex justify-center items-center bg-black/70 backdrop-blur-md transition-opacity duration-300"
          onClick={(e) => {
            // Close only if clicked outside the image
            if (e.target === e.currentTarget) setSelectedImage(null);
          }}
        >
          <img
            src={selectedImage}
            alt="fullscreen"
            className="max-w-[90%] max-h-[90%] rounded-2xl shadow-2xl transition-transform duration-300 transform hover:scale-105 cursor-zoom-out"
          />
        </div>
      )}

    </div>
  );
};

export default Feed;
