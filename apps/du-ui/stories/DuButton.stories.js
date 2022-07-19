import DuButton from '@frontend/du-button/src/Button.vue'

import '@frontend/du-styles/styles/index.scss'
import './theme.scss'

export default {
  title: 'Button',
  component: DuButton,
  argTypes: {
    onClick: {
      action: 'click',
    },
  },
}

const TemplateAll = (args) => ({
  components: { DuButton },
  setup() {
    return { args }
  },
  template: `
    <div>
      <div>
        <h3>type:</h3>
        <p><DuButton v-bind="args" type="primary" @click="onClick">primary</DuButton></p>
        <p><DuButton v-bind="args" type="secondary" @click="onClick">secondary</DuButton></p>
        <p><DuButton v-bind="args" type="recommend" @click="onClick">recommend</DuButton></p>
        <p><DuButton v-bind="args" type="info" @click="onClick">info</DuButton></p>
        <p><DuButton v-bind="args" type="text" @click="onClick">text</DuButton></p>
        <p><DuButton v-bind="args" type="text-primary" @click="onClick">text-primary</DuButton></p>
        <p><DuButton v-bind="args" disabled @click="onClick">disabled</DuButton></p>
        <p><DuButton v-bind="args" type="text" disabled @click="onClick"> text disabled</DuButton></p>
      </div>

      <div>
        <h3>Size</h3>
        <p><DuButton v-bind="args" size="large" @click="onClick">large</DuButton></p>
        <p><DuButton v-bind="args" size="medium" @click="onClick">medium</DuButton></p>
        <p><DuButton v-bind="args" size="normal" @click="onClick">normal</DuButton></p>
        <p><DuButton v-bind="args" size="small" @click="onClick">small</DuButton></p>
        <p><DuButton v-bind="args" size="mini" @click="onClick">mini</DuButton></p>
      </div>
      <div>
        <h3>Disabled</h3>
        <p><DuButton v-bind="args" type="secondary" disabled @click="onClick">disabled</DuButton></p>
      </div>

      <div>
        <h3>arrowRight</h3>
        <p><DuButton v-bind="args" arrowRight  @click="onClick">arrowRight</DuButton></p>
      </div>

      <div>
        <h3>Icon</h3>
        <p><DuButton v-bind="args" type="secondary" loading @click="onClick">loading</DuButton></p>
        <p>
          <DuButton
            v-bind="args"
            icon="https://cdn.qiandaoapp.com/admins/ad46c9877c13f283bd28bda924131d69.png"
            type="secondary"
            disabled
            @click="onClick"
          >
            url icon
          </DuButton>
        </p>
        <p>
          <DuButton v-bind="args" icon="alarm" type="secondary" disabled @click="onClick">
            使用icon组件的name icon="alarm"
          </DuButton>
        </p>
        <p>
          <DuButton
            v-bind="args"
            icon="alarm"
            iconPosition="right"
            type="secondary"
            disabled
            @click="onClick"
          >
            iconPosition="right"
          </DuButton>
        </p>
      </div>
      <p>
        <DuButton v-bind="args" size="normal" type="recommend" extStyle="width: 200px" @click="onClick">
          固定宽度200px
        </DuButton>
      </p>
      <p style="width: 300px">
        <DuButton v-bind="args" size="normal" type="recommend" @click="onClick" full
          >撑满父容器300px</DuButton
        >
      </p>
      <p style="width: 300px; display: flex; height: 100px; align-items: center; justify-content: center">
        <DuButton v-bind="args" size="normal" type="recommend" @click="onClick" full
          >撑满父容器flex300px</DuButton
        >
      </p>
      <p>
        <DuButton v-bind="args" size="medium" type="primary" :extClass="['theme--pay']" @click="onClick">
          替换主题
        </DuButton>
      </p>
      <div>
        <h3>square:</h3>
        <p><DuButton v-bind="args" square size="normal" @click="onClick">normal</DuButton></p>
        <p><DuButton v-bind="args" square size="mini" @click="onClick">normal</DuButton></p>
      </div>
      <div style="background: #726B5C;color: #fff;">
        <h3>ghost:</h3>
        <p><DuButton v-bind="args" ghost type="primary" @click="onClick">primary</DuButton></p>
        <p><DuButton v-bind="args" ghost type="secondary" @click="onClick">secondary</DuButton></p>
        <p><DuButton v-bind="args" ghost type="recommend" @click="onClick">recommend</DuButton></p>
        <p><DuButton v-bind="args" ghost type="info" @click="onClick">info</DuButton></p>
        <p><DuButton v-bind="args" ghost type="text" @click="onClick">text</DuButton></p>
        <p><DuButton v-bind="args" type="text-primary" @click="onClick">text-primary</DuButton></p>
        <p><DuButton v-bind="args" ghost type="info" disabled @click="onClick">disabled</DuButton></p>
        <p><DuButton v-bind="args" ghost type="text" disabled @click="onClick">text disabled</DuButton></p>
      </div>
    </div>
  `,
})

const Template = (args) => ({
  setup() {
    return { args }
  },
  components: { DuButton },
  template: '<div><DuButton v-bind="args"/></div> ',
})

export const Default = TemplateAll.bind({})

Default.args = {
  text: '自动宽度',
  //   icon:
  //     'https://cdn.qiandaoapp.com/admins/ad46c9877c13f283bd28bda924131d69.png',
}

export const TypePrimary = Template.bind({})

TypePrimary.args = {
  text: 'button',
  type: 'primary',
}
