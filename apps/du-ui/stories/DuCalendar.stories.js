import Vue from 'vue';
import VueCompositionApi from '@vue/composition-api';
import { DuCalendar } from '@echoingtech/du-calendar/src/index.js';
import ScrollView from '../components/ScrollView.vue';
import  DuButton from '@echoingtech/du-button/src/Button.vue'

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
  components: { DuCalendar, DuButton },
  data() {
    return {
      singleVisible: false,
      multipleVisible: false,
      calendarType: 'single',
      defaultDateSingle: new Date(),
      defaultDateArray: [
        new Date('2021-11-21'), new Date('2022-01-15'), new Date('2022-01-20'),
        new Date('2022-01-29'), new Date('2022-02-16'), new Date(),
        new Date('2022-03-27'), new Date('2022-04-23'), 
      ],
      singleResult: null,
      multipleResult: [],
    }
  },
  template: `
    <div>
      <div style="display: flex;flex-direction: column;justify-content: center;align-items: center;margin-bottom: 20px;">
        <DuButton @click="handleSingleOpen">单选</DuButton>
        <div>单选日期为：{{ singleResult }}</div>
        <DuCalendar type="single" :visible="singleVisible" :defaultDate="defaultDateSingle" @close="handleClose" @confirm="handleSingleConfirm" />
      </div>
      <div style="display: flex;flex-direction: column;justify-content: center;align-items: center;">
        <DuButton @click="handleMultipleOpen">多选</DuButton>
        <div>多选日期数为：{{ multipleResult.length }}个</div>
        <DuCalendar type="multiple" :visible="multipleVisible" :defaultDate="defaultDateArray" @close="handleClose" @confirm="handleMultipleConfirm" />
      </div>
    </div>
  `,
  methods: {
    handleSingleOpen(type) {
      this.singleVisible = true;
    },
    handleMultipleOpen(type) {
      this.multipleVisible = true;
    },
    handleClose() {
      this.singleVisible = false
      this.multipleVisible = false
    },
    handleSingleConfirm(val) {
      this.singleResult = val.value
      this.singleVisible = false
    },
    handleMultipleConfirm(val) {
      this.multipleResult = [...val.value]
      console.log('Multiple:', this.multipleResult);
      this.multipleVisible = false
    },
  },
});

export const Default = Template.bind({});

Default.args = {};