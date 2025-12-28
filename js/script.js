// Mobile menu toggle with animation
document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.getElementById('mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('open');
            mobileMenu.classList.toggle('open');
        });

        // Close mobile menu when clicking a link
        document.querySelectorAll('.mobile-menu .nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('open');
                mobileMenu.classList.remove('open');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
                hamburger.classList.remove('open');
                mobileMenu.classList.remove('open');
            }
        });
    }

    // Add smooth scroll to all navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', smoothScroll);
    });

    // Back to top functionality
    const backToTopButton = document.getElementById('backToTop');

    if (backToTopButton) {
        const toggleBackToTopButton = () => {
            if (window.pageYOffset > 200) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        };

        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            requestAnimationFrame(toggleBackToTopButton);
        });

        // Smooth scroll to top
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Copy citation buttons
    const copyButtons = document.querySelectorAll('.copy-citation-btn');

    copyButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const citation = button.getAttribute('data-citation');
            if (!citation) return;

            try {
                // Use modern Clipboard API
                await navigator.clipboard.writeText(citation);

                // Store original HTML for restoration
                const originalHTML = button.innerHTML;

                // Provide visual feedback
                button.innerHTML = '<i class="fas fa-check text-green-500"></i>';

                // Reset the button after 2 seconds
                setTimeout(() => {
                    button.innerHTML = originalHTML;
                }, 2000);
            } catch (err) {
                // Fallback for browsers that don't support Clipboard API
                const tempTextArea = document.createElement('textarea');
                tempTextArea.value = citation;
                tempTextArea.style.position = 'fixed';
                tempTextArea.style.opacity = '0';
                document.body.appendChild(tempTextArea);
                tempTextArea.select();

                try {
                    document.execCommand('copy');
                    const originalHTML = button.innerHTML;
                    button.innerHTML = '<i class="fas fa-check text-green-500"></i>';
                    setTimeout(() => {
                        button.innerHTML = originalHTML;
                    }, 2000);
                } catch (fallbackErr) {
                    console.error('Failed to copy citation:', fallbackErr);
                } finally {
                    document.body.removeChild(tempTextArea);
                }
            }
        });
    });

    // Theme toggle functionality
    function initializeTheme() {
        const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
        const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');
        const themeToggleDarkIconMobile = document.getElementById('theme-toggle-dark-icon-mobile');
        const themeToggleLightIconMobile = document.getElementById('theme-toggle-light-icon-mobile');
        const themeToggle = document.getElementById('theme-toggle');
        const themeToggleMobile = document.getElementById('theme-toggle-mobile');

        // Function to update icons based on theme
        function updateIcons(isDark) {
            if (themeToggleLightIcon && themeToggleDarkIcon && themeToggleLightIconMobile && themeToggleDarkIconMobile) {
                if (isDark) {
                    themeToggleLightIcon.classList.remove('hidden');
                    themeToggleDarkIcon.classList.add('hidden');
                    themeToggleLightIconMobile.classList.remove('hidden');
                    themeToggleDarkIconMobile.classList.add('hidden');
                } else {
                    themeToggleDarkIcon.classList.remove('hidden');
                    themeToggleLightIcon.classList.add('hidden');
                    themeToggleDarkIconMobile.classList.remove('hidden');
                    themeToggleLightIconMobile.classList.add('hidden');
                }
            }
        }

        // Set initial state
        if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
            updateIcons(true);
        } else {
            document.documentElement.classList.remove('dark');
            updateIcons(false);
        }

        // Function to toggle theme
        function toggleTheme() {
            if (localStorage.getItem('color-theme')) {
                if (localStorage.getItem('color-theme') === 'light') {
                    document.documentElement.classList.add('dark');
                    localStorage.setItem('color-theme', 'dark');
                    updateIcons(true);
                } else {
                    document.documentElement.classList.remove('dark');
                    localStorage.setItem('color-theme', 'light');
                    updateIcons(false);
                }
            } else {
                if (document.documentElement.classList.contains('dark')) {
                    document.documentElement.classList.remove('dark');
                    localStorage.setItem('color-theme', 'light');
                    updateIcons(false);
                } else {
                    document.documentElement.classList.add('dark');
                    localStorage.setItem('color-theme', 'dark');
                    updateIcons(true);
                }
            }
        }

        // Add click handlers to both buttons
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }
        if (themeToggleMobile) {
            themeToggleMobile.addEventListener('click', toggleTheme);
        }
    }

    // Call the function when the page loads
    initializeTheme();

    // Modal functionality
    const modalContainer = document.getElementById('modal-container');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    const closeButtons = document.querySelectorAll('.modal-close-btn');

    // Check if modal elements exist before proceeding
    if (!modalContainer || !modalBackdrop || !modalTitle || !modalContent) {
        console.warn('Modal elements not found. Modal functionality may not work correctly.');
    }

    // Mapping of project IDs to their corresponding modal HTML file paths
    const projectModalPaths = {
        'virtual-5g': 'modals/virtual-5g.html',
        'aerial-irs': 'modals/aerial-irs.html',
        'photonic-crystal': 'modals/photonic-crystal.html',
        'lidar-irs': 'modals/lidar-irs.html',
        'plasmonic-sensor': 'modals/plasmonic-sensor.html',
        'fdtd-modelling': 'modals/fdtd-modelling.html',
        'book-recommender': 'modals/book-recommender.html',
        'gen-ai-outfit': 'modals/gen-ai-outfit.html'
    };

    // Project details for modal titles
    const projectDetails = {
        'virtual-5g': { title: 'Virtual 5G Testbeds' },
        'aerial-irs': { title: 'Aerial IRS-assisted Wireless Communications' },
        'photonic-crystal': { title: 'Photonic Crystal-based SPR Sensor' },
        'lidar-irs': { title: 'LiDAR-enabled IRS Beamforming' },
        'plasmonic-sensor': { title: 'Metamaterial-based Plasmonic Biosensor' },
        'fdtd-modelling': { title: 'FDTD Modelling for Non-destructive Testing' },
        'book-recommender': { title: 'Hyperbolic Book Recommender System' },
        'gen-ai-outfit': { title: 'GenAI Outfit Recommender' }
    };

    // Function to load modal content
    async function loadModalContent(projectId) {
        try {
            const response = await fetch(projectModalPaths[projectId]);
            if (!response.ok) {
                throw new Error('Modal content not found');
            }
            return await response.text();
        } catch (error) {
            console.error('Error loading modal content:', error);
            return `<p class="text-red-500">Error loading project details. ${error.message}</p>`;
        }
    }

    async function openModal(projectId) {
        if (!modalContainer || !modalTitle || !modalContent) {
            console.error('Modal elements not found');
            return;
        }

        try {
            // Get the project details object
            const project = projectDetails[projectId];

            // Load modal content
            const modalHtml = await loadModalContent(projectId);

            // Set modal content
            modalTitle.textContent = project ? project.title : 'Project Details';
            modalContent.innerHTML = modalHtml;

            // Show modal
            modalContainer.classList.remove('hidden');
            document.body.style.overflow = 'hidden';

            // Hide back to top button when modal is open
            const backToTopBtn = document.getElementById('backToTop');
            if (backToTopBtn) {
                backToTopBtn.classList.remove('visible');
            }

            // Animation
            modalContainer.animate([
                { opacity: 0, transform: 'scale(0.95)' },
                { opacity: 1, transform: 'scale(1)' }
            ], {
                duration: 200,
                easing: 'ease-out'
            });
        } catch (error) {
            console.error('Error opening modal:', error);
        }
    }

    // In your closeModal function:
    function closeModal() {
        modalContainer.animate([
            { opacity: 1, transform: 'scale(1)' },
            { opacity: 0, transform: 'scale(0.95)' }
        ], {
            duration: 150,
            easing: 'ease-in'
        }).onfinish = () => {
            modalContainer.classList.add('hidden');
            document.body.style.overflow = '';

            // Check scroll position and show back to top button if needed
            if (window.pageYOffset > 200) {
                document.getElementById('backToTop').classList.add('visible');
            }
        };
    }

    // Event listeners for closing modal
    closeButtons.forEach(button => {
        button.addEventListener('click', closeModal);
    });

    modalBackdrop.addEventListener('click', closeModal);

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modalContainer.classList.contains('hidden')) {
            closeModal();
        }
    });

    // Add click handlers to project cards
    document.querySelectorAll('.project-card').forEach(card => {
        const projectId = card.dataset.projectId;
        const links = card.querySelectorAll('a');

        card.addEventListener('click', (e) => {
            // Check if click was on or inside a link
            let clickedLink = false;
            links.forEach(link => {
                if (link.contains(e.target)) {
                    clickedLink = true;
                }
            });

            if (!clickedLink) {
                openModal(projectId);
            }
        });
    });
});

// Smooth scroll function
function smoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    if (targetId === "#") return;

    const targetElement = document.querySelector(targetId);
    const headerOffset = 60;
    const elementPosition = targetElement.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
        duration: 1500
    });
}
