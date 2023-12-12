<template>
  <div
    :class="[
      'du-textarea',
      {
        'du-textarea--bordered': bordered,
      },
    ]"
  >
    <textarea
      class="du-textarea__inner"
      :value="value"
      :maxlength="maxlength"
      @input="handleInput"
      :placeholder="placeholder"
    />
    <div v-if="showCount" class="du-textarea__count">
      <span
        :class="{
          'du-textarea__overflow': isOverflow,
        }"
      >
        {{ value.length }}
      </span>
      <span v-if="maxlength !== -1">/{{ maxlength }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /**
     * 值
     */
    value: string
    /**
     * 占位文字
     */
    placeholder: string
    /**
     * 是否显示字数统计
     */
    showCount: boolean
    /**
     * 最多可输入文字数，为 -1 时没有输入限制
     */
    maxlength: number
    /**
     * 是否是外边框类型
     */
    bordered: boolean
  }>(),
  {
    maxlength: -1,
    value: '',
    placeholder: '',
    showCount: false,
    bordered: false,
  },
)

const emit = defineEmits<{
  (e: 'update:value', value: string): void
}>()

const handleInput = (e: any) => {
  if (__WEB__) {
    emit('update:value', e.target.value)
  } else if (__UNI_PLATFORM__) {
    emit('update:value', e.detail.value)
  }
}

const isOverflow = computed(() => {
  return props.maxlength !== -1 && props.value.length > props.maxlength
})
</script>
