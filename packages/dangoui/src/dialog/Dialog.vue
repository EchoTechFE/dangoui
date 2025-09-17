<template>
  <DuPopup
    v-model:visible="_visible"
    type="center"
    :header-visible="state.headerVisible"
    :mask-click="state.maskClick"
    :closable="state.closable"
    :disable-portal="state.disablePortal"
    :title="state.title"
    :title-align="state.titleAlign"
    :ext-class="dialogContainerClass"
    :ext-style="state.extStyle"
    :mask-class="state.maskClass"
    :mask-style="state.maskStyle"
    @close="handleClick"
  >
    <div class="du-dialog__container">
      <div v-if="content" class="du-dialog__content">
        {{ content }}
      </div>
      <slot v-else />
      <div
        :class="[
          'du-dialog__footer',
          'du-dialog__button',
          {
            'du-dialog__button--horizontal': actionLayout === 'horizontal',
            'du-dialog__button--vertical': actionLayout === 'vertical',
          },
        ]"
      >
        <div class="du-dialog__button-item" v-show="showOk">
          <DuButton :text="okText" @click="handleOkClick" full type="primary" />
        </div>
        <div class="du-dialog__button-item" v-show="showCancel">
          <DuButton
            :text="cancelText"
            @click="handleCancelClick"
            full
            type="outline"
          />
        </div>
        <div
          class="du-dialog__button-item"
          v-show="showActions"
          v-for="(btnConfig, index) in state.actions"
          @click="handleActionButtonClick(btnConfig.key, index)"
        >
          <DuButton
            :key="btnConfig.key"
            :ext-class="btnConfig.extClass"
            :ext-style="btnConfig.extStyle"
            :size="btnConfig.size"
            :type="btnConfig.type"
            :loading="btnConfig.loading"
            :disabled="btnConfig.disabled"
            :color="btnConfig.color"
            :icon-size="btnConfig.iconSize"
            :icon-position="btnConfig.iconPosition"
            :icon="btnConfig.icon"
            :text="btnConfig.text || '按钮'"
            :arrow-right="btnConfig.arrowRight"
            :button-id="btnConfig.buttonId"
            :disabled-type="btnConfig.disabledType"
            :open-type="btnConfig.openType"
            :press="btnConfig.press"
            :press-background="btnConfig.pressBackground"
            :theme="btnConfig.theme"
            full
            @click="btnConfig.onClick"
          />
        </div>
      </div>
    </div>
  </DuPopup>
</template>
<script lang="ts" setup>
import DuPopup from '../popup/Popup.vue'
import { computed, normalizeClass, reactive, ref, watch } from 'vue'
import DuButton from '../button/Button.vue'
import { Dialog } from './Dialog.ts'

const props = withDefaults(defineProps<Dialog>(), {
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
  actionLayout: 'horizontal',
  content: '',
  showOk: true,
  showCancel: true,
  okText: '确定',
  cancelText: '取消',
})

const dialogContainerClass = computed(() => {
  const { extClass } = props
  return normalizeClass(['du-dialog', extClass])
})

const _visible = ref(false)

const state = reactive<Dialog>({ ...props })

watch(
  () => props,
  (val) => {
    Object.assign(state, val)
  },
  {
    deep: true,
  },
)

watch(
  () => props.visible,
  (val) => {
    _visible.value = val
  },
  {
    immediate: true,
  },
)

watch(
  () => _visible.value,
  (val) => {
    emits('update:visible', val)
  },
)

const showActions = computed(() => {
  return !props.showOk && !props.showCancel
})

function handleClick() {
  emits('close')
}

function handleOkClick() {
  state.onConfirm?.()
  emits('confirm')
  emits('close')
  emits('update:visible', false)
}

function handleCancelClick() {
  state.onCancel?.()
  emits('cancel')
  emits('close')
  emits('update:visible', false)
}

function handleActionButtonClick(key: string | number, index: number) {
  emits('action', {
    key,
    index,
  })
}

function open(options: Dialog) {
  Object.assign(state, options)
  _visible.value = true
}

function close() {
  _visible.value = false
}

const emits = defineEmits([
  'update:visible',
  'close',
  'action',
  'confirm',
  'cancel',
])

defineExpose({
  open,
  close,
})
</script>
