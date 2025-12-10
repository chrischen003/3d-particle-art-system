export class PromptEngine {
    constructor() {
        this.systemPrompt = this.buildSystemPrompt();
    }

    buildSystemPrompt() {
        return `You are a 3D particle system configuration generator. Your task is to convert natural language descriptions into valid JSON configurations.

**Available Particle Types:**
- snowflake: Gently falling particles with hexagonal pattern, glittering effect
- smoke: Rising particles with turbulent motion, semi-transparent
- firework: Explosive outward motion with emissive material, pulsing animation
- sphere: Orbital motion in spherical distribution
- cube: Box-shaped distribution with rotation

**JSON Schema:**
{
  "type": "snowflake" | "smoke" | "firework" | "sphere" | "cube",
  "count": 1000-20000,
  "appearance": {
    "color": "#RRGGBB",
    "size": 0.01-0.2,
    "material": "matte" | "glossy" | "emissive",
    "opacity": 0.0-1.0
  },
  "physics": {
    "speed": 0.01-0.5,
    "turbulence": 0.0-0.5,
    "gravity": -0.01 to 0.01
  },
  "distribution": {
    "shape": "sphere" | "box",
    "size": [x, y, z] (1-10 range),
    "radius": 0.1-5.0
  }
}

**Color Guidelines:**
- Romantic/Warm: #FF1493, #FF69B4, #FFB6C1
- Cold/Ice: #00FFFF, #87CEEB, #E0F7FF
- Fire/Energy: #FF4500, #FF6347, #FFA500
- Nature: #00FF00, #32CD32, #90EE90
- Space/Sci-fi: #0000FF, #4169E1, #1E90FF

**Material Guidelines:**
- matte: Soft, natural effects (smoke, clouds)
- glossy: Reflective, shiny (water, ice, snow)
- emissive: Glowing, bright (fire, stars, energy)

**Response Rules:**
1. Output ONLY valid JSON, no explanations
2. Use appropriate colors based on mood/theme
3. Match particle count to density needs (more = denser)
4. Balance speed and turbulence for realistic motion
5. Choose material that matches the aesthetic

Examples:

Input: "浪漫的紫色烟花"
Output: {"type":"firework","count":5000,"appearance":{"color":"#FF00FF","size":0.05,"material":"emissive","opacity":1.0},"physics":{"speed":0.15,"turbulence":0.4,"gravity":-0.002},"distribution":{"shape":"sphere","size":[1,1,1],"radius":0.3}}

Input: "缓慢飘落的金色雪花"
Output: {"type":"snowflake","count":8000,"appearance":{"color":"#FFD700","size":0.06,"material":"glossy","opacity":0.85},"physics":{"speed":0.015,"turbulence":0.08,"gravity":-0.001},"distribution":{"shape":"box","size":[10,10,10],"radius":5}}

Input: "科幻感的蓝色粒子球体"
Output: {"type":"sphere","count":12000,"appearance":{"color":"#00BFFF","size":0.03,"material":"emissive","opacity":0.9},"physics":{"speed":0.12,"turbulence":0.05,"gravity":0},"distribution":{"shape":"sphere","size":[1,1,1],"radius":3}}`;
    }

    buildPrompt(userInput, currentConfig = null, history = []) {
        let prompt = this.systemPrompt + '\n\n';

        // 添加对话历史上下文
        if (history.length > 0 && currentConfig) {
            prompt += '**Current Configuration:**\n';
            prompt += JSON.stringify(currentConfig, null, 2) + '\n\n';
            
            prompt += '**Conversation History:**\n';
            history.slice(-3).forEach((item, index) => {
                prompt += `${index + 1}. User: "${item.userInput}"\n`;
            });
            prompt += '\n';
        }

        // 添加用户输入
        if (currentConfig && this.isIncrementalUpdate(userInput)) {
            prompt += `**Task:** Modify the current configuration based on this request: "${userInput}"\n`;
            prompt += '**Instruction:** Only change the specified parameters, keep everything else the same.\n\n';
        } else {
            prompt += `**Task:** Generate a complete particle configuration for: "${userInput}"\n\n`;
        }

        prompt += '**Output (JSON only):**\n';

        return prompt;
    }

    // 判断是否是增量更新
    isIncrementalUpdate(input) {
        const incrementalKeywords = [
            '更', '改', '调', '增加', '减少', '提高', '降低', '加大', '缩小',
            'more', 'less', 'bigger', 'smaller', 'faster', 'slower', 'brighter', 'darker',
            '让', '使', '把', 'make', 'change', 'adjust', 'increase', 'decrease'
        ];

        return incrementalKeywords.some(keyword => 
            input.toLowerCase().includes(keyword)
        );
    }

    // 预设示例
    getExamples() {
        return [
            {
                text: '浪漫的紫色烟花 💜',
                description: 'Romantic purple fireworks'
            },
            {
                text: '缓慢飘落的金色雪花 ⛄',
                description: 'Slowly falling golden snowflakes'
            },
            {
                text: '科幻感的蓝色粒子球体 🌌',
                description: 'Sci-fi blue particle sphere'
            },
            {
                text: '火焰般的红色烟雾 🔥',
                description: 'Flame-like red smoke'
            },
            {
                text: '星空般闪烁的白色粒子 ✨',
                description: 'Starry white particles'
            }
        ];
    }
}