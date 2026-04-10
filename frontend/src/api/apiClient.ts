import axios from "axios";

// Default to localhost:8080 if env variable is not set
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add a request interceptor to add the JWT token to headers
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("jwt_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle 401 errors
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Clear token and redirect to login if unauthorized
            // Avoid redirecting if already on login page to prevent loops
            if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
                localStorage.removeItem("jwt_token");
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
