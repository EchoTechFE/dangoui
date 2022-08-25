<template>
  <div :class="className" :style="style">
    <div
      class="point"
      v-for="point in 5"
      :key="point"
      @click="handleTapPoint(point)"
      :style="{
        marginRight: `${space}px`,
      }"
    >
      <DuIcon
        name="rate-filled"
        :color="drakColor"
        :size="`${size}px`"
        :extStyle="{ 
          position: 'absolute',
          zIndex: '-1'
        }"
      />    
      <div 
        class="point-on"
        :style="{
          width: calcWidth(point),
        }"
      >
        <DuIcon
          name="rate-filled"
          :color="lightColor"
          :size="`${size}px`"
        />  
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue'
import styleToCss from 'style-object-to-css-string'
import classNames from 'classnames'
import DuIcon from '@frontend/du-icon/src/Icon.vue'

export default defineComponent({
  components: {
    DuIcon,
  },
  props: {
    step: {
      type: Number,
      default: 1,
    },
    rating: {
      type: Number,
      required: true,
    },
    size: {
      type: Number,
      default: 32,
    },
    space: {
      type: Number,
      default: 8,
    },
    lightColor: {
      type: String,
      default: '#F19E38'
    },
    drakColor: {
      type: String,
      default: 'rgba(12, 12, 12, 0.1)'
    },
    extClass: {
      type: [String, Array, Object],
      default: '',
    },
    extStyle: {
      type: [String, Object],
      default: '',
    },
  },
  setup(props, { emit }) {
    const style = computed(() => {
      const { extStyle } = props
      return typeof extStyle === 'string'
        ? extStyle
        : styleToCss({
            ...extStyle,
          })
    })

    const className = computed(() => {
      return classNames('du-rate', props.extClass)
    })

    function handleTapPoint(point) {
      emit('handleTapPoint', point * props.step)
    }

    function calcWidth(point) {
      const realPoint = point
      if (props.rating / props.step - realPoint >= 0) return '100%'
      if (props.rating / props.step - realPoint < 0 && props.rating / props.step - realPoint > -1) {
        return (1 + (props.rating / props.step - realPoint)) * 100 + '%'
      }

      return '0%'
    }

    return {
      style,
      className,
      handleTapPoint,
      calcWidth,
    }
  },
  emits: ['handleTapPoint'],
})
</script>

<style lang="scss">
.du-rate {
  display: flex;
  font-size: 0;
  .point {
    position: relative;
    &:last-child{
      margin-right: 0 !important;
    }
    .point-on {
      overflow: hidden;
    }
  }
}
</style>
