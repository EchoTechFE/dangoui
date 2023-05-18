# `@frontend/du-top-tab`

## TopTab组件

## API 设计

### 组件 Props

| Name | Type | Required | Default | 备注 |
| ---- | ---- | -------- | ------- | ---- |
| tabs | Array | true | [] | tab数组 |
| mode | String | fasle | level1 | 样式类型：level1、level2 |
| extStyle | String | false | '' | |
| extClass | String, Array, Object | false | '' | |

### emit 事件

- handleTapPoint handleChannelTap

## Example

```vue
<DuTopTab :tabs="tabs"  mode="level1" @handleTabTap="handleTabTap" @handleChannelTap="handleChannelTap" />

```
