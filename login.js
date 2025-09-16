// login.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBgsHAYXZeLIv-vC0LCHbNHjOTrZOq3GBA",
  authDomain: "burgershotorders.firebaseapp.com",
  projectId: "burgershotorders",
  storageBucket: "burgershotorders.appspot.com",
  messagingSenderId: "244133569976",
  appId: "1:244133569976:web:0dcca3439958188439db4d",
  measurementId: "G-2X69N31D9Q"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = "home.html"; // redirect after login
    })
    .catch((error) => {
      const errorMessage = error.code === "auth/wrong-password"
        ? "❌ Incorrect password."
        : error.code === "auth/user-not-found"
        ? "❌ User not found."
        : "❌ Login failed. Please try again.";
      document.getElementById("loginError").textContent = errorMessage;
    });
});
