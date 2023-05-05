<template>
    <div style="z-index: 99999;position: fixed">
        <DuTransition name="fade" :duration="500" :show="visible" :destroy="destroyWhenClosed">
            <div class="du-overlay" @click="handleClick" @touchmove.prevent >
                <slot></slot>
            </div>
        </DuTransition>
    </div>
</template>
<script setup>
import {computed, toRefs, watch} from 'vue'
import DuTransition from '../DuTransition/index.vue'

const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    destroyWhenClosed: {
        type: Boolean,
        default: false
    },
})

const emits = defineEmits(['overlayClick', 'open'])

const {visible, destroyWhenClosed} = toRefs(props)

watch([destroyWhenClosed, visible], (val) => {
    if (visible.value) emits('open')
})

const handleClick = () => {
    emits('overlayClick')
}

</script>

<style lang="scss">
.du-overlay {
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  position: fixed;
  z-index: 99999;
  background: #0000003D;
}

</style>
