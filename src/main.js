import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ParticleSystem } from './ParticleSystem.js';
import { particleConfigs } from './particleConfigs.js';
import { AIController } from './AIController.js';
import { PromptEngine } from './PromptEngine.js';

let scene, camera, renderer, controls;
let particleSystem;
let currentConfig;
let aiController = null;
let promptEngine;

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
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
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

    // Initialize AI components
    promptEngine = new PromptEngine();

    // Setup controls
    setupControls();
    setupAIControls();
    setupModal();
    updateJSONDisplay();

    // Check for saved API key and auto-initialize
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
        console.log('Found saved API key, initializing...');
        initializeAI(savedKey);
    }

    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);

    // Start animation
    animate();
}

function setupModal() {
    const modal = document.getElementById('settings-modal');
    const openBtn = document.getElementById('open-settings');
    const closeBtn = document.getElementById('close-modal');
    const apiKeyInput = document.getElementById('api-key-input');
    const toggleVisibilityBtn = document.getElementById('toggle-key-visibility');
    const saveKeyBtn = document.getElementById('save-key-btn');

    // Open modal
    openBtn.addEventListener('click', () => {
        modal.classList.add('show');
        // Load saved key
        const savedKey = localStorage.getItem('gemini_api_key');
        if (savedKey) {
            apiKeyInput.value = savedKey;
        }
    });

    // Close modal
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
    });

    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });

    // Toggle password visibility
    toggleVisibilityBtn.addEventListener('click', () => {
        if (apiKeyInput.type === 'password') {
            apiKeyInput.type = 'text';
            toggleVisibilityBtn.textContent = '🙈';
        } else {
            apiKeyInput.type = 'password';
            toggleVisibilityBtn.textContent = '👁️';
        }
    });

    // Save API key
    saveKeyBtn.addEventListener('click', () => {
        const apiKey = apiKeyInput.value.trim();
        if (apiKey) {
            localStorage.setItem('gemini_api_key', apiKey);
            initializeAI(apiKey);
            modal.classList.remove('show');
        } else {
            alert('Please enter a valid API Key');
        }
    });

    // Enter to save
    apiKeyInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveKeyBtn.click();
        }
    });
}

function setupControls() {
    const typeSelect = document.getElementById('particle-type');
    const colorPicker = document.getElementById('color-picker');
    const countSlider = document.getElementById('particle-count');
    const sizeSlider = document.getElementById('particle-size');
    const speedSlider = document.getElementById('particle-speed');
    const exportBtn = document.getElementById('export-json');

    const countValue = document.getElementById('count-value');
    const sizeValue = document.getElementById('size-value');
    const speedValue = document.getElementById('speed-value');

    typeSelect.addEventListener('change', (e) => {
        const newConfig = JSON.parse(JSON.stringify(particleConfigs[e.target.value]));
        newConfig.count = currentConfig.count;
        newConfig.appearance.size = currentConfig.appearance.size;
        newConfig.physics.speed = currentConfig.physics.speed;
        currentConfig = newConfig;
        particleSystem.updateConfig(currentConfig);
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

function setupAIControls() {
    const aiInput = document.getElementById('ai-input');
    const sendBtn = document.getElementById('send-btn');
    const exampleBtns = document.querySelectorAll('.example-btn');
    const modelToggle = document.getElementById('model-toggle');

    sendBtn.addEventListener('click', () => handleAIRequest());
    
    aiInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleAIRequest();
        }
    });

    exampleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (!aiController) {
                updateAIStatus('⚠️ Please configure API Key first', 'warning');
                document.getElementById('open-settings').click();
                return;
            }
            aiInput.value = btn.dataset.prompt;
            handleAIRequest();
        });
    });

    modelToggle.addEventListener('change', (e) => {
        if (aiController) {
            aiController.switchModel(e.target.checked ? 'pro' : 'flash');
            updateAIStatus(`Switched to ${e.target.checked ? 'Gemini 3 Pro' : 'Gemini 2.0 Flash'}`, 'success');
        }
    });
}

function initializeAI(apiKey) {
    const aiInput = document.getElementById('ai-input');
    const sendBtn = document.getElementById('send-btn');
    
    console.log('Initializing AI with API key...');
    
    try {
        aiController = new AIController(apiKey);
        
        aiInput.disabled = false;
        sendBtn.disabled = false;
        
        updateAIStatus('✅ AI Ready - Start creating!', 'success');
        console.log('✅ AI initialized successfully');
        
    } catch (error) {
        console.error('❌ AI initialization failed:', error);
        aiController = null;
        aiInput.disabled = true;
        sendBtn.disabled = true;
        updateAIStatus('❌ Failed to initialize AI', 'error');
    }
}

async function handleAIRequest() {
    if (!aiController) {
        updateAIStatus('⚠️ Please configure API Key first', 'warning');
        document.getElementById('open-settings').click();
        return;
    }

    const aiInput = document.getElementById('ai-input');
    const sendBtn = document.getElementById('send-btn');
    const userInput = aiInput.value.trim();
    
    if (!userInput) {
        updateAIStatus('⚠️ Please enter a description', 'warning');
        return;
    }

    try {
        updateAIStatus('🤔 AI is thinking...', 'processing');
        sendBtn.disabled = true;
        aiInput.disabled = true;

        console.log('Generating config for:', userInput);
        const newConfig = await aiController.generateParticleConfig(userInput, currentConfig);
        console.log('Generated config:', newConfig);
        
        currentConfig = newConfig;
        particleSystem.updateConfig(currentConfig);
        updateJSONDisplay();
        updateControlsFromConfig();
        
        const modelName = aiController.currentModel === 'pro' ? 'Pro 🧠' : 'Flash ⚡';
        updateAIStatus(`✅ Generated with ${modelName}`, 'success');
        aiInput.value = '';

    } catch (error) {
        console.error('❌ AI Generation Error:', error);
        
        let errorMsg = '❌ Generation failed';
        if (error.message.includes('API') || error.message.includes('key')) {
            errorMsg = '❌ Invalid API Key - Check settings';
        } else if (error.message.includes('quota')) {
            errorMsg = '❌ Quota exceeded - Try again later';
        }
        
        updateAIStatus(errorMsg, 'error');
        
    } finally {
        sendBtn.disabled = false;
        aiInput.disabled = false;
        aiInput.focus();
    }
}

function updateAIStatus(message, type = 'info') {
    const statusEl = document.getElementById('ai-status');
    statusEl.textContent = message;
    statusEl.className = `ai-status ${type}`;
}

function updateControlsFromConfig() {
    const typeSelect = document.getElementById('particle-type');
    const colorPicker = document.getElementById('color-picker');
    const countSlider = document.getElementById('particle-count');
    const sizeSlider = document.getElementById('particle-size');
    const speedSlider = document.getElementById('particle-speed');

    typeSelect.value = currentConfig.type;
    colorPicker.value = currentConfig.appearance.color;
    countSlider.value = currentConfig.count;
    sizeSlider.value = currentConfig.appearance.size;
    speedSlider.value = currentConfig.physics.speed;

    document.getElementById('count-value').textContent = currentConfig.count;
    document.getElementById('size-value').textContent = currentConfig.appearance.size;
    document.getElementById('speed-value').textContent = currentConfig.physics.speed;
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

init();