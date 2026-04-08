# Uno Preset Echo Tokens

> 本文件记录 `uno-preset-echo` 的 token 体系演进，供存量迁移参考。
> 最终目标：完全废弃存量命名，全面对接 Figma 规范命名。

---

## 一、Spacing Token

### 存量命名（uno-preset-echo 当前值）

| Token | CSS 值 | UnoCSS Class |
|-------|--------|--------------|
| `spacing-none` | `0` | `p-none`, `gap-none` |
| `spacing-mini` | `0.5rem` (8px) | `p-mini`, `gap-mini` |
| `spacing-sm` | `1rem` (16px) | `p-sm`, `gap-sm` |
| `spacing-norm` | `2rem` (32px) | `p-norm`, `gap-norm` |
| `spacing-md` | `3rem` (48px) | `p-md`, `gap-md` |
| `spacing-lg` | `4rem` (64px) | `p-lg`, `gap-lg` |

### Figma 规范命名（01 tokens/_styles.css）

| Token | CSS 值 | UnoCSS Class | 说明 |
|-------|--------|--------------|------|
| `spacing-mini` | `0.125rem` (2px) | `p-spacing-mini` | 极小间距 |
| `spacing-small` | `0.25rem` (4px) | `p-spacing-small` | 小间距 |
| `spacing-normal` | `0.5rem` (8px) | `p-spacing-normal` | 常规间距 |
| `spacing-medium` | `0.75rem` (12px) | `p-spacing-medium` | 中间距 |
| `spacing-large` | `1rem` (16px) | `p-spacing-large` | 大间距 |

### 迁移对照表

| 存量命名 | 存量值 | Figma 命名 | Figma 值 | 差异 |
|----------|--------|------------|----------|------|
| `mini` | 8px | `spacing-mini` | 2px | -6px |
| `sm` | 16px | `spacing-small` | 4px | -12px |
| `norm` | 32px | `spacing-normal` | 8px | -24px |
| `md` | 48px | `spacing-medium` | 12px | -36px |
| `lg` | 64px | `spacing-large` | 16px | -48px |

> ⚠️ **值完全不同，不可混用**

---

## 二、Border Radius Token

### 存量命名（uno-preset-echo 当前值）

| Token | CSS 值 | UnoCSS Class |
|-------|--------|--------------|
| `radius-none` | `0` | `rounded-none` |
| `radius-mini` | `0.5rem` (8px) | `rounded-mini` |
| `radius-sm` | `1rem` (16px) | `rounded-sm` |
| `radius-norm` | `2rem` (32px) | `rounded-norm` |
| `radius-md` | `6rem` (96px) | `rounded-md` |
| `radius-lg` | `8rem` (128px) | `rounded-lg` |
| `radius-full` | `9999px` | `rounded-full` |

### Figma 规范命名（01 tokens/_styles.css）

| Token | CSS 值 | UnoCSS Class | 说明 |
|-------|--------|--------------|------|
| `radius-mini` | `0.125rem` (2px) | `rounded-radius-mini` | 极小圆角 |
| `radius-small` | `0.25rem` (4px) | `rounded-radius-small` | 小圆角 |
| `radius-normal` | `0.5rem` (8px) | `rounded-radius-normal` | 常规圆角 |
| `radius-medium` | `0.75rem` (12px) | `rounded-radius-medium` | 中圆角 |
| `radius-large` | `1rem` (16px) | `rounded-radius-large` | 大圆角 |

### 迁移对照表

| 存量命名 | 存量值 | Figma 命名 | Figma 值 | 差异 |
|----------|--------|------------|----------|------|
| `mini` | 8px | `radius-mini` | 2px | -6px |
| `sm` | 16px | `radius-small` | 4px | -12px |
| `norm` | 32px | `radius-normal` | 8px | -24px |
| `md` | 96px | `radius-medium` | 12px | -84px |
| `lg` | 128px | `radius-large` | 16px | -112px |

> ⚠️ **值完全不同，不可混用**

---

## 三、Typography Token

### 存量命名（uno-preset-echo shortcuts）

