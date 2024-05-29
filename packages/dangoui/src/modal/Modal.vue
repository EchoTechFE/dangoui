<template>
  <DuPopup v-model:visible="_visible" type="center">

  </DuPopup>
</template>
<script lang="ts" setup>
import DuPopup from '../popup/Popup.vue'
import { ref, watch } from 'vue'


const props = withDefaults(
  defineProps<{
    /**
     * 是否展示弹窗
     */
    visible: boolean
    /**
     * 是否展示内置的头部栏
     */
    headerVisible: boolean
    /**
     * 点击遮罩层是否关闭
     */
    maskClick: boolean
    /**
     * 是否展示关闭按钮（当内置头部栏展示时有效）
     */
    closable: boolean
    /**
     * 禁止将 Popup 渲染到根节点
     */
    disablePortal: boolean
    /**
     * 弹窗标题
     */
    title: string
    /**
     * 标题对齐方式，default 为左对齐
     */
    titleAlign: string
    /**
     * maskClass
     */
    maskClass: string | string[] | Record<string, boolean>
    /**
     * maskStyle
     */
    maskStyle: string | { [x: string]: string | number; }
    /**
     * extClass
     */
    extClass: string | string[] | Record<string, boolean>
    /**
     * extStyle
     */
    extStyle:
      | string
      | {
      [x: string]: string | number
    }
  }>(),
  {
    extStyle: '',
    extClass: '',
    visible: false,
    title: '',
    titleAlign: 'default',
    headerVisible: true,
    maskClick: true,
    closable: true,
    maskClass: '',
    maskStyle: '',
    disablePortal: false,
  }
)

const _visible = ref(false)

watch(() => props.visible, (val) => {
  _visible.value = val
}, {
  immediate: true
})

console.log(props)
</script>
