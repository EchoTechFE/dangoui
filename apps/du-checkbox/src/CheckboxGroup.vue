<template>
  <div v-if="options" :class="className" :style="style">
    <du-checkbox v-for="op in options" :key="op?.value" :label="op?.value" :disabled="op?.disabled">
      {{ op?.label || op?.value }}
    </du-checkbox>
  </div>
  <div v-else :class="className" :style="style">
    <slot></slot>
  </div>
</template>

<script>
import { computed, provide, ref, watch } from 'vue'
import classNames from 'classnames'
import styleToCss from 'style-object-to-css-string'
import DuCheckbox from './Checkbox.vue'

export default {
  name: 'du-checkbox-group',
  props: {
    extClass: {
      type: [String, Array],
      default: '',
    },
    extStyle: {
      type: [String, Object],
      default: '',
    },
    options: {
      type: Array,
    },
    shape: {
      type: String,
      default: '',
    },
    inline: {
      type: Boolean,
      default: false,
    },
    position: {
      type: String,
      default: '',
    },
    value: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    DuCheckbox,
  },
  emits: ['input', 'update:value'],
  setup(props, { emit }) {
    const className = computed(() => {
      const { extClass } = props

      return classNames(['du-checkbox-group'], extClass)
    })

    const style = computed(() => {
      const { extStyle } = props

      return typeof extStyle === 'string' ? extStyle : styleToCss({ ...extStyle })
    })

    const groupConfig = computed(() => {
      const { shape, inline, position } = props

      return {
        shape,
        inline,
        position,
      }
    })

    const groupValue = ref([])

    watch(
      () => props.value,
      (v) => {
        groupValue.value = v
      },
      {
        immediate: true,
      },
    )

    function setGroupValue(value) {
      emit('input', value)
      emit('update:value', value)
      groupValue.value = value
    }

    provide('groupConfig', groupConfig)
    provide('groupValue', groupValue)
    provide('setGroupValue', setGroupValue)

    return {
      className,
      style,
    }
  },
}
</script>
