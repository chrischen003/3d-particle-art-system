# 🧪 测试和调试指南

## 🚨 紧急修复检查清单

### ✅ 第一步：验证基础功能（无需 API Key）

打开页面后，**在没有配置 API Key 的情况下**：

- [ ] ✅ 页面正常加载，背景是黑色
- [ ] ✅ 左上角控制面板显示
- [ ] ✅ 雪花粒子效果自动出现
- [ ] ✅ 可以拖动鼠标旋转视角
- [ ] ✅ 可以滚动缩放

### ✅ 第二步：测试手动控制

在 "🎨 Manual Controls" 区域：

1. **粒子类型**
   - [ ] 下拉菜单可以打开
   - [ ] 选择 "🎆 Firework"，粒子效果立即改变
   - [ ] 选择 "💨 Smoke"，粒子开始上升

2. **颜色选择器**
   - [ ] 点击颜色方块，出现颜色选择器
   - [ ] 选择红色，粒子颜色变红
   - [ ] 选择蓝色，粒子颜色变蓝

3. **滑块控制**
   - [ ] 拖动 "Particle Count" 滑块，数值和粒子数量同步变化
   - [ ] 拖动 "Size" 滑块，粒子大小实时变化
   - [ ] 拖动 "Speed" 滑块，粒子速度实时变化

4. **导出功能**
   - [ ] 点击 "💾 Export JSON"，自动下载 JSON 文件

**如果以上全部正常，说明 Phase 1 基础功能完全正常！**

---

### ✅ 第三步：测试设置弹窗

1. **打开设置**
   - [ ] 点击右上角 ⚙️ 图标
   - [ ] 弹窗出现，背景变暗模糊
   - [ ] 弹窗有绿色边框和模糊效果

2. **API Key 输入**
   - [ ] 输入框默认是星号显示 (type="password")
   - [ ] 点击 👁️ 按钮，星号变成明文
   - [ ] 再次点击 🙈 按钮，明文变回星号

3. **关闭弹窗**
   - [ ] 点击 ✕ 按钮，弹窗关闭
   - [ ] 点击弹窗外面背景，弹窗也关闭

**如果以上全部正常，说明设置弹窗功能完全正常！**

---

### ✅ 第四步：配置 API Key

1. **获取 API Key**
   - 访问: https://ai.google.dev/
   - 登录 Google 账号
   - 点击 "Get API Key"
   - 复制 API Key（以 AIza 开头）

2. **保存 API Key**
   - [ ] 点击 ⚙️ 打开设置
   - [ ] 粘贴你的 API Key
   - [ ] 点击 "💾 Save & Activate"
   - [ ] 弹窗自动关闭
   - [ ] 底部 AI 区域的状态变为：✅ AI Ready - Start creating!

3. **验证 AI 启用**
   - [ ] "🤖 AI Assistant" 区域的文本框变为可用（不再是灰色）
   - [ ] "✨ Generate" 按钮变为可用（不再是灰色）
   - [ ] 4 个示例按钮全部变为可用

**如果以上全部正常，说明 API Key 配置成功！**

---

### ✅ 第五步：测试 AI 生成

1. **手动输入**
   - [ ] 在文本框输入："浪漫的紫色烟花"
   - [ ] 点击 "✨ Generate"
   - [ ] 状态显示：🤔 AI is thinking...
   - [ ] 1-3 秒后粒子效果自动变为紫色烟花
   - [ ] 状态显示：✅ Generated with Flash ⚡

2. **示例按钮**
   - [ ] 点击 "💜 烟花" 按钮
   - [ ] 自动生成烟花效果
   - [ ] 点击 "⛄ 雪花" 按钮
   - [ ] 自动生成雪花效果

3. **模型切换**
   - [ ] 将 Flash/Pro 开关拨到 Pro
   - [ ] 状态显示：✅ Switched to Gemini 3 Pro
   - [ ] 输入复杂描述，点击 Generate
   - [ ] 状态显示：✅ Generated with Pro 🧠

**如果以上全部正常，说明 AI 功能完全正常！**

---

