import { shallowMount, mount } from '@vue/test-utils'

import CompositionApi from '@vue/composition-api'
import Vue from 'vue'

import { DuRadio, DuRadioGroup } from '../src/index.js'

Vue.use(CompositionApi)

describe('@frontend/du-radio DuRadio', () => {
  it('test radio', async () => {
    const wrapper = shallowMount(DuRadio)
    wrapper.find('.du-radio').trigger('click')
    wrapper.find('.du-radio').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted().click.length).toBe(2)
    expect(wrapper.emitted().input.length).toBe(2)
    expect(wrapper.emitted().input[0]).toStrictEqual([true])
  })

  it('test radio allow cancel', async () => {
    const wrapper = shallowMount(DuRadio, {
      propsData: {
        cancel: true,
      },
    })
    wrapper.find('.du-radio').trigger('click')
    wrapper.find('.du-radio').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted().click.length).toBe(2)
    expect(wrapper.emitted().input.length).toBe(2)
    expect(wrapper.emitted().input[0]).toStrictEqual([true])
    expect(wrapper.emitted().input[1]).toStrictEqual([false])
    expect(wrapper.vm.$data.isSelected).toStrictEqual(false)
  })
})

describe('@frontend/du-radio DuRadio with DuRadioGroup', () => {
  it('test DuRadioGroup', async () => {
    const wrapper = mount({
      template: `
          <DuRadioGroup :options="groupConfig" v-model="value">
            <div>
              <DuRadio label="lbb_fake" :options="lbbRadioConfig" />
              <DuRadio>no label</DuRadio>
            </div>
          </DuRadioGroup>
        `,
      components: {
        DuRadio,
        DuRadioGroup,
      },
      setup() {
        return {
          value: true,
          groupConfig: {
            cancel: true,
          },
          lbbRadioConfig: {
            label: 'lbb',
          },
        }
      },
    })
    const [radio1, radio2] = wrapper.findAllComponents(DuRadio).wrappers
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    expect(radio2.vm.$data.isSelected).toBe(true)
    radio1.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.$data.value).toBe('lbb')
    expect(radio1.vm.$data.isSelected).toBe(true)
    expect(radio2.vm.$data.isSelected).toBe(false)
  })
})
