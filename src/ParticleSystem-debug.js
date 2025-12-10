import * as THREE from 'three';

/**
 * 调试版粒子系统 - 使用最简单的方式
 */
export class ParticleSystemDebug {
    constructor(scene, config) {
        this.scene = scene;
        this.config = config;
        this.particles = null;
        this.time = 0;
        
        console.log('🔧 Creating debug particle system with config:', config);
        this.createSimpleParticles();
    }

    createSimpleParticles() {
        // Remove old particles
        if (this.particles) {
            this.scene.remove(this.particles);
            this.particles.geometry.dispose();
            this.particles.material.dispose();
            console.log('🗑️ Old particles removed');
        }

        const count = this.config.count || 5000;
        console.log(`🔨 Creating ${count} particles...`);

        // Create geometry
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);

        // Generate random positions in a box
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 10;     // x
            positions[i3 + 1] = (Math.random() - 0.5) * 10; // y
            positions[i3 + 2] = (Math.random() - 0.5) * 10; // z
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        console.log('✅ Geometry created with positions');

        // Create simple material
        const color = new THREE.Color(this.config.appearance?.color || '#ffffff');
        const size = (this.config.appearance?.size || 0.15) * 10; // 大型颗粒
        
        const material = new THREE.PointsMaterial({
            color: color,
            size: size,
            sizeAttenuation: true,
            transparent: true,
            opacity: 1.0,
            depthWrite: false
        });
        
        console.log(`✅ Material created: color=${color.getHexString()}, size=${size}`);

        // Create particle system
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
        
        console.log('✅ Particles added to scene');
        console.log('Scene children count:', this.scene.children.length);
    }

    update() {
        if (!this.particles) return;
        
        this.time += 0.01;
        
        // Simple rotation animation
        this.particles.rotation.y = this.time * 0.1;
        
        // Slow fall
        const positions = this.particles.geometry.attributes.position.array;
        for (let i = 1; i < positions.length; i += 3) {
            positions[i] -= 0.01;
            if (positions[i] < -5) {
                positions[i] = 5;
            }
        }
        this.particles.geometry.attributes.position.needsUpdate = true;
    }

    updateConfig(newConfig) {
        console.log('🔄 Updating config:', newConfig);
        this.config = newConfig;
        this.createSimpleParticles();
    }

    dispose() {
        if (this.particles) {
            this.scene.remove(this.particles);
            this.particles.geometry.dispose();
            this.particles.material.dispose();
        }
    }
}