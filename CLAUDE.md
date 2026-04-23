# Dangoui · AI 使用说明

本文件供 AI（如 Claude）自动读取。Dangoui 是一个单仓多出口的设计系统，本文件的规范适用于在 Dangoui 仓库内进行的所有 AI 工作。

AI 行为准则：每次完成操作后，在完成摘要的第一句写「完成了！TPP」。不要自行新建分支（通常是 main）或 push，所有新增文件需 Jocelyn 同意。

## 01 · 战略层：原型即上线

为什么做：让 PM 能用自然语言快速搭出可上线的页面原型，最大化减少人工介入。OKR 为打通「自然语言 → 生产代码」闭环，拆解目标按优先级排序对应指标为P0 = AI 翻译可用（5 页面无需手动修复），P1 = Business 层覆盖核心场景（≥3 页面），P2 = PM 可独立操作（耗时缩短 50%），长期 = PM 自助率 > 80%。卡点追踪见 `docs/.claude/project-status.md`，当上下文丢失时读取。

###

```
任何人自然语言描述需求（PM 直接描述，无需设计介入）
    ↓
Demo HTML 生成（Claude 参考 CLAUDE.md 理解上下文，由 Jocelyn 维护）←────┐
    ↑                                                              │飞轮效应：Demo促进设计系统完善，反哺后续 Demo
产品周会评审                                                         │
    ↓                                                              │
定稿设计精调（Figma 插件导回，把 HTML demo 识别为 Figma 组件）            │
    ↓                                                              │
AI 翻译（figma-to-code：Figma → JSON Schema → 生产代码，由曾书伟维护）   │
    ↓                                                              │
Dangoui 组件库（生成可用代码）─────────────────────────────────────────┘
    ↓
生产代码上线
```


## 02 · 范围层：项目定位与分工

做什么：Dangoui 是设计系统指南 + 组件库，输出 JSON Schema / DSL 世界通用语言，供各端（Flutter/Web/iOS/Android）翻译成自己的代码，dangoui 有哪些组件、PM Terminal 能搭哪些页面。取决于 Business Schema 完整性（以 Figma REST API JSON 为准）：

```
PM 说："我要一个闲置发布页面"
    ↓
Business Schema：👻 Islands / PublishPage
    - slots: [💙 TabBar, 💙 FAB, ...]    ← 引用原子/分子组件
    - layout: { flex-direction, gap }     ← 布局信息
    - tokens: { bg, text }                ← Token 引用
    ↓
Claude Code 生成 DangUI 代码
    ↓
DangUI 渲染层直接展示 → PM 看到的就是最终 App（所见即所得）
```

| 目录/文件 | 负责层级 | 维护者 | 工具 |
|-----------|---------|--------|------|
| `CLAUDE.md` | 战略层 / 范围层 / 结构层 | Jocelyn | - |
| `figma-to-code/.claude/figma-context.md` | 框架层 / 表现层 | 曾书伟 | `figma-to-code` CLI（Figma 骨架提取）；表现层规范（组件样式/Token 值/API）见此；Props 统计见 `docs/.claude/props-reference.md` |
| `packages/dangoui` | 原子/分子组件 | 前端组 | Dangoui 组件库（生产代码底座） |
| `docs/` | 文档站 + 组件测试床 | Jocelyn | - |
| `JSON Schema / DSL` | 各移动端生产代码（iOS/Android/Flutter/HarmonyOS） | Jocelyn | - |
| 不在此项目中，独立维护 | 原子/分子组件（iOS/Android/Flutter/HarmonyOS） | 移动端组 | - |


## 03 · 结构层：核心架构

怎么做：通过 Token/Component/Business 三层架构，实现 Figma → JSON Schema → 各端生产代码的数据流。

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
│   └──────────────────────────────┘                          │
│   ┌──────── Component Schema ─────┐                          │
│   │ { "type": "COMPONENT_SET",   │                           │
│   │  "variants": { "Main": {...} }                           │
│   └──────────────────────────────┘                          │
│   ┌──────── Business Schema ───────┐                         │
│   │ { "👻 Islands / Grid",         │                         │
│   │  "slots": ["💙 TabBar",        │                         │
│   │            "💙 FAB"],          │                         │
│   │  "layout": {...} }             │                         │
│   └────────────────────────────────┘                         │
└──────────────────────────────────────────────────────────────┘
<!-- 数据来源优先级：Figma > 组件实现 > UnoCSS presets > ❌ 硬编码；代码真值 ≠ Token 真值 -->
          │                    │                    │
          ▼                    ▼                    ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ 💙 Token 流      │  │💙 Component 流   │  │👻 Business 流    │
│ dangoui-design-  │  │ packages/dangoui │  │ 业务组件          │
│   token          │  │ (运行时组件)       │  │ (Token+Component │
│ uno-preset-echo  │  │ docs / H5 指南    │  │  + 布局组合)      │
└──────────────────┘  └──────────────────┘  └──────────────────┘
         ▼                    ▼                    ▼
┌──────────────────────────────────────────────────────────────┐
│              App 各端上线代码 (Code Generation)                │
│         Flutter / Web / iOS / Android / PM Terminal          │
└──────────────────────────────────────────────────────────────┘
```


docs 是 Dangoui 的文档站点，也是组件的**测试床**（开发自验）。

**目录结构：**

```
docs/
├── business/                      # 业务组件 Vue 文件（IslandDetail/IslandsGrid 等）
├── content/                        # Markdown 内容源（Nuxt Content）
│   ├── 00 GET START/              # 入门
│   ├── 01 STYLE/                  # 通用样式
│   ├── 02 BAR/                    # Bar 系列
│   ├── 03 FORM/                    # 表单类
│   ├── 04 DATA/                    # 数据展示类
│   ├── 05 FEEDBACK/                # 反馈类
│   ├── 06 OTHERS/                 # 其他
│   ├── business/                   # 业务组件文档（island-detail 等）
│   └── index.md
│
├── pages/                          # Vue 页面
│   ├── [...slug].vue                # 动态路由（加载 content/*.md）
│   ├── demos/                      # Demo 片段（snippet*.vue）
│   └── general/                    # 复杂展示页（独立 Vue）
│
├── components/                     # 文档站共用 Vue 组件
│   ├── content/                   # 渲染器（Demo/Stage/Api/CssVars 等）
│   └── icons/                      # 图标
│
├── layouts/
│   ├── doc.vue                     # 文档布局
│   └── demo.vue                    # Demo 布局
```

**文档规范：**
- 简单组件：content/x.md → ::demo 块 → Demo.vue；复杂页：直接写 Vue；优先 UnoCSS，不新建 .css 文件
- 文件操作用 `git mv` 保留 history，rename 后校验 `git diff <old>..<new> --name-status | grep '^R'`
- CSS 不生效时清缓存：`rm -rf .nuxt node_modules/.vite`



