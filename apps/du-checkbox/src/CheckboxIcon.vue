<template>
  <div
    :class="[
      'du-checkbox__checkbox',
      { 'du-checkbox__checkbox--selected': selected },
      `du-checkbox__checkbox--${shape}`,
    ]"
  >
    <DuIcon extClass="du-checkbox__checkbox__icon" v-if="selected" name="check" color="#fff" size="20rpx" />
  </div>
</template>

<script>
import DuIcon from '@frontend/du-icon/src/Icon'

export default {
  name: 'checkbox-icon',
  components: {
    DuIcon,
  },
  props: {
    selected: {
      type: Boolean,
      default: false,
    },
    shape: {
      type: String,
      default: 'round',
    },
  },
  setup(props) {},
}
</script>

<style lang="scss">
.du-checkbox__checkbox {
  position: relative;
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background-color: #20242633;

  &--selected {
    background-color: var(--du-color-main);
  }

  &--square {
    border-radius: 0;
  }

  &__icon {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
