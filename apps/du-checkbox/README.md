# `@frontend/du-calendar`

## Checkbox & CheckboxGroup

## API 设计

### Checkbox 组件 Props

| Name     | Type                    | Required | Default | 备注               |
| -------- | ----------------------- | -------- | ------- | ------------------ |
| extClass | [string,array]          | false    | ''      | 扩展类名           |
| extStyle | [string,object]         | false    | ''      | 扩展样式           |
| shape    | 'round'/'square'        | false    | 'round' | 多选图标样式       |
| inline   | boolean                 | false    | false   | 是否为行内样式     |
| disable  | boolean                 | false    | false   | 按钮是否失效       |
| label    | [string,number,boolean] | false    |         | 多选框后展示文案   |
| value    | boolean                 | false    | false   | 多选框是否被选中   |
| position | 'left'/'right'          | false    | 'right' | 多选图标出现的位置 |
| custom   | boolean                 | false    | false   | 是否开启自定义模式 |

### Checkbox Emit 事件

| 成员  | 说明                 | payload           |
| ----- | -------------------- | ----------------- |
| click | 返回是否选中改多选框 | isChecked:boolean |
| input | 返回是否选中改多选框 | isChecked:boolean |

### CheckboxGroup 组件 Props

| Name     | Type                                        | Required | Default | 备注               |
| -------- | ------------------------------------------- | -------- | ------- | ------------------ |
| extClass | [string,array]                              | false    | ''      | 扩展类名           |
| extStyle | [string,object]                             | false    | ''      | 扩展样式           |
| options  | <{label?:any,value:any,disabled?:any}>Array | false    | 'round' | 多选图标样式       |
| inline   | boolean                                     | false    | false   | 是否为行内样式     |
| shape    | 'round'/'square'                            | false    | false   | 按钮是否失效       |
| position | 'left'/'right'                              | false    | 'right' | 多选图标出现的位置 |

### CheckboxGroup Emit 事件

| 成员  | 说明                 | payload           |
| ----- | -------------------- | ----------------- |
| input | 返回是否选中改多选框 | isChecked:boolean |

## Example

```vue
<template>
  <!-- 使用options渲染多个checkbox -->
  <du-checkbox-group :options="options" v-model="colorArray"></du-checkbox-group>

  <!-- 也可以直接在du-checkbox-group中嵌套du-checkbox -->
  <du-checkbox-group v-model="cardRoles">
    <du-checkbox inline label="Jack">Jack</du-checkbox>
    <du-checkbox label="Queen">Queen</du-checkbox>
    <du-checkbox label="King" disabled>King</du-checkbox>
  </du-checkbox-group>

  <!-- 当然还可以单独使用du-checkbox -->
  <du-checkbox v-model="isChecked">其他备注</du-checkbox>
</template>

<script>
import { DuCheckbox, DuCheckboxGroup } from './src'
import { reactive, toRefs } from '@vue'
export default {
  components: {
    DuCheckbox,
    DuCheckboxGroup,
  },
  setup() {
    const state = reactive({
      options: [
        { label: '红色', value: 'red' },
        { label: '绿色', value: 'green' },
        { label: '蓝色', value: 'blue', disabled: true },
      ],
      colorArray: [],
      cardRoles: [],
      isChecked: false,
    })

    return {
      ...toRefs(state),
    }
  },
}
</script>
```
