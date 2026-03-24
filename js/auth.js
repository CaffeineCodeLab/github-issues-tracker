const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

function handleLogin() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMsg = document.getElementById("error-msg");

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        localStorage.setItem("isLoggedIn", "true");
        window.location.herf="main.html";
    } else {
        errorMsg.classList.remove("hidden");
    }
}

document.addEventListener("keydown", function(e) {
    if(e.key === "Enter") handleLogin();
});
