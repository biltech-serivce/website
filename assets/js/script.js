// ============================================
// BILTECH - PREMIUM INTERACTIVE SCRIPTS
// ============================================

// Mobile Menu Toggle
function toggleMenu() {
    const nav = document.getElementById('navLinks');
    const toggle = document.getElementById('mobileToggle');

    nav.classList.toggle('active');
    toggle.classList.toggle('active');

    // Prevent body scroll when menu is open
    document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
}

// Close menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        const nav = document.getElementById('navLinks');
        const toggle = document.getElementById('mobileToggle');

        nav.classList.remove('active');
        toggle.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Header scroll effect
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Add stagger delay to service cards
document.querySelectorAll('.service-card').forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
});

// Add stagger delay to about features
document.querySelectorAll('.about-feature').forEach((feature, index) => {
    feature.style.transitionDelay = `${index * 0.1}s`;
});

// Add stagger delay to contact items
document.querySelectorAll('.contact-item').forEach((item, index) => {
    item.style.transitionDelay = `${index * 0.1}s`;
});

// Parallax effect for hero section (subtle)
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');

    if (hero && scrolled < window.innerHeight) {
        hero.style.setProperty('--scroll', scrolled * 0.3 + 'px');
    }
});

// Console branding (easter egg)
console.log('%c🏗️ Biltech Gebäudeservice', 'font-size: 24px; font-weight: bold; color: #d4af37;');
console.log('%cProfessionell. Zuverlässig. Persönlich.', 'font-size: 14px; color: #40e0d0;');
