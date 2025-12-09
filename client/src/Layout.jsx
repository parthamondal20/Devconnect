import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Toaster } from 'react-hot-toast';
import EnableNotifications from "./components/EnableNotifications";
export default function Layout() {
    const location = useLocation();
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0d1117] text-gray-900 dark:text-gray-100 transition-colors duration-300">
            {!location.pathname.includes("/chat") && <Header />}

            {/* Main content area */}
            <main className="flex-1">
                <Outlet />
            </main>

            {(location.pathname === "/feed" || location.pathname === "/") && <Footer />}

            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
            />
            <Toaster position="top-center" />
        </div>
    );
}
