// src/components/FeedLoader.jsx

const SkeletonPost = () => {
    return (
        // Post Container
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 sm:p-5 animate-pulse">
            
            {/* Header Area (Avatar + Name Lines) */}
            <div className="flex items-start gap-4 mb-4">
                {/* Avatar Placeholder */}
                <div className="w-11 h-11 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0"></div>
                
                {/* User Info Lines */}
                <div className="flex-1 pt-1">
                    <div className="h-3.5 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-28"></div>
                </div>
                
                {/* More Icon Placeholder */}
                <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            </div>

            {/* Content Area */}
            <div className="space-y-2.5">
                {/* Text Lines */}
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-11/12"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>

            {/* Image Placeholder (Large Block) */}
            <div className="mt-4 h-56 w-full bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            
            {/* Footer Actions (Small Line) */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-800 mt-4">
                <div className="h-3 w-1/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-3 w-1/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-3 w-1/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
        </div>
    );
};


const FeedLoader = ({ count = 3 }) => {
    return (
        <div className="space-y-6">
            {Array.from({ length: count }).map((_, index) => (
                <SkeletonPost key={index} />
            ))}
        </div>
    );
};

export default FeedLoader;