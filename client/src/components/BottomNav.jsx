import { NavLink } from "react-router-dom";
import { Home, MessageCircle, User, ClipboardList } from "lucide-react";
import { useSelector } from "react-redux";

const BottomNav = () => {
    const { user } = useSelector(state => state.auth);

    if (!user) return null;

    const navItems = [
        {
            label: "Feed",
            path: "/feed",
            Icon: Home
        },
        {
            label: "Q&A",
            path: "/questions",
            Icon: ClipboardList
        },
        {
            label: "Messages",
            path: "/messages",
            Icon: MessageCircle
        },
        {
            label: "Profile",
            path: `/profile/${user._id}`,
            Icon: User
        },
    ];

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 shadow-lg">
            <div className="flex items-center justify-around h-16 px-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                            flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-all duration-200 flex-1 max-w-[120px]
                            ${isActive
                                ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                                : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                            }
                        `}
                    >
                        {({ isActive }) => (
                            <>
                                <item.Icon
                                    size={24}
                                    className={`transition-transform ${isActive ? 'scale-110' : ''}`}
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                                <span className={`text-xs font-medium ${isActive ? 'font-semibold' : ''}`}>
                                    {item.label}
                                </span>
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
};

export default BottomNav;
