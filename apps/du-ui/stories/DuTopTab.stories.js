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
      ],
      options: [
        {
          label: '选项1',
        },
        {
          label: '选项2',
        }
      ],
    }
  },
  methods: {
    handleTabTap({index, item}) {
      console.log(`=====点击了tab${index}======`, item)
    },
    handleOptionTap({index, item}) {
      console.log(`=====点击了option${index}======`, item)
    },
    handleSearchTap() {
      console.log('======search=======')
    }
  },
  template: `
    <div>
      <h3>一级</h3>
      <DuSortTab :tabs="tabs" :options="options" mode="level1" @handleTabTap="handleTabTap" @handleOptionTap="handleOptionTap" @handleSearchTap="handleSearchTap"/>
    </div>
    <div>
      <h3>二级</h3>
      <DuSortTab :tabs="tabs" :options="options" mode="level2" @handleTabTap="handleTabTap" @handleOptionTap="handleOptionTap"/>
    </div>
    <div>
      <h3>三级</h3>
      <DuSortTab :tabs="tabs" :options="options" mode="level3" @handleTabTap="handleTabTap" @handleOptionTap="handleOptionTap" />
    </div>
    <div>
      <h3>四级</h3>
      <DuSortTab :tabs="tabs" :options="options" mode="level4" @handleTabTap="handleTabTap" @handleOptionTap="handleOptionTap"/>
    </div>
  `,
})

export const Default = Template.bind({})

Default.args = {}
