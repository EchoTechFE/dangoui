<template>
  <div :class="['du-radio__radio', { 'du-radio__radio--checked': checked }]" :style="sizeStyle">
    <!-- TODO: 需要一些工具函数来转换rpx -->
    <img
      v-show="checked"
      src="https://cdn.qiandaoapp.com/admins/1094c5afbcb6ae86323605a326536769.svg"
      class="du-radio__radio-check"
      :style="sizeStyle"
    />
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue'
import DuIcon from '@frontend/du-icon/src/Icon.vue'
import styleToCss from 'style-object-to-css-string'

export default defineComponent({
  components: {
    DuIcon,
  },
  props: {
    checked: {
      type: Boolean,
      default: false,
    },
    size: {
      type: [String, Number],
      default: '',
    },
  },
  setup(props) {
    const sizeStyle = computed(() => {
      const style = {}
      if (props.size) {
        style.width = props.size
        style.height = props.size
      }
      return styleToCss(style)
    })

    return {
      sizeStyle,
    }
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
    --du-icon-fz: 20rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    &--checked {
      background: var(--du-color-main);
    }
  }

  &__radio-check {
    width: 32rpx;
    height: 32rpx;
  }
}
</style>
