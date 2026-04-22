# Dangoui · AI 使用说明

本文件供 AI（如 Claude）自动读取。Dangoui 是一个单仓多出口的设计系统，本文件的规范适用于在 Dangoui 仓库内进行的所有 AI 工作。

## 基本操作原则

- 每次完成操作后，在完成摘要的第一句写「完成了！TPP」。如果忘记上下文，根据 01 战略层的目标就能知道进度
- 不要自行新建分支。除非用户明确要求，所有改动直接提交到当前分支（通常是 main）
- 不要自行 push。除非用户明确要求推送
- 新增文件/文件夹需经过 Jocelyn 同意。dangoui 下的任何新增文件或文件夹（包括业务组件、docs 内容、配置文件等）都需要用户确认后才能创建

---

## 01 · 战略层：原型即上线

### 核心理念

**自然语言描述需求 → AI 生成代码 → 直接上线**

通过 AI 辅助，最大化减少人工介入，让产品经理能用自然语言快速搭出可上线的页面原型。

```
任何人自然语言描述需求
    ↓
Demo HTML 生成（AI 参考 CLAUDE.md 理解上下文，由 Jcoelyn 维护）←───────┐
    ↑                                                             │飞轮效应：Demo促进设计系统完善，反哺 Demo 
产品周会评审                                                        │
    ↓                                                             │
定稿设计精调（Figma 插件导回）                                        │
    ↓                                                             │
AI 翻译（figma-to-code 把 Figma 设计稿准确翻译成生产代码，由曾书伟维护）  │
    ↓                                                             │
Dangoui 组件库 ←───────────────────────────────────────────────────┘
    ↓
生产代码上线
```

| 阶段 | 工具/方式 | 说明 |
|------|----------|------|
| **① 需求描述** | PM 自然语言 | 直接描述需求，无需设计介入 |
| **② Demo 生成** | Claude 生成 HTML | 快速预览，所见即所得 |
| **③ 周会评审** | 产品内部 | 快速迭代，节省设计资源 |
| **④ 定稿** | 产品/设计确认 | 设计介入，精细化 |
| **⑤ 精调** | Figma 插件导回 | 把 HTML demo 识别为 Figma 组件 |
| **⑥ AI 翻译** | figma-to-code | Figma → JSON Schema → 生产代码 |
| **⑦ 上线** | Dangoui 组件库 | 生成可用代码 |

### 目标与成功指标

**大目标**：打通「自然语言 → 生产代码」的完整闭环，让 PM 能独立完成从需求到上线。

**暴露问题策略**：
> 通过试跑逐步发现 + 集中输出修复

- figma-to-code/.claude/figma-context.md 的基础组件映射还包括很多细节不够完善
- 不要追求一次性完善，而是在试跑过程中逐步发现、记录
- 集中输出时机：每次试跑后汇总问题，定期（如每天/每周）统一修复
- 问题发现流程：试跑 → 发现问题 → 更新到本文件 P0 任务清单 → 曾书伟修复 → 验证

**P0 — 确保 AI 翻译可用（基础设施）**

> figma-to-code/.claude/figma-context.md 是 AI 翻译的「词典」，如果词典不全或不准，输出的代码就是错的。

已完成：
- ✅ 安装 figma-to-code
- ✅ 配置 Figma PAT
- ✅ 初始化 dangoui 项目
- ✅ 完善 `figma-to-code/.claude/figma-context.md`
- ✅ 验证 AI 翻译质量

卡点：
| 状态 | 任务 | 说明 |
|------|------|------|
| ⬜ | 骨架输出结构化 | 148KB 输出难以阅读，需结构化 |
| ⬜ | 增强 INSTANCE 识别 | IslandsSlide/IslandsSlideBasic/SPU 等未被识别 |
| ⬜ | 骨架标注视觉位置 | HTML 顺序 ≠ 渲染顺序，需标注左右中 |
| ✅ | 组件路径冲突 | StatusBar 重复 → 已删除 |

**P1 — 打通核心业务场景**

> Business 层是「原型即上线」的关键 —— PM 能搭出的页面复杂度取决于 Business 组件的丰富度。

卡点：
| 状态 | 任务 |
|------|------|
| ⬜ | IslandsSlide / IslandsSlideBasic |
| ⬜ | SPU / SPUBasic |
| ⬜ | NavigationBar 系列 |
| ⬜ | IslandsHeader / IslandsPin / IslandsFeed |

**P2 — 消除卡点**

已完成：
- ✅ components/content 嵌套目录扫描

卡点：
| 状态 | 任务 |
|------|------|
| ⬜ | Figma 插件环节（设计把 HTML demo 导回 Figma）|
| ⬜ | PM Terminal 入口（让 PM 有界面可用，而不是靠 CLI）|

**P3 — 长期建设**

| 状态 | 任务 |
|------|------|
| ⬜ | 完善 Token 层（iOS/Android/Web 各端 token 对齐）|
| ⬜ | 完善 Component 层（原子组件补全）|
| ⬜ | 制定 SOP 并推广（让 PM/FE/设计都会用这套流程）|

**飞轮效应**：PM 需求 demo → 提醒设计是否有必要抽成组件 → 原子分子更新 / 业务组件新增更改 → Business 层完善 → PM Terminal 能搭更复杂页面 → 更多 PM 需求 demo。组件库完善后反哺 Demo 代码质量，形成正向循环。

**成功指标**：

