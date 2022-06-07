<template>
  <div :class="['du-radio__radio', { 'du-radio__radio--checked': checked }]">
    <!-- TODO: 需要一些工具函数来转换rpx -->
    <DuIcon extClass="du-radio__radio__icon" v-if="checked" name="check" color="#fff" size="16rpx" />
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
import DuIcon from '@frontend/du-icon/src/Icon.vue'

export default defineComponent({
  components: {
    DuIcon,
  },
  props: {
    checked: {
      type: Boolean,
      default: false,
    },
  },
})
</script>

<style lang="scss">
.du-radio {
  &__radio {
    width: 32rpx;
    height: 32rpx;
    overflow: hidden;

    background: rgba(32, 36, 38, 0.1);
    border-radius: 50%;
    position: relative;
    &--checked {
      background: var(--du-color-main);
    }
    &__icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
