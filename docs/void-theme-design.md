# Hugo 主题 "void" 设计文档

> 参考: [shloked.com](https://www.shloked.com/)
> 风格: 极简主义 · 深色优先 · 两栏布局

---

## 现代 CSS 特性

| 特性 | 用途 | 示例 |
|------|------|------|
| **@layer** | 层叠层，控制优先级 | `@layer base, layout, components` |
| **CSS Nesting** | 嵌套选择器 | `.nav { a { &:hover {...} } }` |
| **oklch** | 感知均匀颜色 | `oklch(50% 0 0)` |
| **:is()** | 简化选择器 | `:is(h1, h2, h3, h4)` |
| **100dvh** | 动态视口高度 | 移动端友好 |
| **margin-block** | 逻辑属性 | 国际化友好 |
| **width <=** | 新媒体查询语法 | `@media (width <= 768px)` |

---

## 目录结构

```
themes/void/
├── hugo.toml                     # 主题配置
├── archetypes/
│   └── default.md                # 新文章模板
├── layouts/
│   ├── _default/
│   │   ├── baseof.html           # HTML 骨架
│   │   ├── list.html             # 列表页
│   │   └── single.html           # 文章页
│   ├── partials/
│   │   ├── sidebar.html          # 侧边栏
│   │   └── comments.html         # Giscus 评论
│   ├── shortcodes/
│   │   └── neodb.html            # NeoDB 卡片
│   ├── index.html                # 首页
│   └── 404.html                  # 404 页面
└── static/
    ├── css/
    │   └── style.css             # 样式（单文件）
    └── js/
        └── theme.js              # 主题切换
```

---

## 文件说明

### 布局文件

| 文件 | 说明 |
|------|------|
| `baseof.html` | HTML 骨架，定义两栏结构，引入 CSS/JS |
| `index.html` | 首页，展示文章列表 |
| `list.html` | 列表页，用于分类/标签页 |
| `single.html` | 文章详情页 |
| `404.html` | 404 错误页 |

### 组件文件

| 文件 | 说明 |
|------|------|
| `sidebar.html` | 头像、导航、社交图标、主题切换 |
| `comments.html` | Giscus 评论，自动跟随主题 |
| `neodb.html` | NeoDB 短代码卡片 |

### 静态资源

| 文件 | 说明 |
|------|------|
| `style.css` | 所有样式，使用 @layer 组织 |
| `theme.js` | 深浅色切换，同步 Giscus |

---

## CSS 架构

### 层叠层 (@layer)

```css
@layer base, layout, components, utilities;
```

| Layer | 内容 |
|-------|------|
| **base** | 颜色系统、CSS 变量、基础元素 |
| **layout** | 两栏布局、响应式骨架 |
| **components** | 所有 UI 组件 |
| **utilities** | 工具类（预留） |

### 颜色系统 (oklch)

基础灰度（深浅主题共用）：

```css
:root {
  --gray-50:  oklch(98% 0 0);   /* 最浅 */
  --gray-100: oklch(95% 0 0);
  --gray-200: oklch(90% 0 0);
  --gray-400: oklch(65% 0 0);
  --gray-500: oklch(50% 0 0);
  --gray-600: oklch(40% 0 0);
  --gray-800: oklch(20% 0 0);
  --gray-900: oklch(12% 0 0);
  --gray-950: oklch(8% 0 0);    /* 最深 */
}
```

语义化映射：

| 变量 | 用途 | 深色 | 浅色 |
|------|------|------|------|
| `--surface` | 背景 | gray-950 | gray-50 |
| `--surface-alt` | 次级背景 | gray-900 | gray-100 |
| `--text` | 主文字 | gray-100 | gray-900 |
| `--text-muted` | 次级文字 | gray-400 | gray-600 |
| `--text-faint` | 弱化文字 | gray-500 | gray-400 |
| `--border` | 边框 | gray-800 | gray-200 |

### 间距系统

```css
:root {
  --space-xs: 0.25rem;   /* 4px */
  --space-sm: 0.5rem;    /* 8px */
  --space-md: 1rem;      /* 16px */
  --space-lg: 1.5rem;    /* 24px */
  --space-xl: 2rem;      /* 32px */
}
```

### 布局变量

```css
:root {
  --sidebar-width: 220px;
  --content-max: 65ch;
}
```

---

## 布局结构

```
┌────────────────────────────────────────────────────┐
│  ┌───────────┐  ┌───────────────────────────────┐  │
│  │  Sidebar  │  │            Main               │  │
│  │  (固定)    │  │          (可滚动)             │  │
│  │           │  │                               │  │
│  │  220px    │  │   文章列表 / 文章正文          │  │
│  │           │  │   max-width: 65ch             │  │
│  └───────────┘  └───────────────────────────────┘  │
└────────────────────────────────────────────────────┘
```

- **Sidebar**: 固定宽度，不可滚动
- **Main**: 占据剩余空间，独立滚动
- **文章正文**: 最大宽度 65ch（约 65 字符）

---

## 组件设计

### 文章列表

```
┌─────────────────────────────────────────────────────┐
│  2024-01-01   文章标题                    tag1  tag2 │
└─────────────────────────────────────────────────────┘
     ↑              ↑                          ↑
   日期           标题                       标签
  (5rem)       (flex: 1)              (z-index: 1)
```

- 点击整行跳转（`::after` 伪元素覆盖）
- 标签不触发跳转（`z-index: 1`）
- hover 时背景变色
- 鼠标保持默认箭头

### 侧边栏

```
┌─────────────┐
│  [头像] 名字 │  ← .profile
│  简介文字    │  ← .bio
│             │
│  Home       │  ← .nav
│  Posts      │
│  Tags       │
│             │
│  [图标] [图标]│  ← .social
│  [切换]      │  ← .theme-toggle
└─────────────┘
```

---

## 响应式设计

### 断点: 768px

| 桌面端 (>768px) | 移动端 (≤768px) |
|-----------------|-----------------|
| 两栏布局 | 单栏布局 |
| Sidebar 固定左侧 | Sidebar 变顶部导航 |
| 简介显示 | 简介隐藏 |
| 列表横向 | 列表纵向堆叠 |
| Main 独立滚动 | 整页滚动 |

### 响应式写法（组件内嵌套）

```css
.nav {
  flex-direction: column;

  @media (width <= 768px) {
    flex-direction: row;
    width: 100%;
  }
}
```

---

## 功能集成

### Giscus 评论

配置位置: `hugo.toml`

```toml
[params.giscus]
enable = true
repo = "your/repo"
repo_id = "xxx"
category = "Announcements"
category_id = "xxx"
```

主题自动跟随深浅色切换。

### Google Analytics

配置位置: `hugo.toml`

```toml
[services.googleAnalytics]
id = 'G-XXXXXXXXXX'
```

### NeoDB 短代码

用法:

```markdown
{{</* neodb "https://neodb.social/book/xxx" */>}}
```

---

## 修改指南

### 调整颜色

编辑 `style.css` 中的 oklch 灰度值：

```css
--gray-500: oklch(50% 0 0);  /* 调整亮度百分比 */
```

### 调整布局

```css
:root {
  --sidebar-width: 250px;  /* 侧边栏宽度 */
  --content-max: 70ch;     /* 文章最大宽度 */
}
```

### 调整间距

```css
:root {
  --space-md: 1.25rem;  /* 调整基础间距 */
}
```

### 添加组件

1. 在 `@layer components` 中添加样式
2. 使用 CSS Nesting 组织代码
3. 响应式样式写在组件内部

```css
@layer components {
  .new-component {
    /* 基础样式 */

    .child {
      /* 子元素 */
    }

    @media (width <= 768px) {
      /* 响应式 */
    }
  }
}
```