| Shortcut | 展开值 | 字重 | 行高 | 字体 |
|----------|--------|------|------|------|
| `text-h1` | `text-24` | 500 | 30 | PingFang SC |
| `text-h2` | `text-20` | 500 | 26 | PingFang SC |
| `text-h3` | `text-18` | 500 | 25 | PingFang SC |
| `text-h4` | `text-16` | 500 | 24 | PingFang SC |
| `text-h5` | `text-14` | 500 | 22 | PingFang SC |
| `text-h6` | `text-12` | 500 | 18 | PingFang SC |
| `text-h7` | `text-11` | 500 | 13 | PingFang SC |
| `text-h8` | `text-10` | 500 | 11 | PingFang SC |
| `text-b1` | `text-24` | 400 | 30 | PingFang SC |
| `text-b2` | `text-20` | 400 | 26 | PingFang SC |
| `text-b3` | `text-18` | 400 | 25 | PingFang SC |
| `text-b4` | `text-16` | 400 | 24 | PingFang SC |
| `text-b5` | `text-14` | 400 | 22 | PingFang SC |
| `text-b6` | `text-12` | 400 | 18 | PingFang SC |
| `text-b7` | `text-11` | 400 | 13 | PingFang SC |
| `text-b8` | `text-10` | 400 | 11 | PingFang SC |
| `text-n1` | `text-24` | 500 | 30 | Roboto |
| `text-n2` | `text-20` | 500 | 26 | Roboto |
| `text-n3` | `text-18` | 500 | 25 | Roboto |
| `text-n4` | `text-16` | 500 | 24 | Roboto |
| `text-n5` | `text-14` | 500 | 22 | Roboto |
| `text-n6` | `text-12` | 500 | 18 | Roboto |
| `text-n7` | `text-12` | 500 | 18 | Roboto |
| `text-n8` | `text-10` | 500 | 11 | Roboto |

### Figma 规范命名（01 tokens/_styles.css）

| Token | 展开值 | 字重 | 行高 | 字体 |
|-------|--------|------|------|------|
| `font-h1` | 500 24px/30px | 500 | 30 | PingFang SC |
| `font-h2` | 500 20px/26px | 500 | 26 | PingFang SC |
| `font-h3` | 500 18px/25px | 500 | 25 | PingFang SC |
| `font-h4` | 500 16px/24px | 500 | 24 | PingFang SC |
| `font-h5` | 500 14px/22px | 500 | 22 | PingFang SC |
| `font-h6` | 500 12px/18px | 500 | 18 | PingFang SC |
| `font-h7` | 500 11px/13px | 500 | 13 | PingFang SC |
| `font-h8` | 500 10px/11px | 500 | 11 | PingFang SC |
| `font-b1` | 400 24px/30px | 400 | 30 | PingFang SC |
| `font-b2` | 400 20px/26px | 400 | 26 | PingFang SC |
| `font-b3` | 400 18px/25px | 400 | 25 | PingFang SC |
| `font-b4` | 400 16px/24px | 400 | 24 | PingFang SC |
| `font-b5` | 400 14px/22px | 400 | 22 | PingFang SC |
| `font-b6` | 400 12px/18px | 400 | 18 | PingFang SC |
| `font-b7` | 400 11px/13px | 400 | 13 | PingFang SC |
| `font-b8` | 400 10px/11px | 400 | 11 | PingFang SC |
| `font-n1` | 500 24px/30px | 500 | 30 | Roboto |
| `font-n2` | 500 20px/26px | 500 | 26 | Roboto |
| `font-n3` | 500 18px/25px | 500 | 25 | Roboto |
| `font-n4` | 500 16px/24px | 500 | 24 | Roboto |
| `font-n5` | 500 14px/22px | 500 | 22 | Roboto |
| `font-n6` | 500 12px/18px | 500 | 18 | Roboto |
| `font-n7` | 500 12px/18px | 500 | 18 | Roboto |
| `font-n8` | 500 10px/11px | 500 | 11 | Roboto |

### 差异说明

| 问题 | 现状 | 说明 |
|------|------|------|
| 命名方式 | UnoCSS 用 shortcut（`text-h1`），Figma 用 CSS var（`--font-h1`） | 体系不同但名称一致 |
| 使用方式 | UnoCSS: `class="text-h5"`, Figma: `font: var(--font-h5)` | 引用方式不同 |

---

## 四、Shadow Token

### 存量命名（uno-preset-echo）

| Token | 值 | UnoCSS Class |
|-------|-----|--------------|
| `shadow-primary` | `0 1px 20rpx 0 rgba(0,0,0,0.08)` | `shadow-primary` |
| `shadow-2` | `0 1px 20rpx 0 rgba(0,0,0,0.06)` | `shadow-2` |

### Figma 规范

> Figma Variables 中无 shadow 等价物，暂无对应 token。

---

## 五、Theme Switch（主题切换）

### 存量命名（uno-preset-echo-colors）