| 阶段 | 指标 | 验证方式 |
|------|------|----------|
| **P0 完成** | AI 翻译可用 | 曾书伟抽 5 个 Figma 页面，Claude 生成的代码可直接预览，无需手动修复 |
| **P1 完成** | Business 层覆盖核心场景 | PM Terminal 能搭出「闲置发布页」等 3 个以上页面 |
| **P2 完成** | PM 可独立操作 | 统计 3 个 PM 的 demo 从需求到可预览的耗时，vs 以前缩短 50% |
| **长期** | PM 自助率 | 季度统计：PM 独立完成的 demo 数 / 总需求数 > 80% |

---

## 02 · 范围层：功能与组件

> 回答「我们要做什么」—— dangoui 有什么组件、PM Terminal 能搭什么页面。

### PM Terminal 与 Business Schema

PM Terminal 是「原型即上线」在 **Business 层** 的具体实现。PM Terminal 能搭出什么页面，取决于 **Business Schema** 的完整性：

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

Schema 格式以 Figma REST API 实际导出的 JSON 为准。

### 项目定位与分工

**Dangoui 项目定位**：设计系统指南 + 组件库，最终输出 JSON Schema / DSL 世界通用语言，供各端（Flutter / Web / iOS / Android）翻译成自己的代码。

| 目录/文件 | 负责层级 | 维护者 | 工具 |
|-----------|---------|--------|------|
| `CLAUDE.md` | 战略层 / 范围层 / 结构层 | Jocelyn | - |
| `figma-to-code/.claude/figma-context.md` | 框架层 / 表现层 | 曾书伟 | `figma-to-code` CLI（Figma 骨架提取） |
| `packages/dangoui` | 原子/分子组件 | 前端组 | Dangoui 组件库（生产代码底座） |
| `docs/` | 文档站 + 组件测试床 | Jocelyn | - |
| `JSON Schema / DSL` | 各移动端生产代码（iOS/Android/Flutter/HarmonyOS） | Jocelyn | - |
| 不在此项目中，独立维护 | 原子/分子组件（iOS/Android/Flutter/HarmonyOS） | 移动端组 | - |

---

## 03 · 结构层：核心架构

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

**数据来源优先级**：遇到任何问题，先问「这个答案在哪层数据里」，不要凭经验推断。

```
Figma MCP / REST API  ← 最高，设计真值
Dangoui 已有组件实现  ← 代码真值（Vue 组件的实际行为）
UnoCSS presets       ← Token 真值（设计 Token 的原始值）
❌ 凭经验硬编码       ← 禁止
```

> **代码真值 ≠ Token 真值：** 组件实现（props/slots/behavior）是 Vue 代码，Token 值（颜色/字号/间距）是设计变量，两回事。

### DangoUI Docs 文档站

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

**文档生产流程：**

- 简单组件（Button/Tabs）：`content/` 新建 `x.md` → 写 `::demo` 块 → Demo.vue 渲染
- 复杂展示页：直接写 Vue 页面，读取 content 规范文本
- 新增文档步骤：content md → Demo 片段 snippet → components 共用组件

**文件操作：**
- `git mv` 保留 content history；删除+新建会丢 frontmatter
- rename 后必须校验：`git diff <old>..<new> --name-status | grep '^R' | grep '\.md$'`
- restore：`git show <commit>:<文件路径>`

**样式规范：**
- 优先 UnoCSS，不新建 `*.css` 文件
- Nuxt CSR 路由切换不自动刷新，content 变更后建议重启 dev server
- CSS 不生效时清缓存：`rm -rf .nuxt node_modules/.vite`

### Props 规范现状

> 来源：遍历 `packages/dangoui/src` 所有 .vue 文件的 defineProps，覆盖 Component（原子/分子组件）和 Business（业务组件）

**Props 频率 TOP10：**

| Prop | 次数 | Figma 对应 |
|------|------|-----------|
| extStyle | 31 | - |
| extClass | 30 | - |
| color | 20 | ✅ Color |
| value | 17 | - |
| size | 16 | ✅ Size |
| type | 11 | ✅ Type |
| disabled | 11 | ✅ State |
| title | 8 | ✅ Text |
| icon | 7 | ✅ iconLeading/Trailing |
| text | 6 | ✅ Text |

**Figma 与代码对齐情况：**

| 属性类型 | 对齐情况 |
|----------|---------|
| Size（Large/Medium/Small） | ✅ 一致 |
| Boolean（disabled/visible） | ✅ 一致 |
| Layout（Vertical/Horizontal） | ✅ 一致 |
| Type（Solid/Soft/Outline） | ⚠️ Figma 用 Solid/Soft，代码用 primary/secondary，需映射 |
| Text（title/text/placeholder） | ⚠️ 命名混用，待统一 |
| Status（Process/Finished） | ❌ 代码未体现，需新增 |

**待建立映射表：**

| Figma 值 | 代码值 | 状态 |
|---------|-------|------|
| Solid | primary | ⚠️ 需映射 |
| Soft | secondary | ⚠️ 需映射 |
| Outline | outline | ✅ 一致 |
| Text | text | ✅ 一致 |

---

## 04 · 表现层：规范速查

> 具体组件长什么样、token 值是多少、组件 API 长什么样——这些属于表现层，在 `figma-to-code/.claude/figma-context.md` 里找。

### Token / Component / Business 规范去哪找

| 问题 | 答案在 figma-context.md |
|------|------------------------|
| Color/Typography/Spacing/Radius 等 token 的具体值 | 第 4 章「设计 Token」 |
| 各组件（Button/Input/Select 等）的翻译规则 | 第 5 章「组件映射规则」 |
| 页面结构模板、布局模式（横滑/Cell/固定底部等） | 第 6 章「布局模式规则」 |
| 代码生成规则（宽度不写死/颜色用 token/动态内容等） | 第 7 章「生成规则」 |
| 组件引入规范（按需引入、import 写法） | 第 1 章「组件引入」 |

