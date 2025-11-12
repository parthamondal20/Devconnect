import { useEffect, useState } from "react";
import { Briefcase, MapPin, Globe, Clock } from "lucide-react";
import { motion } from "framer-motion";
import getJobs from "../services/job";
import Loader from "../components/Loader";

const LOCATIONS = ["Remote", "New York, USA", "San Francisco, USA", "London, UK", "Berlin, Germany", "Bengaluru, India"];
const ROLES = ["Frontend Engineer", "Backend Engineer", "Fullstack Engineer", "DevOps Engineer", "Product Manager", "Designer"];

export default function Jobs() {
    const [location, setLocation] = useState("");
    const [role, setRole] = useState("");
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchInitialJobs = async () => {
            setLoading(true);
            try {
                const results = await getJobs("", "developer");
                setJobs(results);
                setFilteredJobs(results);
            } catch (error) {
                console.error("Error fetching initial jobs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialJobs();
    }, []);

    useEffect(() => {
        const filtered = jobs.filter(job => {
            const jobTitle = job.title?.toLowerCase() || "";
            const matchRole = role ? jobTitle.includes(role.toLowerCase()) : true;
            const matchLocation = location ? job.location?.includes(location) : true;
            return matchRole && matchLocation;
        });
        setFilteredJobs(filtered);
    }, [role, location]);

    const resetFilters = () => {
        setRole("");
        setLocation("");
        setFilteredJobs(jobs);
    };

    if (loading) return <Loader message="Fetching job listings..." loading={loading} />;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#0d1117] dark:to-[#161b22] text-gray-900 dark:text-gray-100 py-12 px-4 md:px-12">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <header className="mb-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-2">
                        <span className="bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
                            Explore Tech Jobs
                        </span>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                        Filter by role or location — real-time listings from global sources.
                    </p>
                </header>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row gap-3 mb-8 bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800"
                >
                    <select
                        value={role}
                        onChange={e => setRole(e.target.value)}
                        className="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm md:text-base outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select Role</option>
                        {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>

                    <select
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                        className="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm md:text-base outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select Location</option>
                        {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>

                    <button
                        onClick={resetFilters}
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm md:text-base font-semibold hover:opacity-90 transition"
                    >
                        Reset
                    </button>
                </motion.div>

                {/* Job List */}
                <motion.div layout className="space-y-4">
                    {filteredJobs.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-white dark:bg-gray-900 p-8 rounded-2xl text-center text-gray-600 dark:text-gray-400 shadow-md border border-gray-200 dark:border-gray-800"
                        >
                            No jobs found. Try different filters.
                        </motion.div>
                    ) : (
                        filteredJobs.map((job, i) => (
                            <motion.article
                                key={job.id || i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.02 }}
                                whileHover={{ scale: 1.01 }}
                                className="group bg-white dark:bg-gray-900 p-6 md:p-7 rounded-2xl shadow-md border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition"
                            >
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                                    <div className="flex flex-col gap-1">
                                        <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                                            {job.title}
                                        </h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                            <Briefcase size={16} /> {job.company}
                                            <span className="hidden md:inline">•</span>
                                            <MapPin size={16} /> {job.location}
                                        </p>
                                    </div>

                                    <div className="text-sm text-gray-600 dark:text-gray-400 text-right space-y-1">
                                        {job.salary && <div className="font-medium">{job.salary}</div>}
                                        {job.updated && (
                                            <div className="flex items-center justify-end gap-1 text-xs">
                                                <Clock size={12} /> {new Date(job.updated).toDateString()}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <p
                                    className="text-sm mt-3 text-gray-700 dark:text-gray-300 line-clamp-3"
                                    dangerouslySetInnerHTML={{ __html: job.snippet }}
                                />

                                <div className="mt-4 flex justify-between items-center">
                                    <a
                                        href={job.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                        View Details <Globe size={14} className="ml-1" />
                                    </a>
                                    {job.source && (
                                        <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-1 rounded-full">
                                            {job.source}
                                        </span>
                                    )}
                                </div>
                            </motion.article>
                        ))
                    )}
                </motion.div>
            </div>
        </div>
    );
}
