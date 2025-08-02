// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, getDoc, setDoc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCYOmtNogqznYszgpBmntFMRhykZ_8cEe8",
    authDomain: "romart-rstracker-99748.firebaseapp.com",
    projectId: "romart-rstracker-99748",
    storageBucket: "romart-rstracker-99748.firebasestorage.app",
    messagingSenderId: "380797477951",
    appId: "1:380797477951:web:a89a11cd5474ed9fbb048a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize default admin if not exists
async function initializeAdmin() {
    try {
        const adminRef = doc(db, 'admins', 'admin1');
        const adminDoc = await getDoc(adminRef);

        if (!adminDoc.exists()) {
            await setDoc(adminRef, {
                email: 'shaun.romart@gmail.com',
                password: 'Romart479',
                isActive: true,
                createdAt: new Date().toISOString()
            });
            console.log('Default admin created');
        }
    } catch (error) {
        console.error('Admin initialization error:', error);
    }
}

initializeAdmin();

// Make Firebase instance available globally
window.db = db;

console.log('Firebase initialized:', !!db); // Debug log

export { db };

