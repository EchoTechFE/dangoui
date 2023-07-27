import { DuCalendar } from '@frontend/du-calendar/src/index.js'
import ScrollView from '../components/ScrollView.vue'
import DuButton from '@frontend/du-button/src/Button.vue'

import '@frontend/du-styles/styles/index.scss'
import './theme.scss'

export default {
  title: 'Calendar',
  component: DuCalendar,
  argTypes: {},
}

const Template = (args) => ({
  components: { DuCalendar, DuButton },
  setup() {
    return { args }
  },
  data() {
    return {
      singleVisible: false,
      multipleVisible: false,
      rangeVisible: false,
      calendarType: 'single',
      defaultDateSingle: new Date(),
      minSelectDate: new Date('2021-10-21'),
      maxSelectDate: new Date('2022-04-20'),
      defaultDateArray: [
        new Date('2021-10-21'),
        new Date('2022-01-15'),
        new Date('2022-01-20'),
        new Date('2022-01-29'),
        new Date('2022-02-16'),
        new Date(),
        new Date('2022-03-20'),
        new Date('2022-04-20'),
      ],
      defaultRangeArray: [new Date('2023-07-27'), new Date('2023-07-30')],
    }
  },
  template: `
    <div>
      <div style="display: flex;flex-direction: column;justify-content: center;align-items: center;margin-bottom: 20px;">
        <DuButton @click="handleSingleOpen">单选</DuButton>
        <div>单选日期为：{{ defaultDateSingle }}</div>
        <DuCalendar
          type="single"
          :visible="singleVisible"
          :selectedDate="defaultDateSingle"
          @close="handleClose"
          @confirm="handleSingleConfirm"
        />
      </div>
      <div style="display: flex;flex-direction: column;justify-content: center;align-items: center;">
        <DuButton @click="handleMultipleOpen">多选</DuButton>
        <div>多选日期数为：{{ defaultDateArray.length }}个</div>
        <DuCalendar
          type="multiple"
          :minDate="minSelectDate"
          :maxDate="maxSelectDate"
          :visible="multipleVisible"
          :selectedDate="defaultDateArray"
          @close="handleClose"
          @confirm="handleMultipleConfirm"
        />
      </div>
      <div style="display: flex;flex-direction: column;justify-content: center;align-items: center;">
      <DuButton @click="handleRangeOpen">范围</DuButton>
      <div>多选日期数为：{{ rangeDateArray }}</div>
      <DuCalendar
        type="range"
        :visible="rangeVisible"
        :selectedDate="defaultRangeArray"
        @close="handleClose"
        @confirm="handleRangeConfirm"
      />
    </div>
    </div>
  `,
  methods: {
    handleSingleOpen(type) {
      this.singleVisible = true
    },
    handleMultipleOpen(type) {
      this.multipleVisible = true
    },
    handleRangeOpen() {
      this.rangeVisible = true
    },
    handleClose() {
      this.singleVisible = false
      this.multipleVisible = false
      this.rangeVisible = false
    },
    handleSingleConfirm(val) {
      this.defaultDateSingle = val.value
      this.singleVisible = false
    },
    handleMultipleConfirm(val) {
      this.defaultDateArray = [...val.value]
      this.multipleVisible = false
    },
    handleRangeConfirm(val) {
      this.rangeDateArray = [...val.value]
      this.rangeVisible = false
    },
  },
})

export const Default = Template.bind({})

Default.args = {}
