# Docs 调试经验

## CSS 样式不生效（heading 字号/颜色等）

### 排查步骤

1. **确认实际渲染的 HTML 结构**
```javascript
document.querySelector('.doc-prose')?.className
```

2. **检查目标元素的 computed styles**
```javascript
getComputedStyle(el).fontSize
getComputedStyle(el).color
```

3. **检查 CSS 规则是否存在**
```javascript
for (const sheet of document.styleSheets) {
  try {
    for (const rule of sheet.cssRules) {
      if (rule.selectorText?.includes('target-selector')) {
        console.log(rule.selectorText, '->', rule.style.cssText)
      }
    }
  } catch(e) {}
}
```

### 经验法则

| 样式来源 | 特点 | 修改方式 |
|---------|------|---------|
| 自定义 CSS（`docs/assets/index.css`） | 用 `:deep()` 操作符穿透组件 | 直接写 CSS 规则 |
| 第三方样式（Nuxt Content / Tailwind Typography） | 依赖类名（如 `.prose`） | 确认类名存在，或添加类 |

### 关键点

**Tailwind Typography 的 `.prose` 类是 Nuxt Content 的默认样式依赖**

- Nuxt Content 的 `ContentDoc` 组件期望有 `.prose` 类来应用 markdown 样式
- 如果 `ContentDoc` 只有自定义类（如 `doc-prose`）而没有 `.prose`，heading 样式不会生效
- 在 `[...slug].vue` 中使用 `<ContentDoc class="doc-prose prose" />` 确保两套样式都生效
