<template>
  <!-- add minus 使用click.stop的原因是避免与FormItem组件一起使用时，点击事件冒泡导致DuInput触发聚焦频繁唤起键盘 -->
  <div class="du-input-number">
    <img
      class="du-input-number__item"
      :src="mValue > min ? icon.minus : icon.minusDisabled"
      alt
      @click.stop="minus"
    >
    <div
      v-if="input"
      class="du-input-number__input"
    >
      <DuInput
        :value="mValue"
        :prefix="inputPrefix"
        :suffix="inputSuffix"
        input-align="center"
        @input="onInput"
      />
    </div>

    <div
      v-else
      class="du-input-number__value"
    >
      {{ mValue }}
    </div>

    <img
      class="du-input-number__item"
      :src="mValue < max ? icon.add : icon.addDisabled"
      alt
      @click.stop="add"
    >
  </div>
</template>

<script>
import { ref, watch } from '@vue/composition-api'

import DuInput from '@frontend/du-input/src/Input.vue'
const ICONS = {
  minus:
    'https://cdn.qiandaoapp.com/admins/2cdeaab50e4e21960d680fe9243f5d4b.png',
  minusDisabled:
    'https://cdn.qiandaoapp.com/admins/7a42dab4cc6f6b6f6be4fc79f0287df1.png',
  add: 'https://cdn.qiandaoapp.com/admins/c8baffc5ffdc0c42f2e6120c31934867.png',
  addDisabled:
    'https://cdn.qiandaoapp.com/admins/65665d81f293a99bea9fafc600f0b32c.png'
}

export default {
  components: {
    DuInput
  },
  props: {
    value: {
      type: Number,
      default: 0
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: Infinity
    },
    input: {
      type: Boolean,
      default: false
    },
    inputPrefix: {
      type: String,
      default: ''
    },
    inputSuffix: {
      type: String,
      default: ''
    },
    step: {
      type: Number,
      default: 1
    }
  },
  emits: ['input', 'change'],
  setup (props, { emit }) {
    const mValue = ref(props.min)

    watch(
      () => props.value,
      (val) => {
        if (mValue.value !== val) {
          mValue.value = val
        }
      }
    )

    watch(mValue, (val) => {
      emit('input', val)
      emit('change', val)
    })

    function minus () {
      const { step, min } = props
      const nVal = mValue.value - step
      if (nVal >= min) {
        mValue.value = nVal
      }
    }

    function add () {
      const { step, max } = props
      const nVal = mValue.value + step
      if (nVal <= max) {
        mValue.value = nVal
      }
    }

    function onInput (val) {
      mValue.value = Number(val)
    }

    return {
      icon: ICONS,
      mValue,
      minus,
      add,
      onInput
    }
  }
}
</script>

<style lang="scss">
.du-input-number {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  &__input {
    width: 140rpx;
    margin: 0 16rpx;

    font-size: 32rpx;
    line-height: 48rpx;
  }

  &__value {
    min-width: 80rpx;
    margin: 0 16rpx;

    color: rgba(32, 36, 38, 1);
    color: #202426;
    font-size: 32rpx;
    line-height: 48rpx;

    text-align: center;
  }
  &__item {
    position: relative;

    display: flex;
    align-items: center;
    justify-content: center;

    width: 40rpx;
    height: 40rpx;

    border-radius: 50%;
  }
}
</style>
