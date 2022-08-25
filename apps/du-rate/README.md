# `@frontend/du-rate`

## Rate组件

## API 设计

### 组件 Props

| Name | Type | Required | Default | 备注 |
| ---- | ---- | -------- | ------- | ---- |
| step | Number | false | 1 | 每颗星代表的分数 |
| rating | Number | true | | |
| size | Number | false | 32 | 大小，如 16 |
| space | Number | false | 8 | 星星的间隔，如 8 |
| lightColor | String | false | #F19E38 | 点亮星星的颜色，如 var(--color-main)、red、#666) |
| drakColor | String | false | rgba(12, 12, 12, 0.1) | 置灰星星的颜色，如 var(--color-main)、red、#666) |
| extStyle | String | false | '' | |
| extClass | String, Array, Object | false | '' | |

### emit 事件

- handleTapPoint

## Example

```vue
 <DuRate rating="7" step="2" size="16" space="8"/>
```
