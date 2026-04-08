# Dangoui · AI 使用说明

**每次完成操作后，在完成摘要的第一句写「好的，TPP」，这代表我还没忘记。**

> 本文件供 AI（如 Claude）自动读取。Dangoui 是一个单仓多出口的设计系统，本文件的规范适用于在 Dangoui 仓库内进行的所有 AI 工作。

---

## 01 · 核心架构

### 架构图

```
                              ┌─────────────────────────┐
                              │      Figma              │
                              │  ┌───────────────────┐  │
                              │  │ 💙 Token          │  │
                              │  │ 💙 Component      │  │
                              │  │ 👻 Business       │  │ ← PM Terminal 搭 demo 的关键
                              │  └───────────────────┘  │
                              └───────────┬─────────────┘
                                          │ REST API
                                          ▼
┌──────────────────────────────────────────────────────────────┐
│                    JSON Schema / DSL                         │
│                  「原型即上线」的世界通用语言                    │
│                                                              │
│   ┌──────── Token Schema ─────────┐                          │
│   │ { "primary/bt/solidBg":      │                           │
│   │    { "$value": "#7C66FF" } } │                           │
│   └──────────────────────────────┘                           │
│   ┌──────── Component Schema ─────┐                          │
│   │ { "type": "COMPONENT_SET",   │                           │
│   │  "variants": { "Main": {...} }                           │
│   └──────────────────────────────┘                           │
│   ┌──────── Business Schema ───────┐                         │
│   │ { "👻 Islands / Grid",         │                         │
│   │  "slots": ["💙 TabBar",        │                         │
│   │            "💙 FAB"],          │                         │
│   │  "layout": {...} }             │                         │
│   └────────────────────────────────┘                         │
└──────────────────────────────────────────────────────────────┘
          │                    │                    │
          ▼                    ▼                    ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ 💙 Token 流      │  │💙 Component 流   │  │👻 Business 流    │
│                  │  │                  │  │                  │
│ dangoui-design-  │  │ packages/dangoui │  │ 业务组件          │ ← PM Terminal
│   token          │  │ (运行时组件)       │  │ (Token+Component │    搭 demo 的关键
│                  │  │                  │  │  + 布局组合)      │
│ uno-preset-echo  │  │ docs / H5 指南    │  │                  │
│ (text-h5 等)     │  │ (DangUI自渲染)    │  │ 👻 Islands / Grid│
└────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌──────────────────────────────────────────────────────────────┐
│              App 各端上线代码 (Code Generation)                │
│         Flutter / Web / iOS / Android / PM Terminal          │
└──────────────────────────────────────────────────────────────┘
```

### 三层数据流

| 层级 | Figma 来源 | Schema 内容 | Dangoui 落地 |
|------|-----------|------------|-------------|
| **Token** | 💙 Token | 颜色/间距/圆角/字号 | `dangoui-design-token` + `uno-preset-echo` |
| **Component** | 💙 Component | 原子分子组件（Button/Tabs/NavBar） | `packages/dangoui` + `docs` H5 指南 |
| **Business** | 👻 Business | 业务组件（Grid/Header/Feed）+ 布局 + Slots | **PM Terminal 搭 demo 的关键** |

### 数据来源优先级

> 遇到任何问题，先问「这个答案在哪层数据里」，不要凭经验推断。

```
Figma MCP / REST API  ← 最高，设计真值（Figma 官方接口，两种调用方式）
  ↓
Dangoui 已有组件实现  ← 代码真值（Vue 组件的实际行为）
  ↓
UnoCSS presets       ← Token 真值（设计 Token 的原始值）
  ↓
❌ 凭经验硬编码       ← 禁止
```

**代码真值 ≠ Token 真值：** 组件实现（props/slots/behavior）是 Vue 代码，Token 值（颜色/字号/间距）是设计变量，两回事。

### PM Terminal 工作流

Business Schema = Token（样式底色）+ Component（原子组件）+ Layout（布局结构）

