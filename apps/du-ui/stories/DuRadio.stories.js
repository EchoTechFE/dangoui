import Vue from 'vue'
import VueCompositionApi from '@vue/composition-api'
import { DuRadio, DuRadioGroup } from '@echoingtech/du-radio/src/index.js'

import '@echoingtech/du-styles/styles/index.scss'

Vue.use(VueCompositionApi)

export default {
  title: 'Radio',
  argTypes: {
    onClick: {
      action: 'click'
    }
  }
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { DuRadio, DuRadioGroup },
  template: `
    <div>
      <div>
        自定义
        <DuRadio v-bind="$props" label="lbb">lbb</DuRadio>
      </div>
      <div>
        可取消
        <DuRadio label="lbb" cancel>lbb</DuRadio>
      </div>
      <div>
        默认样式
        <DuRadioGroup>
          <DuRadio label="lbb">lbb</DuRadio>
          <DuRadio label="黄河">黄河</DuRadio>
        </DuRadioGroup>
      </div>
      <div>
        shape="button" inline
        <DuRadioGroup shape="button" inline>
          <DuRadio label="lbb">lbb</DuRadio>
          <DuRadio label="黄河">黄河</DuRadio>
        </DuRadioGroup>
      </div>
    </div>
  `
})

export const Default = Template.bind({})

Default.args = {}
