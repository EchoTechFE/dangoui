import Vue from 'vue'
import VueCompositionApi from '@vue/composition-api'
import { DuRadio, DuRadioGroup, DuRadioIcon } from '@frontend/du-radio/src/index.js'

import '@frontend/du-styles/styles/index.scss'

Vue.use(VueCompositionApi)

export default {
  title: 'Radio',
  argTypes: {
    onClick: {
      action: 'click',
    },
  },
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { DuRadio, DuRadioGroup, DuRadioIcon },
  template: `
    <div>
      <div>
        <h3>可取消</h3>
        <DuRadio label="lbb" cancel>lbb</DuRadio>
      </div>
      <div>
        <h3>默认样式</h3>
        <DuRadioGroup>
          <DuRadio label="lbb">lbb</DuRadio>
          <DuRadio label="黄河">黄河</DuRadio>
        </DuRadioGroup>
      </div>
      <div>
        <h3>cell</h3>
        <DuRadioGroup cell>
          <DuRadio label="lbb">lbb</DuRadio>
          <DuRadio label="黄河">黄河</DuRadio>
        </DuRadioGroup>
      </div>
      <div>
        <h3>shape="button" inline</h3>
        <DuRadioGroup shape="button" inline>
          <DuRadio label="lbb">lbb</DuRadio>
          <DuRadio label="黄河">黄河</DuRadio>
        </DuRadioGroup>
      </div>
      <div>
        <h3>todo: 自定义</h3>
        <DuRadio v-bind="$props" label="lbb">lbb</DuRadio>
      </div>
      <div>
        <h3>内部使用的图标</h3>
        <DuRadioIcon checked size="100px" />
      </div>
    </div>
  `,
})

export const Default = Template.bind({})

Default.args = {}
