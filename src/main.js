/* =============================================
   MAIN ENTRY POINT — SPACE PORTFOLIO
   ============================================= */

import './style.css';
import { initSpace } from './space.js';
import { initAnimations } from './animations.js';

// ---- Initialize Everything ----
document.addEventListener('DOMContentLoaded', () => {
    initSpace();
    initAnimations();
    initTypewriter();
    initProjectFilter();
    initMobileNav();
    initCursorGlow();
    initSmoothScroll();
});

// ---- Typewriter Effect ----
function initTypewriter() {
    const typewriterEl = document.getElementById('typewriter');
    if (!typewriterEl) return;

    const phrases = [
        'Web Developer & ML Enthusiast',
        'B.Tech Computer Science Student',
        'Building the Future, One Line at a Time',
        'React.js • Python • Three.js',
        'Turning Ideas into Reality 🚀',
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typewriterEl.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 40;
        } else {
            typewriterEl.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 80;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 2000; // pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 400; // pause before new phrase
        }

        setTimeout(type, typingSpeed);
    }

    setTimeout(type, 1200);
}

// ---- Project Filtering ----
function initProjectFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach((card, i) => {
                const category = card.getAttribute('data-category');
                const shouldShow = filter === 'all' || category === filter;

                if (shouldShow) {
                    card.style.display = 'block';
                    // Re-animate with stagger
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, i * 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// ---- Mobile Navigation ----
function initMobileNav() {
    const toggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');

    if (!toggle || !navLinks) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('open');
        navLinks.classList.toggle('open');
    });

    // Close on link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('open');
            navLinks.classList.remove('open');
        });
    });
}

// ---- Cursor Glow Effect ----
function initCursorGlow() {
    const cursorGlow = document.getElementById('cursor-glow');
    if (!cursorGlow) return;

    // Hide on mobile
    if (window.innerWidth < 768) {
        cursorGlow.style.display = 'none';
        return;
    }

    let cx = 0, cy = 0;
    let tx = 0, ty = 0;

    window.addEventListener('mousemove', (e) => {
        tx = e.clientX;
        ty = e.clientY;
    });

    function updateCursor() {
        cx += (tx - cx) * 0.08;
        cy += (ty - cy) * 0.08;
        cursorGlow.style.left = cx + 'px';
        cursorGlow.style.top = cy + 'px';
        requestAnimationFrame(updateCursor);
    }

    updateCursor();
}

// ---- Smooth Scroll for Anchor Links ----
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }
        });
    });
}
