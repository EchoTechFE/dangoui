# Props 规范现状

> 来源：遍历 `packages/dangoui/src` 所有 .vue 文件的 defineProps，覆盖 Component（原子/分子组件）和 Business（业务组件）

## Props 频率 TOP10

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

## Figma 与代码对齐情况

| 属性类型 | 对齐情况 |
|----------|---------|
| Size（Large/Medium/Small） | ✅ 一致 |
| Boolean（disabled/visible） | ✅ 一致 |
| Layout（Vertical/Horizontal） | ✅ 一致 |
| Type（Solid/Soft/Outline） | ⚠️ Figma 用 Solid/Soft，代码用 primary/secondary，需映射 |
| Text（title/text/placeholder） | ⚠️ 命名混用，待统一 |
| Status（Process/Finished） | ❌ 代码未体现，需新增 |

## 待建立映射表

| Figma 值 | 代码值 | 状态 |
|---------|-------|------|
| Solid | primary | ⚠️ 需映射 |
| Soft | secondary | ⚠️ 需映射 |
| Outline | outline | ✅ 一致 |
| Text | text | ✅ 一致 |