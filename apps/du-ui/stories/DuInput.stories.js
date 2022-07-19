import DuInput from '@frontend/du-input/src/Input.vue'

import '@frontend/du-styles/styles/index.scss'

export default {
  title: 'Input',
  component: DuInput,
  argTypes: {},
}

const Template = (args, { argTypes }) => ({
  components: { DuInput },
  setup() {
    return { args }
  },
  template: `
    <div>
      <DuInput v-bind="args" placeholder="自动聚焦，请输入金额" prefix="￥"  suffix="精确到整数" autofocus/>
      <div style="height: 10px" />
      <DuInput v-bind="args" :maxlength="10" placeholder="maxlength 10"/>
      <div style="height: 10px" />
      <DuInput v-bind="args" inputAlign="right" placeholder="inputAlign='right'" />
      <div style="height: 10px" />
      <DuInput value="被禁用了哦" disabled />
      <div style="height: 10px" />
      <DuInput placeholder="placeholder样式红色" extStyle="--du-input-placeholder-color: red;" />
    </div>
  `,
})

export const Default = Template.bind({})

Default.args = {
  trim: true,
}
