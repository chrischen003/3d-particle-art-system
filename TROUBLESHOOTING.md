# 🔧 粒子系统问题排查指南

## ❗ 核心问题：粒子不可见

### 🚨 紧急修复（最新版本）

**问题根源**：自定义 Shader 在某些环境下不可见

**解决方案**：已替换为 Three.js 内置 `PointsMaterial`

---

## ✅ 立即测试步骤

### 1️⃣ **基础测试页面**

访问：[https://chrischen003.github.io/3d-particle-art-system/test.html](https://chrischen003.github.io/3d-particle-art-system/test.html)

**应该看到**：
- 左上角绿色调试信息
- 大量白色光点慢慢旋转
- 所有项目显示绿色 ✅

**如果这个页面有粒子**：
- ✅ Three.js 正常工作
- ✅ WebGL 支持正常
- ✅ 问题在主页面逻辑

**如果这个页面没有粒子**：
- ❌ 浏览器不支持 WebGL
- ❌ 显卡驱动问题
- ❌ 硬件加速被禁用

---

### 2️⃣ **主页面测试**

访问：[https://chrischen003.github.io/3d-particle-art-system/](https://chrischen003.github.io/3d-particle-art-system/)

**正常情况应该看到**：

```
       ❄️    ❄️      ❄️
   ❄️       ❄️    ❄️
❄️     ❄️        ❄️    ❄️
    ❄️    ❄️      ❄️
```

- **5000 个白色雪花**在黑色背景上飘落
- 可以拖动鼠标旋转视角
- 可以滚轮缩放

---

## 🔍 故障诊断清单

### 场景 A：完全黑屏

**症状**：打开页面只有黑色背景，什么都没有

**原因**：
1. JavaScript 没有加载
2. 网络资源加载失败
3. Vite 构建问题

**排查**：
```javascript
// 打开浏览器控制台 (F12)
// 应该看到：
🚀 Initializing 3D Particle Art System...
✅ Particle system created with config: {...}
✅ System initialized successfully!
```

**如果没有日志**：
1. 检查 Console 选项卡是否有红色错误
2. 检查 Network 选项卡是否有 404
3. 强制刷新：Ctrl+Shift+R

---

### 场景 B：有 UI 但没有粒子

**症状**：左侧控制面板可见，但中间画布没有粒子

**原因**：
1. 粒子太小（已修复）
2. 相机位置不对（已修复）
3. Shader 问题（已用 PointsMaterial 替换）

**排查**：
```javascript
// 控制台输入：
scene.children.length
// 应该返回 >= 3 (包含粒子、光照)

scene.children.forEach(c => console.log(c.type))
// 应该看到：Points, AmbientLight, PointLight
```

**应急修复**：
1. 拖动 Size 滑块到最大 (0.3)
2. 拖动 Count 滑块到最大 (20000)
3. 用鼠标滚轮缩小相机距离

---

### 场景 C：粒子很模糊/太小

**症状**：能看到小光点，但很难辨认

**解决**：
1. **增大尺寸**：拖动 Size 滑块到 0.2-0.3
2. **增加数量**：Count 设为 10000+
3. **靠近相机**：滚轮缩小到最小距离 (3)

---

## 📊 最新修复历史

### Version 3.0 (2025-12-10 最新)

**重大变更**：
- ✅ **删除自定义 Shader**，改用 `THREE.PointsMaterial`
- ✅ **粒子大小 x2**：从 0.15 变为 0.3 (实际渲染)
- ✅ **简化动画逻辑**，减少复杂度
- ✅ **增强错误处理**，添加详细日志

**为什么这次会有效**：

| 方法 | 问题 | 解决 |
|------|------|------|
| **自定义 Shader** | 可能不兼容 | ❌ 删除 |
| **PointsMaterial** | Three.js 内置 | ✅ 使用 |
| **小粒子** | size 过小 | ✅ 放大 2倍 |
| **复杂逻辑** | 难调试 | ✅ 简化 |

---

## 🐛 如果还是不可见

### 最后的检查

1. **浏览器支持**
   ```javascript
   // 控制台输入
   document.createElement('canvas').getContext('webgl')
   // 应该返回对象，不是 null
   ```

2. **硬件加速**
   - Chrome: `chrome://gpu`
   - 查看 "Graphics Feature Status"
   - 所有项目应该是 "Hardware accelerated"

3. **显卡驱动**
   - 更新显卡驱动到最新版本
   - 重启浏览器

4. **测试其他浏览器**
   - Chrome / Edge (推荐)
   - Firefox
   - Safari (Mac)

5. **禁用扩展**
   - 在隐身模式下测试
   - 禁用所有浏览器扩展

---

## 📞 联系支持

**如果仍然无法解决，请提供**：

1. 浏览器版本 (Chrome/Firefox/Safari)
2. 操作系统 (Windows/Mac/Linux)
3. 控制台截图 (Console + Network 选项卡)
4. test.html 是否可见
5. `chrome://gpu` 的输出

---

## ✅ 预期效果

**正常情况下，你应该看到**：

### Snowflake (雪花) ⛄
- 5000 个白色光点
- 缓慢从上往下飘落
- 左右轻微摇摆

### Smoke (烟雾) 💨
- 8000 个灰色光点
- 从下往上上升
- 轻微扩散

### Firework (烟花) 🎆
- 3000 个紫色发光光点
- 从中心向外爆炸
- 有重力下落效果

### Sphere (球体) 🔵
- 10000 个青色光点
- 形成旋转的球体

### Cube (立方体) 🟦
- 8000 个黄色光点
- 形成旋转的立方体

---

## 🚀 快速测试命令

在浏览器控制台中运行：

```javascript
// 1. 检查场景对象
scene
// 应该返回 THREE.Scene {...}

// 2. 检查粒子系统
particleSystem
// 应该返回 ParticleSystem {...}

// 3. 检查场景子元素
scene.children
// 应该有 Points, AmbientLight, PointLight

// 4. 检查粒子数量
particleSystem.particles.geometry.attributes.position.count
// 应该返回 5000

// 5. 强制可见
if (particleSystem.particles) {
    particleSystem.particles.material.size = 1.0;
    particleSystem.particles.material.needsUpdate = true;
}
// 粒子应该变得很大
```

---

**最后更新**: 2025-12-10  
**版本**: 3.0 (使用 PointsMaterial)