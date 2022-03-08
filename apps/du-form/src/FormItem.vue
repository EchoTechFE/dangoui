<template>
  <div :class="className" :style="style" @click="onClick">
    <div class="du-form-item__content">
      <div
        :class="[
          'du-form-item__label',
          {
            'du-form-item__label--right': config.labelAlign === 'right',
          },
        ]"
        :style="{
          width: config.slotNextLine ? '100%' : config.labelSize,
        }"
      >
        {{ config.label }}
        <span v-if="config.required" class="du-form-item__label__required">
          *
        </span>

        <img
          v-if="config.info"
          class="du-form-item__label__info"
          src="https://cdn.qiandaoapp.com/admins/13d2521b24ec1f305671e4a5cb29877c.png"
          @click="handleInfoTap"
        />
        <span class="du-form-item__label__dirty" v-if="config.isDirty">
          已修改
        </span>
      </div>
      <div v-if="!config.slotNextLine" class="du-form-item__slot">
        <div>
          <slot />
        </div>
        <slot name="tips">
          <div
            v-if="config.tips"
            class="du-form-item__tips"
            selectable
            user-select
          >
            {{ config.tips }}
          </div>
        </slot>
      </div>
    </div>
    <div v-if="config.slotNextLine" class="du-form-item__slot">
      <slot />
      <div>
        <slot name="tips">
          <text
            v-if="config.tips"
            class="du-form-item__tips"
            selectable
            user-select
          >
            {{ config.tips }}
          </text>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import {
  ref,
  computed,
  provide,
  inject,
  onBeforeUnmount,
} from "@vue/composition-api";
import styleToCss from "style-object-to-css-string";
import classNames from "classnames";

export default {
  props: {
    extClass: {
      type: [String, Array, Object],
      default: "",
    },
    extStyle: {
      type: [String, Object],
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    labelAlign: {
      type: String,
      default: "",
    },
    labelSize: {
      type: String,
      default: "",
    },
    slotNextLine: {
      type: Boolean,
      default: false,
    },
    tips: {
      type: String,
      default: "",
    },
    required: {
      type: Boolean,
      default: false,
    },
    info: {
      type: Boolean,
      default: false,
    },
    isDirty: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const formLabelSize = inject("formLabelSize", "");
    const formLabelAlign = inject("formLabelAlign", "");

    const onClickListeners = ref([]);

    const config = computed(() => {
      const {
        label,
        labelSize,
        labelAlign,
        tips,
        required,
        slotNextLine,
        info,
        extStyle,
        extClass,
        isDirty,
      } = {
        ...props,
        ...props.options,
      };

      return Object.freeze({
        label,
        tips,
        required,
        labelSize: labelSize || formLabelSize,
        labelAlign: labelAlign || formLabelAlign,
        info,
        extStyle,
        extClass,
        slotNextLine,
        isDirty,
      });
    });

    const style = computed(() => {
      const { extStyle } = config.value;
      return typeof extStyle === "string"
        ? extStyle
        : styleToCss({
            ...extStyle,
          });
    });

    const className = computed(() => {
      const { extClass, slotNextLine } = config.value;
      return classNames(
        "du-form-item",
        {
          "du-form-item--slot-next-line": slotNextLine,
        },
        extClass
      );
    });

    onBeforeUnmount(() => {
      onClickListeners.value = null;
    });

    function onClick() {
      onClickListeners.value.forEach((fn) => {
        typeof fn === "function" && fn();
      });
    }

    function listenOnClick(listener) {
      onClickListeners.value.push(listener);
    }

    function handleInfoTap() {
      // todo:
    }

    provide("listenFormItemOnClick", listenOnClick);

    return {
      className,
      style,
      config,
      onClick,
      listenOnClick,
      handleInfoTap,
    };
  },
};
</script>

<style lang="scss">
.du-form-item {
  &__content {
    display: flex;
  }

  &__label {
    display: inline-flex;
    align-items: center;
    height: 88rpx;
    margin-right: 30rpx;
    overflow: hidden;
    position: relative;

    color: #202426;
    font-size: 28rpx;
    line-height: 44rpx;

    &__required {
      color: rgba(255, 64, 122, 1);
    }

    &__info {
      width: 24rpx;
      height: 24rpx;
      margin-left: 8rpx;
    }

    &__dirty {
      display: block;
      color: #05bea9;
      font-size: 20rpx;
      position: absolute;
      top: 54rpx;
    }
  }

  &__slot {
    flex: 1 0 0;
  }

  &__tips {
    margin-top: 8rpx;
    padding-bottom: 16rpx;

    color: rgba(32, 36, 38, 0.4);
    font-size: 24rpx;
    line-height: 36rpx;
  }

  &--slot-next-line {
    .du-form-item__label {
      display: block;
      height: auto;
      margin-right: 0rpx;
    }

    .du-form-item__slot {
      margin-top: 16rpx;
    }
  }
}
</style>
