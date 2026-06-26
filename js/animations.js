/* ── AWEBAI INTERACTIVE ANIMATIONS (Scroll Reveals & Filtering) ── */

// SCROLL REVEALS
function triggerSA() {
    const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add("in");
            } else {
                e.target.classList.remove("in");
            }
        });
    }, { threshold: .1 });
    
    document.querySelectorAll(".sa").forEach(el => io.observe(el));
}

// COUNT UP TIMERS FOR NUMERICAL METRICS
function countUp() {
    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                if (el.dataset.started) return;
                el.dataset.started = "true";
                
                const target = +el.dataset.target;
                const suffix = el.dataset.suffix || "+";
                let cur = 0;
                const step = Math.max(target / 45, 1); // smooth incremental step size
                const t = setInterval(() => {
                    cur = Math.min(cur + step, target);
                    el.textContent = Math.floor(cur) + suffix;
                    if (cur >= target) {
                        clearInterval(t);
                        el.textContent = target + suffix; // absolute termination value
                    }
                }, 24);
                
                io.unobserve(el);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll("[data-target]").forEach(el => io.observe(el));
}

// PORTFOLIO METRICS FILTERING
function filterPort(btn, cat) {
    document.querySelectorAll(".fbtn").forEach(b => b.classList.remove("on"));
    btn.classList.add("on");
    document.querySelectorAll(".pcard").forEach(c => {
        if (cat === "all" || c.dataset.cat === cat) {
            c.style.display = "block";
        } else {
            c.style.display = "none";
        }
    });
}

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", () => {
    triggerSA();
    setTimeout(countUp, 600);
});
