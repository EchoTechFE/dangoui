import { DuEmpty } from '@frontend/du-empty/src/index.js'
import './theme.scss'

import '@frontend/du-styles/styles/index.scss'

export default {
  title: 'Empty',
  argTypes: {},
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { DuEmpty },
  template: `
    <DuEmpty v-bind="$props" />
  `,
})

export const Default = Template.bind({})

Default.args = {
  image: 'success',
  text: '操作成功',
  buttonText: '返回工作台',
  extStyle: {},
  extClass: {},
}
