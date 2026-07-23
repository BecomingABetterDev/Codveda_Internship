/**
 * SpeedCraft Labs - Bare-Metal Interactive Performance Engine
 * Fully decoupled from third-party runtime frameworks
 */

document.addEventListener("DOMContentLoaded", () => {
    // ==========================================================================
    // 1. HARDWARE ACCELERATED CUSTOM SYSTEM CURSOR
    // ==========================================================================
    const cursor = document.getElementById("js-cursor");
    const cursorRing = document.getElementById("js-cursor-ring");

    if (cursor && cursorRing) {
        let mouseX = 0,
            mouseY = 0;
        let ringX = 0,
            ringY = 0;

        window.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Render the small physical point instantaneously
            cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        });

        // Use requestAnimationFrame loop for hardware cursor lagging physics
        const updateRingPosition = () => {
            const ease = 0.15; // Smooth interpolation constant
            ringX += (mouseX - ringX) * ease;
            ringY += (mouseY - ringY) * ease;
            cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
            requestAnimationFrame(updateRingPosition);
        };
        requestAnimationFrame(updateRingPosition);

        // UI Interactive Hover Detection States
        const interactiveSelectors = 'a, button, input[type="range"], .metric-card';
        document.querySelectorAll(interactiveSelectors).forEach((element) => {
            element.addEventListener("mouseenter", () =>
                document.body.classList.add("cursor-hover")
            );
            element.addEventListener("mouseleave", () =>
                document.body.classList.remove("cursor-hover")
            );
        });
    }

    // ==========================================================================
    // 2. RADIAL SPOTLIGHT COMPOSITING
    // ==========================================================================
    const initFluidCanvas = () => {
        const canvas = document.createElement("canvas");
        const container =
            document.getElementById("js-hero") || document.querySelector(".hero");

        if (!container) return;

        // Setup styling to keep canvas locked strictly in background
        canvas.style.position = "absolute";
        canvas.style.top = "0";
        canvas.style.left = "0";
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.zIndex = "0";
        canvas.style.pointerEvents = "none"; // Let users click buttons below it
        canvas.style.opacity = "0.75";

        container.style.position = "relative";
        container.style.overflow = "hidden";
        container.insertBefore(canvas, container.firstChild);

        const ctx = canvas.getContext("2d");
        let width = (canvas.width = container.offsetWidth);
        let height = (canvas.height = container.offsetHeight);

        // Handle physical resizing cleanly
        window.addEventListener("resize", () => {
            width = canvas.width = container.offsetWidth;
            height = canvas.height = container.offsetHeight;
        });

        // Interactive particle physics
        const particles = [];
        const maxParticles = 65; // High-performance ceiling

        const mouse = { x: null, y: null, active: false };

        container.addEventListener("mousemove", (e) => {
            const rect = container.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
            mouse.active = true;
        });

        container.addEventListener("mouseleave", () => {
            mouse.active = false;
        });

        class FluidFilament {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.8;
                this.vy = (Math.random() - 0.5) * 0.8;
                this.radius = Math.random() * 1.5 + 1;
                this.alpha = Math.random() * 0.5 + 0.1;
                this.life = Math.random() * 200 + 100;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.life--;

                // Attract toward mouse if cursor is active
                if (mouse.active && mouse.x !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 220) {
                        const force = (220 - dist) / 220;
                        this.vx += (dx / dist) * force * 0.08;
                        this.vy += (dy / dist) * force * 0.08;
                    }
                }

                // Drag/Inertia limit
                this.vx *= 0.98;
                this.vy *= 0.98;

                // Boundary bounds check
                if (
                    this.x < 0 ||
                    this.x > width ||
                    this.y < 0 ||
                    this.y > height ||
                    this.life <= 0
                ) {
                    this.reset();
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 240, 255, ${this.alpha})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < maxParticles; i++) {
            particles.push(new FluidFilament());
        }

        // Optimized rendering loop using high-frequency Frame cycles
        const renderLoop = () => {
            ctx.clearRect(0, 0, width, height);

            // Generate glowing vectors connections (the kinetic mesh)
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 100) {
                        const alpha = ((100 - dist) / 100) * 0.15;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(0, 255, 170, ${alpha})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            if (!document.hidden) {
                requestAnimationFrame(renderLoop);
            }
        };
        renderLoop();
    };
    initFluidCanvas();

    // ==========================================================================
    // 3. ENTRANCE REVEALS & COMPOSING NUMERICAL METRIC COUNTERS
    // ==========================================================================
    const metricsSection = document.getElementById("js-metrics-section");
    const scrollRevealItems = document.querySelectorAll(".reveal-on-scroll");

    const runNumberAnimation = (
        targetElement,
        finalVal,
        suffix = "",
        duration = 1500
    ) => {
        let startTimestamp = null;
        const startValue = 0;

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentVal = progress * (finalVal - startValue) + startValue;

            // Format decimal precision depending on target
            if (finalVal % 1 === 0) {
                targetElement.textContent = `${Math.floor(currentVal)}${suffix}`;
            } else {
                targetElement.textContent = `${currentVal.toFixed(1)}${suffix}`;
            }

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                targetElement.textContent = `${finalVal}${suffix}`;
            }
        };
        requestAnimationFrame(step);
    };

    // Use a high-efficiency Intersection Observer to trigger scroll animations
    if (metricsSection && scrollRevealItems.length > 0) {
        const observer = new IntersectionObserver(
            (entries, self) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        scrollRevealItems.forEach((item) => {
                            item.classList.add("reveal-on-scroll--active");

                            // Fire the corresponding animated incremental metric value
                            const valueNode = item.querySelector(".metric-card__value");
                            if (valueNode && !valueNode.classList.contains("counted")) {
                                valueNode.classList.add("counted");
                                const target = parseFloat(
                                    valueNode.getAttribute("data-target")
                                );
                                const suffix = target === 40 ? "ms" : target === 1.2 ? "s" : "";
                                runNumberAnimation(valueNode, target, suffix);
                            }
                        });
                        self.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15 }
        );

        observer.observe(metricsSection);
    }

    // ==========================================================================
    // 4. PERFORMANCE SANDBOX SIMULATOR & TERMINAL LOG STREAMER
    // ==========================================================================
    const slider = document.getElementById("budget-slider");
    const sliderValueDisplay = document.getElementById("slider-value");
    const lcpDisplay = document.getElementById("output-lcp");
    const retentionDisplay = document.getElementById("output-retention");
    const terminalBody = document.getElementById("js-terminal-body");

    if (slider) {
        const appendTerminalLine = (message, type = "info") => {
            if (!terminalBody) return;
            const line = document.createElement("div");
            line.className = "sandbox-terminal__line";

            const timestamp = new Date().toISOString().slice(11, 19);

            let prefix = `<span class="sandbox-terminal__prefix">[${timestamp}] [SYS_INFO]:</span>`;
            if (type === "warning") {
                prefix = `<span class="sandbox-terminal__warning">[${timestamp}] [WARN]:</span>`;
            } else if (type === "error") {
                prefix = `<span class="sandbox-terminal__error">[${timestamp}] [ERR_DEGRADED]:</span>`;
            }

            line.innerHTML = `${prefix} ${message}`;
            terminalBody.appendChild(line);

            // Limit buffer size to prevent memory leaks
            if (terminalBody.children.length > 15) {
                terminalBody.removeChild(terminalBody.firstChild);
            }

            terminalBody.scrollTop = terminalBody.scrollHeight;
        };

        const updateMetrics = (weight) => {
            const pageWeight = parseFloat(weight);
            const calculatedLcp = (pageWeight * 0.6).toFixed(1);
            let retentionPercentage = Math.round(100 - pageWeight * 8);
            if (retentionPercentage < 10) retentionPercentage = 10;

            sliderValueDisplay.textContent = `${pageWeight.toFixed(1)} MB`;
            lcpDisplay.textContent = `${calculatedLcp}s`;
            retentionDisplay.textContent = `${retentionPercentage}%`;

            // State indicators
            if (pageWeight <= 1.5) {
                lcpDisplay.style.color = "var(--accent)";
                retentionDisplay.style.color = "var(--accent)";
                appendTerminalLine(
                    `Asset size safe. Current payload: ${pageWeight}MB. LCP standard is optimized.`
                );
            } else if (pageWeight > 1.5 && pageWeight <= 3.0) {
                lcpDisplay.style.color = "var(--color-orange)";
                retentionDisplay.style.color = "var(--color-orange)";
                appendTerminalLine(
                    `Performance warning. Thread blocking observed. Payload: ${pageWeight}MB.`,
                    "warning"
                );
            } else {
                lcpDisplay.style.color = "#ef4444";
                retentionDisplay.style.color = "#ef4444";
                appendTerminalLine(
                    `CRITICAL threshold reached. Core Web Vitals compromised. User loss risk at ${
            100 - retentionPercentage
          }%.`,
                    "error"
                );
            }
        };

        slider.addEventListener("input", (e) => {
            updateMetrics(e.target.value);
        });
    }

    // ==========================================================================
    // 5. TOAST DISPATCHER & SYSTEM NOTIFICATIONS
    // ==========================================================================
    window.showSystemToast = (message, type = "info") => {
        let container = document.querySelector(".toast-container");
        if (!container) {
            container = document.createElement("div");
            container.className = "toast-container";
            document.body.appendChild(container);
        }

        const toast = document.createElement("div");
        toast.className = "toast";
        if (type === "warning") toast.style.borderLeftColor = "var(--color-orange)";
        if (type === "error") toast.style.borderLeftColor = "#ef4444";

        toast.innerHTML = `
            <span>${message}</span>
        `;
        container.appendChild(toast);

        // Auto remove toast after standard read duration
        setTimeout(() => {
            toast.style.animation = "slideIn 0.3s ease reverse forwards";
            toast.addEventListener("animationend", () => {
                toast.remove();
                if (container.children.length === 0) container.remove();
            });
        }, 3500);
    };

    // Clean hook for contact page form submission
    const contactForm = document.querySelector(".contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const nameInput = document.getElementById("client-name");
            const emailInput = document.getElementById("client-email");
            const msgInput = document.getElementById("client-message");

            if (!nameInput.value || !emailInput.value || !msgInput.value) {
                window.showSystemToast(
                    "Validation failure: Payload variables incomplete.",
                    "warning"
                );
                return;
            }

            // Clean submission confirmation toast
            window.showSystemToast(
                `Data Packet dispatched. Operator "${nameInput.value}" authorized.`
            );
            contactForm.reset();
        });
    }
});