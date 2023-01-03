<template>
  <div
    :class="[
      'du-checkbox__checkbox',
      selected ? `du-checkbox__checkbox--selected` : '',
      `du-checkbox__checkbox--${shape}`,
    ]"
    :style="{
      width: size,
      height: size,
    }"
  >
    <img
      v-if="selected"
      :style="imageStyle"
      src="https://cdn.qiandaoapp.com/admins/1094c5afbcb6ae86323605a326536769.svg"
    />
  </div>
</template>

<script>
import { computed } from 'vue'
export default {
  name: 'checkbox-icon',
  props: {
    selected: {
      type: Boolean,
      default: false,
    },
    shape: {
      type: String,
      default: 'round',
    },
    size: {
      type: String,
      default: '40rpx',
    },
  },
  setup(props) {
    const imageStyle = computed(() => {
      const { size } = props

      return {
        width: size,
        height: size,
      }
    })

    return {
      imageStyle,
    }
  },
}
</script>

<style lang="scss">
.du-checkbox__checkbox {
  box-sizing: border-box;
  position: relative;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;

  border: 2rpx solid rgba(0, 0, 0, 0.24);

  &--selected {
    border: none;
    background-color: var(--du-color-main);
  }

  &--square {
    border-radius: 0;
  }
}
</style>
