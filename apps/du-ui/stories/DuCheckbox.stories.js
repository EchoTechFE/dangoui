import Vue from 'vue'
import VueCompositionApi from '@vue/composition-api'
import { DuCheckbox, DuCheckboxGroup } from '@frontend/du-checkbox/src/index.js'

import '@frontend/du-styles/styles/index.scss'

Vue.use(VueCompositionApi)

export default {
  title: 'Checkbox',
  argTypes: {
    onClick: {
      action: 'click',
    },
  },
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { DuCheckbox, DuCheckboxGroup },
  data() {
    return {
      fruitGroupValue: [],

      wearGroupValue: [],

      options: [
        { label: 'ip5', value: 3000 },
        { label: 'ip6', value: 4000 },
        { label: 'ip7', value: 5000, disabled: true },
      ],
      optionsGroupValue: [],

      singleCheckboxValue: '',

      singleStyle: {
        padding: '20px',
        margin: '20px',
      },
    }
  },
  methods: {
    onCheckboxClick(value) {
      console.log('checkboxValue is', value)
    },
    onGroupInput(value) {
      console.log('groupValue is', value)
    },
  },
  template: `
    <div>
      <div>
        <h3>多选组合</h3>
        <du-checkbox-group  v-model="fruitGroupValue" @input="onGroupInput">
          <du-checkbox label="apple" >苹果</du-checkbox>
          <du-checkbox label="banana">香蕉</du-checkbox>
          <du-checkbox label="orange" >橘子</du-checkbox>
        </du-checkbox-group>
      </div>

      <div>
        <h3>多选组合</h3>
        <du-checkbox-group  v-model="wearGroupValue" inline shape="square" >
          <du-checkbox label="衬衫" value="shirt" />
          <du-checkbox  position="left" value="trousers" />
          <du-checkbox label="大衣" value="coat" />
        </du-checkbox-group>
      </div>
      
      <div>
        <h3>使用options生成的checkbox</h3>
        <du-checkbox-group :options="options" v-model="optionsGroupValue" position="left" />
      </div>
      
      
      <div>
        <h3>单个多选</h3>
        <du-checkbox :ext-style="singleStyle"  label="single-check" :value="singleCheckboxValue" @click="onCheckboxClick" >
          这是单个多选器
        </du-checkbox>
      </div>
      
    </div>
  `,
})

export const Default = Template.bind({})

Default.args = {}
