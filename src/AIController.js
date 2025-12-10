import { GoogleGenerativeAI } from '@google/generative-ai';
import { PromptEngine } from './PromptEngine.js';

export class AIController {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.genAI = null;
        this.currentModel = 'flash'; // 'flash' or 'pro'
        this.conversationHistory = [];
        this.promptEngine = new PromptEngine();
        this.isProcessing = false;
        
        if (apiKey) {
            this.initialize();
        }
    }

    initialize() {
        try {
            this.genAI = new GoogleGenerativeAI(this.apiKey);
            console.log('✅ Google AI initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize Google AI:', error);
            throw new Error('Invalid API Key');
        }
    }

    setApiKey(apiKey) {
        this.apiKey = apiKey;
        this.initialize();
    }

    // 智能选择模型（混合方案）
    selectModel(userInput) {
        const complexityIndicators = [
            '复杂', '详细', '多个', '序列', '动画', '故事',
            'complex', 'detailed', 'multiple', 'sequence', 'animation', 'story'
        ];
        
        const isComplex = complexityIndicators.some(indicator => 
            userInput.toLowerCase().includes(indicator)
        );

        // 如果输入包含复杂性指示词，使用 Pro 模型
        if (isComplex) {
            this.currentModel = 'pro';
            console.log('🧠 Using Gemini 3 Pro (Complex task detected)');
        } else {
            this.currentModel = 'flash';
            console.log('⚡ Using Gemini 2.0 Flash (Fast mode)');
        }

        return this.currentModel;
    }

    getModel() {
        const modelName = this.currentModel === 'pro' 
            ? 'gemini-3-pro-preview' 
            : 'gemini-2.0-flash-exp';

        return this.genAI.getGenerativeModel({
            model: modelName,
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 2048,
                responseMimeType: 'application/json'
            }
        });
    }

    // 生成粒子配置
    async generateParticleConfig(userInput, currentConfig = null) {
        if (!this.genAI) {
            throw new Error('AI not initialized. Please provide API Key.');
        }

        if (this.isProcessing) {
            throw new Error('Processing previous request...');
        }

        this.isProcessing = true;

        try {
            // 智能选择模型
            this.selectModel(userInput);

            // 构建 prompt
            const prompt = this.promptEngine.buildPrompt(
                userInput, 
                currentConfig,
                this.conversationHistory
            );

            // 调用 AI
            const model = this.getModel();
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // 解析 JSON
            let config;
            try {
                config = JSON.parse(text);
            } catch (e) {
                // 如果 JSON 解析失败，尝试提取 JSON
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    config = JSON.parse(jsonMatch[0]);
                } else {
                    throw new Error('Invalid JSON response from AI');
                }
            }

            // 验证配置
            this.validateConfig(config);

            // 保存到对话历史
            this.conversationHistory.push({
                userInput,
                aiConfig: config,
                timestamp: Date.now()
            });

            // 限制历史记录长度
            if (this.conversationHistory.length > 5) {
                this.conversationHistory.shift();
            }

            this.isProcessing = false;
            return config;

        } catch (error) {
            this.isProcessing = false;
            console.error('AI Generation Error:', error);
            throw error;
        }
    }

    // 验证配置
    validateConfig(config) {
        const required = ['type', 'count', 'appearance', 'physics', 'distribution'];
        
        for (const field of required) {
            if (!config[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        // 类型验证
        const validTypes = ['snowflake', 'smoke', 'firework', 'sphere', 'cube'];
        if (!validTypes.includes(config.type)) {
            config.type = 'sphere'; // 默认类型
        }

        // 数值范围验证
        config.count = Math.max(1000, Math.min(20000, config.count));
        config.appearance.size = Math.max(0.01, Math.min(0.2, config.appearance.size));
        config.appearance.opacity = Math.max(0, Math.min(1, config.appearance.opacity));

        return config;
    }

    // 获取对话历史
    getHistory() {
        return this.conversationHistory;
    }

    // 清除历史
    clearHistory() {
        this.conversationHistory = [];
    }

    // 切换模型
    switchModel(modelType) {
        if (['flash', 'pro'].includes(modelType)) {
            this.currentModel = modelType;
            console.log(`🔄 Switched to ${modelType === 'pro' ? 'Gemini 3 Pro' : 'Gemini 2.0 Flash'}`);
        }
    }
}