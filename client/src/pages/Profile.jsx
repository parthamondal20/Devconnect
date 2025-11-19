import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { User, Code, Users, FolderGit2, Edit2, X, LogOut } from "lucide-react";
import Loader from "../components/Loader";
import { logout } from "../services/auth";
import { showError, showSuccess } from "../utils/toast";
import { setUser, clearUser } from "../features/authSlice";
import { useNavigate, useParams } from "react-router-dom";
import { uploadAvatar } from "../services/user";
import { getUserProfile, followUser } from "../services/user";
import { createConversation } from "../services/message";
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
    const [isEditing, setIsEditing] = useState(false);
    const [bio, setBio] = useState(user?.bio || "");
    const [about, setAbout] = useState(user?.about || "");
    const [skills, setSkills] = useState(["React", "Node.js", "MongoDB"]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("loading...");
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    const [profileUser, setProfileUser] = useState(user._id === user_id ? user : null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followersCount, setFollowersCount] = useState(0);
    const toggleSkill = (skill) => {
        setSkills((prev) =>
            prev.includes(skill)
                ? prev.filter((s) => s !== skill)
                : [...prev, skill]
        );
    };
    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            setMessage("Fetching user profile...");
            const res = await getUserProfile(user_id);
            console.log(res);
            setProfileUser(res);
            setBio(res?.bio || "");
            setAbout(res?.about || "");
            setAvatarPreview(res?.avatar || "");
            setIsFollowing(res?.isFollowing || false);
            setFollowersCount(res?.followers?.length || 0);
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
            setBio(profileUser?.bio || "");
            setAbout(profileUser?.about || "");
            setAvatarPreview(profileUser?.avatar || "");
        }
    }, [user_id]);
    const handleSave = () => {
        // here you'd send PUT request to backend (example)
        console.log({
            bio,
            about,
            skills,
        });
        setIsEditing(false);
    };

    const navigateChatRoom = async () => {
        setLoading(true);
        try {
            if (!profileUser.conversation_id) {
                const res = await createConversation([user._id, profileUser._id]);
                profileUser.conversation_id = res._id;
            }
            navigate(`/chat/${profileUser.conversation_id}`, {
                state: { currentUser: profileUser }
            });
        } catch (error) {
            console.log(error);
            showError("Failed to start chat");
        } finally {
            setLoading(false);
        }
    }

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
    }
    const handleAvatarUpload = async (file) => {
        try {
            setLoading(true);
            setMessage("Uploading profile picture...")
            const formData = new FormData();
            formData.append("file", file);
            const res = await uploadAvatar(formData);
            dispatch(setUser(res));
            showSuccess("Profile picture updated successfully");
            // setAvatarPreview(res.avatar);
        } catch (error) {
            showError(error?.response?.error?.message);
            console.log(error);
        } finally {
            setLoading(false);
        }
    }
    if (loading || !profileUser) {
        return <Loader message={message} loading={loading} />
    }
    const handleFollow = async () => {
        try {
            setLoading(true);
            setMessage("Following user...");
            await followUser(profileUser._id);
            showSuccess("Followed user successfully");
            if (isFollowing) {
                setFollowersCount(prev => prev - 1);
            } else {
                setFollowersCount(prev => prev + 1);
            }
            setIsFollowing(prev => !prev);
        } catch (error) {
            showError("Failed to follow user");
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-[#0d1117] text-gray-800 dark:text-gray-200 transition-colors duration-300">
            <div className="max-w-5xl mx-auto px-4 py-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md">
                    <div className="flex items-center gap-6">
                        <div className="relative w-28 h-28">
                            <img
                                src={avatarPreview}
                                alt="avatar"
                                className="w-28 h-28 rounded-full object-cover border-4 border-blue-500 cursor-pointer"
                                onClick={() => setIsAvatarModalOpen(true)}
                            />
                            {/* Camera button */}
                            {profileUser._id === user._id && <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-1 rounded-full cursor-pointer border-2 border-white dark:border-gray-900">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            // Optional: handle file upload to Cloudinary or backend
                                            const reader = new FileReader();
                                            reader.onload = () => setAvatarPreview(reader.result); // preview
                                            reader.readAsDataURL(file);
                                            handleAvatarUpload(file); // upload immediately

                                        }
                                    }}
                                />
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3 7h2l3-3h8l3 3h2v14H3V7z"
                                    />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 11a3 3 0 100 6 3 3 0 000-6z" />
                                </svg>
                            </label>}
                        </div>
                        {isAvatarModalOpen && (
                            <div
                                className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
                                onClick={() => setIsAvatarModalOpen(false)}
                            >
                                <img
                                    src={avatarPreview}
                                    alt="avatar zoom"
                                    className="
        rounded-lg shadow-lg
        w-[90vw] max-w-[600px]  
        h-auto max-h-[80vh]     
        object-contain
      "
                                    onClick={(e) => e.stopPropagation()} // prevent closing when clicking the image
                                />
                            </div>
                        )}
                        <div>
                            <h1 className="text-2xl font-bold">{profileUser?.username || "Dev User"}</h1>
                            <p className="text-gray-500 dark:text-gray-400">@{profileUser?.email || "email@example.com"}</p>
                            <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-md">
                                {bio || "Building, breaking, and fixing code. Passionate about open source and web development."}
                            </p>
                        </div>
                    </div>
                    {profileUser._id === user._id && <div className="flex gap-3 mt-4 md:mt-0">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                        >
                            <Edit2 className="w-4 h-4" /> Edit Profile
                        </button>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                        >
                            <LogOut className="w-4 h-4" /> Logout
                        </button>
                    </div>}
                </div>
                {
                    user._id !== profileUser._id && <div className="mt-6 flex justify-center gap-6">
                        <button
                            onClick={handleFollow}
                            disabled={loading}
                            className={`px-6 py-2.5 rounded-2xl w-full  text-white  shadow-md hover:shadow-lg transition-all active:scale-95 ${isFollowing
                                ? "bg-gray-800 hover:bg-gray-900 border border-gray-700"
                                : "bg-blue-600 hover:bg-blue-700 border border-blue-500"
                                }`}
                        >
                            {isFollowing ? "Unfollow" : "Follow"}
                        </button>
                        <button
                            onClick={navigateChatRoom}
                            className="px-6 py-2.5 rounded-2xl w-full bg-gray-100 text-gray-900 hover:bg-gray-200 shadow-md hover:shadow-lg transition-all active:scale-95"
                        >
                            Message
                        </button>
                    </div>
                }
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow flex flex-col items-center cursor-pointer ">
                        <Users className="text-blue-400 w-6 h-6" />
                        <p className="text-xl font-bold mt-1">{followersCount || 0}</p>
                        <p className="text-gray-400 text-sm">Followers</p>
                    </div>
                    <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow flex flex-col items-center cursor-pointer ">
                        <Users className="text-green-400 w-6 h-6" />
                        <p className="text-xl font-bold mt-1">{profileUser.following?.length || 0}</p>
                        <p className="text-gray-400 text-sm">Following</p>
                    </div>
                    <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow flex flex-col items-center cursor-pointer ">
                        <Code className="text-purple-400 w-6 h-6" />
                        <p className="text-xl font-bold mt-1">34</p>
                        <p className="text-gray-400 text-sm">Posts</p>
                    </div>
                    <div
                        onClick={() => navigate(`/projects/${profileUser._id}`)}
                        className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow flex flex-col items-center cursor-pointer ">
                        <FolderGit2 className="text-yellow-400 w-6 h-6" />
                        {/* <p className="text-xl font-bold mt-1">8</p> */}
                        <p className="text-gray-400 text-sm">Projects</p>
                    </div>
                </div>

                {/* About Section */}
                <div className="bg-white dark:bg-gray-900 mt-8 p-6 rounded-2xl shadow-md">
                    <h2 className="text-xl font-semibold mb-3">About</h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {about ||
                            "I’m a passionate developer who loves building full-stack web applications using MERN stack."}
                    </p>
                </div>

                {/* Skills Section */}
                <div className="bg-white dark:bg-gray-900 mt-6 p-6 rounded-2xl shadow-md">
                    <h2 className="text-xl font-semibold mb-3">Skills</h2>
                    <div className="flex flex-wrap gap-3">
                        {skills.map((skill) => (
                            <span
                                key={skill}
                                className="px-3 py-1 bg-blue-100 dark:bg-blue-800 dark:text-blue-200 text-blue-700 rounded-full text-sm font-medium"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Recent Posts */}
                <div className="bg-white dark:bg-gray-900 mt-6 p-6 rounded-2xl shadow-md">
                    <h2 className="text-xl font-semibold mb-3">Recent Posts</h2>
                    <div className="space-y-4">
                        {[1, 2, 3].map((p) => (
                            <div
                                key={p}
                                className="p-4 border dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                            >
                                <h3 className="font-semibold">Building My Dev Portfolio</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                                    Sharing how I built my full-stack portfolio using React, Node.js, and TailwindCSS.
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {isEditing && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg max-w-lg w-full relative">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

                        <label className="block mb-2 font-medium">Bio</label>
                        <textarea
                            className="w-full p-2 rounded-md border dark:bg-gray-800 dark:border-gray-700"
                            rows="2"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                        />

                        <label className="block mt-4 mb-2 font-medium">About</label>
                        <textarea
                            className="w-full p-2 rounded-md border dark:bg-gray-800 dark:border-gray-700"
                            rows="4"
                            value={about}
                            onChange={(e) => setAbout(e.target.value)}
                        />

                        <label className="block mt-4 mb-2 font-medium">Select Skills</label>
                        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 border rounded-md dark:border-gray-700">
                            {ALL_SKILLS.map((skill) => (
                                <button
                                    key={skill}
                                    onClick={() => toggleSkill(skill)}
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${skills.includes(skill)
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                                        }`}
                                >
                                    {skill}
                                </button>
                            ))}
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={handleSave}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
