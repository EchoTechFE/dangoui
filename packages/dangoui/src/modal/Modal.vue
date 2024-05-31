<template>
  <DuPopup
    v-model:visible="_visible"
    type="center"
    :header-visible="headerVisible"
    :mask-click="maskClick"
    :closable="closable"
    :disable-portal="disablePortal"
    :title="title"
    :title-align="titleAlign"
    :ext-class="modalContainerClass"
    :ext-style="extStyle"
    :mask-class="maskClass"
    :mask-style="maskStyle"
  >
    <slot />
    <div class="du-modal__footer du-modal__button">
      <DuButton v-for="btnConfig in actions" v-bind="btnConfig"/>
    </div>
  </DuPopup>
</template>
<script lang="ts" setup>
import DuPopup from '../popup/Popup.vue'
import { computed, normalizeClass, ref, watch } from 'vue'
import DuButton from '../button/Button.vue'

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
    titleAlign: 'default' | 'center' | undefined
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
    /**
     * 底部按钮配置，类型参考Button的属性
     */
    actions: (InstanceType<typeof DuButton>['$props'] & { buttonText: string })[]
    /**
     * 按钮排列方式：水平或者垂直
     */
    buttonLayout: 'horizontal' | 'vertical'
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
    actions: () => [],
    buttonLayout: 'horizontal'
  }
)

const modalContainerClass = computed(() => {
  const { extClass } = props
  return normalizeClass([
    'du-modal',
    extClass
  ])
})

const _visible = ref(false)

watch(() => props.visible, (val) => {
  _visible.value = val
}, {
  immediate: true
})


</script>
