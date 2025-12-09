import React from 'react';

const InstagramLoader = ({ show }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="instagram-loader-container">
                <svg className="instagram-loader" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <circle className="instagram-loader-circle" cx="50" cy="50" r="45" />
                </svg>
            </div>

            <style jsx>{`
                .instagram-loader-container {
                    width: 60px;
                    height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .instagram-loader {
                    width: 100%;
                    height: 100%;
                    animation: instagram-rotate 1.5s linear infinite;
                }

                .instagram-loader-circle {
                    fill: none;
                    stroke: url(#instagram-gradient);
                    stroke-width: 6;
                    stroke-linecap: round;
                    stroke-dasharray: 283;
                    stroke-dashoffset: 280;
                    animation: instagram-dash 1.5s ease-in-out infinite;
                    transform-origin: center;
                }

                @keyframes instagram-rotate {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }

                @keyframes instagram-dash {
                    0% {
                        stroke-dashoffset: 280;
                    }
                    50% {
                        stroke-dashoffset: 75;
                    }
                    100% {
                        stroke-dashoffset: 280;
                    }
                }
            `}</style>

            {/* Instagram-style gradient */}
            <svg width="0" height="0">
                <defs>
                    <linearGradient id="instagram-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#f09433', stopOpacity: 1 }} />
                        <stop offset="25%" style={{ stopColor: '#e6683c', stopOpacity: 1 }} />
                        <stop offset="50%" style={{ stopColor: '#dc2743', stopOpacity: 1 }} />
                        <stop offset="75%" style={{ stopColor: '#cc2366', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#bc1888', stopOpacity: 1 }} />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
};

export default InstagramLoader;
