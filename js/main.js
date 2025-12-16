/**
 * LimeTree Accounting Solutions
 * Main JavaScript file
 */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize all modules
    initMobileMenu();
    initHeaderScroll();
    initSmoothScroll();
    initFormValidation();
    initAnimations();
});

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMain = document.querySelector('.nav-main');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!menuToggle || !navMain) return;

    menuToggle.addEventListener('click', function () {
        this.classList.toggle('active');
        navMain.classList.toggle('active');
        document.body.style.overflow = navMain.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            menuToggle.classList.remove('active');
            navMain.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navMain.classList.contains('active')) {
            menuToggle.classList.remove('active');
            navMain.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/**
 * Header scroll effect
 */
function initHeaderScroll() {
    const header = document.querySelector('.header');

    if (!header) return;

    let lastScroll = 0;

    window.addEventListener('scroll', function () {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    const anchors = document.querySelectorAll('a[href^="#"]:not([href="#"])');

    anchors.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();

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

/**
 * Form validation
 */
function initFormValidation() {
    const forms = document.querySelectorAll('form[data-validate]');

    forms.forEach(form => {
        form.addEventListener('submit', function (e) {
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');

            // Remove previous error states
            form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
            form.querySelectorAll('.error-message').forEach(el => el.remove());

            requiredFields.forEach(field => {
                if (!validateField(field)) {
                    isValid = false;
                    showError(field);
                }
            });

            // Validate email format
            const emailField = form.querySelector('input[type="email"]');
            if (emailField && emailField.value && !isValidEmail(emailField.value)) {
                isValid = false;
                showError(emailField, 'Please enter a valid email address');
            }

            // Validate phone format (optional)
            const phoneField = form.querySelector('input[type="tel"]');
            if (phoneField && phoneField.value && !isValidPhone(phoneField.value)) {
                isValid = false;
                showError(phoneField, 'Please enter a valid phone number');
            }

            if (!isValid) {
                e.preventDefault();

                // Scroll to first error
                const firstError = form.querySelector('.error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstError.focus();
                }
            }
        });

        // Real-time validation
        const fields = form.querySelectorAll('input, textarea, select');
        fields.forEach(field => {
            field.addEventListener('blur', function () {
                if (this.hasAttribute('required') && !validateField(this)) {
                    showError(this);
                } else {
                    clearError(this);
                }
            });

            field.addEventListener('input', function () {
                if (this.classList.contains('error')) {
                    if (validateField(this)) {
                        clearError(this);
                    }
                }
            });
        });
    });
}

function validateField(field) {
    if (field.type === 'checkbox') {
        return field.checked;
    }
    return field.value.trim() !== '';
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    // Allow various phone formats
    const phoneRegex = /^[\d\s\+\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

function showError(field, message = 'This field is required') {
    field.classList.add('error');
    field.style.borderColor = '#EF4444';

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = '#EF4444';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    errorDiv.textContent = message;

    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    field.parentNode.appendChild(errorDiv);
}

function clearError(field) {
    field.classList.remove('error');
    field.style.borderColor = '';

    const errorDiv = field.parentNode.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
}

/**
 * Scroll animations
 */
function initAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if (animatedElements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

/**
 * Utility: Format phone number for display
 */
function formatPhoneNumber(phone) {
    return phone.replace(/(\d{5})(\d{6})/, '$1 $2');
}

/**
 * Utility: Track outbound links (for analytics)
 */
function trackOutboundLink(url) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'click', {
            'event_category': 'outbound',
            'event_label': url,
            'transport_type': 'beacon'
        });
    }
}

/**
 * Google Ads conversion tracking helper
 * Call this function when a form is submitted successfully
 */
function trackConversion(conversionLabel) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'conversion', {
            'send_to': conversionLabel
        });
    }
}

/**
 * Cookie consent helper (basic)
 */
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = name + '=' + value + ';expires=' + expires.toUTCString() + ';path=/';
}

function getCookie(name) {
    const value = '; ' + document.cookie;
    const parts = value.split('; ' + name + '=');
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}
