import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";


const firebaseConfig = {
    apiKey: "AIzaSyA9wZYPE22E5Miwj84-CGO2k_x92R5xhFE",
    authDomain: "devconnect-1c24f.firebaseapp.com",
    projectId: "devconnect-1c24f",
    storageBucket: "devconnect-1c24f.firebasestorage.app",
    messagingSenderId: "921470863986",
    appId: "1:921470863986:web:f5434235d570bf6ce550eb",
    measurementId: "G-E660JYH3P0"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);