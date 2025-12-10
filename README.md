# 🌟 3D Particle Art System - AI Powered

一个基于 Three.js 和 Google Gemini AI 的多模态 3D 粒子艺术生成系统，支持自然语言驱动的粒子效果生成。

## ✨ 特性

### ✅ Phase 1: 基础粒子系统 (MVP)

- ✅ **5 种预设粒子类型**
  - ❄️ **Snowflake (雪花)**: 柔和飘落效果，六边形图案，闪烁动画
  - 💨 **Smoke (烟雾)**: 上升流动，半透明，渐变消散
  - 🎆 **Firework (烟花)**: 爆炸效果，发光材质，脉冲动画
  - 🔵 **Sphere (球体)**: 轨道运动，球形分布
  - 🟦 **Cube (立方体)**: 立方体分布，旋转动画

- ✅ **实时交互控制**
- ✅ **JSON 驱动架构**
- ✅ **自定义 Shader**

### 🆕 Phase 2: AI 文本驱动 (新！)

- ✅ **自然语言输入**: 用中文/英文描述你想要的效果
- ✅ **混合模型策略**:
  - ⚡ **Gemini 2.0 Flash**: 快速、低成本，适用于简单任务
  - 🧠 **Gemini 3 Pro**: 超强推理，适用于复杂任务
  - 🤖 **智能切换**: 根据任务复杂度自动选择模型
- ✅ **对话历史**: 支持连续调整（"让它更亮一点"）
- ✅ **预设示例**: 一键生成常用效果
- ✅ **安全管理**: 设置弹窗 + 密码加密显示
- ✅ **实时生成**: 1-2 秒即可看到结果

## 💻 技术栈

- **Three.js** - 3D 渲染引擎
- **Google Gemini AI** - LLM 文本驱动
  - Gemini 2.0 Flash (Fast)
  - Gemini 3 Pro (Powerful)
- **Vite** - 构建工具
- **WebGL Shaders (GLSL)** - 自定义着色器

## 🚀 快速开始

### 在线使用

1. **访问**: [https://chrischen003.github.io/3d-particle-art-system/](https://chrischen003.github.io/3d-particle-art-system/)
2. **点击 ⚙️**: 打开设置弹窗
3. **输入 API Key**: 在 [Google AI Studio](https://ai.google.dev/) 获取免费 API Key
4. **保存并开始**: 点击保存，开始创作！

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 🔑 API Key 获取步骤

1. 访问 [Google AI Studio](https://ai.google.dev/)
2. 登录 Google 账号
3. 点击 "Get API Key"
4. 创建新的 API Key
5. 复制并粘贴到系统设置中

**🎁 免费额度**: 每天 **1500 次**免费请求！

## 🤖 AI 使用示例

### 基础使用

```
输入: "创建浪漫的紫色烟花效果"
AI 生成: 紫色发光粒子，爆炸式散开，脉冲动画
```

### 连续调整

```
1. "创建雪花效果"
2. "把颜色改成金色"
3. "让它飘得更慢一些"
4. "增加粒子数量到 10000"
```

### 复杂任务（自动切换到 Pro 模型）

```
"创建一个包含多个层次的复杂粒子系统"
→ 自动使用 Gemini 3 Pro 处理
```

## 🎮 使用指南

### 🤖 AI 模式

1. **配置 API Key** (首次使用)
   - 点击右上角 ⚙️ 设置按钮
   - 输入你的 Gemini API Key
   - 点击保存
   - API Key 会安全存储在本地

2. **创建粒子效果**
   - 在文本框中描述你想要的效果
   - 点击 "✨ Generate" 或按 Enter
   - 等待 1-2 秒，看到效果自动应用

3. **使用预设示例**
   - 点击任何示例按钮（💜 🎆 🌌 🔥）
   - 立即生成对应效果

4. **连续调整**
   - 直接说出修改需求
   - AI 会基于当前配置进行增量更新

### 🎨 手动模式

1. **选择粒子类型**: 使用下拉菜单
2. **调整参数**: 通过滑块实时调整
3. **交互操作**:
   - 🖄️ 拖动鼠标旋转视角
   - 🔍 滚动缩放

## 📋 JSON 配置结构

```json
{
  "type": "firework",
  "count": 5000,
  "appearance": {
    "color": "#FF00FF",
    "size": 0.05,
    "material": "emissive",
    "opacity": 1.0
  },
  "physics": {
    "speed": 0.15,
    "turbulence": 0.4,
    "gravity": -0.002
  },
  "distribution": {
    "shape": "sphere",
    "size": [1, 1, 1],
    "radius": 0.3
  }
}
```

## 💡 混合模型策略

系统会根据任务复杂度自动选择最优模型：

| 场景 | 模型 | 响应时间 | 成本 |
|------|------|----------|------|
| 简单描述 | Flash ⚡ | 1-2秒 | 极低 |
| 复杂推理 | Pro 🧠 | 3-5秒 | 中等 |

**复杂指示词**: 复杂、详细、多个、序列、动画、故事、complex、detailed、multiple、sequence

也可以手动切换：使用界面上的 Flash/Pro 切换开关。

## 🎯 路线图

### Phase 1: MVP ✅ 已完成
- [x] 基础粒子系统
- [x] 5 种预设粒子类型
- [x] 自定义 Shader
- [x] JSON 配置系统

### Phase 2: AI 文本驱动 ✅ 已完成
- [x] LLM 文本驱动 (Gemini)
- [x] 混合模型策略 (Flash + Pro)
- [x] 智能模型切换
- [x] 对话历史支持
- [x] 预设示例
- [x] 安全设置管理

### Phase 3: 多模态输入 🔄 计划中
- [ ] 图片输入解析 (Gemini Vision)
- [ ] 3D 模型输入支持
- [ ] 语音输入
- [ ] 图片 + 文本组合输入

### Phase 4: 高级功能 🔮 未来
- [ ] 性能优化 (LOD 系统)
- [ ] 社区功能
- [ ] 预设模板库
- [ ] 动画序列生成

## ⚠️ 注意事项

### 🔒 API Key 安全

- ✅ API Key 存储在本地 localStorage
- ✅ 输入框支持密码模式（星号显示）
- ⚠️ 不要分享你的 API Key
- ⚠️ API Key 仅存储在你的浏览器中

### 📊 使用限制

- 免费版每天 **1500 次**请求
- 建议合理使用，避免超限
- Flash 模型比 Pro 更省配额

### 🌐 网络要求

- 需要稳定的网络连接
- 需要访问 Google AI API

## 📚 API 参考

### AIController 类

```javascript
import { AIController } from './src/AIController.js';

const ai = new AIController('YOUR_API_KEY');

// 生成配置
const config = await ai.generateParticleConfig('创建烟花效果');

// 增量更新
const updated = await ai.generateParticleConfig('让它更大', currentConfig);

// 切换模型
ai.switchModel('pro'); // 或 'flash'

// 清除历史
ai.clearHistory();
```

## 👥 贡献

欢迎提交 Issue 和 Pull Request！

## 📝 License

MIT License

---

⭐ **如果你觉得这个项目有用，请给个 Star！** ⭐

**Powered by Google Gemini AI** 🤖