/* =============================================
   GSAP SCROLL ANIMATIONS — SPACE PORTFOLIO
   ============================================= */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initAnimations() {

    // ---- Hero Animations (on load) ----
    const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

    heroTimeline
        .to('.hero-badge', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 0.3,
        })
        .to('.title-word', {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.15,
        }, '-=0.3')
        .to('.hero-subtitle', {
            opacity: 1,
            duration: 0.6,
        }, '-=0.2')
        .to('.hero-cta', {
            opacity: 1,
            y: 0,
            duration: 0.6,
        }, '-=0.2')
        .to('.hero-stats', {
            opacity: 1,
            y: 0,
            duration: 0.6,
        }, '-=0.3')
        .to('.scroll-indicator', {
            opacity: 1,
            duration: 0.8,
        }, '-=0.2');

    // ---- Counter Animation ----
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(num => {
        const target = parseInt(num.getAttribute('data-target'));
        ScrollTrigger.create({
            trigger: num,
            start: 'top 90%',
            once: true,
            onEnter: () => {
                gsap.to(num, {
                    innerText: target,
                    duration: 2,
                    snap: { innerText: 1 },
                    ease: 'power2.out',
                });
            }
        });
    });

    // ---- About Section ----
    gsap.to('.about-content', {
        scrollTrigger: {
            trigger: '.about-section',
            start: 'top 60%',
            toggleActions: 'play none none none',
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
    });

    gsap.to('.about-image-container', {
        scrollTrigger: {
            trigger: '.about-section',
            start: 'top 60%',
            toggleActions: 'play none none none',
        },
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'power3.out',
    });

    // ---- Skills Section ----
    gsap.utils.toArray('.skill-category').forEach((cat, i) => {
        gsap.to(cat, {
            scrollTrigger: {
                trigger: cat,
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: i * 0.1,
            ease: 'power3.out',
        });
    });

    // ---- Projects Section ----
    gsap.utils.toArray('.project-card').forEach((card, i) => {
        gsap.to(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 88%',
                toggleActions: 'play none none none',
            },
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: i * 0.08,
            ease: 'power3.out',
        });
    });

    // ---- Timeline Section ----
    gsap.utils.toArray('.timeline-item').forEach((item, i) => {
        gsap.to(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: i * 0.1,
            ease: 'power3.out',
        });
    });

    // ---- Contact Section ----
    gsap.utils.toArray('.contact-card').forEach((card, i) => {
        gsap.to(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 88%',
                toggleActions: 'play none none none',
            },
            opacity: 1,
            x: 0,
            duration: 0.6,
            delay: i * 0.1,
            ease: 'power3.out',
        });
    });

    gsap.to('.terminal-window', {
        scrollTrigger: {
            trigger: '.terminal-window',
            start: 'top 85%',
            toggleActions: 'play none none none',
        },
        opacity: 1,
        x: 0,
        duration: 0.7,
        ease: 'power3.out',
    });

    // ---- Navbar scroll effect ----
    ScrollTrigger.create({
        start: 80,
        onUpdate: (self) => {
            const navbar = document.getElementById('navbar');
            if (self.scroll() > 80) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });

    // ---- Scroll Progress Bar ----
    ScrollTrigger.create({
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
            const progress = document.getElementById('scroll-progress');
            if (progress) {
                progress.style.width = `${self.progress * 100}%`;
            }
        }
    });

    // ---- Active Nav Link on Scroll ----
    const sections = ['hero', 'about', 'skills', 'projects', 'timeline', 'contact'];
    sections.forEach(sectionId => {
        ScrollTrigger.create({
            trigger: `#${sectionId}`,
            start: 'top center',
            end: 'bottom center',
            onEnter: () => setActiveNav(sectionId),
            onEnterBack: () => setActiveNav(sectionId),
        });
    });

    function setActiveNav(sectionId) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === sectionId) {
                link.classList.add('active');
            }
        });
    }

    // ---- Hide scroll indicator on scroll ----
    ScrollTrigger.create({
        start: 100,
        onUpdate: (self) => {
            const indicator = document.getElementById('scroll-indicator');
            if (indicator) {
                indicator.style.opacity = self.scroll() > 100 ? '0' : '1';
            }
        }
    });
}
