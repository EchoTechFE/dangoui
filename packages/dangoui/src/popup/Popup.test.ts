import { afterEach, expect, test, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Popup from './Popup.vue'

const global = {
  stubs: {
    DuRootPortal: {
      template: '<div><slot /></div>',
    },
    DuIcon: true,
  },
}

const baseProps = {
  title: '',
  titleAlign: 'default' as const,
  headerVisible: true,
  type: 'center' as const,
  visible: false,
  extClass: '',
  extStyle: '',
  maskClick: true,
  closable: false,
  maskClass: '',
  maskStyle: '',
  disablePortal: false,
  safeArea: true,
  root: 'page' as const,
}

afterEach(() => {
  vi.useRealTimers()
})

test('locks content interactions while opening and closing', async () => {
  vi.useFakeTimers()

  const wrapper = mount(Popup, {
    props: {
      ...baseProps,
      visible: false,
    },
    slots: {
      default: '<button class="buy-button">Buy</button>',
    },
    global,
  })

  await wrapper.setProps({ visible: true })
  await nextTick()

  expect(wrapper.find('.du-popup__content').classes()).toContain(
    'du-popup__content--locked',
  )

  vi.advanceTimersByTime(100)
  await nextTick()

  expect(wrapper.find('.du-popup__content').classes()).toContain(
    'du-popup__content--locked',
  )
  expect(wrapper.find('.du-popup__content').classes()).toContain(
    'du-popup--center-open',
  )

  vi.advanceTimersByTime(300)
  await nextTick()

  expect(wrapper.find('.du-popup__content').classes()).not.toContain(
    'du-popup__content--locked',
  )

  await wrapper.setProps({ visible: false })
  await nextTick()

  expect(wrapper.find('.du-popup__content').classes()).toContain(
    'du-popup__content--locked',
  )

  vi.advanceTimersByTime(399)
  await nextTick()

  expect(wrapper.find('.du-popup').exists()).toBe(true)

  vi.advanceTimersByTime(1)
  await nextTick()

  expect(wrapper.find('.du-popup').exists()).toBe(false)
})

test('ignores mask clicks while transition guard is active', async () => {
  vi.useFakeTimers()

  const wrapper = mount(Popup, {
    props: {
      ...baseProps,
      visible: false,
      maskClick: true,
    },
    global,
  })

  await wrapper.setProps({ visible: true })
  await nextTick()

  await wrapper.find('.du-popup__mask').trigger('click')

  expect(wrapper.emitted('update:visible')).toBeFalsy()
  expect(wrapper.emitted('close')).toBeFalsy()

  vi.advanceTimersByTime(400)
  await nextTick()

  await wrapper.find('.du-popup__mask').trigger('click')

  expect(wrapper.emitted('update:visible')).toEqual([[false]])
  expect(wrapper.emitted('close')).toEqual([[]])
})
