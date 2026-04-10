
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import AnalyticsPage from "./pages/AnalyticsPage";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-gray-50 text-gray-900 dark:bg-none dark:bg-gray-900 dark:text-gray-50 transition-colors duration-300">
            <Navbar />
            <div className="flex-grow">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route element={<PrivateRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/analytics/:shortUrl" element={<AnalyticsPage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                </Route>
              </Routes>
            </div>
            <Footer />
            <Toaster position="bottom-right" reverseOrder={false} />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
