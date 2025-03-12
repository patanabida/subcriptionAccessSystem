// Backend API URL (Update if hosted)
const API_URL = "http://localhost:5000"; 

// Check if user is logged in (Runs on page load)
function checkAuth() {
    const token = localStorage.getItem("token");
    if (token && window.location.pathname.includes("index.html")) {
        window.location.href = "dashboard.html";
    }
}

// Register User
async function register() {
    const name = document.getElementById("reg-name").value;
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-password").value;

    const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();
    document.getElementById("message").innerText = data.message || "Registration successful!";
}

// Login User
async function login() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "dashboard.html";
    } else {
        document.getElementById("message").innerText = "Login failed!";
    }
}

// Fetch Subscription Content
async function getSubscriptionContent() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "index.html";
        return;
    }

    const response = await fetch(`${API_URL}/subscription/content`, {
        headers: { Authorization: token }
    });

    const data = await response.json();
    document.getElementById("current-plan").innerText = data.subscriptionPlan || "Unknown";
    document.getElementById("content").innerText = data.content;
}

// Upgrade Subscription Plan
async function upgradePlan(plan) {
    const token = localStorage.getItem("token");

    await fetch(`${API_URL}/subscription/subscribe`, {
        method: "PUT",
        headers: { 
            "Content-Type": "application/json", 
            Authorization: token 
        },
        body: JSON.stringify({ subscriptionPlan: plan })
    });

    alert(`Subscription upgraded to ${plan}`);
    getSubscriptionContent(); // Refresh content
}

// Logout
function logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}

// Auto-run functions based on the page
if (window.location.pathname.includes("dashboard.html")) {
    getSubscriptionContent();
} else {
    checkAuth();
}
//for togglemenu
function toggleMenu() {
    document.querySelector(".nav").classList.toggle("active");
    document.querySelector(".hamburger").classList.toggle("active");
}
