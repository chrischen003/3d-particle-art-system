import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ParticleSystemDebug } from './ParticleSystem-debug.js';
import { particleConfigs } from './particleConfigs.js';

let scene, camera, renderer, controls;
let particleSystem;
let currentConfig;

console.log('%c🐛 DEBUG MODE ENABLED', 'color: #0f0; font-size: 20px; font-weight: bold');

function init() {
    console.log('🚀 [DEBUG] Initializing...');
    
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    console.log('✅ [DEBUG] Scene created');

    // Create camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 0, 10);
    console.log('✅ [DEBUG] Camera at:', camera.position);

    // Create renderer
    const canvas = document.getElementById('canvas-container');
    if (!canvas) {
        console.error('❌ [DEBUG] canvas-container not found!');
        return;
    }
    
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    canvas.appendChild(renderer.domElement);
    console.log('✅ [DEBUG] Renderer created and appended');

    // Add orbit controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    console.log('✅ [DEBUG] Controls added');

    // Add strong light
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
    scene.add(ambientLight);
    console.log('✅ [DEBUG] Light added');

    // Initialize with snowflake config
    currentConfig = JSON.parse(JSON.stringify(particleConfigs.snowflake));
    console.log('✅ [DEBUG] Config loaded:', currentConfig);
    
    particleSystem = new ParticleSystemDebug(scene, currentConfig);
    console.log('✅ [DEBUG] Particle system created');
    
    // Log scene structure
    console.log('✅ [DEBUG] Scene children:', scene.children.length);
    scene.children.forEach((child, i) => {
        console.log(`  Child ${i}:`, child.type);
    });

    // Setup controls
    setupControls();
    updateJSONDisplay();

    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);

    // Start animation
    let frameCount = 0;
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        
        if (particleSystem) {
            particleSystem.update();
        }
        
        renderer.render(scene, camera);
        
        if (frameCount === 0) {
            console.log('✅ [DEBUG] First frame rendered!');
        }
        if (frameCount === 60) {
            console.log('✅ [DEBUG] 60 frames rendered successfully');
        }
        frameCount++;
    }
    animate();
    
    console.log('✅ [DEBUG] System initialized!');
}

function setupControls() {
    const typeSelect = document.getElementById('particle-type');
    const colorPicker = document.getElementById('color-picker');
    const countSlider = document.getElementById('particle-count');
    const sizeSlider = document.getElementById('particle-size');

    const countValue = document.getElementById('count-value');
    const sizeValue = document.getElementById('size-value');

    if (!typeSelect || !colorPicker || !countSlider || !sizeSlider) {
        console.warn('⚠️ [DEBUG] Some controls not found');
        return;
    }

    typeSelect.addEventListener('change', (e) => {
        console.log('[DEBUG] Type changed to:', e.target.value);
        currentConfig = JSON.parse(JSON.stringify(particleConfigs[e.target.value]));
        particleSystem.updateConfig(currentConfig);
        updateJSONDisplay();
    });

    colorPicker.addEventListener('input', (e) => {
        console.log('[DEBUG] Color changed to:', e.target.value);
        currentConfig.appearance.color = e.target.value;
        particleSystem.updateConfig(currentConfig);
        updateJSONDisplay();
    });

    countSlider.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        console.log('[DEBUG] Count changed to:', value);
        countValue.textContent = value;
        currentConfig.count = value;
        particleSystem.updateConfig(currentConfig);
        updateJSONDisplay();
    });

    sizeSlider.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        console.log('[DEBUG] Size changed to:', value);
        sizeValue.textContent = value;
        currentConfig.appearance.size = value;
        particleSystem.updateConfig(currentConfig);
        updateJSONDisplay();
    });
}

function updateJSONDisplay() {
    const jsonContent = document.getElementById('json-content');
    if (jsonContent) {
        jsonContent.textContent = JSON.stringify(currentConfig, null, 2);
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

init();