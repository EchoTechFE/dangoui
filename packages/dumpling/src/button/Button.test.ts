import { expect, test } from 'vitest'
import DuButton from './Button.vue'
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
