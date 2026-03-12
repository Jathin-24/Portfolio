/* =============================================
   MAIN ENTRY POINT — SPACE PORTFOLIO
   ============================================= */

import './style.css';
import { initSpace, flyToZone } from './space.js';
import { initAnimations } from './animations.js';

// ---- Initialize Everything ----
document.addEventListener('DOMContentLoaded', () => {
    initSpace();
    initAnimations();
    initTypewriter();
    initProjectFilter();
    initHUD();
    initMobileNav();
    initCursorGlow();
    initCosmicDust();
    initZoneObserver();
});

// ---- HUD Navigation & Status ----
function initHUD() {
    const hudLinks = document.querySelectorAll('.hud-link');
    const statusValue = document.querySelector('.hud-item.status .value');
    
    hudLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const zone = link.getAttribute('data-section');
            const coords = link.getAttribute('data-coords');
            
            // Trigger 3D Fly-to
            flyToZone(zone);
            
            // Update HUD Status
            if (statusValue) {
                statusValue.textContent = `WARPING_TO_${zone.toUpperCase()}`;
                setTimeout(() => {
                    statusValue.textContent = `ZONE_${zone.toUpperCase()}_LOCKED`;
                }, 2000);
            }

            // Scroll to section manually to keep DOM in sync
            const targetEl = document.getElementById(zone);
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth' });
            }

            // Update Active Link
            hudLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

// ---- Zone Intersection Observer ----
function initZoneObserver() {
    const zones = document.querySelectorAll('.zone');
    const options = {
        threshold: 0.3
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const zone = entry.target.id;
                // Only fly if user is scrolling naturally
                if (!window.isWarpingByClick) {
                    flyToZone(zone);
                    updateHUDActiveLink(zone);
                }
             entry.target.classList.add('in-view');
            }
        });
    }, options);

    zones.forEach(zone => observer.observe(zone));
}

function updateHUDActiveLink(zoneId) {
    const links = document.querySelectorAll('.hud-link');
    links.forEach(link => {
        if (link.getAttribute('href') === `#${zoneId}`) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// ---- Typewriter Effect ----
function initTypewriter() {
    const typewriterEl = document.getElementById('typewriter');
    if (!typewriterEl) return;

    const phrases = [
        'Agentic AI & SLM Developer',
        'Commander of the Savage-01 🚀',
        'Winner @ India AI Buildathon HCL GUVI',
        'VS Code Extension & NPM Creator',
        'B.Tech CS @ KKR & KSR Institute',
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
            typingSpeed = 2000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 400;
        }

        setTimeout(type, typingSpeed);
    }

    setTimeout(type, 1200);
}

// ---- Cosmic Dust Effect ----
function initCosmicDust() {
    window.addEventListener('click', (e) => {
        for (let i = 0; i < 8; i++) {
            createDust(e.clientX, e.clientY);
        }
    });

    function createDust(x, y) {
        const dust = document.createElement('div');
        dust.className = 'cosmic-dust';
        
        const size = Math.random() * 4 + 2;
        dust.style.width = size + 'px';
        dust.style.height = size + 'px';
        
        dust.style.left = x + 'px';
        dust.style.top = y + 'px';
        
        document.body.appendChild(dust);
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 100 + 50;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        
        const animation = dust.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 0.8 },
            { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
        ], {
            duration: Math.random() * 1000 + 500,
            easing: 'cubic-bezier(0, .9, .57, 1)'
        });
        
        animation.onfinish = () => dust.remove();
    }
}

// ---- Project Filtering ----
function initProjectFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach((card, i) => {
                const category = card.getAttribute('data-category');
                const shouldShow = filter === 'all' || category === filter;

                if (shouldShow) {
                    card.style.display = 'block';
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
    const hudLinks = document.getElementById('nav-links');

    if (!toggle || !hudLinks) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('open');
        hudLinks.classList.toggle('open');
    });

    hudLinks.querySelectorAll('.hud-link').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('open');
            hudLinks.classList.remove('open');
        });
    });
}

// ---- Cursor Glow Effect ----
function initCursorGlow() {
    const cursorGlow = document.getElementById('cursor-glow');
    if (!cursorGlow) return;
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
