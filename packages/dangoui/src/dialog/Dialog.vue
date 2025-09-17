<template>
  <DuPopup
    :visible="_visible"
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
    @close="handleClose"
  >
    <div class="du-dialog__container">
      <slot />
      <slot name="footer">
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
          <div class="du-dialog__button-item" v-show="cancelText">
            <DuButton
              :text="cancelText"
              @click="handleCancelClick"
              full
              type="outline"
              size="large"
            />
          </div>
          <div class="du-dialog__button-item" v-show="okText">
            <DuButton
              :text="okText"
              @click="handleOkClick"
              full
              size="large"
              type="primary"
            />
          </div>
        </div>
      </slot>
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
  visible: undefined,
  title: '',
  titleAlign: 'default',
  headerVisible: true,
  maskClick: true,
  closable: true,
  maskClass: '',
  maskStyle: '',
  disablePortal: false,
  actionLayout: 'horizontal',
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
    if (val !== undefined) {
      _visible.value = val
    }
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

function handleClose() {
  if (props.visible === undefined) {
    _visible.value = false
  }
  emits('close')
}

function handleOkClick() {
  state.onConfirm?.()
  emits('confirm')
  emits('close')
  emits('update:visible', false)
  if (props.visible === undefined) {
    _visible.value = false
  }
}

function handleCancelClick() {
  state.onCancel?.()
  emits('cancel')
  emits('close')
  emits('update:visible', false)
  if (props.visible === undefined) {
    _visible.value = false
  }
}

function open(options: Dialog) {
  Object.assign(state, options)
  _visible.value = true
}

function close() {
  _visible.value = false
}

const emits = defineEmits(['update:visible', 'close', 'confirm', 'cancel'])

defineExpose({
  open,
  close,
})
</script>
