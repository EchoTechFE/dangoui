<template>
  <div class="du-step-check">
    <div class="du-step-check__vertical" />
    <div class="du-step-check__horizontal" />
  </div>
</template>

<script>
export default {
}
</script>

<style lang="scss">
.du-step-check {
  transform: scaleX(-1) rotate(-45deg);
  margin-bottom: 2rpx;

  &__vertical {
    width: 3rpx;
    height: 14rpx;
    background: var(--du-steps-circle-inner-color);
    border-bottom-left-radius: 2rpx;
  }

  &__horizontal {
    height: 3rpx;
    width: 8rpx;
    background: var(--du-steps-circle-inner-color);
    border-bottom-left-radius: 2rpx;
    margin-top: -3rpx;
  }
}
</style>
