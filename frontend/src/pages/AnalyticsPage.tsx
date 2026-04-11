import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import apiClient from "../api/apiClient";
import type { ClickEvent, UrlMapping } from "../types";
import { Loader2, ArrowUpRight, Link2, MousePointer2, Activity, Calendar } from "lucide-react";
import toast from "react-hot-toast";

const AnalyticsPage: React.FC = () => {
    const { shortUrl } = useParams<{ shortUrl: string }>();

    if (shortUrl) {
        return <SingleUrlAnalytics shortUrl={shortUrl} />;
    }

    return <GlobalAnalyticsDashboard />;
};

const SingleUrlAnalytics: React.FC<{ shortUrl: string }> = ({ shortUrl }) => {
    const [data, setData] = useState<ClickEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics(shortUrl);
    }, [shortUrl]);

    const fetchAnalytics = async (code: string) => {
        setLoading(true);
        try {
            const endDate = new Date().toISOString();
            const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

            const response = await apiClient.get<ClickEvent[]>(`/urls/analytics/${code}`, {
                params: { startDate, endDate }
            });

            const rawData = response.data || [];
            const statsArray: ClickEvent[] = [];
            let currentDate = new Date(startDate);
            const end = new Date(endDate);

            // Create a map for easy lookup
            const dataMap = new Map();
            rawData.forEach(item => {
                dataMap.set(item.clickDate, item.count);
            });

            while (currentDate <= end) {
                const dateStr = currentDate.toISOString().split('T')[0];
                statsArray.push({
                    clickDate: dateStr,
                    count: dataMap.get(dateStr) || 0
                });
                currentDate.setDate(currentDate.getDate() + 1);
            }

            setData(statsArray);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load analytics data");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-8 space-y-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Analytics for <span className="text-blue-600 dark:text-blue-400">{shortUrl}</span>
            </h2>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
            ) : data.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
                    <p className="text-gray-500 dark:text-gray-400">No clicks recorded in the last 7 days.</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 h-[400px]">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Click History (Last 7 Days)</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis
                                dataKey="clickDate"
                                stroke="#6b7280"
                                fontSize={12}
                                tickFormatter={(value) => new Date(value).toLocaleDateString()}
                            />
                            <YAxis stroke="#6b7280" fontSize={12} />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="count"
                                stroke="#2563eb"
                                strokeWidth={2}
                                activeDot={{ r: 8 }}
                                name="Clicks"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

const GlobalAnalyticsDashboard: React.FC = () => {
    const [summary, setSummary] = useState({ totalUrls: 0, totalClicks: 0, todayClicks: 0, activeUrls: 0 });
    const [clickTrend, setClickTrend] = useState<{ date: string; count: number }[]>([]);
    const [topUrls, setTopUrls] = useState<UrlMapping[]>([]);
    const [recentActivity, setRecentActivity] = useState<{ urls: UrlMapping[]; clicks: ClickEvent[] }>({ urls: [], clicks: [] });
    const [loading, setLoading] = useState(true);
    const [trendFilter, setTrendFilter] = useState("7"); // 7 or 30

    useEffect(() => {
        fetchGlobalData();
    }, []);

    useEffect(() => {
        fetchClickTrend(trendFilter);
    }, [trendFilter]);

    const fetchGlobalData = async () => {
        setLoading(true);
        try {
            const [summaryRes, urlsRes, recentRes] = await Promise.all([
                apiClient.get("/urls/analytics/summary"),
                apiClient.get<UrlMapping[]>("/urls/myurls"),
                apiClient.get<{ urls: UrlMapping[]; clicks: ClickEvent[] }>("/urls/analytics/recent")
            ]);

            setSummary(summaryRes.data);

            // Process Top URLs
            const sortedUrls = urlsRes.data.sort((a, b) => b.clickCount - a.clickCount).slice(0, 5);
            setTopUrls(sortedUrls);

            setRecentActivity(recentRes.data);

        } catch (error) {
            console.error("Error fetching global analytics:", error);
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    const fetchClickTrend = async (days: string) => {
        try {
            const endDate = new Date().toISOString().split('T')[0];
            const startDate = new Date(Date.now() - parseInt(days) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

            const response = await apiClient.get<Record<string, number>>("/urls/totalclicks", {
                params: { startDate, endDate }
            });

            // Fill gaps
            const statsArray = [];
            let currentDate = new Date(startDate);
            const end = new Date(endDate);

            while (currentDate <= end) {
                const dateStr = currentDate.toISOString().split('T')[0];
                statsArray.push({
                    date: dateStr,
                    count: response.data[dateStr] || 0
                });
                currentDate.setDate(currentDate.getDate() + 1);
            }
            setClickTrend(statsArray);
        } catch (error) {
            console.error("Error fetching click trend:", error);
        }
    };

    if (loading && summary.totalUrls === 0) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-8 space-y-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Analytics Dashboard</h2>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <SummaryCard title="Total URLs Created" value={summary.totalUrls} icon={<Link2 className="h-6 w-6 text-blue-500" />} />
                <SummaryCard title="Total Clicks" value={summary.totalClicks} icon={<MousePointer2 className="h-6 w-6 text-purple-500" />} />
                <SummaryCard title="Today's Clicks" value={summary.todayClicks} icon={<Activity className="h-6 w-6 text-green-500" />} />
                <SummaryCard title="Active URLs" value={summary.activeUrls} icon={<Link2 className="h-6 w-6 text-orange-500" />} />
            </div>

            {/* Click Trend Chart */}
            <div className="bg-white/80 dark:bg-gray-800 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 dark:border-none dark:shadow-none p-6 md:p-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
                        <Calendar className="h-5 w-5 mr-2" /> Click Trends
                    </h3>
                    <select
                        value={trendFilter}
                        onChange={(e) => setTrendFilter(e.target.value)}
                        className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                    >
                        <option value="7">Last 7 Days</option>
                        <option value="30">Last 30 Days</option>
                    </select>
                </div>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={clickTrend}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                            <XAxis
                                dataKey="date"
                                stroke="#6b7280"
                                fontSize={12}
                                tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            />
                            <YAxis stroke="#6b7280" fontSize={12} />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.95)', border: 'none', borderRadius: '8px', color: '#fff' }}
                                labelFormatter={(label) => new Date(label).toLocaleDateString()}
                            />
                            <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Performing URLs */}
                <div className="bg-white/80 dark:bg-gray-800 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 dark:border-none dark:shadow-none p-6 md:p-8">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                        <ArrowUpRight className="h-5 w-5 mr-2 text-green-500" /> Top Performing URLs
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                            <thead className="bg-gray-50 dark:bg-gray-700 text-xs uppercase text-gray-700 dark:text-gray-300">
                                <tr>
                                    <th className="px-4 py-3">Short URL</th>
                                    <th className="px-4 py-3">Original URL</th>
                                    <th className="px-4 py-3 text-right">Clicks</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {topUrls.map((url) => (
                                    <tr key={url.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white text-blue-600 dark:text-blue-400">
                                            {url.shortUrl}
                                        </td>
                                        <td className="px-4 py-3 max-w-[150px] truncate" title={url.originalUrl}>
                                            {url.originalUrl}
                                        </td>
                                        <td className="px-4 py-3 text-right font-bold">{url.clickCount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white/80 dark:bg-gray-800 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 dark:border-none dark:shadow-none p-6 md:p-8">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                        <Activity className="h-5 w-5 mr-2 text-purple-500" /> Recent Activity
                    </h3>
                    <div className="space-y-4">
                        {/* Recent Clicks - showing mixed creation/clicks effectively as a feed */}
                        {recentActivity.clicks.length > 0 && (
                            <div>
                                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Recent Clicks</h4>
                                <ul className="space-y-2">
                                    {recentActivity.clicks.map((click, idx) => (
                                        <li key={idx} className="flex justify-between items-center text-sm p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                            <span className="truncate max-w-[70%]">
                                                Clicked <span className="font-medium text-blue-500">{click.shortUrl}</span>
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                {new Date(click.clickDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {recentActivity.urls.length > 0 && (
                            <div className="mt-4">
                                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Recently Created</h4>
                                <ul className="space-y-2">
                                    {recentActivity.urls.map((url, idx) => (
                                        <li key={idx} className="flex justify-between items-center text-sm p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                            <span className="truncate max-w-[70%]">
                                                Created <span className="font-medium text-green-500">{url.shortUrl}</span>
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                {new Date(url.createdDate).toLocaleDateString()}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const SummaryCard: React.FC<{ title: string; value: number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 dark:border-gray-700/50 p-6 flex items-center space-x-4">
        <div className="p-3 bg-blue-50/50 dark:bg-gray-700 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
        </div>
    </div>
);

export default AnalyticsPage;
