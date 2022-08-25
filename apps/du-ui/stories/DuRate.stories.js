import { DuRate } from '@frontend/du-rate/src/index.js'
import './theme.scss'

import '@frontend/du-styles/styles/index.scss'

export default {
  title: 'Rate',
  argTypes: {},
}

const Template = (args) => ({
  components: { DuRate },
  setup() {
    return { args }
  },
  template: `
    <DuRate rating="9" step="2"/>
  `,
})

export const Default = Template.bind({})

Default.args = {}
