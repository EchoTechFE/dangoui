import Vue from 'vue'
import VueCompositionApi from '@vue/composition-api'
import DuIcon from '@echoingtech/du-icon/src/Icon.vue'
import '@echoingtech/du-icon/src/iconfont.css'
import iconConfig from '@echoingtech/du-icon/src/iconfont-config.json'

import '@echoingtech/du-styles/styles/index.scss'
import './theme.scss'

Vue.use(VueCompositionApi)

export default {
  title: 'Icon',
  component: DuIcon,
  argTypes: {},
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { DuIcon },
  template: `
    <div>
      图标数量: ${Object.keys(iconConfig.icons).length}
      <div>
        <div style="display:flex;flex-wrap: wrap;">
          ${Object.keys(iconConfig.icons)
            .map((iconName) => {
              return ` <div
                style="width:25%;display:flex;flex-direction: column;align-items: center;justify-content: center;padding:12px 4px; overflow: hidden;box-sizing:border-box;word-break:break-all;"
              >
                <DuIcon name="${iconName}"></DuIcon>
                <div style="margin-top:6px;text-align:center">${iconName}</div>
              </div>`
            })
            .join('')}
        </div>
      </div>
    </div>
  `,
})

export const Default = Template.bind({})

Default.args = {}
