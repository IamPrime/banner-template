// Back to Top Button Implementation
// Creates a floating button that appears when scrolling down and smoothly scrolls to top when clicked

(function() {
    'use strict';
    
    // Create back to top button
    function createBackToTopButton() {
        // Check if button already exists
        if (document.getElementById('back-to-top-btn')) {
            return;
        }
        
        const button = document.createElement('button');
        button.id = 'back-to-top-btn';
        button.className = 'back-to-top';
        button.innerHTML = '↑';
        button.title = 'Back to Top';
        button.setAttribute('aria-label', 'Back to Top');
        
        // Add click event
        button.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Add to page
        document.body.appendChild(button);
        
        return button;
    }
    
    // Show/hide button based on scroll position
    function handleScroll() {
        const button = document.getElementById('back-to-top-btn');
        if (!button) return;
        
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 300) {
            button.classList.add('show');
        } else {
            button.classList.remove('show');
        }
    }
    
    // Initialize back to top functionality
    function initBackToTop() {
        createBackToTopButton();
        
        // Add scroll listener
        window.addEventListener('scroll', handleScroll);
        
        // Initial check
        handleScroll();
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBackToTop);
    } else {
        initBackToTop();
    }
    
    // For MkDocs Material instant loading compatibility
    if (typeof document$ !== "undefined") {
        document$.subscribe(function() {
            // Small delay to ensure page is fully loaded
            setTimeout(initBackToTop, 100);
        });
    }
})();