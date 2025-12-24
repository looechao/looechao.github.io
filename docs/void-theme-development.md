# void 主题开发过程

记录从零开始设计和实现 Hugo 主题 "void" 的完整过程。

---

## 1. 需求分析

### 起点

用户想要一个类似 [shloked.com](https://www.shloked.com/) 的博客主题。

### 目标网站分析

通过 WebFetch 抓取目标网站，分析其设计特点：

| 特点 | 描述 |
|------|------|
| 布局 | 左侧固定侧边栏 + 右侧可滚动内容 |
| 配色 | 深色背景 + 浅灰文字（极简暗色风） |
| 排版 | 大量留白、精简文字、清晰层级 |
| 导航 | 分层结构：头像 → 菜单 → 社交图标 |
| 交互 | 细腻的悬停效果 |
| 响应式 | 移动端导航隐藏 |

### 现有资源

用户已有一个 Hugo 博客，使用 `lucid` 主题，集成了：
- Giscus 评论
- Google Analytics
- NeoDB 短代码

### 关键决策

与用户确认了三个关键问题：

1. **配色风格** → 支持深浅色切换
2. **主题名称** → void
3. **首页内容** → 文章列表

---

## 2. 架构设计

### 文件结构规划

```
themes/void/
├── layouts/
│   ├── _default/        # 默认模板
│   ├── partials/        # 可复用组件
│   └── shortcodes/      # 短代码
└── static/
    ├── css/             # 样式
    └── js/              # 脚本
```

### 设计原则

1. **单文件 CSS** - 避免过度拆分，保持简单
2. **零 JS 框架** - 只用原生 JS 实现主题切换
3. **纯 CSS** - 不用 Tailwind 等框架，保持主题独立性
4. **利用 Hugo** - 充分使用 Hugo 模板语法和配置

---

## 3. 实现过程

### 第一阶段：基础骨架

**创建目录结构**

```bash
mkdir -p themes/void/{layouts/{_default,partials},static/{css,js}}
```

**实现 baseof.html**

定义 HTML 骨架，两栏 Grid 布局：

```html
<div class="layout">
  <aside class="sidebar">{{ partial "sidebar.html" . }}</aside>
  <main class="main">{{ block "main" . }}{{ end }}</main>
</div>
```

**实现 sidebar.html**

包含：头像、名字、简介、导航菜单、社交图标、主题切换按钮。

### 第二阶段：页面模板

| 模板 | 用途 |
|------|------|
| `index.html` | 首页，遍历 posts 展示文章列表 |
| `list.html` | 分类/标签列表页 |
| `single.html` | 文章详情页 |
| `404.html` | 错误页 |

### 第三阶段：样式实现

初版 CSS 结构：

```css
/* 变量 */
:root { ... }
[data-theme="dark"] { ... }
[data-theme="light"] { ... }

/* 布局 */
.layout { ... }
.sidebar { ... }
.main { ... }

/* 组件 */
.post-list { ... }
.article-content { ... }
```

### 第四阶段：主题切换

```javascript
function toggleTheme() {
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('theme', next);
}
```

---

## 4. 迭代优化

根据用户反馈进行多轮调整：

### 问题 1：文章不居中

**原因**: `.main` 没有设置 `margin: auto`

**解决**:
```css
.main { margin: 0 auto; }
```

### 问题 2：列表太窄

**需求**: 列表要像表格一样占满宽度

**解决**: 去掉 `.main` 的 `max-width`，让列表全宽展示

### 问题 3：布局调整

**需求**: 日期和标题靠左，tags 靠右

**解决**:
```css
.post-item {
  display: flex;
}
.post-date { width: 5rem; }
.post-title { flex: 1; }
.post-tags { margin-left: auto; }
```

### 问题 4：整行可点击

**需求**: 点击列表任意位置跳转，但 tags 除外

**解决**: 使用 `::after` 伪元素覆盖整行，tags 设置 `z-index: 1`

```css
.post-title a::after {
  content: "";
  position: absolute;
  inset: 0;
}
.post-tags { z-index: 1; }
```

### 问题 5：鼠标样式

**需求**: hover 时不要变成手指

**解决**: `cursor: default`

### 问题 6：滚动区域

**需求**: 左侧不响应滚动，只有右侧可滚动

**解决**:
```css
html, body { overflow: hidden; }
.sidebar { overflow: hidden; }
.main { overflow-y: auto; }
```

---

## 5. CSS 重构

### 第一次重构：现代 CSS 原则

参考文章《得体的网站所需的最少 CSS》，应用原则：

1. `color-scheme: light dark` - 利用浏览器原生深浅色
2. `system-ui` 字体 - 使用系统字体
3. 去掉冗余 reset
4. 使用逻辑属性（`margin-block`）

### 第二次重构：高级特性

应用更多现代 CSS 特性：

**@layer 层叠层**

```css
@layer base, layout, components, utilities;

@layer base { /* 颜色、变量 */ }
@layer layout { /* 两栏布局 */ }
@layer components { /* UI 组件 */ }
```

**CSS Nesting**

```css
.nav {
  a {
    &:hover { color: var(--text); }
  }
  @media (width <= 768px) {
    flex-direction: row;
  }
}
```

**oklch 颜色**

```css
:root {
  --gray-50: oklch(98% 0 0);
  --gray-950: oklch(8% 0 0);
}

[data-theme="dark"] {
  --surface: var(--gray-950);
  --text: var(--gray-100);
}
```

---

## 6. 最终架构

### CSS 层级

```
@layer base        → 颜色系统 + 基础元素
@layer layout      → 两栏布局
@layer components  → 所有 UI 组件（使用 Nesting）
```

### 颜色系统

```
oklch 灰度（共用）
    ↓
语义化变量（按主题映射）
    ↓
组件使用语义变量
```

### 响应式策略

组件内嵌套媒体查询，而非集中管理：

```css
.component {
  /* 桌面样式 */

  @media (width <= 768px) {
    /* 移动样式 */
  }
}
```

---

## 7. 经验总结

### 设计原则

1. **先分析再动手** - 充分理解目标设计
2. **渐进实现** - 先骨架，再细节
3. **快速迭代** - 根据反馈及时调整
4. **适度重构** - 代码可用后再优化

### 技术选择

| 选择 | 理由 |
|------|------|
| 纯 CSS | 零依赖，主题独立 |
| 单文件 | 简单，易于维护 |
| CSS 变量 | 主题切换、易于定制 |
| @layer | 清晰的优先级控制 |
| CSS Nesting | 减少重复，提升可读性 |
| oklch | 感知均匀，易于调整 |

### 避坑指南

1. **布局问题先查 overflow** - 滚动相关问题通常是 overflow 配置
2. **点击区域用伪元素** - 不改变 HTML 结构
3. **z-index 要配合 position** - 否则不生效
4. **移动端先测试视口** - `100vh` 在移动端有问题，用 `100dvh`

---

## 8. 文件清单

最终交付的文件：

```
themes/void/
├── hugo.toml
├── archetypes/default.md
├── layouts/
│   ├── _default/
│   │   ├── baseof.html
│   │   ├── list.html
│   │   └── single.html
│   ├── partials/
│   │   ├── sidebar.html
│   │   └── comments.html
│   ├── shortcodes/
│   │   └── neodb.html
│   ├── index.html
│   └── 404.html
└── static/
    ├── css/style.css      # ~530 行
    └── js/theme.js        # ~15 行

docs/
├── void-theme-design.md       # 设计文档
└── void-theme-development.md  # 开发过程（本文档）
```
