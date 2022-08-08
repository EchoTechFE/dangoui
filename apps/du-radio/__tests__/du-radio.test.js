import { shallowMount, mount } from '@vue/test-utils'

import Vue from 'vue'

import { DuRadio, DuRadioGroup } from '../src/index.js'

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
    expect(wrapper.vm.checked).toStrictEqual(false)
  })
})

describe('@frontend/du-radio DuRadio with DuRadioGroup', () => {
  it('test DuRadioGroup', async () => {
    const wrapper = mount({
      template: `
          <DuRadioGroup :options="groupConfig" v-model:value="value">
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
    const [radio1, radio2] = wrapper.findAllComponents(DuRadio)
    await wrapper.vm.$nextTick()
    expect(radio2.vm.checked).toBe(true)
    radio1.trigger('click')
    await wrapper.vm.$nextTick()
    expect(radio1.vm.checked).toBe(true)
    expect(radio2.vm.checked).toBe(false)
  })

  it('test radio with labelKey', async () => {
    const wrapper = mount({
      template: `
            <DuRadioGroup v-model:value="value">
                <DuRadio v-for="i in options" :key="i.id" :label="i" labelKey="id">{{i.name}}</DuRadio>
            </DuRadioGroup>
          `,
      components: {
        DuRadio,
        DuRadioGroup,
      },
      setup() {
        return {
          value: {
            id: '1',
            name: '',
          },
          groupConfig: {
            cancel: true,
          },
          options: [
            {
              id: '1',
              name: 'lbb',
            },
            {
              id: '2',
              name: 'lbb_fake',
            },
          ],
        }
      },
    })
    const [radio1, radio2] = wrapper.findAllComponents(DuRadio)
    await wrapper.vm.$nextTick()
    expect(radio1.vm.checked).toBe(true)
    radio2.trigger('click')
    await wrapper.vm.$nextTick()
    expect(radio1.vm.checked).toBe(false)
    expect(radio2.vm.checked).toBe(true)
    console.log(wrapper.value)
  })
})
