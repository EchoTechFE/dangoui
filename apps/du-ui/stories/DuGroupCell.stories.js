import { DuGroupCell } from '@frontend/du-group-cell/src/index.js'
import { DuButton } from '@frontend/du-button/src/index.js'
import './theme.scss'

import '@frontend/du-styles/styles/index.scss'

export default {
  title: 'GroupCell',
  argTypes: {
    onGuideTap: {
      action: 'guideTap',
    },
    onActionTap: {
      action: 'actionTap',
    },
    onInfoTap: {
      action: 'infoTap',
    },
  },
}

const Template = (args, { argTypes }) => ({
  components: { DuGroupCell, DuButton },
  data() {
    return {}
  },
  setup() {
    return { args }
  },
  template: `
    <div style="padding-top: 18px; padding-bottom: 18px; background: #EDEDF2;">
      <DuGroupCell v-bind="args" title="标题" subtitle="子标题" ext-style="margin-bottom: 2.66vw;">
      这里填充GroupCell具体内容
      </DuGroupCell>

      <DuGroupCell v-bind="args" title="标题" subtitle="子标题" info-text="规格说明" ext-style="margin-bottom: 2.66vw;">
      这里填充GroupCell具体内容
      </DuGroupCell>

      <DuGroupCell v-bind="args" title="标题" subtitle="子标题" info-text="" guide-text="" action-icon="delete" ext-style="margin-bottom: 2.66vw;">
      这里填充GroupCell具体内容
      </DuGroupCell>

      <DuGroupCell v-bind="args" title="标题" ext-style="margin-bottom: 2.66vw;">
        <template #left>
          <DuButton size="mini" type="info">左侧自定义 slot</DuButton>
        </template>
        <div>HELLO WORLD</div>
      </DuGroupCell>

      <DuGroupCell v-bind="args" title="标题" ext-style="margin-bottom: 2.66vw;">
        <template #right>
          <DuButton size="mini" type="info">右侧自定义 slot</DuButton>
        </template>
        <div>HELLO WORLD</div>
      </DuGroupCell>

      <DuGroupCell v-bind="args" title="标题" ext-style="margin-bottom: 2.66vw;" mode="collapse">
        <template #right>
          <DuButton size="mini" type="info">右侧自定义 slot</DuButton>
        </template>
        <div>非受控</div>
      </DuGroupCell>

      <DuGroupCell v-bind="args" title="标题" ext-style="margin-bottom: 2.66vw;" mode="collapse" open>
        <template #right>
          <DuButton size="mini" type="info">右侧自定义 slot</DuButton>
        </template>
        <div>受控</div>
      </DuGroupCell>
    </div>
  `,
})

export const Default = Template.bind({})

Default.args = {}
