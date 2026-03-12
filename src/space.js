/* =============================================
   THREE.JS — INTERSTELLAR ODYSSEY
   ============================================= */

import * as THREE from 'three';
import gsap from 'gsap';

let scene, camera, renderer, starMaterial, stars, nebulaMaterial, nebula;
let isWarping = false;
let warpFactor = 0;
let currentZone = 'hero';

const planetRegistry = {};
const zoneCoordinates = {
    hero: { pos: new THREE.Vector3(0, 0, 5), lookAt: new THREE.Vector3(0, 0, -10) },
    about: { pos: new THREE.Vector3(0, 10, 20), lookAt: new THREE.Vector3(0, 8, -5) },
    skills: { pos: new THREE.Vector3(30, -5, -10), lookAt: new THREE.Vector3(25, -5, -20) },
    projects: { pos: new THREE.Vector3(-40, 15, 30), lookAt: new THREE.Vector3(-35, 10, 20) },
    feed: { pos: new THREE.Vector3(10, -20, 50), lookAt: new THREE.Vector3(5, -15, 40) },
    timeline: { pos: new THREE.Vector3(0, 0, -100), lookAt: new THREE.Vector3(0, 0, -150) },
    contact: { pos: new THREE.Vector3(5, 5, 10), lookAt: new THREE.Vector3(0, 0, 0) }
};

export function initSpace() {
    const canvas = document.getElementById('space-canvas');
    if (!canvas) return;

    // ---- Scene Setup ----
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.copy(zoneCoordinates.hero.pos);
    camera.lookAt(zoneCoordinates.hero.lookAt);

    renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // ---- Starfield ----
    const starCount = 3000;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
        const i3 = i * 3;
        starPositions[i3]     = (Math.random() - 0.5) * 400;
        starPositions[i3 + 1] = (Math.random() - 0.5) * 400;
        starPositions[i3 + 2] = (Math.random() - 0.5) * 400;
        starSizes[i] = Math.random() * 2 + 0.5;

        // Color palette matching the theme
        const colorChoice = Math.random();
        if (colorChoice < 0.6) { // White
            starColors[i3] = 1.0; starColors[i3+1] = 1.0; starColors[i3+2] = 1.0;
        } else if (colorChoice < 0.8) { // Cyan
            starColors[i3] = 0.0; starColors[i3+1] = 0.83; starColors[i3+2] = 1.0;
        } else { // Purple
            starColors[i3] = 0.66; starColors[i3+1] = 0.33; starColors[i3+2] = 0.97;
        }
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    starMaterial = new THREE.ShaderMaterial({
        vertexShader: `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            uniform float uTime;
            uniform float uWarp;
            void main() {
                vColor = color;
                vec3 pos = position;
                // Warp streaking effect
                if (uWarp > 0.0) {
                    pos.z += uWarp * 100.0 * (pos.z / 200.0);
                }
                vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                gl_PointSize = size * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            void main() {
                float dist = length(gl_PointCoord - vec2(0.5));
                if (dist > 0.5) discard;
                gl_FragColor = vec4(vColor, 1.0 - (dist * 2.0));
            }
        `,
        uniforms: { uTime: { value: 0 }, uWarp: { value: 0 } },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // ---- Create Planets for Zones ----
    createPlanet('hero', 0x00d4ff, new THREE.Vector3(0, 0, -15), 5);
    createPlanet('about', 0xff5f56, new THREE.Vector3(0, 10, 0), 4); // Render Nebula core
    createPlanet('skills', 0xa855f7, new THREE.Vector3(45, -5, -30), 6);
    createPlanet('projects', 0x00d4ff, new THREE.Vector3(-60, 15, 10), 8);
    createPlanet('feed', 0x00d4ff, new THREE.Vector3(20, -30, 40), 5);

    // ---- Lighting ----
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);
    const mainLight = new THREE.PointLight(0xffffff, 5, 200);
    mainLight.position.set(20, 20, 20);
    scene.add(mainLight);

    // ---- Resize Handlers ----
    window.addEventListener('resize', onWindowResize);

    animate();
}

function createPlanet(name, color, position, size) {
    const geometry = new THREE.SphereGeometry(size, 64, 64);
    const material = new THREE.MeshStandardMaterial({
        color: 0x050510,
        emissive: color,
        emissiveIntensity: 0.1,
        wireframe: true,
        transparent: true,
        opacity: 0.2
    });
    
    const planet = new THREE.Mesh(geometry, material);
    planet.position.copy(position);
    scene.add(planet);
    
    // Add Atmosphere/Glow
    const glowGeo = new THREE.SphereGeometry(size * 1.1, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.05 });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    planet.add(glow);

    planetRegistry[name] = planet;
}

export function flyToZone(zoneName) {
    if (!zoneCoordinates[zoneName] || currentZone === zoneName) return;
    
    currentZone = zoneName;
    const target = zoneCoordinates[zoneName];
    
    isWarping = true;
    
    // GSAP Timeline for the Warp jump
    const tl = gsap.timeline({
        onComplete: () => {
            isWarping = false;
            gsap.to(starMaterial.uniforms.uWarp, { value: 0, duration: 1 });
        }
    });

    // 1. Zoom into "Warp"
    tl.to(starMaterial.uniforms.uWarp, { value: 2.0, duration: 0.8, ease: "power2.in" });
    
    // 2. Camera Fly-through
    tl.to(camera.position, {
        x: target.pos.x,
        y: target.pos.y,
        z: target.pos.z,
        duration: 2,
        ease: "expo.inOut"
    }, "-=0.5");

    // 3. Smooth LookAt Transition
    const lookTarget = new THREE.Vector3().copy(target.lookAt);
    tl.to({}, {
        duration: 2,
        onUpdate: function() {
            camera.lookAt(lookTarget);
        }
    }, "<");
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    const elapsed = clock.getElapsedTime();

    if (starMaterial) starMaterial.uniforms.uTime.value = elapsed;

    // Rotate all planets
    Object.values(planetRegistry).forEach(p => {
        p.rotation.y += 0.1 * delta;
        p.rotation.z += 0.05 * delta;
    });

    renderer.render(scene, camera);
}
