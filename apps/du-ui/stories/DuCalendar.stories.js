import Vue from 'vue';
import VueCompositionApi from '@vue/composition-api';
import { DuCalendar } from '@echoingtech/du-calendar/src/index.js';
import ScrollView from '../components/ScrollView.vue';

import '@echoingtech/du-styles/styles/index.scss';

Vue.use(VueCompositionApi);
Vue.component('scroll-view', ScrollView);

export default {
  title: 'Calendar',
  component: DuCalendar,
  argTypes: {},
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