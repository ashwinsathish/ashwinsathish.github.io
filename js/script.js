// Mobile menu toggle with animation
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('open');
        mobileMenu.classList.toggle('open');
    });

    // Add smooth scroll to all navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', smoothScroll);
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

    // Back to top functionality
    const backToTopButton = document.getElementById('backToTop');

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

    // Copy citation buttons
    const copyButtons = document.querySelectorAll('.copy-citation-btn');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const citation = button.getAttribute('data-citation');
            
            // Create a temporary textarea to copy the text
            const tempTextArea = document.createElement('textarea');
            tempTextArea.value = citation;
            document.body.appendChild(tempTextArea);
            
            // Select and copy the text
            tempTextArea.select();
            document.execCommand('copy');
            
            // Remove the temporary textarea
            document.body.removeChild(tempTextArea);
            
            // Provide visual feedback
            button.innerHTML = '<i class="fas fa-check text-green-500"></i>';
            
            // Reset the button after 2 seconds
            setTimeout(() => {
                button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>`;
            }, 2000);
        });
    });

    // Theme toggle functionality
    function initializeTheme() {
        const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
        const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');
        const themeToggleDarkIconMobile = document.getElementById('theme-toggle-dark-icon-mobile');
        const themeToggleLightIconMobile = document.getElementById('theme-toggle-light-icon-mobile');

        // Function to update icons based on theme
        function updateIcons(isDark) {
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
        document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
        document.getElementById('theme-toggle-mobile').addEventListener('click', toggleTheme);
    }

    // Call the function when the page loads
    initializeTheme();

    // Modal functionality
    const modalContainer = document.getElementById('modal-container');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    const closeButtons = document.querySelectorAll('.modal-close-btn');
    
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

    // Function to open modal
    async function openModal(projectId) {
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

    // Function to close modal
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
