
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

import { auth, isManager } from "./auth.js";

const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  loginError.textContent = "";

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const button = loginForm.querySelector('button[type="submit"]');
  button.disabled = true;
  button.textContent = "Logging in...";

  try {
    await setPersistence(auth, browserSessionPersistence);

    const { user } = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    window.location.replace(
      isManager(user) ? "management.html" : "home.html"
    );

  } catch (error) {
    console.error("Firebase login error:", error.code, error.message);

    const messages = {
      "auth/invalid-credential": "❌ Incorrect email or password.",
      "auth/wrong-password": "❌ Incorrect email or password.",
      "auth/user-not-found": "❌ Account not found.",
      "auth/unauthorized-domain": "❌ This website domain is not authorised in Firebase.",
      "auth/network-request-failed": "❌ Network error. Please try again."
    };

    loginError.textContent =
      messages[error.code] || `❌ Login failed: ${error.code || "Unknown error"}`;

    button.disabled = false;
    button.textContent = "Login";
  }
});
