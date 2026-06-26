/* ── AWEBAI 3D BACKGROUND EFFECTS (Three.js / Vanta Globe) ── */

let vantaInited = false;

function initVanta() {
    const vantaEl = document.getElementById("vanta-bg");
    if (!vantaInited && vantaEl && typeof VANTA !== "undefined") {
        VANTA.GLOBE({
            el: "#vanta-bg",
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200,
            minWidth: 200,
            scale: 1,
            scaleMobile: 1,
            backgroundColor: 0x04060f,
            color: 0x2563eb,
            color2: 0x00d4ff,
            size: 1.2
        });
        vantaInited = true;
    }
}

// Automatically trigger on page load
document.addEventListener("DOMContentLoaded", () => {
    initVanta();
});
