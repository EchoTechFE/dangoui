import Vue from 'vue'
import VueCompositionApi from '@vue/composition-api'
import DuButton from '@frontend/du-button/src/Button.vue'

import '@frontend/du-styles/styles/index.scss'
import './theme.scss'

Vue.use(VueCompositionApi)

export default {
  title: 'Button',
  component: DuButton,
  argTypes: {
    onClick: {
      action: 'click',
    },
  },
}

const TemplateAll = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { DuButton },
  template: `
    <div>
      <div>
        <h3>type:</h3>
        <p><DuButton v-bind="$props" type="primary" @click="onClick">primary</DuButton></p>
        <p><DuButton v-bind="$props" type="secondary" @click="onClick">secondary</DuButton></p>
        <p><DuButton v-bind="$props" type="recommend" @click="onClick">recommend</DuButton></p>
        <p><DuButton v-bind="$props" type="info" @click="onClick">info</DuButton></p>
        <p><DuButton v-bind="$props" type="text" @click="onClick">text</DuButton></p>
        <p><DuButton v-bind="$props" type="text-primary" @click="onClick">text-primary</DuButton></p>
        <p><DuButton v-bind="$props" disabled @click="onClick">disabled</DuButton></p>
        <p><DuButton v-bind="$props" type="text" disabled @click="onClick"> text disabled</DuButton></p>
      </div>

      <div>
        <h3>Size</h3>
        <p><DuButton v-bind="$props" size="large" @click="onClick">large</DuButton></p>
        <p><DuButton v-bind="$props" size="medium" @click="onClick">medium</DuButton></p>
        <p><DuButton v-bind="$props" size="normal" @click="onClick">normal</DuButton></p>
        <p><DuButton v-bind="$props" size="small" @click="onClick">small</DuButton></p>
        <p><DuButton v-bind="$props" size="mini" @click="onClick">mini</DuButton></p>
      </div>
      <div>
        <h3>Disabled</h3>
        <p><DuButton v-bind="$props" type="secondary" disabled @click="onClick">disabled</DuButton></p>
      </div>

      <div>
        <h3>arrowRight</h3>
        <p><DuButton v-bind="$props" arrowRight  @click="onClick">arrowRight</DuButton></p>
      </div>

      <div>
        <h3>Icon</h3>
        <p><DuButton v-bind="$props" type="secondary" loading @click="onClick">loading</DuButton></p>
        <p>
          <DuButton
            v-bind="$props"
            icon="https://cdn.qiandaoapp.com/admins/ad46c9877c13f283bd28bda924131d69.png"
            type="secondary"
            disabled
            @click="onClick"
          >
            url icon
          </DuButton>
        </p>
        <p>
          <DuButton v-bind="$props" icon="alarm" type="secondary" disabled @click="onClick">
            使用icon组件的name icon="alarm"
          </DuButton>
        </p>
        <p>
          <DuButton
            v-bind="$props"
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
        <DuButton v-bind="$props" size="normal" type="recommend" extStyle="width: 200px" @click="onClick">
          固定宽度200px
        </DuButton>
      </p>
      <p style="width: 300px">
        <DuButton v-bind="$props" size="normal" type="recommend" @click="onClick" full
          >撑满父容器300px</DuButton
        >
      </p>
      <p style="width: 300px; display: flex; height: 100px; align-items: center; justify-content: center">
        <DuButton v-bind="$props" size="normal" type="recommend" @click="onClick" full
          >撑满父容器flex300px</DuButton
        >
      </p>
      <p>
        <DuButton v-bind="$props" size="medium" type="primary" :extClass="['theme--pay']" @click="onClick">
          替换主题
        </DuButton>
      </p>
      <div>
        <h3>square:</h3>
        <p><DuButton v-bind="$props" square size="normal" @click="onClick">normal</DuButton></p>
      </div>
      <div style="background: #726B5C;color: #fff;">
        <h3>ghost:</h3>
        <p><DuButton v-bind="$props" ghost type="primary" @click="onClick">primary</DuButton></p>
        <p><DuButton v-bind="$props" ghost type="secondary" @click="onClick">secondary</DuButton></p>
        <p><DuButton v-bind="$props" ghost type="recommend" @click="onClick">recommend</DuButton></p>
        <p><DuButton v-bind="$props" ghost type="info" @click="onClick">info</DuButton></p>
        <p><DuButton v-bind="$props" ghost type="text" @click="onClick">text</DuButton></p>
        <p><DuButton v-bind="$props" type="text-primary" @click="onClick">text-primary</DuButton></p>
        <p><DuButton v-bind="$props" ghost type="info" disabled @click="onClick">disabled</DuButton></p>
        <p><DuButton v-bind="$props" ghost type="text" disabled @click="onClick">text disabled</DuButton></p>
      </div>
    </div>
  `,
})

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { DuButton },
  template: '<div><DuButton v-bind="$props"/></div> ',
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
