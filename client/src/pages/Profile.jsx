import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  User, Code, Users, FolderGit2, Edit2, X, LogOut,
  Camera, MapPin, Calendar, Link2, Heart, MessageCircle,
  Share2, Briefcase
} from "lucide-react";
import Loader from "../components/Loader";
import { logout } from "../services/auth";
import { showError, showSuccess } from "../utils/toast";
import { setUser, clearUser } from "../features/authSlice";
import { useNavigate, useParams } from "react-router-dom";
import { editProfile, uploadAvatar } from "../services/user";
import { getUserProfile, followUser, getFollowers, getFollowing } from "../services/user";
import { createConversation } from "../services/message";
import FollowerModal from "../components/FollowModel";
import ImageCarousel from "../components/ImageCarousel";
import SmallSpinner from "../components/SmallLoader";
import { toast } from "react-hot-toast";
import ConfirmModal from "../components/ConfirmModal";
const ALL_SKILLS = [
  "React", "Node.js", "Express", "MongoDB", "Tailwind", "TypeScript",
  "Docker", "Git", "Next.js", "Python", "C++", "Firebase", "GraphQL",
  "Java", "Redux", "PostgreSQL", "AWS"
];

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const { user_id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { dark } = useSelector(state => state.theme);
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("");
  const [about, setAbout] = useState("");
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("loading...");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [profileUser, setProfileUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [showFollowers, setShowFollowers] = useState(false);
  const [followersList, setFollowersList] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const toggleSkill = (skill) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setMessage("Fetching user profile...");
      const res = await getUserProfile(user_id);
      setProfileUser(res);
      setBio(res?.bio || "");
      setAbout(res?.about || "");
      setSkills(res?.skills || ["React", "Node.js"]); // Assuming backend returns skills, else default
      setAvatarPreview(res?.avatar || "");
      setIsFollowing(res?.isFollowing || false);
      setFollowersCount(res?.followers?.length || 0);
      setUsername(res?.username || "");
    } catch (error) {
      console.log(error);
      showError("Failed to fetch user profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!profileUser || profileUser._id !== user_id) {
      fetchUserProfile();
    } else {
      // If navigating to own profile from another profile
      setBio(profileUser?.bio || "");
      setAbout(profileUser?.about || "");
      setAvatarPreview(profileUser?.avatar || "");
    }
  }, [user_id]);

  const handleSave = async () => {
    console.log({ bio, about, skills });
    const loadingToast = toast.loading("Saving profile Info..");
    const payload = {
      username,
      bio,
      about,
      skills
    }
    try {
      await editProfile(payload);
      toast.dismiss(loadingToast);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log(error);
    } finally {
      toast.dismiss(loadingToast);
      setIsEditing(false);
    }
  };

  const showFollowersList = async () => {
    const loadingToast = toast.loading("loading...");
    try {
      const followers = await getFollowers();
      toast.dismiss(loadingToast);
      setShowFollowers(true);
      setFollowersList(followers);
    } catch (error) {
      console.log(error);
      toast.error("Network error!");
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const showFollowingList = async () => {
    const loadingToast = toast.loading("loading...");
    try {

      const following = await getFollowing();
      toast.dismiss(loadingToast);
      setShowFollowers(true);
      setFollowersList(following);
    } catch (error) {
      console.log(error);
      toast.error("Network error!");
    } finally {
      toast.dismiss(loadingToast);
    }
  }
  const navigateChatRoom = async () => {
    setLoading(true);
    try {
      if (!profileUser.conversation_id) {
        const res = await createConversation([user._id, profileUser._id]);
        profileUser.conversation_id = res._id;
      }
      console.log(profileUser);
      navigate(`/chat/${profileUser.conversation_id}`, {
        state: { currentUser: profileUser }
      });
    } catch (error) {
      console.log(error);
      showError("Failed to start chat");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout(user._id);
      showSuccess("Logged out successfully");
      dispatch(clearUser());
      navigate("/signin", { replace: true });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (file) => {
    try {
      // setLoading(true);
      setMessage("Uploading profile picture...");
      const formData = new FormData();
      formData.append("file", file);
      const res = await toast.promise(
        uploadAvatar(formData),
        {
          loading: "Uploading...",
          success: "Profile picture uploaded",
          error: "Upload failed"
        }
      )
      dispatch(setUser(res));
      setAvatarPreview(res.avatar); // Update local preview immediately
    } catch (error) {
      toast.error(error?.response?.data?.error?.message || "Upload failed");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      setIsProcessing(true);
      setMessage("Updating follow status...");
      await followUser(profileUser._id);
      toast.success(isFollowing ? "Unfollowed user" : "Followed user");
      setFollowersCount((prev) => (isFollowing ? prev - 1 : prev + 1));
      setIsFollowing((prev) => !prev);
    } catch (error) {
      showError("Failed to update follow status");
      console.log(error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading || !profileUser) {
    return <Loader message={message} loading={loading} />;
  }

  const isOwnProfile = profileUser._id === user._id;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#09090b] transition-colors duration-300">

      {/* --- 1. Cover Image --- */}
      <div className="h-48 md:h-64 lg:h-80 w-full relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 animate-gradient-xy"></div>
        {/* Optional: Add actual cover image here if available */}
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all duration-500"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">

        {/* --- 2. Profile Header --- */}
        <div className="relative -mt-16 md:-mt-24 mb-6">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 md:p-8">

            <div className="flex flex-col md:flex-row items-center md:items-end gap-6">

              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1.5 bg-white dark:bg-gray-900 ring-1 ring-gray-200 dark:ring-gray-700">
                  <img
                    src={avatarPreview}
                    alt="avatar"
                    className="w-full h-full rounded-full object-cover bg-gray-100 dark:bg-gray-800 cursor-pointer hover:opacity-90 transition"
                    onClick={() => setIsAvatarModalOpen(true)}
                  />
                </div>
                {isOwnProfile && (
                  <label className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-full cursor-pointer shadow-lg transition-transform hover:scale-105">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files[0] && handleAvatarUpload(e.target.files[0])}
                    />
                    <Camera className="w-5 h-5" />
                  </label>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left space-y-2 md:space-y-1 w-full">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div>
                    <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white">
                      {username || "Dev User"}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">
                      @{username?.replace(/\s/g, '').toLowerCase()}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 mt-3 md:mt-2 max-w-2xl mx-auto md:mx-0 leading-relaxed">
                      {bio || "No bio added yet."}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap justify-center md:justify-end gap-3 w-full md:w-auto mt-2 md:mt-0">
                    {isOwnProfile ? (
                      <>
                        <button
                          onClick={() => setIsEditing(true)}
                          className="flex-1 md:flex-none items-center justify-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm text-sm"
                        >
                          <span className="flex items-center gap-2"><Edit2 size={16} /> Edit</span>
                        </button>
                        <button
                          onClick={() => setShowLogoutConfirm(true)}
                          className="flex-1 md:flex-none items-center justify-center gap-2 px-5 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl font-semibold hover:bg-red-100 dark:hover:bg-red-900/30 transition text-sm"
                        >
                          <span className="flex items-center gap-2"><LogOut size={16} /> Logout</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={handleFollow}
                          disabled={isProcessing} // Disable button while loading
                          className={`flex items-center justify-center flex-1 md:flex-none px-6 py-2.5 rounded-xl font-semibold shadow-sm transition-all text-sm ${isFollowing
                            ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700"
                            : "bg-blue-600 text-white hover:bg-blue-700 border border-transparent"
                            }`}
                        >
                          {isProcessing ? (
                            // Renders the spinner and hides text while processing
                            <SmallSpinner dark={dark || !isFollowing} />
                          ) : (
                            // Renders the text when not processing
                            isFollowing ? "Following" : "Follow"
                          )}
                        </button>
                        <button
                          onClick={navigateChatRoom}
                          className="flex-1 md:flex-none px-6 py-2.5 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 hover:border-blue-500 transition shadow-sm font-semibold text-sm"
                        >
                          Message
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Meta Data */}
                <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6 pt-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={16} className="shrink-0" />
                    <span>San Francisco, CA</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Briefcase size={16} className="shrink-0" />
                    <span>Full Stack Developer</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={16} className="shrink-0" />
                    <span>Joined March 2024</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Link2 size={16} className="shrink-0" />
                    <a href="#" className="text-blue-600 hover:underline truncate max-w-[150px]">portfolio.dev</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- 3. Main Content Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Rail: Stats & Details (Desktop: col-span-4, Mobile: Top) */}
          <div className="lg:col-span-4 space-y-6">

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div onClick={showFollowersList} className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 cursor-pointer hover:border-blue-500/50 transition group">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{followersCount}</p>
                    <p className="text-xs text-gray-500 mt-1">Followers</p>
                  </div>
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 group-hover:scale-110 transition">
                    <Users size={18} />
                  </div>
                </div>
              </div>

              <div onClick={showFollowingList} className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 cursor-pointer dark:border-gray-800">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{profileUser.following?.length || 0}</p>
                    <p className="text-xs text-gray-500 mt-1">Following</p>
                  </div>
                  <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600">
                    <Users size={18} />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{profileUser.posts?.length || 0}</p>
                    <p className="text-xs text-gray-500 mt-1">Posts</p>
                  </div>
                  <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600">
                    <Code size={18} />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 cursor-pointer hover:border-yellow-500/50 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">8</p>
                    <p className="text-xs text-gray-500 mt-1">Projects</p>
                  </div>
                  <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-yellow-600">
                    <FolderGit2 size={18} />
                  </div>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 md:p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <User size={20} className="text-blue-500" /> About
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                {about || "I'm a passionate developer who loves building full-stack web applications using the MERN stack."}
              </p>
            </div>

            {/* Skills Section */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 md:p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Code size={20} className="text-purple-500" /> Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.length > 0 ? skills.map((skill) => (
                  <span key={skill} className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-700">
                    {skill}
                  </span>
                )) : <p className="text-sm text-gray-500">No skills listed.</p>}
              </div>
            </div>
          </div>

          {/* Right Rail: Posts Feed (Desktop: col-span-8) */}
          <div className="lg:col-span-8 space-y-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white px-1">Recent Activity</h3>

            {!profileUser.posts?.length ? (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
                <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No posts yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">When {profileUser.username} posts something, it will show up here.</p>
              </div>
            ) : (
              profileUser.posts.map((post) => (
                <div key={post._id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm hover:shadow-md transition-shadow">
                  {/* Post Header */}
                  <div className="flex gap-4 mb-4">
                    <img
                      src={profileUser.avatar}
                      alt="avatar"
                      className="w-10 h-10 rounded-full object-cover bg-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white truncate">{profileUser.username}</h4>
                          <p className="text-xs text-gray-500">
                            {new Date(post.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="mb-4">
                    {post.about && (
                      <p className="text-gray-800 dark:text-gray-200 text-[15px] leading-relaxed mb-3 whitespace-pre-wrap">
                        {post.about}
                      </p>
                    )}

                    {/* Image Grid */}
                    {post.images?.length > 0 && (
                      <div className={`grid gap-2 rounded-xl overflow-hidden ${post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
                        }`}>
                        {post.images.slice(0, 4).map((img, idx) => (
                          <div key={idx} className={`relative ${post.images.length === 1 ? 'aspect-video' : 'aspect-square'}`}>
                            <img
                              src={img.url}
                              alt="post content"
                              className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Post Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex gap-6">
                      <button className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-red-500 transition text-sm">
                        <Heart size={18} /> <span>{post.likesCount || 0}</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 transition text-sm">
                        <MessageCircle size={18} /> <span>{post.commentsCount || 0}</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-green-500 transition text-sm">
                        <Share2 size={18} /> <span>{post.shareCount || 0}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* --- Modals --- */}

      {/* 1. Follower Modal */}
      <FollowerModal
        isOpen={showFollowers}
        onClose={() => setShowFollowers(false)}
        followers={followersList}
      />

      {/* 2. Avatar Fullscreen Modal */}
      {isAvatarModalOpen && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsAvatarModalOpen(false)}
        >
          <button className="absolute top-4 right-4 text-white/70 hover:text-white">
            <X size={32} />
          </button>
          <img
            src={avatarPreview}
            alt="Fullscreen Avatar"
            className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* 3. Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-gray-200 dark:border-gray-800">

            {/* Header */}
            <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Profile</h2>
              <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X size={24} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-5 overflow-y-auto space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-white"
                  placeholder="Username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
                <input
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-white"
                  placeholder="Short bio..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">About</label>
                <textarea
                  rows={4}
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-white resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Skills</label>
                <div className="flex flex-wrap gap-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 max-h-48 overflow-y-auto">
                  {ALL_SKILLS.map(skill => (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${skills.includes(skill)
                        ? "bg-blue-600 text-white"
                        : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-medium shadow-lg shadow-blue-600/30 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Logout Confirmation"
        message="Are you sure you want to logout? You will need to sign in again to access your account."
      />
    </div>
  );
};

export default Profile;