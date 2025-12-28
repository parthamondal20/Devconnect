import { getToken } from "firebase/messaging";
import { messaging } from "../api/firebase";
import { saveToken } from "../services/user";

export const requestPushPermission = async () => {
    try {
        // Register service worker first
        const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");

        // Wait for service worker to be ready
        await navigator.serviceWorker.ready;

        // Request notification permission
        const permission = await Notification.requestPermission();

        if (permission === "granted") {
            // Get FCM token with service worker registration
            const token = await getToken(messaging, {
                vapidKey: import.meta.env.VITE_PUBLIC_VAPID_KEY,
                serviceWorkerRegistration: registration
            });

            if (token) {
                await saveToken(token);

                // Show a success notification
                if (registration.active) {
                    registration.showNotification("DevConnect", {
                        body: "Notifications enabled successfully!",
                        icon: "/vite.svg",
                        badge: "/vite.svg"
                    });
                }
            }
        }
    } catch (error) {
        console.error("Error enabling notifications:", error);
        throw error;
    }
};