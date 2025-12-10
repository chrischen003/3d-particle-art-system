import * as THREE from 'three';

// Vertex shader for all particle types
const vertexShader = `
    attribute float aRandom;
    attribute float aSize;
    
    uniform float uTime;
    uniform float uSize;
    
    varying float vRandom;
    varying vec3 vPosition;
    
    void main() {
        vRandom = aRandom;
        vPosition = position;
        
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        
        // 增强尺寸衡减，让粒子更明显
        float sizeAttenuation = 500.0 / -mvPosition.z;  // 从 300.0 增加到 500.0
        
        gl_PointSize = aSize * uSize * sizeAttenuation;
        gl_Position = projectionMatrix * mvPosition;
    }
`;

// Fragment shader for snowflake
const snowflakeFragmentShader = `
    uniform vec3 uColor;
    uniform float uOpacity;
    uniform float uTime;
    
    varying float vRandom;
    varying vec3 vPosition;
    
    void main() {
        // Create snowflake shape
        vec2 center = gl_PointCoord - 0.5;
        float dist = length(center);
        
        // Hexagonal pattern
        float angle = atan(center.y, center.x);
        float hexPattern = cos(angle * 6.0);
        
        float alpha = smoothstep(0.5, 0.0, dist) * (0.5 + hexPattern * 0.5);
        alpha *= uOpacity;
        
        // Add sparkle
        float sparkle = sin(uTime * 3.0 + vRandom * 10.0) * 0.3 + 0.7;
        
        // 增强亮度
        vec3 brightColor = uColor * (sparkle * 1.2);
        
        gl_FragColor = vec4(brightColor, alpha);
    }
`;

// Fragment shader for smoke
const smokeFragmentShader = `
    uniform vec3 uColor;
    uniform float uOpacity;
    uniform float uTime;
    
    varying float vRandom;
    varying vec3 vPosition;
    
    void main() {
        vec2 center = gl_PointCoord - 0.5;
        float dist = length(center);
        
        // Soft smoke appearance
        float alpha = smoothstep(0.5, 0.0, dist);
        alpha *= uOpacity;
        
        // Fade with height
        alpha *= max(0.3, 1.0 - (vPosition.y / 10.0));  // 添加最小不透明度
        
        // Turbulent opacity
        float turbulence = sin(uTime + vRandom * 20.0) * 0.2 + 0.8;
        alpha *= turbulence;
        
        gl_FragColor = vec4(uColor, alpha);
    }
`;

// Fragment shader for firework
const fireworkFragmentShader = `
    uniform vec3 uColor;
    uniform float uOpacity;
    uniform float uTime;
    
    varying float vRandom;
    varying vec3 vPosition;
    
    void main() {
        vec2 center = gl_PointCoord - 0.5;
        float dist = length(center);
        
        // Bright core
        float core = smoothstep(0.5, 0.0, dist);
        float glow = smoothstep(0.8, 0.0, dist) * 0.5;
        
        float alpha = (core + glow) * uOpacity;
        
        // Pulsing effect
        float pulse = sin(uTime * 5.0 + vRandom * 6.28) * 0.3 + 0.7;
        
        // Distance fade
        float distFade = max(0.3, 1.0 - length(vPosition) / 5.0);  // 添加最小不透明度
        alpha *= distFade * pulse;
        
        // Bright emissive color
        vec3 color = uColor * (2.0 + pulse * 0.5);  // 增强亮度
        
        gl_FragColor = vec4(color, alpha);
    }
`;

// Fragment shader for sphere and cube (basic)
const basicFragmentShader = `
    uniform vec3 uColor;
    uniform float uOpacity;
    uniform float uTime;
    
    varying float vRandom;
    varying vec3 vPosition;
    
    void main() {
        vec2 center = gl_PointCoord - 0.5;
        float dist = length(center);
        
        float alpha = smoothstep(0.5, 0.2, dist) * uOpacity;  // 调整边缘
        
        // Subtle pulse
        float pulse = sin(uTime * 2.0 + vRandom * 6.28) * 0.2 + 0.8;
        
        // 增强亮度
        vec3 brightColor = uColor * (pulse * 1.3);
        
        gl_FragColor = vec4(brightColor, alpha);
    }
`;

export function getShaderMaterial(type, appearance) {
    let fragmentShader;
    
    switch(type) {
        case 'snowflake':
            fragmentShader = snowflakeFragmentShader;
            break;
        case 'smoke':
            fragmentShader = smokeFragmentShader;
            break;
        case 'firework':
            fragmentShader = fireworkFragmentShader;
            break;
        default:
            fragmentShader = basicFragmentShader;
    }
    
    return new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uSize: { value: appearance.size * 150 },  // 从 100 增加到 150
            uColor: { value: new THREE.Color(appearance.color) },
            uOpacity: { value: appearance.opacity }
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: type === 'firework' ? THREE.AdditiveBlending : THREE.NormalBlending
    });
}