import { DuRadio, DuRadioGroup, DuRadioIcon } from '@frontend/du-radio/src/index.js'

import '@frontend/du-styles/styles/index.scss'

export default {
  title: 'Radio',
  argTypes: {
    onClick: {
      action: 'click',
    },
  },
}

const Template = (args) => ({
  components: { DuRadio, DuRadioGroup, DuRadioIcon },
  setup() {
    return { args }
  },
  template: `
    <div>
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
        <h3>禁用</h3>
        <DuRadio label="lbb" disabled>lbb</DuRadio>
      </div>
      <div>
        <h3>可取消</h3>
        <DuRadio label="lbb" cancel>lbb</DuRadio>
      </div>
      <div>
        <h3>todo: 自定义</h3>
        <DuRadio v-bind="args" label="lbb">lbb</DuRadio>
      </div>
      <div>
        <h3>内部使用的图标</h3>
        <DuRadioIcon />
        <DuRadioIcon checked />
        <DuRadioIcon disabled />
      </div>
    </div>
  `,
})

export const Default = Template.bind({})

Default.args = {}
