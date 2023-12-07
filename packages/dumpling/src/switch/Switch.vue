<template>
  <div
    :class="[
      'du-switch',
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
    on: boolean
    disabled: boolean
  }>(),
  {
    on: false,
  },
)

const emit = defineEmits<{
  (e: 'update:on', on: boolean): void
}>()

function toggle() {
  if (props.disabled) return
  emit('update:on', !props.on)
}
</script>
