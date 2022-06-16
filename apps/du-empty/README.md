# `@frontend/du-empty`

## Empty 组件

## API 设计

### 组件 Props

| Name | Type | Required | Default | 备注 |
| ---- | ---- | -------- | ------- | ---- |
| image | String | true | | 预设的图片 key 或者自定义URL |
| text | String | false | | 图片下方文字 |
| buttonText | String | false | | 按钮文字，不提供，按钮不展示 |
| extClass |  | false | |  |
| extStyle |  | false | |  |

#### 预设的图片 key

1. networkError: 网络异常
2. offline: 无网络
3. serviceError: 服务器异常
4. loadError: 加载失败
5. success: 全局成功
6. error: 全局失败
7. empty: 全局空数据
8. searchEmpty: 搜索无结果
9. contentDeleted: 内容已删除
10. contentInvisible: 内容已下架
11. notFound: 内容不存在

### emit 事件

- buttonClick

## Example

```vue
<DuEmpty image="success" text="操作成功" />
```
