document.addEventListener('DOMContentLoaded', function() {
    createBackgroundAnimations();
    initializeForm();
    initializeScrollEffects();
    initializeContactButton();
    initializeSmoothScroll();
});

function createBackgroundAnimations() {
    const background = document.querySelector('.animated-background');
    background.innerHTML = '';

    const buildingConfigs = [
        { width: 60, height: 400 },    // Very tall
        { width: 40, height: 150 },    // Very short
        { width: 80, height: 300 },    // Medium-tall
        { width: 50, height: 220 },    // Medium
        { width: 70, height: 350 },    // Tall
        { width: 45, height: 180 },    // Short
        { width: 65, height: 280 },    // Medium
        { width: 55, height: 450 },    // Tallest
        { width: 75, height: 200 }     // Short-wide
    ];

    // Calculate spacing based on screen width
    const screenWidth = window.innerWidth;
    const numberOfBuildings = 10; // Reduced number of buildings
    const spacing = screenWidth / numberOfBuildings;

    // Create buildings with proper spacing
    for (let i = 0; i < numberOfBuildings; i++) {
        const config = buildingConfigs[Math.floor(Math.random() * buildingConfigs.length)];
        // Position each building with consistent spacing
        const position = (spacing * i) + (Math.random() * (spacing * 0.5)); // Add some randomness within the spacing
        createBuilding(background, config, position);
    }
}

// Update the createBuilding function in your JavaScript:

function createBuilding(container, config, position) {
    const building = document.createElement('div');
    building.className = 'building-sketch';

    // Set building dimensions and position
    building.style.width = `${config.width}px`;
    building.style.height = `${config.height}px`;
    building.style.left = `${position}px`;

    // Add animation
    building.style.animation = `
        float-building ${10 + Math.random() * 5}s infinite ease-in-out,
        fade-in 1s ease-out forwards
    `;
    building.style.animationDelay = `${Math.random() * 2}s`;

    // Add windows
    const windowRows = Math.floor(config.height / 25);
    const windowCols = Math.floor(config.width / 20);

    for (let row = 0; row < windowRows; row++) {
        for (let col = 0; col < windowCols; col++) {
            if (Math.random() > 0.2) {
                const windowEl = document.createElement('div');
                windowEl.className = 'building-window';
                windowEl.style.left = `${(col * 20) + 5}px`;
                windowEl.style.bottom = `${(row * 25) + 5}px`;
                building.appendChild(windowEl);
            }
        }
    }

    // More varied building tops
    const topVariation = Math.random();
    if (topVariation > 0.8) {
        // Pointed top
        building.style.borderTopLeftRadius = '50%';
        building.style.borderTopRightRadius = '50%';
    } else if (topVariation > 0.6) {
        // Slightly rounded top
        building.style.borderTopLeftRadius = '20px';
        building.style.borderTopRightRadius = '20px';
    } else if (topVariation > 0.4) {
        // Angular top
        building.style.borderTopLeftRadius = '0';
        building.style.borderTopRightRadius = '30px';
    }

    container.appendChild(building);
}

function initializeForm() {
    const form = document.getElementById('waitlistForm');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = form.querySelector('input[type="email"]').value;
            const submitButton = form.querySelector('button[type="submit"]');

            submitButton.disabled = true;
            submitButton.innerHTML = 'Joining...';

            try {
                // Replace this with your actual Apps Script URL
                const response = await fetch('https://script.google.com/macros/s/AKfycbw-IZdKPInaL2cHtU6PJNL8xdx8nHWP_5DFn5Sw4-2pFdBnQrP3BGoS6J1SbMmEYARY/exec', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: `email=${encodeURIComponent(email)}`
                });

                const result = await response.text();

                if (response.ok && result.includes('Success')) {
                    showNotification('Success! We will notify you when we are live');
                    form.reset();
                } else {
                    showNotification('Something went wrong. Try again.', 'error');
                }

            } catch (error) {
                showNotification('Error joining waitlist. Please try again.', 'error');
            } finally {
                submitButton.disabled = false;
                submitButton.innerHTML = 'Join Waitlist';
            }
        });
    }
}


function initializeContactButton() {
    const contactBtn = document.getElementById('contactBtn');
    if (contactBtn) {
        contactBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'mailto:support@sitesmart.co.in';
        });
    }
}

function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function showNotification(message, type = 'success') {
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease forwards';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}

function initializeScrollEffects() {
    const header = document.querySelector('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add background to header when scrolling
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

// Handle window resize
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        const background = document.querySelector('.animated-background');
        background.innerHTML = '';
        createBackgroundAnimations();
    }, 250);
});

// Initialize animations when page is fully loaded
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});