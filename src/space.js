/* =============================================
   THREE.JS — IMMERSIVE SPACE BACKGROUND
   ============================================= */

import * as THREE from 'three';

export function initSpace() {
    const canvas = document.getElementById('space-canvas');
    if (!canvas) return;

    // ---- Scene Setup ----
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // ---- Starfield ----
    const starCount = 2500;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
        const i3 = i * 3;
        starPositions[i3]     = (Math.random() - 0.5) * 40;
        starPositions[i3 + 1] = (Math.random() - 0.5) * 40;
        starPositions[i3 + 2] = (Math.random() - 0.5) * 40;
        starSizes[i] = Math.random() * 2.5 + 0.5;

        // Varied star colors: white, cyan, light-purple, light-blue
        const colorChoice = Math.random();
        if (colorChoice < 0.4) {
            starColors[i3]     = 0.9;
            starColors[i3 + 1] = 0.9;
            starColors[i3 + 2] = 1.0; // White-blue
        } else if (colorChoice < 0.65) {
            starColors[i3]     = 0.0;
            starColors[i3 + 1] = 0.83;
            starColors[i3 + 2] = 1.0; // Cyan
        } else if (colorChoice < 0.85) {
            starColors[i3]     = 0.66;
            starColors[i3 + 1] = 0.33;
            starColors[i3 + 2] = 0.97; // Purple
        } else {
            starColors[i3]     = 0.96;
            starColors[i3 + 1] = 0.45;
            starColors[i3 + 2] = 0.71; // Pink
        }
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.ShaderMaterial({
        vertexShader: `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            varying float vAlpha;
            uniform float uTime;
            void main() {
                vColor = color;
                float twinkle = sin(uTime * 2.0 + position.x * 10.0 + position.y * 7.0) * 0.3 + 0.7;
                vAlpha = twinkle;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * (200.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            varying float vAlpha;
            void main() {
                float dist = length(gl_PointCoord - vec2(0.5));
                if (dist > 0.5) discard;
                float intensity = 1.0 - (dist * 2.0);
                intensity = pow(intensity, 1.5);
                gl_FragColor = vec4(vColor, intensity * vAlpha);
            }
        `,
        uniforms: {
            uTime: { value: 0 },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // ---- Nebula Particles (large soft glowing spheres) ----
    const nebulaCount = 8;
    const nebulaGeometry = new THREE.BufferGeometry();
    const nebulaPositions = new Float32Array(nebulaCount * 3);
    const nebulaSizes = new Float32Array(nebulaCount);
    const nebulaColors = new Float32Array(nebulaCount * 3);

    const nebulaColorPalette = [
        [0.0, 0.83, 1.0],   // Cyan
        [0.66, 0.33, 0.97],  // Purple
        [0.23, 0.51, 0.96],  // Blue
        [0.96, 0.45, 0.71],  // Pink
    ];

    for (let i = 0; i < nebulaCount; i++) {
        const i3 = i * 3;
        nebulaPositions[i3]     = (Math.random() - 0.5) * 30;
        nebulaPositions[i3 + 1] = (Math.random() - 0.5) * 30;
        nebulaPositions[i3 + 2] = (Math.random() - 0.5) * 20 - 5;
        nebulaSizes[i] = Math.random() * 80 + 40;

        const color = nebulaColorPalette[Math.floor(Math.random() * nebulaColorPalette.length)];
        nebulaColors[i3]     = color[0];
        nebulaColors[i3 + 1] = color[1];
        nebulaColors[i3 + 2] = color[2];
    }

    nebulaGeometry.setAttribute('position', new THREE.BufferAttribute(nebulaPositions, 3));
    nebulaGeometry.setAttribute('size', new THREE.BufferAttribute(nebulaSizes, 1));
    nebulaGeometry.setAttribute('color', new THREE.BufferAttribute(nebulaColors, 3));

    const nebulaMaterial = new THREE.ShaderMaterial({
        vertexShader: `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            uniform float uTime;
            void main() {
                vColor = color;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                float breathe = sin(uTime * 0.5 + position.x) * 0.15 + 1.0;
                gl_PointSize = size * breathe * (200.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            void main() {
                float dist = length(gl_PointCoord - vec2(0.5));
                if (dist > 0.5) discard;
                float intensity = 1.0 - (dist * 2.0);
                intensity = pow(intensity, 3.0);
                gl_FragColor = vec4(vColor, intensity * 0.08);
            }
        `,
        uniforms: {
            uTime: { value: 0 },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
    });

    const nebula = new THREE.Points(nebulaGeometry, nebulaMaterial);
    scene.add(nebula);

    // ---- Shooting Stars ----
    const shootingStars = [];
    const shootingStarGeometry = new THREE.BufferGeometry();
    const shootingStarCount = 3;
    
    for (let i = 0; i < shootingStarCount; i++) {
        shootingStars.push({
            active: false,
            timer: Math.random() * 500 + 200,
            line: null,
        });
    }

    function createShootingStar(index) {
        if (shootingStars[index].line) {
            scene.remove(shootingStars[index].line);
        }

        const startX = (Math.random() - 0.5) * 20;
        const startY = Math.random() * 10 + 5;
        const startZ = (Math.random() - 0.5) * 10 - 3;

        const points = [];
        const trailLength = Math.random() * 3 + 2;
        const dx = (Math.random() * 2 + 1) * (Math.random() > 0.5 ? 1 : -1);
        const dy = -(Math.random() * 2 + 1.5);

        for (let i = 0; i < 20; i++) {
            const t = i / 19;
            points.push(new THREE.Vector3(
                startX + dx * t * trailLength,
                startY + dy * t * trailLength,
                startZ
            ));
        }

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: 0x00d4ff,
            transparent: true,
            opacity: 0,
        });

        const line = new THREE.Line(geometry, material);
        scene.add(line);

        shootingStars[index].line = line;
        shootingStars[index].active = true;
        shootingStars[index].progress = 0;
    }

    // ---- Mouse Parallax ----
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    window.addEventListener('mousemove', (e) => {
        targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // ---- Scroll Parallax ----
    let scrollY = 0;
    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    });

    // ---- Resize ----
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // ---- Animation Loop ----
    const clock = new THREE.Clock();
    let frameCount = 0;

    function animate() {
        requestAnimationFrame(animate);
        const elapsed = clock.getElapsedTime();
        frameCount++;

        // Update uniforms
        starMaterial.uniforms.uTime.value = elapsed;
        nebulaMaterial.uniforms.uTime.value = elapsed;

        // Smooth mouse follow
        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;

        // Rotate stars slightly based on mouse and scroll
        stars.rotation.x = mouseY * 0.1 + scrollY * 0.0001;
        stars.rotation.y = mouseX * 0.1 + elapsed * 0.02;

        nebula.rotation.x = mouseY * 0.05;
        nebula.rotation.y = mouseX * 0.05 + elapsed * 0.01;

        // Camera subtle movement
        camera.position.x = mouseX * 0.3;
        camera.position.y = -mouseY * 0.3 - scrollY * 0.001;

        // Shooting stars logic
        for (let i = 0; i < shootingStarCount; i++) {
            const ss = shootingStars[i];
            if (!ss.active) {
                ss.timer--;
                if (ss.timer <= 0) {
                    createShootingStar(i);
                    ss.timer = Math.random() * 600 + 300;
                }
            } else {
                ss.progress += 0.02;
                if (ss.line) {
                    if (ss.progress < 0.5) {
                        ss.line.material.opacity = ss.progress * 2;
                    } else {
                        ss.line.material.opacity = (1 - ss.progress) * 2;
                    }
                    ss.line.position.x += 0.08;
                    ss.line.position.y -= 0.12;
                }
                if (ss.progress >= 1) {
                    if (ss.line) scene.remove(ss.line);
                    ss.active = false;
                    ss.line = null;
                }
            }
        }

        renderer.render(scene, camera);
    }

    animate();
}
