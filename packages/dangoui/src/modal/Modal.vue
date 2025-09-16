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
    :ext-class="modalContainerClass"
    :ext-style="state.extStyle"
    :mask-class="state.maskClass"
    :mask-style="state.maskStyle"
    @close="handleClick"
  >
    <div class="du-modal__container">
      <div v-if="content" class="du-modal__content">
        {{ content }}
      </div>
      <slot v-else />
      <div
        :class="[
          'du-modal__footer',
          'du-modal__button',
          {
            'du-modal__button--horizontal': actionLayout === 'horizontal',
            'du-modal__button--vertical': actionLayout === 'vertical',
          },
        ]"
      >
        <div
          class="du-modal__button-item"
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
import { Modal } from './Modal.ts'

const props = withDefaults(defineProps<Modal>(), {
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
})

const modalContainerClass = computed(() => {
  const { extClass } = props
  return normalizeClass(['du-modal', extClass])
})

const _visible = ref(false)

const state = reactive<Modal>({ ...props })

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

function handleClick() {
  emits('close')
}

function handleActionButtonClick(key: string | number, index: number) {
  emits('action', {
    key,
    index,
  })
}

function open(options: Modal) {
  Object.assign(state, options)
  _visible.value = true
}

function close() {
  _visible.value = false
}

const emits = defineEmits(['update:visible', 'close', 'action'])

defineExpose({
  open,
  close,
})
</script>
