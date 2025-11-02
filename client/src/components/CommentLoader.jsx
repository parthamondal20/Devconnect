const CommentLoader = ({ loading }) => {
    if (!loading) return null;
    return (
        <div className="space-y-4 p-2">
            {/* Loader 1 */}
            <div className="flex items-start gap-3 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                    <div className="flex items-center gap-3 mt-2">
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-10"></div>
                    </div>
                </div>
            </div>

            {/* Loader 2 */}
            <div className="flex items-start gap-3 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
                    <div className="flex items-center gap-3 mt-2">
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-10"></div>
                    </div>
                </div>
            </div>

            {/* Loader 3 */}
            <div className="flex items-start gap-3 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-3/5"></div>
                    <div className="flex items-center gap-3 mt-2">
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-10"></div>
                    </div>

                    {/* Nested reply loader */}
                    <div className="pl-4 border-l-2 border-gray-200 dark:border-gray-700 mt-3 space-y-3">
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-4/5"></div>
                                <div className="flex items-center gap-3 mt-2">
                                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
                                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-10"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Loader 4 */}
            <div className="flex items-start gap-3 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-4/5"></div>
                    <div className="flex items-center gap-3 mt-2">
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-10"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommentLoader;