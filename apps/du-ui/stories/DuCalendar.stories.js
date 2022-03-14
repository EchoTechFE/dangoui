import Vue from 'vue';
import VueCompositionApi from '@vue/composition-api';
import { DuCalendar } from '@echoingtech/du-calendar/src/index.js';

import '@echoingtech/du-styles/styles/index.scss';

Vue.use(VueCompositionApi);

export default {
  title: 'Calendar',
  component: DuCalendar,
  argTypes: {
    onClick: { action: 'click' },
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { DuCalendar },
  template: `
    <div>
      <DuCalendar />
    </div>
  `,
});

export const Default = Template.bind({});

Default.args = {};