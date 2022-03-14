<template>
  <div class="du-button">is calendar page</div>
</template>

<script>
import { computed } from '@vue/composition-api'
import styleToCss from 'style-object-to-css-string'
import classNames from 'classnames'

export default {
  props: {
    extClass: {
      type: [String, Array, Object],
      default: ''
    },
    extStyle: {
      type: [String, Object],
      default: ''
    },
    type: {
      type: String,
      default: 'primary'
    },
    size: {
      type: String,
      default: 'normal'
    },
    text: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    full: {
      type: Boolean,
      default: false
    },
    square: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    openType: {
      type: String,
      default: ''
    },
    ghost: {
      type: Boolean,
      default: false
    }
  },
  setup (props, { emit }) {

    return {}
  }
}
</script>

<style lang="scss">
</style>
