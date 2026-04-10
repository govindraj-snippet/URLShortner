import React, { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import type { UrlMapping } from "../types";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Copy, ExternalLink, BarChart, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
    BarChart as RechartsBarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";

const Dashboard: React.FC = () => {
    const [originalUrl, setOriginalUrl] = useState("");
    const [shortUrl, setShortUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [urls, setUrls] = useState<UrlMapping[]>([]);
    const [loadingUrls, setLoadingUrls] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activityStats, setActivityStats] = useState<{ date: string; creations: number; clicks: number }[]>([]);
    const [loadingStats, setLoadingStats] = useState(false);
    const [filter, setFilter] = useState("dateDesc");

    const sortedUrls = React.useMemo(() => {
        return [...urls].sort((a, b) => {
            switch (filter) {
                case "dateDesc": return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
                case "dateAsc": return new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime();
                case "clicksDesc": return b.clickCount - a.clickCount;
                case "clicksAsc": return a.clickCount - b.clickCount;
                default: return 0;
            }
        });
    }, [urls, filter]);

    useEffect(() => {
        fetchUrls();
        fetchActivityStats();
    }, []);

    const fetchActivityStats = async () => {
        setLoadingStats(true);
        try {
            const endDate = new Date().toISOString().split('T')[0];
            const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // Last 30 days

            const [creationRes, clickRes] = await Promise.all([
                apiClient.get<Record<string, number>>("/urls/analytics/creation", { params: { startDate, endDate } }),
                apiClient.get<Record<string, number>>("/urls/totalclicks", { params: { startDate, endDate } })
            ]);

            const creationData = creationRes.data;
            const clickData = clickRes.data;

            // Generate full date range
            const statsArray = [];
            let currentDate = new Date(startDate);
            const end = new Date(endDate);

            while (currentDate <= end) {
                const dateStr = currentDate.toISOString().split('T')[0];
                statsArray.push({
                    date: dateStr,
                    creations: creationData[dateStr] || 0,
                    clicks: clickData[dateStr] || 0
                });
                currentDate.setDate(currentDate.getDate() + 1);
            }

            setActivityStats(statsArray);
        } catch (err) {
            console.error("Error fetching stats:", err);
        } finally {
            setLoadingStats(false);
        }
    };

    const fetchUrls = async () => {
        setLoadingUrls(true);
        try {
            const response = await apiClient.get<UrlMapping[]>("/urls/myurls");
            setUrls(response.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load your URLs");
        } finally {
            setLoadingUrls(false);
        }
    };

    const handleShorten = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setShortUrl(null);
        try {
            const response = await apiClient.post<UrlMapping>("/urls/shorten", {
                originalUrl,
            });
            setShortUrl(response.data.shortUrl);
            setOriginalUrl(""); // Clear input
            toast.success("URL Shortened successfully!");
            fetchUrls(); // Refresh list
            fetchActivityStats(); // Refresh stats
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to shorten URL");
            toast.error("Failed to shorten URL");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(`${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:8080'}/${url}`);
        toast.success("Copied to clipboard!");
    };

    return (
        <div className="container mx-auto p-4 md:p-8 space-y-8">
            {/* Analytics Card */}
            <div className="bg-white/80 dark:bg-gray-800 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 dark:border-none dark:shadow-none p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:text-white dark:bg-none">Activity Overview</h2>
                <div className="h-[400px] w-full">
                    {loadingStats ? (
                        <div className="flex justify-center items-center h-full">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                        </div>
                    ) : activityStats.length === 0 ? (
                        <div className="flex justify-center items-center h-full text-gray-500">
                            No activity data available for the last 30 days.
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <RechartsBarChart data={activityStats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} barGap={2}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                                <XAxis
                                    dataKey="date"
                                    stroke="#6b7280"
                                    fontSize={12}
                                    tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    tickMargin={10}
                                    minTickGap={30}
                                />
                                <YAxis stroke="#6b7280" fontSize={12} allowDecimals={false} tickMargin={10} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(17, 24, 39, 0.95)',
                                        borderRadius: '8px',
                                        border: 'none',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                        color: '#F9FAFB'
                                    }}
                                    labelFormatter={(label) => new Date(label).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Bar dataKey="creations" name="URLs Created" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={12} />
                                <Bar dataKey="clicks" name="Total Clicks" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={12} />
                            </RechartsBarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* Shortener Card */}
            <div className="bg-white/80 dark:bg-gray-800 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 dark:border-none dark:shadow-none p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Shorten a new URL</h2>
                <form onSubmit={handleShorten} className="flex flex-col md:flex-row gap-4">
                    <Input
                        placeholder="Enter long URL here (e.g., https://example.com/very-long-url)"
                        value={originalUrl}
                        onChange={(e) => setOriginalUrl(e.target.value)}
                        required
                        className="flex-1"
                        disabled={loading}
                    />
                    <Button type="submit" disabled={loading} className="md:w-32">
                        {loading ? <Loader2 className="animate-spin" /> : "Shorten"}
                    </Button>
                </form>
                {error && <p className="text-red-500 mt-2">{error}</p>}
                {shortUrl && (
                    <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-md flex items-center justify-between">
                        <span className="text-green-800 dark:text-green-300 font-medium">
                            Short URL Created!
                        </span>
                        {/* We won't display the link here to avoid confusion, just "Success" and maybe the link in the list below updates */}
                    </div>
                )}
            </div>

            {/* URLs List */}
            <div className="bg-white/80 dark:bg-gray-800 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 dark:border-none dark:shadow-none p-6 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">My URLs</h2>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Sort by:</span>
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                        >
                            <option value="dateDesc">Newest First</option>
                            <option value="dateAsc">Oldest First</option>
                            <option value="clicksDesc">Most Clicks</option>
                            <option value="clicksAsc">Least Clicks</option>
                        </select>
                    </div>
                </div>

                {loadingUrls ? (
                    <div className="flex justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    </div>
                ) : urls.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                        You haven't shortened any URLs yet.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                            <thead className="bg-gray-50 dark:bg-gray-700 text-xs uppercase text-gray-700 dark:text-gray-300">
                                <tr>
                                    <th className="px-6 py-3">Original URL</th>
                                    <th className="px-6 py-3">Short URL</th>
                                    <th className="px-6 py-3">Clicks</th>
                                    <th className="px-6 py-3">Created</th>
                                    <th className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {sortedUrls.map((url) => (
                                    <tr key={url.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4 max-w-[200px] truncate" title={url.originalUrl}>
                                            <div className="flex items-center space-x-2">
                                                <img
                                                    src={`https://www.google.com/s2/favicons?domain=${new URL(url.originalUrl).hostname}&sz=32`}
                                                    alt="favicon"
                                                    className="w-4 h-4 rounded-sm opacity-75"
                                                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                                />
                                                <a href={url.originalUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline dark:text-blue-400 flex items-center truncate">
                                                    <span className="truncate">{url.originalUrl}</span>
                                                    <ExternalLink className="h-3 w-3 ml-1 flex-shrink-0" />
                                                </a>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            {/* Display full short URL for better UX, clickable */}
                                            <a href={`${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:8080'}/${url.shortUrl}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="hover:underline flex items-center gap-1 group">
                                                {url.shortUrl}
                                                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </a>
                                        </td>
                                        <td className="px-6 py-4 text-center font-semibold">{url.clickCount}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                            {new Date(url.createdDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 space-x-2">
                                            <Button variant="ghost" size="icon" onClick={() => copyToClipboard(url.shortUrl)} title="Copy Short URL">
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                            <Link to={`/analytics/${url.shortUrl}`}>
                                                <Button variant="ghost" size="icon" title="View Analytics">
                                                    <BarChart className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
