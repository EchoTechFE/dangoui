<template>
    <div class="du-transition" :class="transitionClassOptions" :style="{transition: `${duration / 1000}s all`, zIndex}">
        <div v-if="destroy && _show" class="du-transition__content--destroy">
            <slot></slot>
        </div>
        <div v-show="!destroy && _show" class="du-transition__content--undestroy">
            <slot></slot>
        </div>
    </div>
</template>
<script setup>
import {onMounted, ref, toRefs, watch} from 'vue'


const props = defineProps({
    // 过渡时间
    duration: {
        type: Number,
        default: 500
    },
    show: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        default: 'fade'
    },
    destroy: {
        type: Boolean,
        default: true
    },
    zIndex: {
        type: Number,
        default: 9999
    }

})

const transitionClassOptions = ref({})

const _show = ref(false)

const {duration, show, name, destroy} = toRefs(props)

watch(name, newName => {
    handlePropsChange(newName, 'name')
    initTransitionClass(newName)
})

watch(show, (newShow, oldValue) => {
    handlePropsChange(newShow, 'show')
    handleShowChange(newShow)
})

watch(duration, newDuration => {
    handlePropsChange(newDuration, 'duration')
    initTransitionClass(name.value)
})

onMounted(() => {
    _show.value = show.value
    initTransitionClass(name.value)
    if (show.value) {
        handleShowChange(true)
    }
})

function handlePropsChange(prop, type) {
    const ok = checkPropsValid(prop, type)
    if (!ok) return
}

function initTransitionClass(name) {
    transitionClassOptions.value = {
        [name + '-enter-from']: true,
        [name + '-enter-active']: false,
        [name + '-enter-to']: false,
        [name + '-leave-from']: false,
        [name + '-leave-active']: false,
        [name + '-leave-to']: false,
    }
}

function triggerAnimation(newShow) {
    const type = name.value
    let timer = null
    if (newShow) {
        _show.value = true
        transitionClassOptions.value = {
            ...transitionClassOptions.value,
            [type + '-leave-to']: false,
            [`${type}-enter-from`]: true,
            [`${type}-enter-active`]: true,
            [`${type}-enter-to`]: true
        }
        setTimeout(() => {
            clearTimeout(timer)
            timer = null
            transitionClassOptions.value = {
                ...transitionClassOptions.value,
                [`${type}-enter-from`]: false,
                [`${type}-enter-active`]: false,
                [`${type}-enter-to`]: true
            }
        }, duration.value)
    } else {
        transitionClassOptions.value = {
            ...transitionClassOptions.value,
            [`${type}-enter-to`]: false,
            [`${type}-leave-active`]: true,
            [`${type}-leave-from`]: true,
            [`${type}-leave-to`]: true
        }
        setTimeout(() => {
            clearTimeout(timer)
            timer = null
            transitionClassOptions.value = {
                ...transitionClassOptions.value,
                [`${type}-leave-from`]: false,
                [`${type}-leave-active`]: false,
                [`${type}-leave-to`]: true
            }
            _show.value = false
        }, duration.value)
    }
}

function handleShowChange(newShow) {
    triggerAnimation(newShow)
}

function checkPropsValid(prop, type) {
    if (
        typeof prop === "undefined"
    ) {
        console.error(`${type} must not be undefined`)
        return false
    }
    return true
}

</script>
<style lang="scss">
@import './transition-related.scss';

.du-transition {

}

.fade {
  &-enter-from {
    opacity: 0;
    z-index: 1000;
  }

  &-enter-active {
  }

  &-enter-to {
    opacity: 1;
    z-index: 1000;
  }

  &-leave-from {
    opacity: 1;
    z-index: 1000;
  }

  &-leave-active {
  }

  &-leave-to {
    opacity: 0;
    z-index: 1000;
  }
}

</style>
