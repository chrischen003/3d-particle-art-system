import * as THREE from 'three';
import { getShaderMaterial } from './shaders.js';

export class ParticleSystem {
    constructor(scene, config) {
        this.scene = scene;
        this.config = config;
        this.particles = null;
        this.time = 0;
        this.createParticles();
    }

    createParticles() {
        // Remove old particles
        if (this.particles) {
            this.scene.remove(this.particles);
            this.particles.geometry.dispose();
            this.particles.material.dispose();
        }

        const { count, type, appearance, physics, distribution } = this.config;

        // Create geometry
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const velocities = new Float32Array(count * 3);
        const randoms = new Float32Array(count);
        const sizes = new Float32Array(count);

        // Generate particles based on distribution
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            
            // Position
            if (distribution.shape === 'sphere') {
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(Math.random() * 2 - 1);
                const r = Math.random() * distribution.radius;
                
                positions[i3] = r * Math.sin(phi) * Math.cos(theta);
                positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
                positions[i3 + 2] = r * Math.cos(phi);
            } else if (distribution.shape === 'box') {
                positions[i3] = (Math.random() - 0.5) * distribution.size[0];
                positions[i3 + 1] = (Math.random() - 0.5) * distribution.size[1];
                positions[i3 + 2] = (Math.random() - 0.5) * distribution.size[2];
            }

            // Velocity
            velocities[i3] = (Math.random() - 0.5) * physics.turbulence;
            velocities[i3 + 1] = (Math.random() - 0.5) * physics.turbulence;
            velocities[i3 + 2] = (Math.random() - 0.5) * physics.turbulence;

            // Random values for animation
            randoms[i] = Math.random();
            
            // Size variation
            sizes[i] = appearance.size * (0.5 + Math.random() * 0.5);
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
        geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));
        geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));

        // Create material based on type
        const material = getShaderMaterial(type, appearance);

        // Create particle system
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    update() {
        this.time += 0.01;
        
        if (!this.particles) return;

        const { physics } = this.config;
        const positions = this.particles.geometry.attributes.position.array;
        const velocities = this.particles.geometry.attributes.velocity.array;

        // Update particle positions
        for (let i = 0; i < positions.length; i += 3) {
            // Apply motion based on type
            switch (this.config.type) {
                case 'snowflake':
                    positions[i + 1] -= physics.speed; // Fall down
                    positions[i] += Math.sin(this.time + i) * 0.001; // Gentle sway
                    
                    // Reset position when out of bounds
                    if (positions[i + 1] < -5) {
                        positions[i + 1] = 5;
                    }
                    break;

                case 'smoke':
                    positions[i + 1] += physics.speed; // Rise up
                    positions[i] += velocities[i] * 0.01;
                    positions[i + 2] += velocities[i + 2] * 0.01;
                    
                    if (positions[i + 1] > 5) {
                        positions[i + 1] = -5;
                    }
                    break;

                case 'firework':
                    // Explosive outward motion
                    positions[i] += velocities[i] * physics.speed;
                    positions[i + 1] += velocities[i + 1] * physics.speed - 0.002; // Gravity
                    positions[i + 2] += velocities[i + 2] * physics.speed;
                    
                    // Reset if too far
                    const dist = Math.sqrt(
                        positions[i] ** 2 + 
                        positions[i + 1] ** 2 + 
                        positions[i + 2] ** 2
                    );
                    if (dist > 5) {
                        positions[i] = 0;
                        positions[i + 1] = 0;
                        positions[i + 2] = 0;
                    }
                    break;

                case 'sphere':
                case 'cube':
                    // Orbital motion
                    const angle = this.time * physics.speed;
                    const radius = Math.sqrt(positions[i] ** 2 + positions[i + 2] ** 2);
                    positions[i] = radius * Math.cos(angle + i);
                    positions[i + 2] = radius * Math.sin(angle + i);
                    break;
            }
        }

        this.particles.geometry.attributes.position.needsUpdate = true;
        
        // Update shader uniforms
        if (this.particles.material.uniforms) {
            this.particles.material.uniforms.uTime.value = this.time;
        }
    }

    updateConfig(newConfig) {
        this.config = newConfig;
        this.createParticles();
    }

    dispose() {
        if (this.particles) {
            this.scene.remove(this.particles);
            this.particles.geometry.dispose();
            this.particles.material.dispose();
        }
    }
}