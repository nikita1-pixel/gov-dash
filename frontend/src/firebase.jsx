import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCU9jSFZCvl2u4P0vqAMjieM1t_29GcKKE",
    authDomain: "://firebaseapp.com",
    projectId: "gov-dash-d99ce",
    storageBucket: "gov-dash-d99ce.firebasestorage.app",
    messagingSenderId: "759077565354",
    appId: "1:759077565354:web:244e8c1cdf6ae6af7f71d3",
    measurementId: "G-TTJCHSXN4G"
};

const app = initializeApp(firebaseConfig);

// This 'auth' object is what your Login.jsx will use to talk to the cloud
export const auth = getAuth(app);
