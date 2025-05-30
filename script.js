 // Initialize GSAP
 gsap.registerPlugin(ScrollTrigger);

 // Navbar Animation
 gsap.from(".navbar", {
     y: -100,
     opacity: 0,
     duration: 1,
     ease: "power3.out"
 });

 // Hero Section Animations
 gsap.from(".hero-text h2", {
     x: -100,
     opacity: 0,
     duration: 1,
     delay: 0.5,
     ease: "power3.out"
 });

 gsap.from(".hero-text p", {
     x: -100,
     opacity: 0,
     duration: 1,
     delay: 0.8,
     stagger: 0.2,
     ease: "power3.out"
 });

 gsap.from(".social-icons a", {
     y: 50,
     opacity: 0,
     duration: 0.8,
     delay: 1.2,
     stagger: 0.1,
     ease: "back.out(1.7)"
 });

 gsap.from(".hero-img img", {
     scale: 0.5,
     opacity: 0,
     duration: 1.5,
     delay: 0.6,
     ease: "elastic.out(1, 0.5)"
 });

 // Service Cards Animation
 gsap.from(".service-card", {
     scrollTrigger: {
         trigger: ".services",
         start: "top 80%",
         toggleActions: "play none none none"
     },
     y: 100,
     opacity: 0,
     duration: 0.8,
     stagger: 0.2,
     ease: "power3.out"
 });

 // Gallery Items Animation
 gsap.from(".gallery-item", {
     scrollTrigger: {
         trigger: ".gallery-container",
         start: "top 80%"
     },
     y: 50,
     opacity: 0,
     duration: 0.8,
     stagger: 0.1,
     ease: "power3.out"
 });

 // Contact Section Animation
 gsap.from(".contact-info", {
     scrollTrigger: {
         trigger: ".contact-content",
         start: "top 80%"
     },
     x: -100,
     opacity: 0,
     duration: 0.8,
 });