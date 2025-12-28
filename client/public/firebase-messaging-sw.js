importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyA9wZYPE22E5Miwj84-CGO2k_x92R5xhFE",
    authDomain: "devconnect-1c24f.firebaseapp.com",
    projectId: "devconnect-1c24f",
    storageBucket: "devconnect-1c24f.firebasestorage.app",
    messagingSenderId: "921470863986",
    appId: "1:921470863986:web:f5434235d570bf6ce550eb",
    measurementId: "G-E660JYH3P0"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    // Firebase sends notification data in payload.notification
    const notificationTitle = payload.notification?.title || 'DevConnect';
    const notificationOptions = {
        body: payload.notification?.body || 'You have a new notification',
        icon: payload.notification?.icon || '/vite.svg',
        badge: '/vite.svg',
        data: payload.data,
        tag: payload.data?.tag || 'notification',
        requireInteraction: false
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
