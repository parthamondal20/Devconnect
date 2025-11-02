import { NavLink } from "react-router-dom";
import { Home, Users, FolderGit2, MessageCircle } from "lucide-react";

const navItems = [
    { label: "Feed", path: "/feed", icon: <Home size={20} /> },
    { label: "Community", path: "/community", icon: <Users size={20} /> },
    { label: "Projects", path: "/projects", icon: <FolderGit2 size={20} /> },
    { label: "Q&A 💬", path: "/questions", icon: <MessageCircle size={20} /> },
];

const Sidebar = () => {
    return (
        <aside
            className="fixed left-0 top-0 h-screen w-60 border-r border-gray-700 bg-[#0f1117] text-gray-300 dark:bg-[#0b0d13] flex flex-col"
        >
            {/* Brand / Logo */}
            <div className="p-4 text-xl font-bold text-white tracking-wide border-b border-gray-700">
                DevConnect
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 flex flex-col mt-4">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors
              hover:text-white hover:bg-gray-800 
              ${isActive ? "bg-gray-800 text-white" : "text-gray-400"}`
                        }
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Footer / Version / Settings */}
            <div className="p-4 border-t border-gray-700 text-xs text-gray-500">
                © 2025 DevConnect
            </div>
        </aside>
    );
};

export default Sidebar;
