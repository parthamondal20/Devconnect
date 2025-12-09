const publicVapidKey = "YOUR_PUBLIC_VAPID_KEY";

function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/");

    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export default function EnableNotifications() {
    const subscribeUser = async () => {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") return alert("Enable notifications first!");

        const worker = await navigator.serviceWorker.register("/sw.js");

        const subscription = await worker.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
        });

        await fetch("http://localhost:5000/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(subscription),
        });

        alert("You are subscribed 🎉");
    };

    return (
        <div className="flex flex-col items-center mt-20">
            <h1 className="text-3xl font-bold mb-6 text-white">
                Push Notifications 🔔 (This is required to push any type of notifications on your device when website is closed)
            </h1>

            <button
                onClick={subscribeUser}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
                Enable Notifications
            </button>
        </div>
    );
}
