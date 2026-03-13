/* =============================================
   THREE.JS — INTERSTELLAR ODYSSEY
   ============================================= */

import * as THREE from 'three';
import gsap from 'gsap';

let scene, camera, renderer, starMaterial, stars, nebulaMaterial, nebula;
let shuttle, thrusters;
let isWarping = false;
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
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);
    
    renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // ---- Starfield ----
    const starCount = 4000;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
        const i3 = i * 3;
        starPositions[i3]     = (Math.random() - 0.5) * 800;
        starPositions[i3 + 1] = (Math.random() - 0.5) * 800;
        starPositions[i3 + 2] = (Math.random() - 0.5) * 800;
        starSizes[i] = Math.random() * 2 + 0.5;

        const colorChoice = Math.random();
        if (colorChoice < 0.6) {
            starColors[i3] = 1.0; starColors[i3+1] = 1.0; starColors[i3+2] = 1.0;
        } else if (colorChoice < 0.8) {
            starColors[i3] = 0.0; starColors[i3+1] = 0.83; starColors[i3+2] = 1.0;
        } else {
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
            uniform float uWarp;
            void main() {
                vColor = color;
                vec3 pos = position;
                if (uWarp > 0.0) {
                    pos.z += uWarp * 150.0 * (pos.z / 400.0);
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
        uniforms: { uWarp: { value: 0 } },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // ---- 3D Space Shuttle (Savage-01) ----
    createShuttle();

    // ---- Create Planets ----
    createPlanet('hero', 0x00d4ff, new THREE.Vector3(0, 0, -20), 5);
    createPlanet('about', 0xff5f56, new THREE.Vector3(15, 15, 0), 4);
    createPlanet('skills', 0xa855f7, new THREE.Vector3(50, -10, -40), 6);
    createPlanet('projects', 0x00d4ff, new THREE.Vector3(-80, 20, 20), 8);
    createPlanet('feed', 0x00d4ff, new THREE.Vector3(30, -40, 60), 5);

    // ---- Lighting ----
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const pointLight = new THREE.PointLight(0x00d4ff, 2, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    onWindowResize();
    window.addEventListener('resize', onWindowResize);

    animate();
}

function createShuttle() {
    shuttle = new THREE.Group();
    
    // Body (Cockpit style)
    const bodyGeom = new THREE.CapsuleGeometry(0.2, 0.6, 4, 8);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9, roughness: 0.1 });
    const body = new THREE.Mesh(bodyGeom, bodyMat);
    body.rotation.x = Math.PI / 2;
    shuttle.add(body);

    // Wings
    const wingGeom = new THREE.BoxGeometry(1.2, 0.05, 0.4);
    const wingMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const wings = new THREE.Mesh(wingGeom, wingMat);
    wings.position.set(0, -0.1, 0);
    shuttle.add(wings);

    // Fins
    const finGeom = new THREE.BoxGeometry(0.05, 0.4, 0.3);
    const finL = new THREE.Mesh(finGeom, wingMat);
    finL.position.set(0.5, 0.1, 0.1);
    shuttle.add(finL);
    
    const finR = finL.clone();
    finR.position.x = -0.5;
    shuttle.add(finR);

    // Thrusters
    const thrusterGeom = new THREE.CylinderGeometry(0.05, 0.08, 0.15, 8);
    const thrusterMat = new THREE.MeshBasicMaterial({ color: 0x00d4ff });
    thrusters = new THREE.Group();
    
    const t1 = new THREE.Mesh(thrusterGeom, thrusterMat);
    t1.position.set(0.15, 0, 0.4);
    t1.rotation.x = Math.PI / 2;
    thrusters.add(t1);
    
    const t2 = t1.clone();
    t2.position.x = -0.15;
    thrusters.add(t2);
    
    shuttle.add(thrusters);

    // Thruster Glow (Inner)
    const glowGeom = new THREE.SphereGeometry(0.06, 8, 8);
    const glowMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
    const glow1 = new THREE.Mesh(glowGeom, glowMat);
    glow1.position.set(0.15, 0, 0.45);
    thrusters.add(glow1);
    const glow2 = glow1.clone();
    glow2.position.x = -0.15;
    thrusters.add(glow2);

    shuttle.position.copy(zoneCoordinates.hero.pos);
    scene.add(shuttle);
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
    
    const tl = gsap.timeline({
        onComplete: () => {
            isWarping = false;
            gsap.to(starMaterial.uniforms.uWarp, { value: 0, duration: 1.5 });
        }
    });

    // 1. Ignite & Tilt
    tl.to(starMaterial.uniforms.uWarp, { value: 4.0, duration: 1.2, ease: "power2.in" });
    
    // 2. Shuttle & Camera Fly
    tl.to(shuttle.position, {
        x: target.pos.x,
        y: target.pos.y,
        z: target.pos.z,
        duration: 3,
        ease: "expo.inOut"
    }, "-=0.2");

    // Camera stays tethered but lags slightly for cinematic feel
    tl.to(camera.position, {
        x: target.pos.x,
        y: target.pos.y + 0.5,
        z: target.pos.z + 4,
        duration: 3.5,
        ease: "expo.out"
    }, "<");

    // 3. Aim at planet
    const lookTarget = new THREE.Vector3().copy(target.lookAt);
    tl.to({}, {
        duration: 3,
        onUpdate: function() {
            shuttle.lookAt(lookTarget);
            camera.lookAt(shuttle.position);
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

    // Shuttle Idle Behavior
    if (shuttle && !isWarping) {
        shuttle.position.y += Math.sin(elapsed * 1.5) * 0.001;
        shuttle.rotation.x = Math.sin(elapsed * 0.8) * 0.05;
        shuttle.rotation.z = Math.sin(elapsed * 1.2) * 0.03;

        // Smooth Chase Camera
        const idealOffset = new THREE.Vector3(0, 0.5, 4);
        idealOffset.applyQuaternion(shuttle.quaternion);
        idealOffset.add(shuttle.position);
        camera.position.lerp(idealOffset, 0.05);
        camera.lookAt(shuttle.position);
    }

    // Rotate all planets
    Object.values(planetRegistry).forEach(p => {
        p.rotation.y += 0.05 * delta;
        p.rotation.z += 0.02 * delta;
    });

    // Thruster Intensity
    if (thrusters) {
        const tScale = isWarping ? 3 + Math.random() : 1 + Math.sin(elapsed * 15) * 0.2;
        thrusters.scale.set(1, 1, tScale);
        thrusters.children.forEach(c => {
            if (c.material) c.material.opacity = isWarping ? 1 : 0.6;
        });
    }

    renderer.render(scene, camera);
}
