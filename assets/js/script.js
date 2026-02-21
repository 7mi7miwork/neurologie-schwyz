/**
 * Neurologie Zentralschweiz AG Website - Main JavaScript
 * Modern, accessible, and performant website functionality
 */

// Use strict mode for better error handling
'use strict';

// Global configuration
const CONFIG = {
    // Animation settings
    animationDuration: 300,
    scrollOffset: 80,
    
    // Form settings
    formTimeout: 5000,
    
    // Performance settings
    debounceDelay: 250,
    throttleDelay: 16,
    
    // Accessibility settings
    focusTimeout: 100,
    
    // Breakpoints
    breakpoints: {
        mobile: 768,
        tablet: 1024,
        desktop: 1200
    }
};

// Utility functions
const Utils = {
    // Debounce function for performance optimization
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for scroll events
    throttle: (func, limit) => {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Check if element is in viewport
    isInViewport: (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Smooth scroll with offset
    smoothScroll: (target, offset = CONFIG.scrollOffset) => {
        const targetElement = document.querySelector(target);
        if (targetElement) {
            const targetPosition = targetElement.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    },

    // Set focus with delay for screen readers
    setFocusWithDelay: (element, delay = CONFIG.focusTimeout) => {
        setTimeout(() => {
            element.focus();
        }, delay);
    },

    // Get current breakpoint
    getBreakpoint: () => {
        const width = window.innerWidth;
        if (width < CONFIG.breakpoints.mobile) return 'mobile';
        if (width < CONFIG.breakpoints.tablet) return 'tablet';
        if (width < CONFIG.breakpoints.desktop) return 'desktop';
        return 'large';
    }
};

// Mobile Navigation Module
const Navigation = {
    init() {
        this.cacheElements();
        this.bindEvents();
        this.setupAccessibility();
    },

    cacheElements() {
        this.navToggle = document.querySelector('.nav-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.body = document.body;
    },

    bindEvents() {
        if (this.navToggle && this.navMenu) {
            this.navToggle.addEventListener('click', () => this.toggleMenu());
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!this.navToggle.contains(e.target) && !this.navMenu.contains(e.target)) {
                    this.closeMenu();
                }
            });

            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.navMenu.classList.contains('active')) {
                    this.closeMenu();
                    this.navToggle.focus();
                }
            });

            // Handle link clicks
            this.navLinks.forEach(link => {
                link.addEventListener('click', () => this.closeMenu());
            });
        }

        // Handle scroll for header styling
        window.addEventListener('scroll', Utils.throttle(() => this.handleScroll(), CONFIG.throttleDelay));
    },

    setupAccessibility() {
        if (this.navToggle) {
            this.navToggle.setAttribute('aria-expanded', 'false');
            this.navToggle.setAttribute('aria-controls', 'nav-menu');
        }
    },

    toggleMenu() {
        const isActive = this.navMenu.classList.toggle('active');
        this.navToggle.classList.toggle('active');
        
        // Update ARIA attributes
        this.navToggle.setAttribute('aria-expanded', isActive);
        
        // Prevent body scroll when menu is open
        this.body.style.overflow = isActive ? 'hidden' : '';
        
        // Focus management
        if (isActive) {
            Utils.setFocusWithDelay(this.navMenu.querySelector('.nav-link'));
        }
    },

    closeMenu() {
        this.navMenu.classList.remove('active');
        this.navToggle.classList.remove('active');
        this.navToggle.setAttribute('aria-expanded', 'false');
        this.body.style.overflow = '';
    },

    handleScroll() {
        const header = document.querySelector('.header');
        if (header) {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    },

    setActiveLink() {
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop() || 'index.html';
        
        this.navLinks.forEach(link => {
            const linkPage = link.getAttribute('href').split('/').pop();
            const isActive = linkPage === currentPage || (currentPage === '' && linkPage === 'index.html');
            
            link.classList.toggle('active', isActive);
            link.setAttribute('aria-current', isActive ? 'page' : 'false');
        });
    }
};

