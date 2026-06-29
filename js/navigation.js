/* ── AWEBAI NAVIGATION (Active Links & Mobile Hamburger Menu) ── */

function initNavigation() {
    const burger = document.querySelector(".nav-burger");
    const navLinks = document.querySelector(".nav-links");
    
    // 1. MOBILE BURGER MENU TOGGLE
    if (burger && navLinks) {
        burger.addEventListener("click", (e) => {
            e.stopPropagation();
            burger.classList.toggle("open");
            navLinks.classList.toggle("open");
        });

        // Close menu when clicking outside
        document.addEventListener("click", (e) => {
            if (!navLinks.contains(e.target) && !burger.contains(e.target)) {
                burger.classList.remove("open");
                navLinks.classList.remove("open");
            }
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                burger.classList.remove("open");
                navLinks.classList.remove("open");
            });
        });
    }

    // 2. ACTIVE PAGE LINK HIGHLIGHTER
    const currentPath = window.location.pathname;
    let page = currentPath.split("/").pop();
    
    // Default to index.html if path is root
    if (!page || page === "") {
        page = "index.html";
    }

    document.querySelectorAll(".nav-links > li > a").forEach(a => {
        const href = a.getAttribute("href");
        if (href && (href === page || (href === "services.html" && (page === "web-development.html" || page === "ai-agents-automation.html" || page === "ui-ux-design.html" || page === "analytics-automation.html" || page === "saas-product-development.html" || page === "cloud-api-integration.html")) || (page === "index.html" && href === "#"))) {
            a.classList.add("active");
        } else {
            a.classList.remove("active");
        }
    });
}

// 3. DROPDOWN BACKDROP OVERLAY (SPOTLIGHT EFFECT)
function initDropdownOverlay() {
    let overlay = document.querySelector(".dropdown-overlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.className = "dropdown-overlay";
        document.body.appendChild(overlay);
    }

    const hasDropdown = document.querySelector(".has-dropdown");
    if (hasDropdown) {
        hasDropdown.addEventListener("mouseenter", () => {
            overlay.classList.add("active");
        });
        hasDropdown.addEventListener("mouseleave", () => {
            overlay.classList.remove("active");
        });

        // Close overlay when any link in the dropdown menu is clicked
        const dropdownLinks = hasDropdown.querySelectorAll(".dropdown-menu a");
        dropdownLinks.forEach(link => {
            link.addEventListener("click", () => {
                overlay.classList.remove("active");
            });
        });
    }
}

// Backend API Configuration
const API_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "https://your-production-backend-url.com"; // Replace with your production server URL when deployed

// Contact form submit state handler
async function submitForm(btn) {
    // Get input field values
    const fname = document.getElementById('fname')?.value || '';
    const lname = document.getElementById('lname')?.value || '';
    const email = document.getElementById('email')?.value || '';
    const serviceSelect = document.getElementById('serviceSelect');
    const service = serviceSelect ? serviceSelect.options[serviceSelect.selectedIndex].text : '';
    const msgText = document.getElementById('msgText')?.value || '';

    const originalText = btn.innerHTML;
    btn.innerHTML = `Sending... <span style="display:inline-block; animation: spin 1s linear infinite;">⏳</span>`;
    btn.disabled = true;

    try {
        const response = await fetch(`${API_BASE_URL}/api/contact`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                firstName: fname,
                lastName: lname,
                email: email,
                service: service,
                message: msgText
            })
        });

        const result = await response.json();
        if (response.ok && result.success) {
            btn.textContent = "✅ Sent! We'll reply within 24 hours.";
            btn.style.background = "linear-gradient(135deg,#059669,#065f46)";
        } else {
            const errMsg = result.errors ? result.errors.join(', ') : (result.message || "Something went wrong.");
            throw new Error(errMsg);
        }
    } catch (error) {
        console.error("Error submitting form:", error);
        alert("Failed to send message: " + error.message);
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

// Select interactive option card handler
function selectOption(element) {
    const parent = element.parentElement;
    const cards = parent.querySelectorAll('.qcard, .qcard-pill');
    cards.forEach(card => card.classList.remove('active'));
    element.classList.add('active');
}

// Quote form submit handler
async function submitQuote(btn) {
    // Get input field values
    const fname = document.getElementById('fname')?.value || '';
    const lname = document.getElementById('lname')?.value || '';
    const email = document.getElementById('email')?.value || '';
    const company = document.getElementById('company')?.value || '';
    const website = document.getElementById('website')?.value || '';
    const details = document.getElementById('details')?.value || '';

    // Get active selection card values
    const activeServiceCard = document.querySelector('.quote-options-grid .qcard.active');
    const activeBudgetCard = document.querySelector('.budget-grid .qcard-pill.active');
    const activeTimelineCard = document.querySelector('.timeline-grid .qcard-pill.active');

    if (!activeServiceCard) {
        alert("Please select a service type!");
        return;
    }
    if (!activeBudgetCard) {
        alert("Please select a budget range!");
        return;
    }
    if (!activeTimelineCard) {
        alert("Please select an estimated timeline!");
        return;
    }

    const service = activeServiceCard.querySelector('.qcard-title')?.textContent || '';
    const budget = activeBudgetCard.textContent.trim();
    const timeline = activeTimelineCard.textContent.trim();

    const originalText = btn.innerHTML;
    btn.innerHTML = `Submitting... <span style="display:inline-block; animation: spin 1s linear infinite;">⏳</span>`;
    btn.disabled = true;

    try {
        const response = await fetch(`${API_BASE_URL}/api/quote`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                firstName: fname,
                lastName: lname,
                email: email,
                company: company || "N/A",
                website: website || "N/A",
                service: service,
                budget: budget,
                timeline: timeline,
                message: details
            })
        });

        const result = await response.json();
        if (response.ok && result.success) {
            btn.textContent = "✅ Submitted! We'll reply within 24 hours.";
            btn.style.background = "linear-gradient(135deg,#059669,#065f46)";
        } else {
            const errMsg = result.errors ? result.errors.join(', ') : (result.message || "Something went wrong.");
            throw new Error(errMsg);
        }
    } catch (error) {
        console.error("Error submitting quote:", error);
        alert("Failed to submit quote inquiry: " + error.message);
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initDropdownOverlay();
});
