import { expect, test } from 'vitest'
import DuButton from './Button.vue'
import { fromPlatte } from './platte'
import { mount } from '@vue/test-utils'

test('should render text', () => {
  const wrapper = mount(DuButton, {
    props: {
      text: 'Hello World',
    },
  })

  expect(wrapper.text()).toContain('Hello World')
})

test('should emit click event', () => {
  const wrapper = mount(DuButton, {
    props: {
      text: 'Hello World',
    },
  })

  wrapper.trigger('click')

  expect(wrapper.emitted('click')).toBeTruthy()
})

test('should not emit click event when disabled', () => {
  const wrapper = mount(DuButton, {
    props: {
      text: 'Hello World',
      disabled: true,
    },
  })

  wrapper.trigger('click')

  expect(wrapper.emitted('click')).toBeFalsy()
})

test('button from platte', () => {
  const ctx = {
    linjie: {
      vars: {
        'primary-bt-solid-bg': 'blue',
      },
    },
  }
  expect(fromPlatte('primary', ctx)).toEqual({
    name: `du-c-primary-bt`,
    vars: {
      'bt-solid-color': `primary-solid-color`,
      'bt-solid-bg': [`primary-bt-solid-bg`, `primary-solid-bg`],
      'bt-solid-disabledtemp-color': `primary-solid-disabledtemp-color`,
      'bt-solid-disabledtemp-bg': `primary-solid-disabledtemp-bg`,
      'bt-color': `primary-color`,
      'bt-soft-bg': `primary-soft-bg`,
      'bt-disabledtemp-color': `primary-disabledtemp-color`,
      'bt-soft-disabledtemp-bg': `primary-soft-disabledtemp-bg`,
      'bt-outline-color': `primary-outline-color`,
      'bt-border': `primary-border`,
      'bt-outline-disabledtemp-color': `primary-outline-disabledtemp-color`,
      'bt-disabledtemp-border': `primary-disabledtemp-border`,
      'bt-text-color': `primary-text-color`,
      'bt-text-disabledtemp-color': `primary-text-disabledtemp-color`,
    },
  })

  expect(fromPlatte('secondary', ctx)).toEqual({
    name: `du-c-secondary-bt`,
    vars: {
      'bt-solid-color': `secondary-solid-color`,
      'bt-solid-bg': `secondary-solid-bg`,
      'bt-solid-disabledtemp-color': `secondary-solid-disabledtemp-color`,
      'bt-solid-disabledtemp-bg': `secondary-solid-disabledtemp-bg`,
      'bt-color': `secondary-color`,
      'bt-soft-bg': `secondary-soft-bg`,
      'bt-disabledtemp-color': `secondary-disabledtemp-color`,
      'bt-soft-disabledtemp-bg': `secondary-soft-disabledtemp-bg`,
      'bt-outline-color': `secondary-outline-color`,
      'bt-border': `secondary-border`,
      'bt-outline-disabledtemp-color': `secondary-outline-disabledtemp-color`,
      'bt-disabledtemp-border': `secondary-disabledtemp-border`,
      'bt-text-color': `secondary-text-color`,
      'bt-text-disabledtemp-color': `secondary-text-disabledtemp-color`,
    },
  })
})
