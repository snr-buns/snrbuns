document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const enteredPassword = document.getElementById("password").value;
    const correctPassword = "burger123";
  
    if (enteredPassword === correctPassword) {
      window.location.href = "home.html";
    } else {
      document.getElementById("loginError").textContent = "Incorrect password. Please try again.";
    }
  });
  