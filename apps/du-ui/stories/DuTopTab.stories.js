import { DuTopTab } from '@frontend/du-top-tab/src/index.js'
import './theme.scss'

import '@frontend/du-styles/styles/index.scss'

export default {
  title: 'TopTab',
  argTypes: {},
}

const Template = (args) => ({
  components: { DuTopTab },
  data() {
    return {
      tabs: [
        {
          label: '全部'
        },
        {
          label: '资料'
        },
        {
          label: '社区'
        },
        {
          label: '文本'
        },
        {
          label: '文本2'
        },
        {
          label: '文本3'
        },
        {
          label: '文本4'
        },
        {
          label: '文本5'
        },
      ],
    }
  },
  methods: {
    handleTabTap(tab) {
      console.log(`=====点击了tab======`, tab)
    },
    handleChannelTap() {
      console.log(`=====handleChannelTap======`)
    },
  },
  template: `
    <div>
      <h3>level1</h3>
      <DuTopTab :tabs="tabs"  mode="level1" @handleTabTap="handleTabTap" @handleChannelTap="handleChannelTap" />
    </div>
    <div>
      <h3>level2</h3>
      <DuTopTab :tabs="tabs"  mode="level2" @handleTabTap="handleTabTap" />
    </div>
  `,
})

export const Default = Template.bind({})

Default.args = {}
