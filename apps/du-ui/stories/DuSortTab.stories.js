import { DuSortTab } from '@frontend/du-sort-tab/src/index.js'
import './theme.scss'

import '@frontend/du-styles/styles/index.scss'

export default {
  title: 'SortTab',
  argTypes: {},
}

const Template = (args) => ({
  components: { DuSortTab },
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
          label: '文本1'
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
    handleTabTap(item) {
      console.log(`=====点击了tab======`, item)
    },
    handleOptionTap(option) {
      console.log(`=====点击了option======`, option)
    },
    handleSearchTap() {
      console.log('======search=======')
    }
  },
  template: `
    <div>
      <h3>level1</h3>
      <DuSortTab :tabs="tabs" :options="options" mode="level1" @handleTabTap="handleTabTap" @handleOptionTap="handleOptionTap" @handleSearchTap="handleSearchTap"/>
    </div>
    <div>
      <h3>level2</h3>
      <DuSortTab :tabs="tabs" :options="options" mode="level2" @handleTabTap="handleTabTap" @handleOptionTap="handleOptionTap"/>
    </div>
    <div>
      <h3>level3</h3>
      <DuSortTab :tabs="tabs" :options="options" mode="level3" @handleTabTap="handleTabTap" @handleOptionTap="handleOptionTap" />
    </div>
    <div>
      <h3>level4</h3>
      <DuSortTab :tabs="tabs" :options="options" mode="level4" @handleTabTap="handleTabTap" @handleOptionTap="handleOptionTap"/>
    </div>
  `,
})

export const Default = Template.bind({})

Default.args = {}
