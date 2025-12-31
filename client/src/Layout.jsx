import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import BottomNav from "./components/BottomNav";
import { useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Toaster } from 'react-hot-toast';
import EnableNotifications from "./components/EnableNotifications";
import { useEffect, useState } from "react";
import { setupForegroundMessageHandler } from "./utils/foregroundMessageHandler";
import ServerDown from "./pages/ServerDown";

export default function Layout() {
    const location = useLocation();
    const showBottomNav = !location.pathname.includes("/chat");
    const [isServerDown, setIsServerDown] = useState(false);

    // Setup foreground message handler on component mount
    useEffect(() => {
        setupForegroundMessageHandler();
    }, []);

    // Listen for server status changes
    useEffect(() => {
        const handleServerStatusChange = (event) => {
            setIsServerDown(event.detail.isDown);
        };

        window.addEventListener('serverStatusChange', handleServerStatusChange);

        return () => {
            window.removeEventListener('serverStatusChange', handleServerStatusChange);
        };
    }, []);

    // If server is down, show ServerDown page
    if (isServerDown) {
        return <ServerDown />;
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0d1117] text-gray-900 dark:text-gray-100 transition-colors duration-300">
            {!location.pathname.includes("/chat") && <Header />}

            {/* Main content area with bottom padding for mobile bottom nav */}
            <main className={`flex-1 ${showBottomNav ? 'pb-16 lg:pb-0' : ''}`}>
                <Outlet />
            </main>

            {(location.pathname === "/feed" || location.pathname === "/") && <Footer />}

            {/* Bottom Navigation for Mobile */}
            {showBottomNav && <BottomNav />}

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
