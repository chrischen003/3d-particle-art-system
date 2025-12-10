import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ParticleSystem } from './ParticleSystem.js';
import { particleConfigs } from './particleConfigs.js';

let scene, camera, renderer, controls;
let particleSystem;
let currentConfig;

// Initialize Three.js scene
function init() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.FogExp2(0x000000, 0.001);

    // Create camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 5;

    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    // Add orbit controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2;
    controls.maxDistance = 10;

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add point light
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Initialize with snowflake
    currentConfig = JSON.parse(JSON.stringify(particleConfigs.snowflake));
    particleSystem = new ParticleSystem(scene, currentConfig);

    // Setup controls
    setupControls();
    updateJSONDisplay();

    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);

    // Start animation
    animate();
}

function setupControls() {
    const typeSelect = document.getElementById('particle-type');
    const colorPicker = document.getElementById('color-picker');
    const countSlider = document.getElementById('particle-count');
    const sizeSlider = document.getElementById('particle-size');
    const speedSlider = document.getElementById('particle-speed');
    const exportBtn = document.getElementById('export-json');

    // Update displays
    const countValue = document.getElementById('count-value');
    const sizeValue = document.getElementById('size-value');
    const speedValue = document.getElementById('speed-value');

    typeSelect.addEventListener('change', (e) => {
        const newConfig = JSON.parse(JSON.stringify(particleConfigs[e.target.value]));
        
        // Preserve user adjustments
        newConfig.count = currentConfig.count;
        newConfig.appearance.size = currentConfig.appearance.size;
        newConfig.physics.speed = currentConfig.physics.speed;
        
        currentConfig = newConfig;
        particleSystem.updateConfig(currentConfig);
        
        // Update color picker
        colorPicker.value = currentConfig.appearance.color;
        
        updateJSONDisplay();
    });

    colorPicker.addEventListener('input', (e) => {
        currentConfig.appearance.color = e.target.value;
        particleSystem.updateConfig(currentConfig);
        updateJSONDisplay();
    });

    countSlider.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        countValue.textContent = value;
        currentConfig.count = value;
        particleSystem.updateConfig(currentConfig);
        updateJSONDisplay();
    });

    sizeSlider.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        sizeValue.textContent = value;
        currentConfig.appearance.size = value;
        particleSystem.updateConfig(currentConfig);
        updateJSONDisplay();
    });

    speedSlider.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        speedValue.textContent = value;
        currentConfig.physics.speed = value;
        particleSystem.updateConfig(currentConfig);
        updateJSONDisplay();
    });

    exportBtn.addEventListener('click', () => {
        const dataStr = JSON.stringify(currentConfig, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileDefaultName = `particle-config-${currentConfig.type}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    });
}

function updateJSONDisplay() {
    const jsonContent = document.getElementById('json-content');
    jsonContent.textContent = JSON.stringify(currentConfig, null, 2);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    
    controls.update();
    
    if (particleSystem) {
        particleSystem.update();
    }
    
    renderer.render(scene, camera);
}

// Start the app
init();