## 🔍 故障排查

### 问题 1：设置按钮点击无效

**现象**：点击 ⚙️ 没有反应

**排查**：
1. 打开浏览器控制台 (F12)
2. 查看 Console 选项卡
3. 看是否有红色错误：
   - 如果有 "element not found"，说明 HTML 没正常加载
   - 如果有 "addEventListener" 错误，说明 JS 没正常加载

**解决**：
- 刷新页面 (Ctrl+Shift+R 强制刷新)
- 清除缓存并刷新

---

### 问题 2：Generate 按钮始终灰色

**现象**：配置了 API Key，但 Generate 按钮还是灰色

**排查**：
1. 打开控制台
2. 输入：`localStorage.getItem('gemini_api_key')`
3. 按 Enter，看是否返回你的 API Key

**解决**：
- 如果返回 `null`，说明 API Key 没保存成功
- 重新点击 ⚙️，再次保存 API Key
- 注意看控制台是否有 "✅ AI initialized successfully"

---

### 问题 3：手动控制不可用

**现象**：滑块、下拉框无法使用

**原因**：这不应该发生！手动控制应该始终可用

**解决**：
1. 查看控制台是否有 JS 错误
2. 刷新页面
3. 检查是否有 CSS 文件加载失败

---

### 问题 4：AI 生成失败

**现象**：点击 Generate 后显示错误

**可能原因**：
1. **API Key 无效**
   - 状态：❌ Invalid API Key - Check settings
   - 解决：检查 API Key 是否正确

2. **网络问题**
   - 状态：❌ Generation failed
   - 解决：检查网络连接

3. **配额超限**
   - 状态：❌ Quota exceeded
   - 解决：等待 24 小时后重试

---

## 📝 控制台日志检查

**正常启动应该看到**：
```
🚀 Initializing 3D Particle Art System...
🔧 Setting up modal...
✅ Modal setup complete
✅ System initialized successfully!
```

**配置 API Key 后应该看到**：
```
🔓 Opening settings modal...
💾 Saving API key...
🤖 Initializing AI controller...
✅ AI initialized successfully
🔒 Closing settings modal...
```

**生成效果时应该看到**：
```
🎨 Generating config for: 浪漫的紫色烟花
✅ Generated config: { ... }
```

---

## 🛠️ 手动调试命令

在浏览器控制台输入以下命令：

### 检查 API Key
```javascript
localStorage.getItem('gemini_api_key')
```

### 清除 API Key
```javascript
localStorage.removeItem('gemini_api_key')
```

### 设置 API Key
```javascript
localStorage.setItem('gemini_api_key', 'YOUR_API_KEY')
```

### 检查元素是否存在
```javascript
document.getElementById('open-settings')
document.getElementById('settings-modal')
document.getElementById('send-btn')
```

### 强制打开设置弹窗
```javascript
document.getElementById('settings-modal').classList.add('show')
```

### 强制启用 AI 控件
```javascript
document.getElementById('ai-input').disabled = false
document.getElementById('send-btn').disabled = false
```

---

## ✅ 最终验收标准

**Phase 1 功能（无需 API Key）**
- ✅ 页面正常加载
- ✅ 粒子效果显示
- ✅ 5 种粒子类型可切换
- ✅ 颜色/数量/大小/速度可调节
- ✅ 可导出 JSON
- ✅ 3D 交互（旋转/缩放）

**Phase 2 AI 功能（需要 API Key）**
- ✅ 设置弹窗正常打开/关闭
- ✅ API Key 星号加密显示
- ✅ API Key 保存成功
- ✅ AI 控件自动启用
- ✅ 文本生成效果成功
- ✅ 示例按钮可用
- ✅ Flash/Pro 模型可切换

---

## 📞 联系支持

如果以上所有步骤都失败，请提供：
1. 浏览器控制台截图
2. Network 选项卡的请求状态
3. 具体操作步骤和错误信息

**系统要求**：
- 现代浏览器 (Chrome 90+, Firefox 88+, Safari 14+)
- 稳定的网络连接
- 已启用 JavaScript
- 已启用 WebGL