import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Link2, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const LandingPage: React.FC = () => {
    const { isAuthenticated } = useAuth();
    return (
        <div className="flex flex-col w-full">
            <div className="flex flex-col py-24 md:py-32 justify-center items-center text-center p-4">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
                            <Link2 className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                            Shorten Your Links <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400">
                                Expand Your Reach
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            A professional URL shortener for modern businesses. Track clicks, analyze data, and manage your links efficiently.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        {isAuthenticated ? (
                            <Link to="/dashboard">
                                <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8">
                                    Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link to="/register">
                                    <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8">
                                        Get Started for Free <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                                <Link to="/login">
                                    <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg h-14 px-8">
                                        Log in
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-12 bg-white dark:bg-gray-900 w-full">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                            Why Choose Our URL Shortener?
                        </h2>
                        <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
                            Efficient, reliable, and designed for scalability.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Feature 1 */}
                        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                            <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                                <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Fast Link Generation</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                Create short URLs instantly with high-speed processing. Our optimized backend ensures minimal delay.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                            <div className="h-12 w-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                                <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Reliable Redirection</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                Experience smooth and accurate redirection from short links to original URLs with high availability.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                            <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                                <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Usage Tracking</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                Monitor how your links perform with basic tracking features such as click counts and usage statistics.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                            <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4">
                                <svg className="h-6 w-6 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Scalable Architecture</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                Built with modern backend design to handle increasing traffic and large numbers of URL requests efficiently.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
