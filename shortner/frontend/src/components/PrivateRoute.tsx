import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute: React.FC = () => {
    const { isAuthenticated } = useAuth();

    // If we are checking auth status (loading), we might want to show a spinner here
    // But for now, since token load is synchronous from localStorage, we can proceed.

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
