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


/* SNR BUNS MANAGEMENT ACCESS */

const MANAGER_UID = "FI4aD3rB0hStDYe0Jou8G3kQrxq2";

function isManager(user) {
  return Boolean(user && user.uid === MANAGER_UID);
}

function requireManager() {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();

      if (!user) {
        window.location.replace("index.html");
        reject(new Error("Not signed in"));
        return;
      }

      if (!isManager(user)) {
        window.location.replace("home.html");
        reject(new Error("Manager access required"));
        return;
      }

      resolve(user);
    });
  });
}


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
export { app, auth, isManager, requireManager };
