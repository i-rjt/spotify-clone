// script.js

const gravity = 0.5;  // Simulate gravity effect
const bounceFactor = 0.7; // Energy loss on bounce
const resetTime = 6000; // 6 seconds

function makeThrowable(element) {
    let isDragging = false;
    let offsetX, offsetY;
    let originalPosition = { top: element.offsetTop, left: element.offsetLeft };

    // Store velocity for physics
    let velocityX = 0, velocityY = 0;

    // Enable dragging
    element.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.clientX - element.offsetLeft;
        offsetY = e.clientY - element.offsetTop;
        element.style.transition = "none"; // Disable smooth transition while dragging
    });

    // Drag the element
    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;
        }
    });

    // Throw the element
    document.addEventListener("mouseup", (e) => {
        if (isDragging) {
            isDragging = false;
            velocityX = (e.movementX || 0) * 1.5; // Capture throw velocity
            velocityY = (e.movementY || 0) * 1.5;
            animateThrow(element, originalPosition);
        }
    });

    // Animate the throw with bounce
    function animateThrow(el, originalPos) {
        let posX = el.offsetLeft;
        let posY = el.offsetTop;

        function frame() {
            // Update positions based on velocity
            posX += velocityX;
            posY += velocityY;

            // Bounce off the walls
            if (posX <= 0 || posX + el.offsetWidth >= window.innerWidth) {
                velocityX = -velocityX * bounceFactor;
                posX = Math.max(0, Math.min(posX, window.innerWidth - el.offsetWidth));
            }
            if (posY <= 0 || posY + el.offsetHeight >= window.innerHeight) {
                velocityY = -velocityY * bounceFactor;
                posY = Math.max(0, Math.min(posY, window.innerHeight - el.offsetHeight));
            }

            // Simulate gravity
            velocityY += gravity;

            // Apply the new position
            el.style.left = `${posX}px`;
            el.style.top = `${posY}px`;

            // Stop the animation if velocity is almost zero
            if (Math.abs(velocityX) < 0.1 && Math.abs(velocityY) < 0.1) {
                clearInterval(animation);
            }
        }

        // Start animation
        const animation = setInterval(frame, 16); // 60 fps

        // Reset after 6 seconds
        setTimeout(() => {
            clearInterval(animation);
            el.style.transition = "all 1s ease";
            el.style.left = `${originalPos.left}px`;
            el.style.top = `${originalPos.top}px`;
        }, resetTime);
    }
}

// Initialize all movable elements
document.querySelectorAll(".spotify-icon, .home-icon,.search-icon").forEach(makeThrowable);
