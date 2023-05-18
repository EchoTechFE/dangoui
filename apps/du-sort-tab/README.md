# `@frontend/du-sort-tab`

## SortTab组件

## API 设计

### 组件 Props

| Name | Type | Required | Default | 备注 |
| ---- | ---- | -------- | ------- | ---- |
| tabs | Array | true | [] | tab数组 |
| mode | String | fasle | level1 | 样式类型：level1、level2、level3、level4 |
| currentTab | Object | false | null | 当前选项 |
| options | Array | false | [] | options数组 |
| extStyle | String | false | '' | |
| extClass | String, Array, Object | false | '' | |

### emit 事件

- handleTapPoint、handleOptionTap、handleSearchTap

## Example

```vue
 <DuSortTab :tabs="tabs" :options="options" mode="level1" @handleTabTap="handleTabTap" @handleOptionTap="handleOptionTap" @handleSearchTap="handleSearchTap"/>
```
