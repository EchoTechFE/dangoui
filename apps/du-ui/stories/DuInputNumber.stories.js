import Vue from 'vue';
import VueCompositionApi from '@vue/composition-api';
import { DuInputNumber } from '@echoingtech/du-input-number/src/index.js';

import '@echoingtech/du-styles/styles/index.scss';

Vue.use(VueCompositionApi);

export default {
  title: 'InputNumber',
  component: DuInputNumber,
  argTypes: {
    onChange: { action: 'changed' },
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { DuInputNumber },
  template: `
    <div>
      <div>
      step: 0.5
        <DuInputNumber :min="-1" :max="5" :step="0.5" @input="onChange" />
      </div>
      <div style="margin-top: 20px">
        <DuInputNumber :min="0" :max="5" input  @change="onChange"  inputPrefix="$"/>
      </div>
      <div style="margin-top: 20px">
        <DuInputNumber :min="0" :max="5" input @change="onChange" />
      </div>
    </div>
  `,
});

export const Default = Template.bind({});

Default.args = {};
