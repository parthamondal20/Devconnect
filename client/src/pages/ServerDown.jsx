import React from 'react';
import { Server, RefreshCw, AlertCircle } from 'lucide-react';

const ServerDown = () => {
    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 px-4">
            <div className="max-w-2xl w-full text-center">
                {/* Animated Server Icon */}
                <div className="relative inline-block mb-8">
                    <div className="absolute inset-0 bg-red-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                    <div className="relative bg-gray-800/50 backdrop-blur-sm p-8 rounded-full border border-red-500/30">
                        <Server className="w-24 h-24 text-red-500 animate-[bounce_2s_ease-in-out_infinite]" />
                    </div>
                </div>

                {/* Main Message */}
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
                    Server Offline
                </h1>

                <div className="flex items-center justify-center gap-2 mb-6">
                    <AlertCircle className="w-6 h-6 text-red-400" />
                    <p className="text-xl text-red-400 font-medium">
                        DevConnect is currently unavailable
                    </p>
                </div>

                {/* Description */}
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 mb-8">
                    <p className="text-gray-300 text-lg leading-relaxed mb-4">
                        Our Render free tier has expired, and the server is currently down.
                        We're working on getting things back up and running.
                    </p>

                    <div className="flex flex-col md:flex-row gap-4 justify-center items-center text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                            <span>Status: Offline</span>
                        </div>
                        <div className="hidden md:block w-1 h-1 rounded-full bg-gray-600"></div>
                        <div className="flex items-center gap-2">
                            <span>Free Tier Expired</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                        onClick={handleRefresh}
                        className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/50"
                    >
                        <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                        Try Again
                    </button>

                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-8 py-4 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white font-semibold rounded-xl transition-all duration-300 border border-gray-700 hover:border-gray-600"
                    >
                        Check GitHub
                    </a>
                </div>

                {/* Additional Info */}
                <div className="mt-12 p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                    <p className="text-blue-400 text-sm">
                        💡 <strong>Note:</strong> This message appears only when the server is completely unreachable,
                        not during slow network conditions.
                    </p>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>
            </div>
        </div>
    );
};

export default ServerDown;
