const Loader = ({ loading, message = "Loading DevConnect..." }) => {
    if (!loading) return null;

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-[#0d1117] text-white">
            <div className="relative w-16 h-16 mb-4">
                <div className="absolute inset-0 border-4 border-transparent border-l-[#00FF9C] border-r-blue-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center font-mono text-lg font-bold">
                    {"{ }"}
                </div>
            </div>

            <p className="font-mono text-sm text-white animate-pulse">
                {message}
            </p>
        </div>
    );
};

export default Loader;
