import * as THREE from 'three';

/**
 * 简化粒子系统 - 使用 Three.js 内置 PointsMaterial 保证可见性
 */
export class ParticleSystem {
    constructor(scene, config) {
        this.scene = scene;
        this.config = config;
        this.particles = null;
        this.time = 0;
        
        console.log('✨ Creating particle system:', config.type);
        this.createParticles();
    }

    createParticles() {
        // Remove old particles
        if (this.particles) {
            this.scene.remove(this.particles);
            if (this.particles.geometry) this.particles.geometry.dispose();
            if (this.particles.material) this.particles.material.dispose();
        }

        const { count, type, appearance, physics, distribution } = this.config;
        const particleCount = count || 5000;
        
        console.log(`✨ Creating ${particleCount} particles of type: ${type}`);

        // Create geometry
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);

        // Generate particles based on distribution
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            if (distribution.shape === 'sphere') {
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(Math.random() * 2 - 1);
                const r = Math.random() * (distribution.radius || 3);
                
                positions[i3] = r * Math.sin(phi) * Math.cos(theta);
                positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
                positions[i3 + 2] = r * Math.cos(phi);
            } else {
                // Box distribution
                const size = distribution.size || [10, 10, 10];
                positions[i3] = (Math.random() - 0.5) * size[0];
                positions[i3 + 1] = (Math.random() - 0.5) * size[1];
                positions[i3 + 2] = (Math.random() - 0.5) * size[2];
            }

            // Velocity for animation
            velocities[i3] = (Math.random() - 0.5) * (physics.turbulence || 0.1);
            velocities[i3 + 1] = (Math.random() - 0.5) * (physics.turbulence || 0.1);
            velocities[i3 + 2] = (Math.random() - 0.5) * (physics.turbulence || 0.1);
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

        // 使用 THREE.PointsMaterial 而不是自定义 shader
        const color = new THREE.Color(appearance.color || '#ffffff');
        const size = (appearance.size || 0.15) * 2; // 放大 2 倍确保可见
        
        const material = new THREE.PointsMaterial({
            color: color,
            size: size,
            sizeAttenuation: true,
            transparent: true,
            opacity: appearance.opacity || 0.9,
            depthWrite: false,
            blending: type === 'firework' ? THREE.AdditiveBlending : THREE.NormalBlending
        });
        
        console.log(`✅ Material: color=${color.getHexString()}, size=${size}, opacity=${material.opacity}`);

        // Create particle system
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
        
        console.log(`✅ ${particleCount} particles added to scene`);
    }

    update() {
        if (!this.particles) return;
        
        this.time += 0.01;
        
        const { physics, type } = this.config;
        const positions = this.particles.geometry.attributes.position.array;
        const velocities = this.particles.geometry.attributes.velocity.array;

        // Update particle positions based on type
        for (let i = 0; i < positions.length; i += 3) {
            switch (type) {
                case 'snowflake':
                    // Fall down with gentle sway
                    positions[i + 1] -= physics.speed || 0.02;
                    positions[i] += Math.sin(this.time + i * 0.01) * 0.001;
                    
                    if (positions[i + 1] < -5) {
                        positions[i + 1] = 5;
                    }
                    break;

                case 'smoke':
                    // Rise up
                    positions[i + 1] += physics.speed || 0.03;
                    positions[i] += velocities[i] * 0.01;
                    positions[i + 2] += velocities[i + 2] * 0.01;
                    
                    if (positions[i + 1] > 5) {
                        positions[i + 1] = -5;
                    }
                    break;

                case 'firework':
                    // Explosive outward motion
                    const speed = physics.speed || 0.08;
                    positions[i] += velocities[i] * speed;
                    positions[i + 1] += velocities[i + 1] * speed - 0.002;
                    positions[i + 2] += velocities[i + 2] * speed;
                    
                    const dist = Math.sqrt(
                        positions[i] ** 2 + 
                        positions[i + 1] ** 2 + 
                        positions[i + 2] ** 2
                    );
                    if (dist > 5) {
                        positions[i] = velocities[i] * 0.1;
                        positions[i + 1] = velocities[i + 1] * 0.1;
                        positions[i + 2] = velocities[i + 2] * 0.1;
                    }
                    break;

                case 'sphere':
                case 'cube':
                    // Orbital motion
                    const angle = this.time * (physics.speed || 0.1);
                    const radius = Math.sqrt(positions[i] ** 2 + positions[i + 2] ** 2);
                    positions[i] = radius * Math.cos(angle + i * 0.01);
                    positions[i + 2] = radius * Math.sin(angle + i * 0.01);
                    break;

                default:
                    // Slow rotation
                    this.particles.rotation.y += 0.001;
                    break;
            }
        }

        this.particles.geometry.attributes.position.needsUpdate = true;
    }

    updateConfig(newConfig) {
        console.log('🔄 Updating particle config:', newConfig.type);
        this.config = newConfig;
        this.createParticles();
    }

    dispose() {
        if (this.particles) {
            this.scene.remove(this.particles);
            if (this.particles.geometry) this.particles.geometry.dispose();
            if (this.particles.material) this.particles.material.dispose();
        }
    }
}