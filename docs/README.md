# Dangoui

Dangoui 是一个单仓多出口的设计系统，核心目标是**原型即上线**。

## 理念

自然语言描述需求 → AI 生成代码 → 直接上线

通过 AI 辅助，最大化减少人工介入，让产品经理能用自然语言快速搭出可上线的页面原型。

## 技术栈

- **文档站**: Nuxt 3 + Nuxt Content + UnoCSS
- **组件库**: Vue 3 + TypeScript
- **设计 Token**: dangoui-design-token + uno-preset-echo

## 开发

```bash
pnpm install
pnpm dev          # 文档站开发
pnpm run generate # 生成静态站
```

## 文档

线上文档：https://dumpling.echo.tech

## 架构

```
Figma → JSON Schema → Dangoui 组件库 → 各端上线代码
```

三层结构：
- **Token** — 颜色/间距/圆角/字号
- **Component** — 原子分子组件（Button/Tabs/NavBar）
- **Business** — 业务组件（Grid/Header/Feed）+ 布局 + Slots
