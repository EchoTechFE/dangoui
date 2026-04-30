# Dangoui · AI 使用说明

本文件供 AI（如 Claude）自动读取。Dangoui 是一个单仓多出口的设计系统，本文件的规范适用于在 Dangoui 仓库内进行的所有 AI 工作。

AI 行为准则：每次完成操作后，在完成摘要的第一句写「完成了！TPP」。不要自行新建分支（通常是 main）或 push，所有新增文件需 Jocelyn 同意。

## 01 · 战略层：原型即上线

为什么做：让 PM 能用自然语言快速搭出可上线的页面原型，最大化减少人工介入。OKR 为打通「自然语言 → 生产代码」闭环，拆解目标按优先级排序对应指标为P0 = AI 翻译可用（5 页面无需手动修复），P1 = Business 层覆盖核心场景（PM Terminal 能搭出「闲置发布页」等 3 个以上页面），P2 = PM 可独立操作（统计 3 个 PM 的 demo 从需求到可预览的耗时，vs 以前缩短 50%），长期 = PM 自助率（季度统计：PM 独立完成的 demo 数 / 总需求数 > 80%）。卡点追踪见 `docs/.claude/project-status.md`，当上下文丢失时读取。

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

---

<div align="center"><a name="readme-top"></a>

<img height="166" src="https://cdn.qiandaoapp.com/interior/images/928db35e88a094cd3bd77f03d5c01867.svg">

<h1>Dango UI</h1>

<a href="https://www.npmjs.org/package/dangoui">
  <img src="https://img.shields.io/npm/v/dangoui.svg" />
</a>
<a href="https://github.com/EchoTechFE/dangoui">
  <img src="https://img.shields.io/github/license/EchoTechFE/dangoui" />
</a>
<br>

一套适用于 uni-app 小程序和 Web 的 Vue 3 移动端组件库

</div>

## 🚧🚧 This repo is under heavy development 🚧🚧

## 特性

- 多平台兼容，uni-app、Web 都可以使用
- 默认就很好看，业务上久经考验
- 🚧 易于扩展主题，满足定制需求（开发中）

## 安装

```bash
npm install dangoui

yarn add dangoui

pnpm add dangoui
```

## 开发

```bash
# 编译组件库
pnpm run build

# 文档站 dev 模式
cd docs
# 在 run dev 前，要编译组件库，要查看最新组件库更改，也要编译组件库
pnpm run dev
```

## 链接

- [Dango UI 文档](https://dumpling.echo.tech/)

## 发布

### 发布 packages

1. 做出更改后，`git add`，然后执行 `npx changeset`，并把变更提交到仓库
2. 发布
   1. 手动发布（不推荐）,`npx changest version`、`pnpm run build`、`npx changeset publish`
   2. 自动发布（GitHub Action），提交/合并到 main 的代码，如果含有 changeset 文件，会更新版本并提交一个 PR，合并 PR 后，会进行版本发布

:bulb: **npx changeset 的使用**
使用空格键确认，使用回车键跳过。在选版本提升时（bump）通过回车键跳过来切换 major，minor，patch 版本。

### 发布文档站

在 GitHub Actions 中，选择 Doc，并点 Run workflow

## 同步到 npmmirror

因为我们的项目用的 npmmirror 镜像，当我们想立刻使用最新版本的时候，可以执行 `pnpm run sync`

## 活动

![Alt](https://repobeats.axiom.co/api/embed/aaf46fe1722cdeeffdf18619e14c1fa43ac66863.svg "Repobeats analytics image")

## 更新图标
1. 如果根目录下没有 `.alioss.json` 的话，需要创建这个文件，并加入 `accessKeyId`、`accessKeySecret`、`region`、`bucket` 这四个字段。这个文件不要提交到远程代码仓库中。
2. 首先需要更新图标文件 Url，去这个网站：https://iconpark.oceanengine.com/projects/7443/detail，不要忘记点击页面上的`更新代码`哦，复制 SVG Symbol 下的 script 的 src 中的地址到 `packages/dangoui/icon-url` 中去。
3. 其次执行 `packages/dangoui/package.json` 下的 `gen:icon` 命令，等待更新完成
4. 更新完成后，提交代码，并执行 changeset。
