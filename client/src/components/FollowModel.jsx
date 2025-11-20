import { motion } from "framer-motion";

export default function FollowerModal({ isOpen, onClose, followers }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            {/* Modal Box */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-xl p-6 relative"
            >
                {/* Close Button */}
                <button
                    className="absolute top-3 right-3 text-xl text-gray-600 hover:text-red-500"
                    onClick={onClose}
                >
                    ✖
                </button>

                <h2 className="text-xl font-semibold mb-4">Followers</h2>

                {/* If no followers */}
                {!followers?.length ? (
                    <p className="text-gray-500 text-center">No followers yet.</p>
                ) : (
                    <div className="max-h-80 overflow-y-auto space-y-4 pr-2">
                        {followers.map((user) => (
                            <div
                                key={user._id}
                                className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                            >
                                <img
                                    src={user.avatar}
                                    className="w-12 h-12 rounded-full object-cover"
                                    alt="avatar"
                                />
                                <div>
                                    <p className="font-medium">{user.username}</p>
                                    <p className="text-gray-500 text-sm">@{user.email}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
