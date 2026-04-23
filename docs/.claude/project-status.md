# 项目状态追踪

> 通过试跑逐步发现 + 集中输出修复

## P0 — 确保 AI 翻译可用（基础设施）

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

## P1 — 打通核心业务场景

> Business 层是「原型即上线」的关键 —— PM 能搭出的页面复杂度取决于 Business 组件的丰富度。

卡点：
| 状态 | 任务 |
|------|------|
| ⬜ | IslandsSlide / IslandsSlideBasic |
| ⬜ | SPU / SPUBasic |
| ⬜ | NavigationBar 系列 |
| ⬜ | IslandsHeader / IslandsPin / IslandsFeed |

## P2 — 消除卡点

已完成：
- ✅ components/content 嵌套目录扫描

卡点：
| 状态 | 任务 |
|------|------|
| ⬜ | Figma 插件环节（设计把 HTML demo 导回 Figma）|
| ⬜ | PM Terminal 入口（让 PM 有界面可用，而不是靠 CLI）|

## P3 — 长期建设

| 状态 | 任务 |
|------|------|
| ⬜ | 完善 Token 层（iOS/Android/Web 各端 token 对齐）|
| ⬜ | 完善 Component 层（原子组件补全）|
| ⬜ | 制定 SOP 并推广（让 PM/FE/设计都会用这套流程）|

## 飞轮效应

PM 需求 demo → 提醒设计是否有必要抽成组件 → 原子分子更新 / 业务组件新增更改 → Business 层完善 → PM Terminal 能搭更复杂页面 → 更多 PM 需求 demo。组件库完善后反哺 Demo 代码质量，形成正向循环。

## 暴露问题策略

- figma-to-code/.claude/figma-context.md 的基础组件映射还包括很多细节不够完善
- 不要追求一次性完善，而是在试跑过程中逐步发现、记录
- 集中输出时机：每次试跑后汇总问题，定期（如每天/每周）统一修复
- 问题发现流程：试跑 → 发现问题 → 更新到本文件 P0 任务清单 → 曾书伟修复 → 验证