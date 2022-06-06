# `@frontend/du-radio`

## Radio组件

## API 设计

### 组件 Props

| Name | Type | Required | Default | 备注 |
| ---- | ---- | -------- | ------- | ---- |
| label |  | false | true | radio的label & 选中时的值 |
| value |  | false | false | 选中的值，可以使用v-model |
| cancel | Boolean | false | false | 选中后是否可以取消选中 |
| disabled | Boolean | false | false | 禁用 |
| shape | 'normal','button' | false | 'normal' | 形状 |
| inline | Boolean | false | false | 等同与display：inline |
| custom | Boolean | false | false | 自定义样式 |
| extStyle | String | false | '' | |
| extClass | String, Array, Object | false | '' | |
| options | Object | false | false | 将所有props以Object的形式传入 |

### emit 事件

- click
- input

## RadioGroup组件

## API 设计

### 组件 Props

| Name | Type | Required | Default | 备注 |
| ---- | ---- | -------- | ------- | ---- |
| value |  | true | undefined | 选中的值 |
| inline | Boolean | false | false | 等同与Radio display：inline |
| cancel | Boolean | false | false | 选中后是否可以取消选中 |
| shape | 'normal','button' | false | 'normal' | Radio的形状 |
| custom | Boolean | false | false | 自定义Radio样式 |
| extStyle | String | false | '' | |
| extClass | String, Array, Object | false | '' | |
| options | Object | false | false | 将所有props以Object的形式传入 |

### emit 事件

- input

## Example

```vue

<DuRadio v-model="checked">单独使用</DuRadio>

<DuRadio v-model="checked2" :label="1">选中时checked2的值为1</DuRadio>

<DuRadio v-model="checked2" costom>
	<!-- 定义想要的样式 -->
</DuRadio>

<DuRadioGroup v-model="checked3">
  <DuRadio :label='0'>lb</DuRadio>
	<DuRadio :label='1'>lbb</DuRadio>
</DuRadioGroup>
```
