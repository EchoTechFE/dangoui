import Vue from 'vue'
import { DuPopup } from '@frontend/du-popup/src/index.js'
import DuButton from '@frontend/du-button/src/Button.vue'
import ScrollView from '../components/ScrollView.vue'
import './theme.scss'

import '@frontend/du-styles/styles/index.scss'

Vue.component('scroll-view', ScrollView)

export default {
  title: 'Popup',
  argTypes: {},
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { DuPopup, DuButton },
  data() {
    return {
      visible: false,
      centerVisible: false,
      topVisible: false,
    }
  },
  template: `
    <div style="margin-top: 18px; background: #fff;">
      <DuButton @click="handleOpen">打开</DuButton>
      <DuButton @click="handleOpenCenter">打开居中</DuButton>
      <DuButton @click="handleOpenTop">打开顶部</DuButton>
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
      <DuPopup :visible.sync="topVisible" title="选择日期（最多可选30天）" type="top" :headerVisible="false">
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

    handleOpenTop() {
      this.topVisible = true
    },
  },
})

export const Default = Template.bind({})

Default.args = {}
