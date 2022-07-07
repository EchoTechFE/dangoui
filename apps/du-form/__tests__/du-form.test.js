import { mount } from '@vue/test-utils'

import { DuForm, DuFormItem } from '../src/index.js'

describe('@frontend/du-input', () => {
  it('test form info', async () => {
    const wrapper = mount({
      template: `
            <DuForm>
              <DuFormItem info="What's your problem?" />
            </DuForm>
          `,
      components: {
        DuForm,
        DuFormItem,
      },
    })

    wrapper.find('.du-form-item__label__info').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(DuFormItem).emitted().showInfo[0]).toEqual(["What's your problem?"])
  })
})
