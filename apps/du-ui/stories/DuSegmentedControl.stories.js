import { DuSegmentedControl } from '@frontend/du-segmented-control/src/index.js'
import './theme.scss'

import '@frontend/du-styles/styles/index.scss'

export default {
  title: 'SegmentedControl',
  argTypes: {},
}

const Template = (args) => ({
  components: { DuSegmentedControl },
  data() {
    return {
      tabs1: [
        {
          label: '拥有'
        },
        {
          label: '想要1'
        },
        {
          label: '想要2'
        },
        {
          label: '想要3'
        },
        {
          label: '想要4'
        },
        {
          label: '想要5'
        },
      ],
      tabs2: [
        {
          label: '标记总数排行'
        },
        {
          label: '总价值排行'
        },
      ],
      tabs3: [
        {
          label: '创建榜'
        },
        {
          label: '编辑榜'
        },
        {
          label: '标记榜'
        },
      ],
    }
  },
  methods: {
    handleTabTap(item) {
      console.log(`=====点击了tab======`, item)
    },
  },
  template: `
    <div>
      <h3>level1</h3>
      <DuSegmentedControl :tabs="tabs1"  mode="level1" @handleTabTap="handleTabTap"/>
    </div>
    <div>
      <h3>level2</h3>
      <DuSegmentedControl :tabs="tabs2"  mode="level2" @handleTabTap="handleTabTap" />
    </div>
    <div>
      <h3>level3</h3>
      <DuSegmentedControl :tabs="tabs3" mode="level3" @handleTabTap="handleTabTap" />
    </div>
  `,
})

export const Default = Template.bind({})

Default.args = {}
