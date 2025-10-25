import { Github, Linkedin, X } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-gray-100 dark:bg-gray-950 text-gray-800 dark:text-gray-300 border-t border-gray-300 dark:border-gray-800 mt-auto">
            <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-6">

                {/* Left Section: Logo & Copyright */}
                <div className="flex flex-col md:flex-row items-center gap-2 text-center md:text-left">
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
                        DevConnect
                    </span>
                    <p className="text-sm">
                        © {new Date().getFullYear()}. All rights reserved.
                    </p>
                </div>

                {/* Right Section: Social Links */}
                <div className="flex items-center gap-4">
                    <a
                        href="https://github.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-blue-500 transition"
                    >
                        <Github size={18} /> GitHub
                    </a>
                    <a
                        href="https://linkedin.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-blue-400 transition"
                    >
                        <Linkedin size={18} /> LinkedIn
                    </a>
                    <a
                        href="https://twitter.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-blue-300 transition"
                    >
                        <X size={18} /> Twitter
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
