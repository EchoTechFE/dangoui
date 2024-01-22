<template>
  <div
    :class="[
      'du-switch',
      `du-c-${props.color}-switch`,
      {
        'du-switch--on': on,
        'du-switch--disabled': !on && disabled,
        'du-switch--on-disabled': on && disabled,
      },
    ]"
  >
    <div
      :class="[
        'du-switch__button',
        {
          'du-switch__button--on': on,
        },
      ]"
      @click="toggle"
    />
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    /**
     * 色彩，可以使用色板中的颜色名
     */
    color: string
    /**
     * 是否打开
     */
    on: boolean
    /**
     * 是否禁用
     */
    disabled: boolean
  }>(),
  {
    color: 'primary',
    on: false,
    disabled: false,
  },
)

const emit = defineEmits<{
  (e: 'update:on', on: boolean): void
}>()

function toggle() {
  if (props.disabled) return
  // @ts-ignore
  if (typeof uni !== 'undefined') {
    // @ts-ignore
    uni.vibrateShort({
      type: 'light',
    })
  }
  emit('update:on', !props.on)
}
</script>
