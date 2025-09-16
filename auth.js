// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  setPersistence,
  browserSessionPersistence
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBgsHAYXZeLIv-vC0LCHbNHjOTrZOq3GBA",
  authDomain: "burgershotorders.firebaseapp.com",
  projectId: "burgershotorders",
  storageBucket: "burgershotorders.appspot.com",
  messagingSenderId: "244133569976",
  appId: "1:244133569976:web:0dcca3439958188439db4d",
  measurementId: "G-2X69N31D9Q"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ✅ Ensure session-only persistence (user must log in each browser session)
setPersistence(auth, browserSessionPersistence).catch((error) => {
  console.error("Persistence setup failed:", error);
});

// ✅ Redirect to login if not authenticated
onAuthStateChanged(auth, (user) => {
  if (!user && window.location.pathname.indexOf("index.html") === -1) {
    window.location.href = "index.html";
  }
});

// ✅ Add a logout function if you ever need it
window.logout = function () {
  signOut(auth)
    .then(() => {
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.error("Logout failed:", error);
    });
};

// ✅ Export app so Firestore can reuse it in other scripts
export { app };
