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

// Contact form submit state handler
function submitForm(btn) {
    btn.textContent = "✅ Sent! We'll reply within 24 hours.";
    btn.style.background = "linear-gradient(135deg,#059669,#065f46)";
    btn.disabled = true;
}

document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initDropdownOverlay();
});
