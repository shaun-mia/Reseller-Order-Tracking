// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

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

// Initialize admin
async function initializeAdmin() {
    try {
        const adminRef = doc(db, 'admins', 'admin1');
        const adminDoc = await getDoc(adminRef);

        if (!adminDoc.exists()) {
            const adminData = {
                email: 'shaun.romart@gmail.com',
                password: 'Romart479',
                createdAt: new Date().toISOString(),
                isActive: true
            };
            await setDoc(adminRef, adminData);
            console.log('Admin initialized successfully');
        }
    } catch (error) {
        console.error('Admin initialization error:', error);
    }
}

// Initialize admin on load
initializeAdmin();

export { db };
    }
}

// Initialize admin on load
await initializeAdmin();

export { db, app };