```
PM 说："我要一个闲置发布页面"
    ↓
Business Schema：👻 Islands / PublishPage
    - slots: [💙 TabBar, 💙 FAB, ...]       ← Component 引用（结构待确认）
    - layout: { flex-direction, gap, ... }   ← 布局信息（格式待确认）
    - tokens: { bg, text, ... }             ← Token 引用（格式待确认）
    ↓
Claude Code 生成 DangUI 代码
    ↓
DangUI 渲染层直接展示
    ↓
PM 看到的就是最终 App 呈现的（所见即所得）
```

**PM Terminal 能搭出什么，取决于 Business Schema 完整性。Business Schema 格式以 Figma REST API 实际导出的 JSON 为准，上例仅为示意。**

───────────────────────────────────────────────────────

## 02 · 规范速查

> 遇到问题查这里，知道答案在哪层数据里，就不用推断。

### Token 规范去哪找

| 问题 | 不要做 | 应该做 |
|------|--------|--------|
| 颜色 token 值是多少 | 查 memory | 读 `packages/dangoui-design-token/theme.ts` |
| 字体规范是什么 | 重新定义 | 读 `docs/content/2.general/Typography.md` 或 `packages/uno-preset-echo/src/index.ts` 的 shortcuts |
| 间距/radius 规范 | 猜数字 | 读 `packages/uno-preset-echo/src/index.ts` 的 theme.spacing / theme.borderRadius |

### Component 规范去哪找

| 问题 | 不要做 | 应该做 |
|------|--------|--------|
| 组件某个 prop 怎么用 | 猜 | 读 `docs/content/` 里该组件的示例，或读 `packages/dangoui/src/{component}/` 的 Vue 文件 |
| 某个组件的 API | 看文档猜测 | 直接读组件源码 `packages/dangoui/src/{component}/` |
| 组件在 Figma 里的定义 | 不确定 | 读 Figma componentPropertyDefinitions（MCP 或 REST API） |

### Business 规范去哪找

| 问题 | 不要做 | 应该做 |
|------|--------|--------|
| 业务组件有哪些 slots | 猜结构 | 读 Figma 👻 Business 组件的 schema（slots 数组 + layout） |
| 业务组件怎么组合 | 自己设计 | 读 Figma Business Schema，或读 `docs/content/` 对应业务模块 |
| PM Terminal 能搭什么 | 不确定 | 取决于 Business Schema 完整性，Schema 越完整，PM Terminal 能搭的越多 |

───────────────────────────────────────────────────────

## 03 · Docs 内容架构

### 实际目录结构

```
docs/
├── content/                        # Markdown 内容源（Nuxt Content）
│   ├── 00 GET START/              # 入门
│   │   ├── _dir.yml
│   │   └── *.md
│   ├── 01 STYLE/                  # 通用样式
│   │   ├── _dir.yml
│   │   ├── 1.typography.md        # 字体规范（Nuxt Content 识别 ::demo 语法）
│   │   ├── 2.layout.md
│   │   ├── 3.button.md
│   │   ├── 4.icon.md
│   │   └── Typography.md           # 重复，待清理
│   ├── 02 BAR/                    # Bar 系列
│   ├── 03 FORM/                    # 表单类
│   ├── 04 DATA/                    # 数据展示类
│   ├── 05 FEEDBACK/                # 反馈类
│   ├── 06 OTHERS/                 # 其他（config/i18n 等）
│   ├── 8.composables/              # 组合式函数
│   └── index.md
│
├── pages/                          # Vue 页面
│   ├── [...slug].vue                # 动态路由（加载 content/*.md）
│   ├── demos/                      # Demo 片段（snippet*.vue）
│   │   ├── general/button/
│   │   │   └── snippet1.vue
│   │   ├── feedback/badge/
│   │   │   └── snippet1.vue
│   │   └── ...
│   └── general/
│       └── typography.vue            # 复杂展示页（独立 Vue，平台切换）
│
├── components/                     # 文档站共用 Vue 组件
│   ├── content/
│   │   ├── Demo.vue                # 示例渲染器（Nuxt Content 调用）
│   │   ├── Stage.vue
│   │   ├── Api.vue
│   │   ├── CssVars.vue
│   │   ├── CodeGroup.ts
│   │   └── Alert.vue
│   ├── icons/                      # 文档站图标
│   │   └── *.vue
│   ├── ScrollView.vue
│   ├── PreviewBlock.vue
│   └── Logo.vue
│
├── layouts/
│   ├── doc.vue                     # 文档布局
│   └── demo.vue                    # Demo 布局
│
└── nuxt.config.ts
```

