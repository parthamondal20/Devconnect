import { onMessage } from "firebase/messaging";
import { messaging } from "../api/firebase";

// Handle foreground messages (when app is open)
export const setupForegroundMessageHandler = () => {
    onMessage(messaging, (payload) => {
        const { notification, data } = payload;

        if (notification) {
            if (Notification.permission === "granted") {
                const notificationTitle = notification.title || "New Notification";
                const notificationOptions = {
                    body: notification.body || "",
                    icon: notification.icon || "/vite.svg",
                    badge: "/vite.svg",
                    data: data,
                    requireInteraction: false,
                    tag: data?.chatId || "notification"
                };

                navigator.serviceWorker.ready.then((registration) => {
                    registration.showNotification(notificationTitle, notificationOptions);
                });
            }
        }
    });
};
