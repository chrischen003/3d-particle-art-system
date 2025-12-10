export const particleConfigs = {
    snowflake: {
        type: 'snowflake',
        count: 5000,
        appearance: {
            color: '#ffffff',
            size: 0.15,  // 增大从 0.05 到 0.15
            material: 'glossy',
            opacity: 0.9  // 增强不透明度
        },
        physics: {
            speed: 0.02,
            turbulence: 0.1,
            gravity: -0.001
        },
        distribution: {
            shape: 'box',
            size: [10, 10, 10],
            radius: 5
        }
    },

    smoke: {
        type: 'smoke',
        count: 8000,
        appearance: {
            color: '#cccccc',  // 更亮的烟雾
            size: 0.2,  // 增大从 0.08 到 0.2
            material: 'matte',
            opacity: 0.6  // 增强不透明度
        },
        physics: {
            speed: 0.03,
            turbulence: 0.3,
            gravity: 0
        },
        distribution: {
            shape: 'box',
            size: [8, 8, 8],
            radius: 4
        }
    },

    firework: {
        type: 'firework',
        count: 3000,
        appearance: {
            color: '#ff00ff',
            size: 0.12,  // 增大从 0.04 到 0.12
            material: 'emissive',
            opacity: 1.0
        },
        physics: {
            speed: 0.08,
            turbulence: 0.5,
            gravity: -0.002
        },
        distribution: {
            shape: 'sphere',
            size: [1, 1, 1],
            radius: 0.2
        }
    },

    sphere: {
        type: 'sphere',
        count: 10000,
        appearance: {
            color: '#00ffff',
            size: 0.1,  // 增大从 0.03 到 0.1
            material: 'glossy',
            opacity: 0.95  // 增强不透明度
        },
        physics: {
            speed: 0.1,
            turbulence: 0.05,
            gravity: 0
        },
        distribution: {
            shape: 'sphere',
            size: [1, 1, 1],
            radius: 3
        }
    },

    cube: {
        type: 'cube',
        count: 8000,
        appearance: {
            color: '#ffff00',
            size: 0.12,  // 增大从 0.04 到 0.12
            material: 'matte',
            opacity: 0.9  // 增强不透明度
        },
        physics: {
            speed: 0.05,
            turbulence: 0.1,
            gravity: 0
        },
        distribution: {
            shape: 'box',
            size: [6, 6, 6],
            radius: 3
        }
    }
};