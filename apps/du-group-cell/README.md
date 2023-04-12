# `@frontend/du-group-cell`

## API 设计

### 组件 Props

| Name | Type | Required | Default | 备注 |
| ---- | ---- | -------- | ------- | ---- |
| title | String | false | '' | 标题 |
| subtitle | String | false | '' | 副标题 |
| guideText | String | false | 查看更多 | 顶栏右侧，带箭头的「查看更多」文字 |
| infoText | String | false | '' | 顶栏右侧，左边带一个 info 图标的文字 |
| actionIcon | String | false | '' | 顶栏右侧的图标按钮 |
| mode | String | false | normal | 模式， normal 或者 collpase，collapse 模式下，点击 guideText 会收起展开内容 |
| size | String | false | normal | 大小，可选 normal 或者 large |
| defaultOpen | Boolean | false | null | collapse 模式下，默认是否打开 |
| open | Boolean | false | null | collapse 模式下，受控模式是否打开 |
| extClass | String | false | '' | extClass |
| extStyle | String | false | '' | extStyle |

### emit 事件

Name | Type | Required | Default | 备注
-- | -- | -- | -- | --
guideTap | function | false |   | 点击 guideText
infoTap|function|false| | 点击 infoText
actionTap|function|false| | 点击 actionIcon
toggleOpen|function|false| | 切换 collapse 状态

### slot

| Name |  备注 |
-- | -- |
| left | 顶栏标题左边的 slot |
| right | 标题右侧的 slot |
