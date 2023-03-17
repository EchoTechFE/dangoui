import { mount } from '@vue/test-utils'

import { ref } from 'vue'

import { DuCheckbox, DuCheckboxGroup } from '../src/index.js'

describe('@frontend/du-checkbox checkbox', () => {
  const checkboxWrapperFactory = (values) =>
    mount(DuCheckbox, {
      data() {
        return {
          ...values,
        }
      },
    })

  it('click to switch true & false', async () => {
    const wrapper = mount({
      template: `
        <div>
          <du-checkbox v-model:value="checkStatus"></du-checkbox>
        </div>
      `,
      components: {
        DuCheckbox,
      },
      data() {
        return {
          checkStatus: false,
        }
      },
    })

    const checkboxComp = wrapper.find('.du-checkbox')

    await checkboxComp.trigger('click')
    expect(wrapper.vm.checkStatus).toBe(true)
    await checkboxComp.trigger('click')
    expect(wrapper.vm.checkStatus).toBe(false)
  })

  it('emit property value ', async () => {
    const wrapper = checkboxWrapperFactory()
    const checkboxComp = wrapper.find('.du-checkbox')

    await checkboxComp.trigger('click')

    expect(wrapper.emitted().click[0]).toEqual([true])
    expect(wrapper.emitted().input[0]).toEqual([true])
  })
})

describe('@frontend/du-checkbox with du-checkbox-group', () => {
  it('test DuRadioGroup v-model disabled', async () => {
    const wrapper = mount({
      template: `
          <du-checkbox-group v-model:value="checkboxGroupValue">
              <du-checkbox inline value="Jack">Jack</du-checkbox>
              <du-checkbox value="Queen">Queen</du-checkbox>
              <du-checkbox value="King" disabled>King</du-checkbox>
          </du-checkbox-group>
        `,
      components: {
        DuCheckbox,
        DuCheckboxGroup,
      },
      setup() {
        return {
          checkboxGroupValue: [],
        }
      },
    })
    const [c1, c2, c3] = wrapper.findAllComponents(DuCheckbox)
    await c1.trigger('click')
    await c1.trigger('click')
    await c2.trigger('click')
    await c3.trigger('click')
    expect(wrapper.vm.checkboxGroupValue).toEqual(['Queen'])
  })

  it('test option generate checkboxGroup', async () => {
    const wrapper = mount(DuCheckboxGroup, {
      propsData: {
        options: [
          { label: '红色', value: 'red' },
          { label: '绿色', value: 'green', disabled: true },
          { label: '蓝色', value: 'blue' },
        ],
        'v-model': ref([]),
      },
    })

    await wrapper.vm.$nextTick()
    const [c1, c2, c3] = wrapper.findAllComponents(DuCheckbox)

    expect(c1.text()).toBe('红色')

    await c2.trigger('click')

    await c3.trigger('click')

    expect(wrapper.emitted()['update:value'][0]).toEqual([['blue']])
  })
})
