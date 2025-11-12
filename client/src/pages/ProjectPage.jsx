import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Star, GitBranch, ExternalLink, Code2, Globe } from "lucide-react";
import Loader from "../components/Loader";
import axios from "axios";

export default function ProjectPage() {
    const { user } = useSelector((state) => state.auth);
    const { githubId } = useParams();
    const [repos, setRepos] = useState([]);
    const [profileUser] = useState(user);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("Fetching your GitHub projects...");

    useEffect(() => {
        if (!user.githubUsername) return;

        const fetchRepos = async () => {
            setLoading(true);
            try {
                // const userRes = await axios.get(`https://api.github.com/user/${githubId}`);
                // const username = userRes.data.login;
                const reposRes = await axios.get(`https://api.github.com/users/${user.githubUsername}/repos`);
                setRepos(reposRes.data);
            } catch (err) {
                console.error("Failed to fetch GitHub repos:", err);
                setRepos([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRepos();
    }, [githubId]);

    if (loading) return <Loader message={message} loading={loading} />;

    return (
        <div className="max-w-6xl mx-auto mt-10 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Code2 className="text-blue-600 dark:text-blue-400" /> GitHub Repositories
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        Showcasing your public work from GitHub.
                    </p>
                </div>
            </div>

            {repos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                    <p className="text-gray-500 dark:text-gray-400 text-lg text-center">
                        No public repositories found.
                    </p>
                    {profileUser && profileUser._id === user._id && !profileUser.githubUsername && (
                        <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-transform transform hover:scale-105">
                            Connect GitHub
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {repos.map((repo) => (
                        <div
                            key={repo.id}
                            className="group relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-2xl hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 p-6 flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                                        {repo.name}
                                    </h3>
                                    <a
                                        href={repo.html_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="View on GitHub"
                                    >
                                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition" />
                                    </a>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 line-clamp-3">
                                    {repo.description || "No description provided."}
                                </p>
                            </div>

                            {/* Language + Stars + Live Demo */}
                            <div className="mt-5 flex flex-wrap items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                                <div className="flex items-center gap-4">
                                    {repo.language && (
                                        <span className="flex items-center gap-1">
                                            <GitBranch className="w-4 h-4" /> {repo.language}
                                        </span>
                                    )}
                                    <span className="flex items-center gap-1">
                                        <Star className="w-4 h-4" /> {repo.stargazers_count}
                                    </span>
                                </div>

                                {repo.homepage && (
                                    <a
                                        href={repo.homepage.startsWith("http") ? repo.homepage : `https://${repo.homepage}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition"
                                    >
                                        <Globe className="w-4 h-4" /> Live Demo
                                    </a>
                                )}
                            </div>

                            {/* Gradient hover glow */}
                            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-blue-50/20 to-blue-100/10 dark:from-blue-500/10 dark:to-blue-800/10 pointer-events-none"></div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
