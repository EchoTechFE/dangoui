import { shallowMount } from '@vue/test-utils'

import CompositionApi from '@vue/composition-api'
import Vue from 'vue'

import { DuEmpty } from '../src/index.js'

Vue.use(CompositionApi)

describe('@frontend/du-empty', () => {
  it('test empty', () => {
    const el = shallowMount(DuEmpty, {
      propsData: {
        image: 'success',
        text: '操作成功',
      },
    })
    expect(el.find('.du-empty__img').attributes('src')).toBe(
      'https://cdn.qiandaoapp.com/admins/c5725e0cceb165232a7e7544302bb919.png',
    )
    expect(el.find('.du-empty__text').text()).toBe('操作成功')
  })
})