### 三层协作关系

| 目录 | 角色 | 消费谁 | 被谁消费 |
|------|------|--------|---------|
| **content/\*.md** | 内容源（文本规范 + `::demo`） | Nuxt Content 解析 | pages/[...slug].vue 路由加载 |
| **pages/demos/snippet\*.vue** | Demo 片段 | 被 content `::demo` 块引用 | components/Demo.vue 渲染 |
| **pages/general/\*.vue** | 复杂展示页（需交互） | 直接渲染 packages/dangoui | 独立路由 |
| **components/content/** | 共用组件（Demo/Api/Stage 等） | pages/demos 依赖它 | content `::demo` 解析后调用 |

### 典型工作流

**简单组件**（Button/Dialog/Tabs）：在 content Markdown 里写 `::demo` 块

```
content/04 DATA/5.tabs.md
  └── ::demo 块
        └── Nuxt Content 解析
              └── components/Demo.vue
                    └── pages/demos/4.data-display/tabs/snippet*.vue
                          └── packages/dangoui 实际组件
```

**复杂展示页**（Typography 平台切换）：独立 Vue 页面

```
pages/general/typography.vue
  └── 独立路由 /general/typography
        ├── 读取 content/01 STYLE/1.typography.md 规范文本
        └── packages/dangoui 组件 + UnoCSS 渲染
```

### 新增文档步骤

1. **简单组件** → 在 `content/` 对应目录新建 `x.md`，写规范 + `::demo` 示例
2. **Demo 片段** → 在 `pages/demos/` 按分类创建 `snippet*.vue`，被 Demo.vue 引用
3. **复杂展示** → 在 `pages/general/` 新建 `xxx.vue`，读取 content 数据 + 交互渲染
4. **共用组件** → 在 `components/content/` 新建，供 Demo.vue 等调用

**docs 既是设计规范文档（给人看），也是 DangUI 组件的测试床（开发自验）。**

### Docs 样式调试经验

**问题：CSS 样式不生效（heading 字号/颜色等）**

排查步骤：
1. 先确认实际渲染的 HTML 结构：`document.querySelector('.doc-prose')?.className`
2. 再确认目标元素的 computed styles：`getComputedStyle(el).fontSize`
3. 检查 CSS 规则是否存在：`document.styleSheets` 里搜索 selectorText

**经验法则：**
- 自定义 CSS（`docs/assets/index.css`）用 `:deep()` 操作符穿透组件
- 第三方样式（Nuxt Content / Tailwind Typography）依赖类名（如 `.prose`）
- 如果 `.doc-prose :deep(h1)` 不生效，先检查 `.doc-prose` 是否真的有 `.prose` 类

**Tailwind Typography 的 `.prose` 类是 Nuxt Content 的默认样式依赖**，修改 markdown 渲染样式前先确认是否需要添加 `.prose` 类。

---

## 04 · 【预留】

---

## 05 · 【预留】

---

## 06 · 【预留】

---

## 07 · 【预留】

---

## 08 · 【预留】

───────────────────────────────────────────────────────

## 10 · Git 操作原则

- **不要自行新建分支**。除非用户明确要求，所有改动直接提交到当前分支（通常是 main）
- **不要自行 push**。除非用户明确要求推送
