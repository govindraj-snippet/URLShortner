import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Button } from "./ui/Button";
import { Link2, LogIn, LogOut, Moon, Sun, UserPlus, BarChart, LayoutDashboard } from "lucide-react";

const Navbar: React.FC = () => {
    const { isAuthenticated, logout, user } = useAuth();
    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    }


    return (
        <nav className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900 backdrop-blur-lg shadow-sm">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center space-x-2 font-bold text-xl text-blue-600 dark:text-blue-400">
                    <Link2 className="h-6 w-6" />
                    <span>UrlShortener</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-6">
                    {isAuthenticated && (
                        <>
                            <Link to="/dashboard" className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                                <LayoutDashboard className="h-4 w-4" />
                                <span>Dashboard</span>
                            </Link>
                            <Link to="/analytics" className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                                <BarChart className="h-4 w-4" />
                                <span>Analytics</span>
                            </Link>
                        </>
                    )}
                </div>

                <div className="flex items-center space-x-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        className="relative rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                        title="Toggle theme"
                    >
                        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0 text-orange-500" />
                        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100 text-blue-500" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>

                    {isAuthenticated ? (
                        <div className="flex items-center space-x-4">
                            <span className="text-sm font-medium hidden sm:block">
                                Hello, {user?.username}
                            </span>
                            <Button onClick={handleLogout} variant="destructive" size="sm" className="hidden sm:flex">
                                <LogOut className="h-4 w-4 mr-2" />
                                Logout
                            </Button>
                            {/* Mobile Logout Icon */}
                            <Button onClick={handleLogout} variant="destructive" size="icon" className="sm:hidden">
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <Link to="/login">
                                <Button variant="ghost" size="sm">
                                    <LogIn className="h-4 w-4 mr-2" />
                                    Login
                                </Button>
                            </Link>
                            <Link to="/register">
                                <Button size="sm">
                                    <UserPlus className="h-4 w-4 mr-2" />
                                    Register
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
