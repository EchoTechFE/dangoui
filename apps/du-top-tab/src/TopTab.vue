<template>
  <div :class="className" :style="style">
    <div class="du-sort-tab__left">
      
    </div>
    <div class="du-sort-tab__right">

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
    extClass: {
      type: [String, Array, Object],
      default: '',
    },
    extStyle: {
      type: [String, Object],
      default: '',
    },
    tabs: {
      type: Array,
      default: () => [],
    },
    options: {
      type: Array,
      default: () => [],
    },
    mode: {
      type: String, // level1,level2,level3,level4
      default: 'level1',
    }
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
      return classNames('du-sort-tab', props.extClass)
    })

    const handleTabTap = () => {

    }

    const handleOptionTap = () => {

    }

    const handleSearchTap = () => {
      emit('handleSearchTap')
    }
    return {
      style,
      className,
      handleTabTap,
      handleOptionTap,
      handleSearchTap,
    }
  },
  emits: ['handleTabTap', 'handleOptionTap', 'handleSearchTap'],
})
</script>

<style lang="scss">
.du-sort-tab {
  display: flex;
  width: 100vw;
  font-size: 0;
  &__left{
    
  }
  &__right{

  }
}
</style>
