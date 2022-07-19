import DuIcon from '@frontend/du-icon/src/Icon.vue'
import '@frontend/du-icon/src/iconfont.css'
import iconConfig from '@frontend/du-icon/src/iconfont-config.json'

import '@frontend/du-styles/styles/index.scss'
import './theme.scss'

export default {
  title: 'Icon',
  component: DuIcon,
  argTypes: {},
}

const Template = (args) => ({
  components: { DuIcon },
  setup() {
    return { args }
  },
  template: `
    <div>
      <div style="margin-bottom: 16px;">
        <DuIcon v-bind="args"></DuIcon>
      </div>
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
        <div style="padding-top: 24px;">通过 color 属性可以调整颜色</div>
        <div style="display:flex;flex-wrap: wrap;">
        ${Object.keys(iconConfig.icons)
          .map((iconName) => {
            return ` <div
              style="width:25%;display:flex;flex-direction: column;align-items: center;justify-content: center;padding:12px 4px; overflow: hidden;box-sizing:border-box;word-break:break-all;"
            >
              <DuIcon name="${iconName}" extStyle="color:var(--color-main);"></DuIcon>
              <div style="margin-top:6px;text-align:center">${iconName}</div>
            </div>`
          })
          .join('')}
        </div>
        <div style="padding-top: 24px;">可以用带下划线的名字</div>
        <div style="display:flex;flex-wrap: wrap;">
          <DuIcon name="arrow_right"></DuIcon>
          <DuIcon name="video-play" extStyle="color:var(--color-main);"></DuIcon>
        </div>
      </div>
    </div>
  `,
})

export const Default = Template.bind({})

Default.args = {
  name: 'wechat-circle-filled',
  extClass: [],
  extStyle: '',
  size: '64px',
  color: 'var(--du-color-main)',
}
