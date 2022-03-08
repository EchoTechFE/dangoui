import Vue from 'vue';
import VueCompositionApi from '@vue/composition-api';
import DuButton from '@echoingtech/du-button/src/Button.vue';

import '@echoingtech/du-styles/styles/index.scss';
import './theme.scss';

Vue.use(VueCompositionApi);

export default {
  title: 'Button',
  component: DuButton,
  argTypes: {
    onClick: {
      action: 'click',
    },
  },
};

const TemplateAll = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { DuButton },
  template: `
    <div>
      <div>
        type:
        <DuButton v-bind="$props" type="primary" @click="onClick"
          >primary</DuButton
        >
        <DuButton v-bind="$props" type="secondary" @click="onClick"
          >secondary</DuButton
        >
        <DuButton v-bind="$props" type="recommend" @click="onClick"
          >recommend</DuButton
        >
        <DuButton v-bind="$props" type="info" @click="onClick">info</DuButton>
        <DuButton v-bind="$props" type="text" @click="onClick">text</DuButton>
        <DuButton v-bind="$props" type="text-primary" @click="onClick"
          >text-primary</DuButton
        >
        <DuButton v-bind="$props" disabled @click="onClick">disabled</DuButton>
        <DuButton v-bind="$props" type="text" disabled @click="onClick">
          text disabled</DuButton
        >
      </div>

      <div>
        size:
        <DuButton v-bind="$props" size="large" @click="onClick">large</DuButton>
        <DuButton v-bind="$props" size="medium" @click="onClick"
          >medium</DuButton
        >
        <DuButton v-bind="$props" size="normal" @click="onClick"
          >normal</DuButton
        >
        <DuButton v-bind="$props" size="small" @click="onClick">small</DuButton>
        <DuButton v-bind="$props" size="mini" @click="onClick">mini</DuButton>
      </div>
      <div>
        <DuButton v-bind="$props" type="secondary" loading @click="onClick"
          >loading</DuButton
        >
        <DuButton v-bind="$props" type="secondary" disabled @click="onClick"
          >disabled</DuButton
        >
        <DuButton
          v-bind="$props"
          icon="https://cdn.qiandaoapp.com/admins/ad46c9877c13f283bd28bda924131d69.png"
          type="secondary"
          disabled
          @click="onClick"
        >
          icon
        </DuButton>
      </div>
      <div>
        <DuButton
          v-bind="$props"
          size="normal"
          type="recommend"
          extStyle="width: 200px"
          @click="onClick"
        >
          固定宽度200px
        </DuButton>
      </div>
      <div style="width: 300px">
        <DuButton
          v-bind="$props"
          size="normal"
          type="recommend"
          @click="onClick"
          full
          >撑满父容器300px</DuButton
        >
      </div>
      <div
        style="width: 300px; display: flex; height: 50px; align-items: center; justify-content: center"
      >
        <DuButton
          v-bind="$props"
          size="normal"
          type="recommend"
          @click="onClick"
          full
          >撑满父容器flex300px</DuButton
        >
      </div>
      <div>
        <DuButton
          v-bind="$props"
          size="medium"
          type="primary"
          :extClass="['theme--pay']"
          @click="onClick"
        >
          替换主题
        </DuButton>
      </div>
      <div>
      square:
        <DuButton v-bind="$props" square size="large" @click="onClick"
          >large</DuButton
        >
        <DuButton v-bind="$props" square size="medium" @click="onClick"
          >medium</DuButton
        >
        <DuButton v-bind="$props" square size="normal" @click="onClick"
          >normal</DuButton
        >
        <DuButton v-bind="$props" square size="small" @click="onClick"
          >small</DuButton
        >
        <DuButton v-bind="$props" square size="mini" @click="onClick"
          >mini</DuButton
        >
      </div>
      <div style="background: #726B5C;color: #fff;">
        <div>
          ghost:
          <DuButton v-bind="$props" ghost type="primary" @click="onClick"
            >primary</DuButton
          >
          <DuButton v-bind="$props" ghost type="secondary" @click="onClick"
            >secondary</DuButton
          >
          <DuButton v-bind="$props" ghost type="recommend" @click="onClick"
            >recommend</DuButton
          >
          <DuButton v-bind="$props" ghost type="info" @click="onClick"
            >info</DuButton
          >
          <DuButton v-bind="$props" ghost type="text" @click="onClick"
            >text</DuButton
          >
          <DuButton v-bind="$props" type="text-primary" @click="onClick"
            >text-primary</DuButton
          >
          <DuButton v-bind="$props" ghost type="info" disabled @click="onClick"
            >disabled</DuButton
          >
          <DuButton v-bind="$props" ghost type="text" disabled @click="onClick"
            >text disabled</DuButton
          >
        </div>
      </div>
    </div>
  `,
});

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { DuButton },
  template: '<div><DuButton v-bind="$props"/></div> ',
});

export const Default = TemplateAll.bind({});

Default.args = {
  text: '自动宽度',
  //   icon:
  //     'https://cdn.qiandaoapp.com/admins/ad46c9877c13f283bd28bda924131d69.png',
};

export const TypePrimary = Template.bind({});

TypePrimary.args = {
  text: 'button',
  type: 'primary',
};
