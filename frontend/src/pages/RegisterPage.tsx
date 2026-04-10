import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../api/apiClient";
import toast from "react-hot-toast";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Loader2 } from "lucide-react";

const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Updated to match DTO: username, password, email, logic adds role="ROLE_USER"
            await apiClient.post("/auth/public/register", { username, email, password });
            toast.success("Registration successful! Please login.");
            navigate("/login");
        } catch (error: any) {
            console.error(error);
            const message = error.response?.data
                ? (typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data))
                : error.message;
            toast.error(message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
                        Create Account
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Join us to shorten your URLs
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="username" className="sr-only">Username</label>
                            <Input
                                id="username"
                                type="text"
                                required
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="sr-only">Email</label>
                            <Input
                                id="email"
                                type="email"
                                required
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <Input
                                id="password"
                                type="password"
                                required
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign Up"}
                        </Button>
                    </div>
                </form>
                <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Already have an account?{" "}
                        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