| Theme Name | CSS Class | 说明 |
|------------|-----------|------|
| `qd` | `.g-theme-qd` | 轻度 purple 主色 |
| `qd-gray` | `.g-theme-qd-gray` | 轻度 purple 灰底 |
| `pay` | `.g-theme-pay` | 支付色（红绿） |
| `dark` | `.g-theme-dark` | 深色主题 |
| `qh` | `.g-theme-qh` | 奇货 orange |
| `vip` | `.g-theme-vip` | VIP 主题 |
| `mihua` | `.g-theme-mihua` | 密乎主题 |
| `mihua-dark` | `.g-theme-mihua-dark` | 密乎深色 |

### Figma 规范（01 tokens/_styles.css）

| Theme Name | 属性选择器 | 说明 |
|------------|-----------|------|
| `light`（默认） | `:root` | 浅色主题 |
| `dark` | `[data-theme="dark"]` | 深色主题 |

### 差异说明

| 维度 | 存量（uno-preset-echo） | Figma 规范 |
|------|-------------------------|-----------|
| 切换方式 | CSS class `.g-theme-*` | data attribute `[data-theme="*"]` |
| 支持主题数 | 8 个品牌主题 | 2 个（light/dark） |
| 实现位置 | UnoCSS rule generator | CSS variable override |

> ✅ **保留 `.g-theme-*` 机制，不迁移到 `data-theme`**

---

## 六、Color Token

### 存量命名（uno-preset-echo-colors）

#### 语义色（Semantic Colors）

| Token | CSS Var | 值示例 |
|-------|---------|--------|
| `text-1` | `var(--du-text-1)` | `#000000` |
| `text-2` | `var(--du-text-2)` | `rgba(0,0,0,.64)` |
| `text-3` | `var(--du-text-3)` | `rgba(0,0,0,.4)` |
| `text-disabled` | `var(--du-text-disabled)` | `rgba(0,0,0,.16)` |
| `icon-1` | `var(--du-icon-1)` | `#2B263B` |
| `icon-2` | `var(--du-icon-2)` | `#625E76` |
| `icon-3` | `var(--du-icon-3)` | `#918B9F` |
| `icon-disabled` | `var(--du-icon-disabled)` | `#D4D0DA` |
| `border-1` | `var(--du-border-1)` | `rgba(0,0,0,.12)` |
| `border-2` | `var(--du-border-2)` | `rgba(0,0,0,.08)` |
| `border-3` | `var(--du-border-3)` | `rgba(0,0,0,.04)` |
| `bg-1` | `var(--du-bg-1)` | `#FFFFFF` |
| `bg-2` | `var(--du-bg-2)` | `#F7F7F9` |
| `bg-3` | `var(--du-bg-3)` | `#FFFFFF` |
| `bg-4` | `var(--du-bg-4)` | `#EDEDF2` |
| `mask-1` | `var(--du-mask-1)` | `rgba(0,0,0,.88)` |
| `mask-2` | `var(--du-mask-2)` | `rgba(0,0,0,.64)` |
| `mask-3` | `var(--du-mask-3)` | `rgba(0,0,0,.4)` |
| `mask-hover` | `var(--du-mask-hover)` | `rgba(0,0,0,.08)` |
| `mask-active` | `var(--du-mask-active)` | `rgba(0,0,0,.04)` |

#### 品牌色（Brand Colors）

每个品牌色有 9 级色阶 + 组件变体：

| 品牌 | 色阶范围 | 变体 |
|------|---------|------|
| `primary` | 100-900 | solid-bg, solid-color, color, soft-bg, outline-color, border, text-color, disabled-* |
| `secondary` | 100-900 | 同上 |
| `trade` | 100-900 | 同上 |
| `white` | 1-9 | solid-bg, solid-color, color, soft-bg, outline-color, border, border-2, border-3, text-color, text-color-2, text-color-3 |
| `default` | 1-9 | 同上 |
| `success` | 100-900 | 同 primary |
| `warning` | 100-900 | 同 primary |
| `error` | 100-900 | 同 primary |
| `transBlack` | 1-9 | 同 primary |

#### 色板色阶（Primitive Colors）

