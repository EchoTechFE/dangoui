<template>
  <form :class="className" :style="style">
    <slot />
  </form>
</template>

<script>
import { computed, provide } from "@vue/composition-api";
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

    labelSize: {
      type: String,
      default: "120rpx",
    },
    labelAlign: {
      type: String,
      default: "left",
    },
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const config = computed(() => {
      const { extStyle, extClass, labelSize, labelAlign } = {
        ...props,
        ...props.options,
      };

      return Object.freeze({
        labelSize,
        labelAlign,
        extStyle,
        extClass,
      });
    });

    const className = computed(() => {
      const { extClass } = config.value;
      return classNames("du-form", extClass);
    });

    const style = computed(() => {
      const { extStyle } = config.value;
      return typeof extStyle === "string"
        ? extStyle
        : styleToCss({
            ...extStyle,
          });
    });

    provide("formLabelSize", config.value.labelSize);
    provide("formLabelAlign", config.value.labelAlign);

    return {
      className,
      style,
      config,
    };
  },
};
</script>

<style lang="scss">
.du-form {
  background: #fff;
}
</style>
