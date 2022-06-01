# `@frontend/du-snackbar`

## API 设计

### 组件 Props

| Name | Type | Required | Default | 备注 |
| ---- | ---- | -------- | ------- | ---- |
| offset | Number | false | 0 | toast距页面底部距离 |
| offsetPosition | String | false | 'bottom' | 基于底(顶)部定位 |
| duration | Number | false | 0 | toast自动关闭时间(秒) |
| content | String | true | '' | 内容 |
| show | Boolean | false | true | 是否展示snackbar |
| showClose | Boolean | false | false | 是否展示关闭icon |
| buttonProps | Object | true | {} | DuButton属性 |

### emit 事件

| Name | Type | Required | Default | 备注 |
| ---- | ---- | -------- | ------- | ---- |
| close | function | false |   | 关闭icon被点击 |
| action | function | true |   | DuButton被点击 |  
