# `@frontend/du-segmented-control`

## SegmentedControl组件

## API 设计

### 组件 Props

| Name | Type | Required | Default | 备注 |
| ---- | ---- | -------- | ------- | ---- |
| tabs | Array | true | [] | tab数组 |
| mode | String | fasle | level1 | 样式类型：level1、level2、level3 |
| currentTab | Object | false | null | 当前选项 |
| extStyle | String | false | '' | |
| extClass | String, Array, Object | false | '' | |

### emit 事件

- handleTabTap

## Example

```vue
 <DuSegmentedControl :tabs="tabs"  mode="level1" @handleTabTap="handleTabTap"/>
```
