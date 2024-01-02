import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyD35doA_bmzf-bkYu5-VxfcCC42ZZ_qK0M",
    authDomain: "chat-app-34f91.firebaseapp.com",
    projectId: "chat-app-34f91",
    storageBucket: "chat-app-34f91.appspot.com",
    messagingSenderId: "478413521682",
    appId: "1:478413521682:web:82e209025ea1bc3ca569cb"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();