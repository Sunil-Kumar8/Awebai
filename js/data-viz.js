/* ── AWEBAI 3D INTERACTIVE DATA STREAM (Three.js WebGL Particle Wave) ── */

(function() {
    document.addEventListener("DOMContentLoaded", () => {
        const container = document.querySelector(".data-viz-container");
        const canvas = document.querySelector(".data-viz__canvas");
        if (!container || !canvas) return;

        let width = container.clientWidth;
        let height = container.clientHeight;

        // 1. Scene & Camera Setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.set(0, 85, 140);
        camera.lookAt(0, -10, 0);

        // 2. WebGL WebGLRenderer Setup
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true,
            powerPreference: "high-performance"
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // 3. Generate Crisp Sharp Circular Node Texture (Pure White for 3D Illusion Look)
        function createCircleTexture() {
            const c = document.createElement('canvas');
            c.width = 32;
            c.height = 32;
            const ctx = c.getContext('2d');
            const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 8);
            grad.addColorStop(0, '#ffffff');                     // Pure white center
            grad.addColorStop(0.85, 'rgba(255, 255, 255, 0.95)');// Crisp white body
            grad.addColorStop(1, 'rgba(255, 255, 255, 0)');      // Transparent outer boundary
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 32, 32);
            return new THREE.CanvasTexture(c);
        }
        const texture = createCircleTexture();

        // 4. Create 3D Particle Grid (60 x 40 = 2400 Particles)
        const cols = 60;
        const rows = 40;
        const numParticles = cols * rows;

        const positions = new Float32Array(numParticles * 3);
        const spacingX = 4.2;
        const spacingZ = 4.2;
        const startX = -((cols - 1) * spacingX) / 2;
        const startZ = -((rows - 1) * spacingZ) / 2;

        let index = 0;
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                positions[index * 3] = startX + i * spacingX; // X
                positions[index * 3 + 1] = 0;                  // Y
                positions[index * 3 + 2] = startZ + j * spacingZ; // Z
                index++;
            }
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        // 5. Points Material with additive neon blending
        const material = new THREE.PointsMaterial({
            size: 5.6,
            map: texture,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });

        const particleSystem = new THREE.Points(geometry, material);
        scene.add(particleSystem);

        // 6. Interactive Raycast Mouse Plane Coordinate Intersection
        let mouseX = 0;
        let mouseZ = 0;
        let targetMouseX = 0;
        let targetMouseZ = 0;
        let isHovered = false;

        const raycaster = new THREE.Raycaster();
        const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0); // Horizontal intersection plane at Y=0

        container.addEventListener("mousemove", (e) => {
            const rect = container.getBoundingClientRect();
            // Translate screen mouse coordinates to normalized device coordinates (-1 to +1)
            const x = ((e.clientX - rect.left) / width) * 2 - 1;
            const y = -((e.clientY - rect.top) / height) * 2 + 1;
            
            raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
            const intersection = new THREE.Vector3();
            raycaster.ray.intersectPlane(plane, intersection);
            
            targetMouseX = intersection.x;
            targetMouseZ = intersection.z;
            isHovered = true;
        });

        container.addEventListener("mouseenter", () => {
            isHovered = true;
        });

        container.addEventListener("mouseleave", () => {
            isHovered = false;
        });

        // 7. Interactive Physics rendering loop
        let count = 0;
        function animate() {
            requestAnimationFrame(animate);

            count += 0.015;

            // Interpolate coordinates smoothly to create trailing physics lag
            mouseX += (targetMouseX - mouseX) * 0.08;
            mouseZ += (targetMouseZ - mouseZ) * 0.08;

            const posAttr = geometry.attributes.position;
            const posArray = posAttr.array;

            let idx = 0;
            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const xCoord = posArray[idx * 3];
                    const zCoord = posArray[idx * 3 + 2];

                    // Baseline wave mechanics
                    let Y = Math.sin(i * 0.16 + count) * 4.5 +
                            Math.cos(j * 0.14 + count) * 4.5;

                    // Compute mouse ripples inside the gravitational bubble radius
                    if (isHovered) {
                        const dx = xCoord - mouseX;
                        const dz = zCoord - mouseZ;
                        const dist = Math.sqrt(dx * dx + dz * dz);
                        
                        if (dist < 42) {
                            const strength = (1 - dist / 42) * 16;
                            // Add a beautiful pulsing concentric wave pushing particles down/up
                            Y += Math.sin(dist * 0.28 - count * 4) * strength;
                        }
                    }

                    posArray[idx * 3 + 1] = Y; // Update Y coordinates
                    idx++;
                }
            }

            posAttr.needsUpdate = true;

            // Subtle rotation grid effect
            particleSystem.rotation.y = Math.sin(count * 0.1) * 0.05;

            renderer.render(scene, camera);
        }
        animate();

        // 8. Fluid resizing via ResizeObserver
        const resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                width = container.clientWidth;
                height = container.clientHeight;

                camera.aspect = width / height;
                camera.updateProjectionMatrix();

                renderer.setSize(width, height);
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            }
        });
        resizeObserver.observe(container);
    });
})();
