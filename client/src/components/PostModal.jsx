import {
  X,
  Image,
  Smile,
  Calendar,
  Settings,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { createPost } from "../services/post";
import Loader from "../components/Loader";
import { showSuccess, showError } from "../utils/toast.js";
import { useDispatch } from "react-redux";
import { setPost } from "../features/postSlice.js";
import React, { useState, useRef, useEffect, lazy, Suspense } from "react";
const EmojiPicker = lazy(() => import("emoji-picker-react"));

const PostModal = ({ isOpen, onClose, user }) => {
  if (!isOpen) return null;
  const [selectedImages, setSelectedImages] = useState([]);
  const [text, setText] = useState("");
  const [previewIndex, setPreviewIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Loading! Please wait...");
  const dispatch = useDispatch();
  const emojiRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Handle selecting multiple images
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setSelectedImages((prev) => [...prev, ...newImages]);
  };

  // Remove one image
  const removeImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    if (previewIndex === index) setPreviewIndex(null);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle post creation
  const handlePostBtn = async () => {
    const formData = new FormData();
    formData.append("about", text);
    selectedImages.forEach((img) => formData.append("images", img.file));

    try {
      setLoading(true);
      setMessage("Creating post..");
      const newPost = await createPost(formData);
      onClose();
      dispatch(setPost(newPost));
      setSelectedImages([]);
      setText("");
      showSuccess("Post created");
    } catch (err) {
      showError(err.response?.data?.message);
      console.error("Error posting:", err);
    } finally {
      setLoading(false);
    }
  };

  // Navigate fullscreen preview
  const nextImage = () => {
    if (previewIndex !== null)
      setPreviewIndex((prev) => (prev + 1) % selectedImages.length);
  };
  const prevImage = () => {
    if (previewIndex !== null)
      setPreviewIndex((prev) =>
        prev === 0 ? selectedImages.length - 1 : prev - 1
      );
  };

  if (loading) {
    return <Loader message={message} loading={loading} />;
  }

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        {/* Expanded width + taller modal */}
        <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-[700px] max-w-[95%] max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-300 dark:border-gray-700 px-5 py-4">
            <div className="flex items-center gap-3">
              <img
                src={user?.avatar}
                alt="avatar"
                className="w-14 h-14 rounded-full border border-gray-300 dark:border-gray-700"
              />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                  {user?.username}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Post to Anyone
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
            >
              <X size={22} />
            </button>
          </div>

          {/* Textarea */}
          <div className="p-5">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full min-h-[140px] resize-none outline-none bg-transparent text-gray-800 dark:text-gray-200 placeholder-gray-400 text-base"
              placeholder="What do you want to talk about?"
            />
          </div>

          {/* Image Preview Grid */}
          {selectedImages.length > 0 && (
            <div
              className={`p-5 grid gap-3 ${selectedImages.length === 1
                  ? "grid-cols-1"
                  : selectedImages.length === 2
                    ? "grid-cols-2"
                    : selectedImages.length === 3
                      ? "grid-cols-3"
                      : "grid-cols-3 sm:grid-cols-4"
                }`}
            >
              {selectedImages.map((img, index) => (
                <div
                  key={index}
                  className="relative group aspect-square overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700"
                >
                  <img
                    src={img.preview}
                    alt={`selected-${index}`}
                    className="w-full h-full object-cover cursor-pointer transition-transform duration-200 group-hover:scale-105"
                    onClick={() => setPreviewIndex(index)}
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Bottom Actions */}
          <div className="flex items-center justify-between border-t border-gray-300 dark:border-gray-700 px-5 py-4">
            <div className="flex items-center gap-5 text-gray-500 dark:text-gray-400">
              <label className="cursor-pointer">
                <Image size={22} />
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {/* Emoji button */}
              <button
                type="button"
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                className="hover:text-yellow-500 transition"
              >
                <Smile size={22} />
              </button>

              <button>
                <Calendar size={22} />
              </button>
              <button>
                <Settings size={22} />
              </button>
              <button>
                <Plus size={22} />
              </button>
            </div>

            <button
              onClick={handlePostBtn}
              disabled={!text && selectedImages.length === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium disabled:opacity-50"
            >
              Post
            </button>
          </div>
        </div>

        {/* Emoji Picker positioned on right side */}
        {showEmojiPicker && (
          <div
            ref={emojiRef}
            className="absolute right-[12%] top-1/2 -translate-y-1/2 z-[60]"
          >
            <Suspense fallback={<div className="text-gray-500">Loading...</div>}>
              <EmojiPicker
                onEmojiClick={(emojiData) =>
                  setText((prev) => prev + emojiData.emoji)
                }
                theme={
                  document.documentElement.classList.contains("dark")
                    ? "dark"
                    : "light"
                }
              />
            </Suspense>
          </div>
        )}
      </div>

      {/* Fullscreen Image Viewer */}
      {previewIndex !== null && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90">
          <img
            src={selectedImages[previewIndex]?.preview}
            alt="preview"
            className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
          />
          <button
            onClick={() => setPreviewIndex(null)}
            className="absolute top-6 right-6 bg-black/60 text-white p-2 rounded-full hover:bg-black/80"
          >
            <X size={24} />
          </button>

          {selectedImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-6 text-white bg-black/50 p-3 rounded-full hover:bg-black/70"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-6 text-white bg-black/50 p-3 rounded-full hover:bg-black/70"
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}

          <button
            onClick={() => removeImage(previewIndex)}
            className="absolute bottom-8 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full"
          >
            Delete This Photo
          </button>
        </div>
      )}
    </>
  );
};

export default PostModal;
