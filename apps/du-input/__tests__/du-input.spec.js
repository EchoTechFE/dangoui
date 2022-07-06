import { shallowMount } from '@vue/test-utils'

import Vue from 'vue'

import { DuInput } from '../src/index.js'

describe('@frontend/du-input', () => {
  it('test input hello', async () => {
    const wrapper = shallowMount(DuInput)

    wrapper.find('input').element.value = 'hello'
    wrapper.find('input').trigger('input')

    await wrapper.vm.$nextTick()

    expect(wrapper.emitted().input).toBeTruthy()
    expect(wrapper.emitted().change).toBeTruthy()
    expect(wrapper.emitted().input.length).toBe(1)
    expect(wrapper.emitted().change.length).toBe(1)
    expect(wrapper.emitted().input[0]).toEqual(['hello'])
    expect(wrapper.emitted().change[0]).toEqual(['hello'])
  })

  it('test input trim', async () => {
    async function check(wrapper) {
      wrapper.find('input').element.value = ' hello '
      wrapper.find('input').trigger('input')

      await wrapper.vm.$nextTick()

      expect(wrapper.emitted().input.length).toBe(1)
      expect(wrapper.emitted().change.length).toBe(1)
      expect(wrapper.emitted().input[0]).toEqual(['hello'])
      expect(wrapper.emitted().change[0]).toEqual(['hello'])
    }
    await check(
      shallowMount(DuInput, {
        propsData: {
          trim: true,
        },
      }),
    )

    await check(
      shallowMount(DuInput, {
        propsData: {
          options: {
            trim: true,
          },
        },
      }),
    )
  })

  it('test input prefix and suffix', async () => {
    async function check(wrapper) {
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.du-input__prefix').text()).toEqual('￥')
      expect(wrapper.find('.du-input__suffix').text()).toEqual('整数')
    }
    await check(
      shallowMount(DuInput, {
        propsData: {
          prefix: '￥',
          suffix: '整数',
        },
      }),
    )

    await check(
      shallowMount(DuInput, {
        propsData: {
          options: {
            prefix: '￥',
            suffix: '整数',
          },
        },
      }),
    )
  })

  it('test input disabled', async () => {
    async function check(wrapper) {
      wrapper.find('input').element.value = '123'
      wrapper.find('input').trigger('input')
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted().input).toBeFalsy()
      expect(wrapper.emitted().change).toBeFalsy()
    }
    await check(
      shallowMount(DuInput, {
        propsData: {
          disabled: true,
        },
      }),
    )

    await check(
      shallowMount(DuInput, {
        propsData: {
          options: {
            disabled: true,
          },
        },
      }),
    )
  })

  //   todo: 测试不了focus
  //   it('test input focus', async () => {
  //     const wrapper = shallowMount(DuInput, {
  //       propsData: {
  //         autofocus: true,
  //       },
  //     })
  //     await wrapper.vm.$nextTick()
  //     expect(wrapper.emitted().focus).toBeTruthy()
  //   })
})
