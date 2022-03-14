# `@echoingtech/du-popup`

## API 设计

### 组件 Props

| Name | Type | Required | Default | 备注 |
| ---- | ---- | -------- | ------- | ---- |
| title | String | false | '' | 标题 |
| type |bottom,center | false | center | 居中/底部 |
| visible |Boolean| false | false | 是否打开|
| maskClick |Boolean| false | true |是否点击遮罩关闭|

### emit 事件

Name | Type | Required | Default | 备注
-- | -- | -- | -- | --
update:visible | function | false |   | 弹窗关闭
close|function|false| |弹窗关闭事件

## Example

```js
const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { DuPopup, DuButton },
  data() {
    return {
      visible: false,
      centerVisible: false,
    }
  },
  template: `
    <div style="margin-top: 18px; background: #fff;">
      <DuButton @click="handleOpen">打开</DuButton>
      <DuButton @click="handleOpenCenter">打开居中</DuButton>
      <DuPopup :visible="visible" title="选择日期（最多可选30天）" @update:visible="handleClose" type="bottom">
        <div>这是内容</div>
        <div>这是内容</div>
      </DuPopup>
      <DuPopup :visible.sync="centerVisible" title="选择日期（最多可选30天）" type="center" extStyle="width: 300px;" :maskClick="false">
        <div style="padding: 8px;">
          <div>这是内容</div>
          <div>这是内容</div>
        </div>
      </DuPopup>
    </div>
  `,
  methods: {
    handleOpen() {
      this.visible = true
    },

    handleClose() {
      this.visible = false
    },

    handleOpenCenter() {
      this.centerVisible = true
    },
  },
})
```
