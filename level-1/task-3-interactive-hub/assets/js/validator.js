/**
 * SpeedCraft Labs - Form Validation & Diagnostics Pipeline
 */
document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".contact-form");
    if (!form) return;

    // Create toast container dynamically if it doesn't exist
    let toastContainer = document.querySelector(".toast-container");
    if (!toastContainer) {
        toastContainer = document.createElement("div");
        toastContainer.className = "toast-container";
        document.body.appendChild(toastContainer);
    }

    // Helper to trigger premium system toasts
    const triggerToast = (message, isError = false) => {
        const toast = document.createElement("div");
        toast.className = "toast";
        if (isError) {
            toast.style.borderLeftColor = "#ef4444"; // Red accent for failures
        }

        toast.innerHTML = `
        <span style="color: ${
          isError ? "#ef4444" : "var(--accent)"
        }; font-weight: bold;">
          ${isError ? "[FAIL]" : "[SYSTEM]"}
        </span>
        <span>${message}</span>
      `;

        toastContainer.appendChild(toast);

        // Auto-remove toast after active duration
        setTimeout(() => {
            toast.style.animation =
                "slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) reverse forwards";
            setTimeout(() => toast.remove(), 350);
        }, 4000);
    };

    // Input styling feedback helpers
    const setInvalidStyle = (input) => {
        input.style.borderColor = "#ef4444";
        input.style.boxShadow = "0 0 12px rgba(239, 68, 68, 0.15)";
    };

    const clearStyle = (input) => {
        input.style.borderColor = "";
        input.style.boxShadow = "";
    };

    // Add real-time user-correction styling clearing
    const inputs = form.querySelectorAll(".contact-form__input");
    inputs.forEach((input) => {
        input.addEventListener("input", () => {
            if (input.value.trim() !== "") {
                clearStyle(input);
            }
        });
    });

    // Handle Submission Payload
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let hasErrors = false;

        const nameInput = document.getElementById("client-name");
        const emailInput = document.getElementById("client-email");
        const messageInput = document.getElementById("client-message");

        // Validate Name
        if (!nameInput.value.trim()) {
            setInvalidStyle(nameInput);
            hasErrors = true;
        } else {
            clearStyle(nameInput);
        }

        // Validate Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
            setInvalidStyle(emailInput);
            hasErrors = true;
        } else {
            clearStyle(emailInput);
        }

        // Validate Message Payload
        if (!messageInput.value.trim()) {
            setInvalidStyle(messageInput);
            hasErrors = true;
        } else {
            clearStyle(messageInput);
        }

        if (hasErrors) {
            triggerToast("Missing required transmission parameters.", true);
            return;
        }

        // Success State
        const submitBtn = form.querySelector(".contact-form__submit");
        const originalText = submitBtn.textContent;

        submitBtn.disabled = true;
        submitBtn.textContent = "TRANSMITTING...";

        setTimeout(() => {
            triggerToast("Payload successfully transmitted to SpeedCraft Labs.");
            form.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }, 1200);
    });
});