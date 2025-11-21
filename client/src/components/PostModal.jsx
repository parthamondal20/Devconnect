import { useState, useRef, useEffect, Suspense } from "react";
import {
  X,
  Image as ImageIcon,
  Smile,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Globe,
  MapPin,
  Hash,
  AtSign,
  Search
} from "lucide-react";

// --- MOCKS FOR PREVIEW ---
const useDispatch = () => () => { }; // Mock dispatch
const createPost = async (data) => new Promise(resolve => setTimeout(resolve, 1500)); // Mock API
const setPost = (post) => ({ type: 'SET_POST', payload: post }); // Mock action
const showSuccess = (msg) => alert(`Success: ${msg}`); // Mock toast
const showError = (msg) => alert(`Error: ${msg}`); // Mock toast

// Enhanced Mock Emoji Picker Component
const MockEmojiPicker = ({ onEmojiClick }) => {
  const [search, setSearch] = useState("");

  const emojiCategories = [
    {
      name: "Smileys & People",
      emojis: ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "🥲", "🥹", "☺️", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🥸", "🤩", "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣", "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😓", "🤗", "🤔", "🫣", "🤭", "🫢", "🫡", "🤫", "🫠", "🤥", "😶", "🫥", "😐", "😑", "😬", "🙄", "😯", "😦", "😧", "😮", "😲", "🥱", "😴", "🤤", "😪", "😵", "😵‍💫", "🫨", "🤐", "🥴", "🤢", "🤮", "🤧", "😷", "🤒", "🤕", "🤑", "🤠", "😈", "👿", "👹", "👺", "🤡", "💩", "👻", "💀", "☠️", "👽", "👾", "🤖", "🎃"]
    },
    {
      name: "Gestures & Body",
      emojis: ["👋", "🤚", "🖐", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞", "🫰", "🤟", "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "☝️", "👍", "👎", "✊", "👊", "🤛", "🤜", "👏", "🙌", "👐", "🤲", "🤝", "🙏", "🫵", "✍️", "💅", "🤳", "💪", "🦵", "🦶", "👂", "🦻", "👃", "🧠", "🫀", "🫁", "🦷", "🦴", "👀", "👁", "👅", "👄", "💋", "🩸"]
    },
    {
      name: "Animals & Nature",
      emojis: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐻‍❄️", "🐨", "🐯", "🦁", "🐮", "🐷", "🐽", "🐸", "🐵", "🙈", "🙉", "🙊", "🐒", "🐔", "🐧", "🐦", "🐤", "🐣", "🐥", "🦆", "🦅", "🦉", "🦇", "🐺", "🐗", "🐴", "🦄", "🐝", "🪱", "🐛", "🦋", "🐌", "🐞", "🐜", "🪰", "🪲", "🪳", "🦟", "🦗", "🕷", "🕸", "🦂", "🐢", "🐍", "🦎", "🦖", "🦕", "🐙", "🦑", "🦐", "🦞", "🦀", "🐡", "🐠", "🐟", "🐬", "🐳", "🐋", "🦈", "🦭", "🐊", "🐅", "🐆", "🦓", "🦍", "🦧", "🦣", "🐘", "🦛", "🦏", "🐪", "🐫", "🦒", "🦘", "🦬", "🐃", "🐂", "🐄", "🐎", "🐖", "🐏", "🐑", "🦙", "🐐", "🦌", "🐕", "🐩", "🦮", "🐕‍🦺", "🐈", "🐈‍⬛", "🪶", "🐓", "🦃", "🦤", "🦚", "🦜", "🦢", "🦩", "🕊", "🐇", "🦝", "🦨", "🦡", "🦫", "🦦", "🦥", "🐁", "🐀", "🐿", "🦔", "🐾", "🐉", "🐲", "🌵", "🎄", "🌲", "🌳", "🌴", "🪵", "🌱", "🌿", "☘️", "🍀", "🎍", "🪴", "🎋", "🍃", "🍂", "🍁", "🍄", "🌾", "💐", "🌷", "🌹", "🥀", "🌺", "🌸", "🌼", "🌻", "🌞", "🌝", "🌛", "🌜", "🌚", "🌕", "🌖", "🌗", "🌘", "🌑"]
    },
    {
      name: "Food & Drink",
      emojis: ["🍏", "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🫐", "🍈", "🍒", "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🍆", "🥑", "🥦", "🥬", "🥒", "🌶", "🫑", "🌽", "🥕", "🫒", "🧄", "🧅", "🥔", "🍠", "🥐", "🥯", "🍞", "🥖", "🥨", "🧀", "🥚", "🍳", "🧈", "🥞", "🧇", "🥓", "🥩", "🍗", "🍖", "🦴", "🌭", "🍔", "🍟", "🍕", "🫓", "🥪", "🥙", "🧆", "🌮", "🌯", "🫔", "🥗", "🥘", "🫕", "🥫", "🍝", "🍜", "🍲", "🍛", "🍣", "🍱", "🥟", "🦪", "🍤", "🍙", "🍚", "🍘", "🍥", "🥠", "🥮", "🍢", "🍡", "🍧", "🍨", "🍦", "🥧", "🧁", "🍰", "🎂", "🍮", "🍭", "🍬", "🍫", "🍿", "🍩", "🍪", "🌰", "🥜", "🍯", "🥛", "🍼", "🫖", "☕️", "🍵", "🧃", "🥤", "🧋", "🍶", "🍺", "🍻", "🥂", "🍷", "🥃", "🍸", "🍹", "🧉", "🍾", "🧊"]
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl w-80 flex flex-col h-96 overflow-hidden ring-1 ring-black/5">
      {/* Search Bar */}
      <div className="p-3 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-20">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input
            type="text"
            placeholder="Search emojis..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-gray-500"
          />
        </div>
      </div>

      {/* Scrollable Emoji Area */}
      <div className="flex-1 overflow-y-auto p-2 custom-scrollbar scroll-smooth">
        {emojiCategories.map((category) => {
          const filteredEmojis = category.emojis.filter(e => !search || true); // Simple placeholder filter logic

          if (filteredEmojis.length === 0) return null;

          return (
            <div key={category.name} className="mb-4">
              <h3 className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-2 sticky top-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm py-1.5 z-10">
                {category.name}
              </h3>
              <div className="grid grid-cols-7 gap-1">
                {filteredEmojis.map((emoji, idx) => (
                  <button
                    key={`${emoji}-${idx}`}
                    onClick={() => onEmojiClick({ emoji })}
                    className="text-xl hover:bg-gray-100 dark:hover:bg-gray-800 p-1.5 rounded-lg transition-transform active:scale-90 cursor-pointer flex items-center justify-center aspect-square"
                    title={emoji}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )
        })}

        {/* Bottom spacer for scroll comfort */}
        <div className="h-2"></div>
      </div>
    </div>
  );
};
// -------------------------

const PostModal = ({ isOpen = true, onClose, user }) => {
  const dispatch = useDispatch();

  // Default user for preview if not provided
  const currentUser = user || {
    username: "Alex Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
  };

  const [selectedImages, setSelectedImages] = useState([]);
  const [text, setText] = useState("");
  const [previewIndex, setPreviewIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const emojiRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [text]);

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

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setSelectedImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index, e) => {
    e?.stopPropagation();
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    if (previewIndex === index) setPreviewIndex(null);
  };

  const handlePostBtn = async () => {
    if (!text.trim() && selectedImages.length === 0) return;

    const formData = new FormData();
    formData.append("about", text);
    selectedImages.forEach((img) => formData.append("images", img.file));

    try {
      setLoading(true);
      const newPost = await createPost(formData);

      dispatch(setPost(newPost));
      showSuccess("Post created successfully");

      // Reset state
      setSelectedImages([]);
      setText("");
      if (onClose) onClose();

    } catch (err) {
      showError(err.response?.data?.message || "Failed to create post");
      console.error("Error posting:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-md p-4 animate-in fade-in duration-300">

      {/* Main Card */}
      <div className="bg-white dark:bg-black rounded-3xl shadow-2xl w-full max-w-[600px] overflow-hidden flex flex-col max-h-[90vh] border border-gray-200 dark:border-gray-800 transition-all">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="p-1 rounded-full border-2 border-blue-100 dark:border-blue-900/30">
              <img
                src={currentUser?.avatar}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-gray-900 dark:text-white text-sm tracking-tight">
                {currentUser?.username}
              </span>
              <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-medium cursor-pointer hover:underline">
                <Globe size={10} />
                <span>Everyone can reply</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-500 dark:text-gray-400"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-transparent text-xl leading-relaxed text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none resize-none min-h-[120px]"
            placeholder="What is happening?!"
            autoFocus
          />

          {/* Dynamic Image Grid */}
          {selectedImages.length > 0 && (
            <div className={`mt-6 grid gap-3 rounded-2xl overflow-hidden ${selectedImages.length === 1 ? 'grid-cols-1' :
              selectedImages.length === 2 ? 'grid-cols-2' : 'grid-cols-2'
              }`}>
              {selectedImages.map((img, index) => (
                <div
                  key={index}
                  className={`relative group bg-gray-100 dark:bg-gray-900 ${selectedImages.length === 3 && index === 0 ? 'row-span-2 h-full' : 'aspect-[4/3]'
                    }`}
                >
                  <img
                    src={img.preview}
                    alt={`preview-${index}`}
                    className="w-full h-full object-cover cursor-zoom-in transition-transform duration-500 group-hover:scale-105"
                    onClick={() => setPreviewIndex(index)}
                  />

                  {/* Image Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <button
                    onClick={(e) => removeImage(index, e)}
                    className="absolute top-3 right-3 bg-white/90 text-red-500 p-2 rounded-full shadow-sm hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-200"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Toolbar & Footer */}
        <div className="px-6 py-4 bg-white dark:bg-black z-10">
          {/* Divider */}
          <div className="h-px w-full bg-gray-100 dark:bg-gray-800 mb-4" />

          <div className="flex items-center justify-between">
            {/* Tools */}
            <div className="flex items-center gap-1 -ml-2">
              <ActionIcon
                icon={<ImageIcon size={20} />}
                color="text-blue-500"
                label="Media"
                isInput
                onChange={handleImageChange}
              />

              <div className="relative" ref={emojiRef}>
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className={`p-2.5 rounded-full transition-colors relative group ${showEmojiPicker
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                    : "text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    }`}
                >
                  <Smile size={20} />
                </button>

                {/* Emoji Picker Popover - Now fully featured */}
                {showEmojiPicker && (
                  <div className="absolute bottom-12 left-0 z-50 animate-in zoom-in-95 duration-150 origin-bottom-left">
                    <MockEmojiPicker
                      onEmojiClick={(emojiData) => {
                        setText((prev) => prev + emojiData.emoji);
                      }}
                    />
                  </div>
                )}
              </div>

              <ActionIcon icon={<Hash size={20} />} color="text-blue-500" />
              <ActionIcon icon={<AtSign size={20} />} color="text-blue-500" />
              <ActionIcon icon={<MapPin size={20} />} color="text-blue-500" disabled />
            </div>

            {/* Post Button */}
            <div className="flex items-center gap-4">
              {text.length > 0 && (
                <span className={`text-xs font-medium ${text.length > 280 ? 'text-red-500' : 'text-gray-400'
                  }`}>
                  {text.length}/280
                </span>
              )}
              <button
                onClick={handlePostBtn}
                disabled={(!text.trim() && selectedImages.length === 0) || loading}
                className="px-6 py-2.5 rounded-full font-bold text-sm bg-blue-500 hover:bg-blue-600 active:scale-95 text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Preview */}
      {previewIndex !== null && (
        <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl flex flex-col animate-in fade-in duration-200">
          <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10">
            <button
              onClick={() => setPreviewIndex(null)}
              className="p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition backdrop-blur-md border border-white/10"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center p-4 relative">
            {selectedImages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewIndex(prev => prev === 0 ? selectedImages.length - 1 : prev - 1);
                }}
                className="absolute left-6 p-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition backdrop-blur-md border border-white/10 hover:scale-110 active:scale-95"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            <img
              src={selectedImages[previewIndex]?.preview}
              alt="fullscreen"
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
            />

            {selectedImages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewIndex(prev => (prev + 1) % selectedImages.length);
                }}
                className="absolute right-6 p-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition backdrop-blur-md border border-white/10 hover:scale-110 active:scale-95"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Component for Toolbar Icons
const ActionIcon = ({ icon, color, isInput, onChange, disabled }) => {
  const content = (
    <div className={`p-2.5 rounded-full transition-colors ${disabled ? 'text-gray-300 dark:text-gray-700 cursor-not-allowed' : `${color} hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer`
      }`}>
      {icon}
    </div>
  );

  if (isInput) {
    return (
      <label>
        {content}
        <input type="file" accept="image/*" multiple onChange={onChange} className="hidden" />
      </label>
    )
  }

  return content;
}

export default PostModal;