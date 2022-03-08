import Vue from 'vue';
import VueCompositionApi from '@vue/composition-api';
import DuInput from '@echoingtech/du-input/src/Input.vue';

import '@echoingtech/du-styles/styles/index.scss';

Vue.use(VueCompositionApi);

export default {
  title: 'Input',
  component: DuInput,
  argTypes: {
    onClick: {
      action: 'click',
    },
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { DuInput },
  template: `
    <div>
      <DuInput v-bind="$props" />
      <div style="height: 10px" />
      <DuInput value="被禁用了哦" disabled/>
      <div style="height: 10px" />
      <DuInput placeholder="placeholder样式红色" extStyle="--du-input-placeholder-color: red;"/>
    </div>

  `,
});

export const Default = Template.bind({});

Default.args = {
  placeholder: '请输入金额',
  inputAlign: 'right',
  trim: true,
  prefix: '￥',
  suffix: '精确到整数',
};
