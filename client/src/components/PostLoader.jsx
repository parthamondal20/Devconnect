// Add this to your tailwind.config.js to get the glitch effect and terminal cursor
// theme: {
//   extend: {
//     animation: {
//       'blink-cursor': 'blink 1s step-end infinite',
//     },
//     keyframes: {
//       blink: {
//         '0%, 100%': { opacity: 1 },
//         '50%': { opacity: 0 },
//       }
//     }
//   }
// }

const PostLoader = ({ loading }) => {
    if (!loading) return null;

    return (
        // Full-screen, dark terminal background
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d1117]/95 backdrop-blur-sm font-mono transition-all animate-in fade-in">
            <div className="p-6 rounded-lg border border-gray-800 bg-[#161b22] shadow-2xl max-w-md w-full mx-4">
                {/* Terminal Window Header */}
                <div className="flex gap-2 mb-4 border-b border-gray-800 pb-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                </div>

                {/* Terminal Output Area */}
                <div className="text-blue-400 text-lg flex flex-col gap-1">
                    <div className="opacity-70">
                        <span className="text-green-500">user@devconnect</span>
                        <span className="text-gray-500">:</span>
                        <span className="text-blue-400">~/posts</span>
                        <span className="text-gray-500">$</span> git push origin main
                    </div>
                    <div className="flex items-center mt-2">
                        <span className="text-gray-500 mr-2">{'>'}</span>
                        <span className="text-blue-300 font-bold tracking-wide">Sending data packets...</span>
                        {/* Blinking Terminal Block Cursor */}
                        <span className="ml-2 w-3 h-5 bg-blue-400/80 animate-blink-cursor"></span>
                    </div>
                    <div className="text-xs text-gray-600 mt-2 animate-pulse">
                        Posting 1 post(s)...
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostLoader;