import Vue from 'vue';
import VueCompositionApi from '@vue/composition-api';
import { DuSteps } from '@echoingtech/du-steps/src/index.js';
import './theme.scss';

import '@echoingtech/du-styles/styles/index.scss';

Vue.use(VueCompositionApi);

export default {
  title: 'Step',
  argTypes: {},
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { DuSteps },
  template: `
    <div style="margin-top: 18px; background: #fff;">
      <DuSteps v-bind="$props" />
    </div>
  `,
});

export const Default = Template.bind({});

Default.args = {
  steps: [
    { title: '等待支付' },
    { title: '等待卖家发货' },
    { title: '已发货' },
    { title: '送货中' },
    { title: '已到货' },
  ],
  status: 'success',
  activeIndex: 1,
  type: 'default',
  extStyle: {},
};

const OpacityTemplate = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { DuSteps },
  template: `
    <div style="margin-top: 18px; background: var(--color-main);">
      <DuSteps v-bind="$props" />
    </div>
  `,
});

export const Ghost = OpacityTemplate.bind({});

Ghost.args = {
  steps: [
    { title: '等待支付' },
    { title: '等待卖家发货' },
    { title: '已发货' },
    { title: '已到货' },
  ],
  activeIndex: 2,
  type: 'ghost',
};