| 色板名 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 |
|--------|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| `neutral` | 04% | 08% | 12% | 16% | 24% | 40% | 64% | 88% | #000 |
| `gray` | #f7f7f9 | #ededf2 | #e1e1e5 | #d4d0da | #bab5c4 | #918b9f | #625e76 | #383950 | #2b263b |
| `purple` | #f2f0ff | #d9d2ff | #c7b8ff | #958dff | #7c66ff | #5c4cd9 | #4036b3 | #28238c | #1a1866 |
| `grape` | #f1e6ff | #ebd4ff | #d6b3ff | #b688ff | #ad69f7 | #8a4fd1 | #6838ab | #4a2585 | #32195e |
| `blue` | #e4ebf9 | #cce0ff | #a6caff | #8fb7ff | #6c9aff | #5077d9 | #3957b3 | #263c8c | #1b2866 |
| `zimablue` | #dff7f7 | #cbf7f7 | #9df2f4 | #62deef | #28bee0 | #009bbf | #087599 | #005273 | #00344d |
| `turquoise` | #e2f7f3 | #cdf9eb | #9dedd9 | #77e5d2 | #36ccb6 | #17ad9b | #14877e | #076059 | #053b3a |
| `green` | #e2f7e3 | #c9f2ca | #9de09d | #7ad37f | #52ba5c | #379e45 | #247842 | #145221 | #0f3d19 |
| `yellow` | #fffde6 | #fff9ca | #ffe885 | #fad728 | #edbf00 | #c79800 | #a17600 | #7a5600 | #543800 |
| `orange` | #fff0e6 | #ffdfca | #ffc299 | #ffa15a | #fc7e22 | #d65d11 | #b04105 | #8a2c00 | #631c00 |
| `red` | #ffebe9 | #ffd1cf | #ffabab | #ff8380 | #f96464 | #d94a4e | #b3343c | #8c222c | #661722 |
| `pink` | #f7dfec | #ffcfe5 | #ffaed5 | #f980ba | #ed64a5 | #c74a88 | #a1336e | #7a2154 | #54163b |
| `tendershoots` | #fbffe5 | #f4fec3 | #e4f689 | #cdee2b | #b2d600 | #99b800 | #7f9900 | #667a00 | #4c5c00 |

### Figma 规范（01 tokens/_styles.css）

> 颜色体系命名基本一致，以下为关键差异：

| 维度 | 存量（uno-preset-echo） | Figma 规范（01 tokens） |
|------|-------------------------|------------------------|
| CSS 变量前缀 | `--du-c-*` (genCssVars) | `--du-c-*-*` (色阶) |
| 语义色变量 | `--du-text-1`, `--du-border-1` | `--text-1`, `--border-1` |
| 品牌色变量 | `--du-c-primary` | `--primary-5` (alias) |
| 组件 token | `--primary-bt-*`, `--primary-tag-*` | `--primary-bt-*`, `--primary-tag-*` |

> ✅ 颜色命名体系基本一致，无需大规模迁移

---

## 七、迁移原则

1. **Spacing/Radius**：存量命名和 Figma 命名**值完全不同**，不可混用。新代码应使用 Figma 规范命名。
2. **Typography**：命名一致（N1-N8 等），但需修正 N7 值。
3. **Shadow**：UnoCSS 特有，Figma 无等价物，保留。
4. **Theme Switch**：保留现有 `.g-theme-*` 机制，不迁移。
5. **Color**：命名基本一致，无需迁移。

---

## 八、Figma 设计源

Token 值来源于 `01 tokens/_styles.css`，该文件由 `generate.py` 从 Figma Variables 生成。

Figma Variables 读取方式（需 Figma 桌面客户端）：
- 文件：`00_原子分子组件 💙`
- 变量集：`Primitives-QD`
- 路径：Local variables → Spacing / Radius / Colors

---

## 九、UnoCSS 使用示例

```vue
<!-- Spacing - 存量（待废弃） -->
<div class="gap-mini p-sm">

<!-- Spacing - Figma 规范（推荐） -->
<div class="gap-spacing-small p-spacing-normal">

<!-- Radius - 存量（待废弃） -->
<button class="rounded-mini">

<!-- Radius - Figma 规范（推荐） -->
<button class="rounded-radius-small">

<!-- Typography -->
<h1 class="text-h5">标题</h1>
<p class="text-b5">正文</p>
<span class="text-n5">数字 123</span>

<!-- Shadow -->
<div class="shadow-primary">

<!-- Theme Switch -->
<div class="g-theme-qd">品牌主题</div>
<!-- 或 -->
<div data-theme="dark">深色主题</div>

<!-- Color -->
<div class="bg-primary text-white">主色背景</div>
<div class="text-1">主要文字</div>
```

---

## 十、待办事项

- [ ] Spacing 存量迁移审计
- [ ] Radius 存量迁移审计
- [ ] 存量命名完全废弃（从 theme 中移除 spacing/radius 存量）