// Form Module
const FormHandler = {
    init() {
        this.cacheElements();
        this.bindEvents();
        this.setupValidation();
        this.setupProgressIndicator();
        this.setupCharacterCounter();
    },

    cacheElements() {
        this.forms = document.querySelectorAll('.form');
        this.submitButtons = document.querySelectorAll('button[type="submit"]');
        this.progressFill = document.querySelector('.progress-fill');
        this.steps = document.querySelectorAll('.step');
        this.charCounter = document.querySelector('#char-count');
        this.messageTextarea = document.querySelector('#message');
    },

    setupProgressIndicator() {
        if (!this.progressFill || !this.steps.length) return;
        
        this.updateProgress();
        
        // Listen for form changes
        const form = document.querySelector('.form');
        if (form) {
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.addEventListener('input', () => this.updateProgress());
                input.addEventListener('change', () => this.updateProgress());
            });
        }
    },

    updateProgress() {
        const form = document.querySelector('.form');
        if (!form) return;
        
        const totalFields = form.querySelectorAll('input[required], select[required], textarea[required]').length;
        const filledFields = form.querySelectorAll('input[required]:valid, select[required]:valid, textarea[required]:valid').length;
        
        const progress = totalFields > 0 ? (filledFields / totalFields) * 100 : 0;
        
        if (this.progressFill) {
            this.progressFill.style.width = `${progress}%`;
        }
        
        // Update steps
        this.steps.forEach((step, index) => {
            const stepProgress = ((index + 1) / this.steps.length) * 100;
            step.classList.toggle('completed', progress >= stepProgress);
            step.classList.toggle('active', progress >= stepProgress && progress < stepProgress + (100 / this.steps.length));
        });
    },

    setupCharacterCounter() {
        if (!this.messageTextarea || !this.charCounter) return;
        
        this.messageTextarea.addEventListener('input', () => {
            const length = this.messageTextarea.value.length;
            const maxLength = 500;
            
            this.charCounter.textContent = length;
            
            const counter = this.charCounter.parentElement;
            counter.classList.remove('warning', 'danger');
            
            if (length > maxLength * 0.9) {
                counter.classList.add('danger');
            } else if (length > maxLength * 0.7) {
                counter.classList.add('warning');
            }
            
            // Prevent typing beyond limit
            if (length > maxLength) {
                this.messageTextarea.value = this.messageTextarea.value.substring(0, maxLength);
                this.charCounter.textContent = maxLength;
            }
        });
    },

    bindEvents() {
        this.forms.forEach(form => {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
            
            // Real-time validation
            const requiredFields = form.querySelectorAll('input[required], select[required], textarea[required]');
            requiredFields.forEach(field => {
                field.addEventListener('blur', () => this.validateField(field));
                field.addEventListener('input', () => {
                    if (field.classList.contains('error')) {
                        this.validateField(field);
                    }
                });
            });

            // Reset button
            const resetButton = form.querySelector('button[type="reset"]');
            if (resetButton) {
                resetButton.addEventListener('click', () => this.resetForm(form));
            }
        });

        // Button loading states
        this.submitButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleButtonClick(e));
        });
    },

    setupValidation() {
        // Set minimum date to today
        const dateInputs = document.querySelectorAll('input[type="date"]');
        const today = new Date().toISOString().split('T')[0];
        dateInputs.forEach(input => {
            input.setAttribute('min', today);
        });
    },

    handleSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        if (this.validateForm(form)) {
            this.submitForm(form);
        }
    },

    validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('input[required], select[required], textarea[required]');
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    },

    validateField(field) {
        const value = field.value.trim();
        const errorElement = document.getElementById(`${field.id}-error`);
        
        // Clear previous errors
        this.clearFieldError(field);
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            this.showFieldError(field, 'Dieses Feld ist erforderlich.');
            return false;
        }
        
        // Email validation
        if (field.type === 'email' && value && !this.isValidEmail(value)) {
            this.showFieldError(field, 'Bitte geben Sie eine gültige Email-Adresse ein.');
            return false;
        }
        
        // Phone validation
        if (field.type === 'tel' && value && !this.isValidPhone(value)) {
            this.showFieldError(field, 'Bitte geben Sie eine gültige Telefonnummer ein.');
            return false;
        }
        
        // Date validation
        if (field.type === 'date' && value) {
            const selectedDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                this.showFieldError(field, 'Das Datum darf nicht in der Vergangenheit liegen.');
                return false;
            }
        }
        
        return true;
    },

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    isValidPhone(phone) {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 7;
    },

    showFieldError(field, message) {
        field.classList.add('error');
        
        const errorElement = document.getElementById(`${field.id}-error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
        
        // Announce error to screen readers
        this.announceToScreenReader(`Fehler in ${field.labels[0]?.textContent || field.name}: ${message}`);
    },

    clearFieldError(field) {
        field.classList.remove('error');
        
        const errorElement = document.getElementById(`${field.id}-error`);
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    },

    submitForm(form) {
        const submitButton = form.querySelector('button[type="submit"]');
        const statusElement = document.getElementById('form-status');
        
        // Show loading state
        this.setButtonLoading(submitButton, true);
        
        // Simulate form submission
        setTimeout(() => {
            this.setButtonLoading(submitButton, false);
            this.showFormMessage(form, 'Vielen Dank für Ihre Anfrage. Wir werden uns so schnell wie möglich bei Ihnen melden.', 'success');
            form.reset();
            
            // Focus to status message for screen readers
            if (statusElement) {
                Utils.setFocusWithDelay(statusElement);
            }
        }, 1500);
    },

    setButtonLoading(button, isLoading) {
        const btnText = button.querySelector('.btn-text');
        const btnLoading = button.querySelector('.btn-loading');
        
        if (isLoading) {
            button.disabled = true;
            if (btnText) btnText.style.display = 'none';
            if (btnLoading) btnLoading.style.display = 'inline';
        } else {
            button.disabled = false;
            if (btnText) btnText.style.display = 'inline';
            if (btnLoading) btnLoading.style.display = 'none';
        }
    },

    showFormMessage(form, message, type) {
        const statusElement = document.getElementById('form-status');
        if (statusElement) {
            statusElement.textContent = message;
            statusElement.className = `form-status ${type} show`;
            
            // Auto-hide message
            setTimeout(() => {
                statusElement.classList.remove('show');
            }, CONFIG.formTimeout);
        }
    },

    resetForm(form) {
        // Clear all errors
        const fields = form.querySelectorAll('input, select, textarea');
        fields.forEach(field => this.clearFieldError(field));
        
        // Clear status message
        const statusElement = document.getElementById('form-status');
        if (statusElement) {
            statusElement.classList.remove('show');
        }
    },

    handleButtonClick(e) {
        const form = e.target.closest('form');
        if (form && !this.validateForm(form)) {
            e.preventDefault();
            // Focus to first error field
            const firstError = form.querySelector('.error');
            if (firstError) {
                Utils.setFocusWithDelay(firstError);
            }
        }
    },

    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
};

// Accessibility Module
const Accessibility = {
    init() {
        this.setupSkipLinks();
        this.setupFocusManagement();
        this.setupKeyboardNavigation();
    },

    setupSkipLinks() {
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(skipLink.getAttribute('href'));
                if (target) {
                    target.setAttribute('tabindex', '-1');
                    Utils.setFocusWithDelay(target);
                    target.removeAttribute('tabindex');
                }
            });
        }
    },

    setupFocusManagement() {
        // Add focus indicators
        const style = document.createElement('style');
        style.textContent = `
            *:focus {
                outline: 2px solid #2d5016;
                outline-offset: 2px;
            }
            
            button:focus,
            input:focus,
            select:focus,
            textarea:focus {
                outline: 2px solid #2d5016;
                outline-offset: 2px;
            }
            
            .nav-toggle:focus {
                outline: 2px solid #2d5016;
                outline-offset: 2px;
            }
        `;
        document.head.appendChild(style);
    },

    setupKeyboardNavigation() {
        // Handle tab navigation for mobile menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const navMenu = document.querySelector('.nav-menu');
                if (navMenu && navMenu.classList.contains('active')) {
                    const focusableElements = navMenu.querySelectorAll('a, button, input, select, textarea');
                    const firstElement = focusableElements[0];
                    const lastElement = focusableElements[focusableElements.length - 1];
                    
                    if (e.shiftKey && document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    } else if (!e.shiftKey && document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    }
};

// Performance Module
const Performance = {
    init() {
        this.setupLazyLoading();
        this.setupIntersectionObserver();
        this.optimizeImages();
        this.setupTooltips();
        this.setupSmoothScrolling();
    },

    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                        }
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });
            
            const lazyImages = document.querySelectorAll('img[loading="lazy"]');
            lazyImages.forEach(img => imageObserver.observe(img));
        }
    },

    setupIntersectionObserver() {
        // Animate elements on scroll with staggered delays
        if ('IntersectionObserver' in window) {
            const animateElements = document.querySelectorAll('.service-card, .team-member, .support-member, .hero-feature');
            
            const animationObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        const delay = index * 100; // Staggered animation
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }, delay);
                        animationObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1
            });
            
            animateElements.forEach((element, index) => {
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';
                element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                animationObserver.observe(element);
            });
        }
    },

    optimizeImages() {
        // Add loading="lazy" to images that don't have it
        const images = document.querySelectorAll('img:not([loading])');
        images.forEach(img => {
            if (!img.closest('.hero')) { // Don't lazy load hero images
                img.setAttribute('loading', 'lazy');
            }
        });
    },

    setupTooltips() {
        // Enhanced tooltip functionality
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.showTooltip(e.target);
            });
            
            element.addEventListener('mouseleave', (e) => {
                this.hideTooltip(e.target);
            });
            
            element.addEventListener('focus', (e) => {
                this.showTooltip(e.target);
            });
            
            element.addEventListener('blur', (e) => {
                this.hideTooltip(e.target);
            });
        });
    },

    showTooltip(element) {
        const tooltipText = element.getAttribute('data-tooltip');
        if (!tooltipText) return;
        
        // Remove existing tooltip
        this.hideTooltip(element);
        
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip-active';
        tooltip.textContent = tooltipText;
        tooltip.style.cssText = `
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            background: #333;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            font-size: 0.875rem;
            white-space: nowrap;
            z-index: 1000;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
            margin-bottom: 0.5rem;
        `;
        
        document.body.appendChild(tooltip);
        
        // Position tooltip
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + rect.width / 2 + 'px';
        tooltip.style.top = rect.top + 'px';
        
        // Fade in
        requestAnimationFrame(() => {
            tooltip.style.opacity = '1';
        });
        
        element._tooltip = tooltip;
    },

    hideTooltip(element) {
        if (element._tooltip) {
            element._tooltip.style.opacity = '0';
            setTimeout(() => {
                if (element._tooltip && element._tooltip.parentNode) {
                    element._tooltip.parentNode.removeChild(element._tooltip);
                }
                element._tooltip = null;
            }, 300);
        }
    },

    setupSmoothScrolling() {
        // Enhanced smooth scrolling for anchor links
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="#"]')) {
                e.preventDefault();
                const targetId = e.target.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update URL without jumping
                    history.pushState(null, null, `#${targetId}`);
                }
            }
        });
    }
};

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize modules
    Navigation.init();
    Navigation.setActiveLink();
    FormHandler.init();
    Accessibility.init();
    Performance.init();
    
    // Log successful initialization
    console.log('Neurologie Schwyz Website - All modules initialized successfully');
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden, pause any animations or timers
        document.body.classList.add('page-hidden');
    } else {
        // Page is visible, resume animations
        document.body.classList.remove('page-hidden');
    }
});

// Handle resize events with debouncing
window.addEventListener('resize', Utils.debounce(() => {
    // Update any layout-dependent functionality
    const breakpoint = Utils.getBreakpoint();
    document.body.setAttribute('data-breakpoint', breakpoint);
}, CONFIG.debounceDelay));

// Set initial breakpoint
document.body.setAttribute('data-breakpoint', Utils.getBreakpoint());
