# 🌟 3D Particle Art System

一个基于 Three.js 的多模态 3D 粒子艺术生成系统，支持 LLM 驱动的 JSON 配置控制。

## ✨ 特性

### 已实现功能 (Phase 1 MVP)

- ✅ **5 种预设粒子类型**
  - ❄️ **Snowflake (雪花)**: 柔和飘落效果，六边形图案，闪烁动画
  - 💨 **Smoke (烟雾)**: 上升流动，半透明，渐变消散
  - 🎆 **Firework (烟花)**: 爆炸效果，发光材质，脉冲动画
  - 🔵 **Sphere (球体)**: 轨道运动，球形分布
  - 🟦 **Cube (立方体)**: 立方体分布，旋转动画

- ✅ **实时交互控制**
  - 粒子类型切换
  - 颜色调整
  - 数量控制 (1,000 - 20,000)
  - 大小调整
  - 速度控制

- ✅ **JSON 驱动架构**
  - 实时 JSON 配置显示
  - 导出 JSON 配置文件
  - 所有粒子属性通过 JSON 配置

- ✅ **自定义 Shader**
  - 每种粒子类型独特的着色器
  - 距离衰减
  - 动态动画效果

## 💻 技术栈

- **Three.js** - 3D 渲染引擎
- **Vite** - 构建工具
- **WebGL Shaders (GLSL)** - 自定义着色器
- **Vanilla JavaScript** - 纯 JavaScript，无额外框架

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

### GitHub Pages 部署

本项目已配置 GitHub Pages 自动部署。推送到 `main` 分支即可触发部署。

访问地址: `https://chrischen003.github.io/3d-particle-art-system/`

## 📋 JSON 配置结构

```json
{
  "type": "snowflake",
  "count": 5000,
  "appearance": {
    "color": "#ffffff",
    "size": 0.05,
    "material": "glossy",
    "opacity": 0.8
  },
  "physics": {
    "speed": 0.02,
    "turbulence": 0.1,
    "gravity": -0.001
  },
  "distribution": {
    "shape": "box",
    "size": [10, 10, 10],
    "radius": 5
  }
}
```

### 配置参数说明

- **type**: 粒子类型 (`snowflake` | `smoke` | `firework` | `sphere` | `cube`)
- **count**: 粒子数量
- **appearance**: 视觉外观
  - `color`: 颜色 (hex)
  - `size`: 大小
  - `material`: 材质 (`matte` | `glossy` | `emissive`)
  - `opacity`: 不透明度
- **physics**: 物理属性
  - `speed`: 移动速度
  - `turbulence`: 渍流强度
  - `gravity`: 重力加速度
- **distribution**: 空间分布
  - `shape`: 分布形状 (`sphere` | `box`)
  - `size`: 分布范围 [x, y, z]
  - `radius`: 半径（球形分布时）

## 🎯 路线图

### Phase 1: MVP ✅ 已完成
- [x] 基础粒子系统
- [x] 5 种预设粒子类型
- [x] 自定义 Shader
- [x] JSON 配置系统
- [x] 基础 UI 控制

### Phase 2: 多模态扩展 🔄 计划中
- [ ] LLM 文本驱动 (GPT-4 API)
- [ ] 图片输入解析 (GPT-4 Vision)
- [ ] 3D 模型输入支持
- [ ] 增量更新机制

### Phase 3: 高级功能 🔮 未来
- [ ] 性能优化 (LOD 系统)
- [ ] 社区功能
- [ ] 预设模板库
- [ ] 动画序列生成

## 🎮 使用方法

1. **选择粒子类型**: 使用左侧控制面板选择粒子效果
2. **调整参数**: 通过滑块和颜色选择器实时调整
3. **交互操作**:
   - 🖄️ 拖动鼠标旋转视角
   - 🔍 滚动缩放
4. **导出配置**: 点击 "Export JSON" 保存当前配置

## 📚 参考资料

- [Three.js 官方文档](https://threejs.org/docs/)
- [WebGL Shaders 教程](https://www.shadertoy.com/)
- [Vite 文档](https://vitejs.dev/)

## 📝 License

MIT License - 详见 LICENSE 文件

## 👥 贡献

欢迎提交 Issue 和 Pull Request！

---

⭐ **如果你觉得这个项目有用，请给个 Star！** ⭐