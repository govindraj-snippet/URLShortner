import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";


import type { User } from "../types";

interface AuthContextType {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem("jwt_token"));
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        if (token) {
            // Decode options or fetch user details if needed. 
            // For now, we assume simple token presence means authenticated.
            // Ideally we would validate the token with the backend or decode it here.
            try {
                // Simple JWT decode to get username if it's in payload
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));

                const payload = JSON.parse(jsonPayload);
                setUser({ username: payload.sub, role: payload.roles || "ROLE_USER" });
            } catch (e) {
                console.error("Failed to decode token", e);
                logout();
            }
        } else {
            setUser(null);
        }
    }, [token]);

    const login = (newToken: string) => {
        localStorage.setItem("jwt_token", newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem("jwt_token");
        setToken(null);
        setUser(null);
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{ token, user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
