
<template>
  <DuGroupCell class="important-mt-4px" title="创建商品" guide-text="">
      <DuForm label-size="80px">
        <DuFormItem label="商品图片" required :show-border="false">
          <DuUpload :value="productImages" />
        </DuFormItem>
        <DuFormItem label="商品名称" required>
          <DuInput
            placeholder="请输入商品名称"
            :trim="true"
          />
        </DuFormItem>
        <DuFormItem label="价格" info="请输入整数" required tips="金额不能小于5元">
          <DuInput
            placeholder="请输入金额"
            :trim="true"
            prefix="￥"
            suffix="精确到整数"
          />
        </DuFormItem>
        <DuFormItem label="库存" required>
          <DuInput
            placeholder="数量"
            :trim="true"
          />
        </DuFormItem>
        <DuFormItem label="限购" required>
          <DuInputNumber />
        </DuFormItem>
        <DuFormItem label="发货模式" required :show-border="false">
          <DuRadioGroup :value="1">
            <DuRadio label="直接物流" :value="1" />
            <DuRadio label="寄存柜" :value="2" />
            <DuRadio label="自提" :value="3" />
          </DuRadioGroup>
        </DuFormItem>
        <DuFormItem label="支付方式" required :show-border="false">
          <DuCheckboxGroup :value="['1']" inline>
            <DuCheckbox label="支付宝" name="1" />
            <DuCheckbox label="微信" name="2" />
          </DuCheckboxGroup>
        </DuFormItem>
        <DuFormItem label="极速模式" :show-border="false" required>
          <DuSwitch :on="true" />
        </DuFormItem>
        <DuButton full size="large" ext-class="!mt-8px">
          发布
        </DuButton>
      </DuForm>
  </DuGroupCell>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  DuButton,
  DuForm,
  DuFormItem,
  DuInput,
  DuGroupCell,
  DuRadioGroup,
  DuRadio,
  DuCheckboxGroup,
  DuCheckbox,
  DuInputNumber,
  DuUpload,
  DuSwitch,
} from '@frontend/dumpling'

const productImages = ref([
  {
    uid: 1,
    url: '',
    thumbUrl: 'https://cdn.qiandaoapp.com/interior/images/1ab88333caa868a7f2bdfc0bbd3df1f6.jpg'
  },
  {
    uid: 2,
    url: '',
    thumbUrl: 'https://cdn.qiandaoapp.com/interior/images/1ab88333caa868a7f2bdfc0bbd3df1f6.jpg'
  },
  {
    uid: 3,
    url: '',
    thumbUrl: 'https://cdn.qiandaoapp.com/interior/images/1ab88333caa868a7f2bdfc0bbd3df1f6.jpg'
  },
])
</script>
