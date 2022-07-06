import { DuForm, DuFormItem } from '@frontend/du-form/src/index.js';
import { DuInput } from '@frontend/du-input';

import '@frontend/du-styles/styles/index.scss';

export default {
  title: 'Form',
  component: DuInput,
  argTypes: {
    onClick: {
      action: 'click',
    },
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { DuForm, DuFormItem, DuInput },
  template: `
    <div>
      <DuForm>
        <DuFormItem label="价格：" info required tips="金额不能小于5元">
          <DuInput
            v-bind="$props"
            placeholder="请输入金额"
            :trim="true"
            prefix="￥"
            suffix="精确到整数"
          />
        </DuFormItem>
        <DuFormItem
          label="价格："
          info
          required
          slotNextLine
          tips="金额不能小于5元"
        >
          <DuInput
            v-bind="$props"
            placeholder="请输入金额"
            :trim="true"
            suffix="精确到整数"
          />
        </DuFormItem>
        <DuFormItem
          label="一二三四五六七八"
          info
          required
          labelSize="100px"
          tips="金额不能小于5元"
        >
          <DuInput
            v-bind="$props"
            placeholder="请输入金额"
            :trim="true"
            suffix="精确到整数"
          />
        </DuFormItem>
      </DuForm>
    </div>
  `,
});

export const Default = Template.bind({});

Default.args = {};
