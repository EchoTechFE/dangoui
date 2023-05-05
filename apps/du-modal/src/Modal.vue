<template>
    <div class="du-modal">
        <overlay :visible="_visible"
                 @overlay-click="handleClickOverlay"
                 :destroy-when-closed="_options.destroyWhenClosed"
                 @open="handleOpen">
            <ModalBox
                    class="modal-box"
                    :width="_options.width"
                    :extStyle="extStyle"
                    :extClass="extClass"
                    :title="_options.title"
                    :title-align="_options.titleAlign"
                    :confirmButtonLoading="confirmButtonLoading"
                    :cancel-button-disabled="cancelButtonDisabled"
                    :cancel-button-text="_options.cancelButtonText"
                    :confirm-button-disabled="confirmButtonDisabled"
                    :confirm-button-text="_options.confirmButtonText"
                    :show-cancel-button="_options.showCancelButton"
                    :show-confirm-button="_options.showConfirmButton"
                    :show-close-button="_options.showCloseButton"
                    :modal-loading="modalLoading"
                    @cancel="handleCancel"
                    @confirm="handleConfirm"
                    @close="handleClose"
            >
                <div style="position:relative">
                    <DuTransition name="fade" :duration="300" :show="modalLoading" destroy>
                        <div class="du-modal-loading">加载中...</div>
                    </DuTransition>
                    <slot>{{ _options.content }}</slot>
                </div>
            </ModalBox>
        </overlay>
    </div>
</template>
<script setup>
import {computed, onMounted, ref, toRefs, watch} from 'vue'
import Overlay from './components/Overlay/index.vue'
import ModalBox from './components/ModalBox/index.vue'
import classNames from "classnames";
import styleToCss from "style-object-to-css-string";
import DuTransition from './components/DuTransition/index.vue'

const props = defineProps({
    extClass: {
        type: [String, Array, Object],
        default: '',
    },
    extStyle: {
        type: [String, Object],
        default: '',
    },
    // Modal 整个的 loading
    modalLoading: {
        type: Boolean,
        default: false
    },
    // Modal 确认按钮的 loading
    confirmButtonLoading: {
        type: Boolean,
        default: false
    },
    // 控制 Modal 是否显示
    visible: {
        type: Boolean,
        default: undefined
    },
    // 是否展示右上角关闭按钮
    showCloseButton: {
        type: Boolean,
        default: false
    },
    // 是否展示取消按钮
    showCancelButton: {
        type: Boolean,
        default: true
    },
    //  是否展示确认按钮
    showConfirmButton: {
        type: Boolean,
        default: true
    },
    // 是否禁用确认按钮
    confirmButtonDisabled: {
        type: Boolean,
        default: false
    },
    // 是否禁用取消按钮
    cancelButtonDisabled: {
        type: Boolean,
        default: false
    },
    // 当点击弹层的时候是否关闭 Modal
    closeOnClickOverlay: {
        type: Boolean,
        default: true
    },
    destroyWhenClosed: {
        type: Boolean,
        default: false
    },
    // 取消按钮文案
    cancelButtonText: {
        type: String,
        default: '取消'
    },
    // 确认按钮文案
    confirmButtonText: {
        type: String,
        default: '确定'
    },
    // 弹窗宽度
    width: {
        type: String,
        default: 70
    },
    // 弹窗标题
    title: {
        type: String,
        default: '弹窗'
    },
    // 标题文本对齐方式
    titleAlign: {
        type: String,
        validator(value) {
            return value === 'left' || value === 'center'
        },
        default: 'left'
    },
    content: {
        type: String,
        default: ''
    },
    defaultVisible: {
        type: Boolean,
        default: false
    }
});

const {
    confirmButtonLoading,
    cancelButtonDisabled,
    cancelButtonText,
    confirmButtonDisabled,
    confirmButtonText,
    showCancelButton,
    showCloseButton,
    showConfirmButton,
    title,
    titleAlign,
    width,
    closeOnClickOverlay, modalLoading, visible, content, defaultVisible, destroyWhenClosed
} = toRefs(props)

const emits = defineEmits(['confirm', 'close', 'cancel', 'open', 'update:visible'])


// hooks
const _options = ref({
    content: undefined,
    title: undefined,
    titleAlign: undefined,
    width: undefined,
    showCloseButton: undefined,
    showCancelButton: undefined,
    showConfirmButton: undefined,
    closeOnClickOverlay: undefined,
    destroyWhenClosed: undefined,
    cancelButtonText: undefined,
    confirmButtonText: undefined,
})

const _visible = ref(false)

// 此处是在使用 API 方式调用打开或者关闭 Modal 的时候，要调用的函数
let confirmFunc = [],
    cancelFunc = [],
    closeFunc = []


watch(visible, v => {
    if (typeof v === 'boolean') _visible.value = v
})

watch([
    content,
    title,
    titleAlign,
    width,
    showCloseButton,
    showCancelButton,
    showConfirmButton,
    closeOnClickOverlay,
    destroyWhenClosed,
    cancelButtonText,
    confirmButtonText
], vals => {
    if (typeof visible.value === 'boolean') {
        const [
            content,
            title,
            titleAlign,
            width,
            showCloseButton,
            showCancelButton,
            showConfirmButton,
            closeOnClickOverlay,
            destroyWhenClosed,
            cancelButtonText,
            confirmButtonText
        ] = vals
        _options.value = {
            content,
            title,
            titleAlign,
            width,
            showCloseButton,
            showCancelButton,
            showConfirmButton,
            closeOnClickOverlay,
            destroyWhenClosed,
            cancelButtonText,
            confirmButtonText
        }
    }
})

onMounted(() => {
    for (const optionsKey in _options.value) {
        if (_options.value.hasOwnProperty(optionsKey)) {
            _options.value[optionsKey] = props[optionsKey]
        }
    }
    if (visible.value) {
        _visible.value = visible.value
        return
    }
    if (defaultVisible.value) {
        _visible.value = true
    }
})
// handlers
const handleClickOverlay = function () {
    if (_options.value.closeOnClickOverlay && !confirmButtonLoading.value && !modalLoading.value) {
        handleClose()
    }
}

function reset() {
    cancelFunc = []
    confirmFunc = []
    closeFunc = []
}

const handleCancel = function () {
    emits('cancel')
    if (typeof visible.value !== "boolean") {
        let err = undefined
        try {
            while (cancelFunc.length > 0) {
                const f = cancelFunc.shift()
                f()
            }
            reset()
        } catch (e) {
            err = e
        }
        if (typeof err === "undefined") {
            _visible.value = false
        }
    }
}

const handleConfirm = function () {
    emits('confirm')
    if (typeof visible.value !== "boolean") {
        let err = undefined
        try {
            while (confirmFunc.length > 0) {
                const f = confirmFunc.shift()
                f()
            }
            reset()
        } catch (e) {
            err = e
        }
        if (typeof err === "undefined") {
            _visible.value = false
        }
    }
}

function handleOpen() {
    emits('open')
    emits('update:visible', true)
}

function handleClose() {
    emits('close')
    emits('update:visible', false)
    if (typeof visible.value !== "boolean") {
        let err = undefined
        try {
            while (closeFunc.length > 0) {
                const f = closeFunc.shift()
                f()
            }
            reset()
        } catch (e) {
            err = e
        }
        if (typeof err === "undefined") {
            _visible.value = false
        }
    }

}


const _onConfirm = function (fn) {
    if (typeof fn === 'undefined') {
        console.warn('lack of function of confirm')
    } else if (typeof fn === 'function') {
        confirmFunc.push(fn)
    }
    return {
        confirm: _onConfirm,
        cancel: _onCancel,
        close: _onClose
    }
}

const _onCancel = function (fn) {
    if (typeof fn === "undefined") {
        console.warn('lack of function of cancel')
    } else if (typeof fn === "function") {
        cancelFunc.push(fn)
    }
    return {
        confirm: _onConfirm,
        cancel: _onCancel,
        close: _onClose
    }
}

const _onClose = function (fn) {
    if (typeof fn === "undefined") {
        console.warn('lack of function of cancel')
    } else if (typeof fn === "function") {
        closeFunc.push(fn)
    }
    return {
        confirm: _onConfirm,
        cancel: _onCancel,
        close: _onClose
    }
}

const open = function (options = {}) {
    if (visible.value) {
        console.warn('property visible is controled now')
        return
    }

    _visible.value = true

    const {
        content,
        title,
        titleAlign,
        width,
        showCloseButton,
        showCancelButton,
        showConfirmButton,
        closeOnClickOverlay,
        destroyWhenClosed,
        cancelButtonText,
        confirmButtonText,
    } = options

    _options.value = {
        ...props,
        content,
        title,
        titleAlign,
        width,
        showCloseButton,
        showCancelButton,
        showConfirmButton,
        closeOnClickOverlay,
        destroyWhenClosed,
        cancelButtonText,
        confirmButtonText,
    }
    return {
        confirm: _onConfirm,
        cancel: _onCancel,
        close: _onClose
    }
}

defineExpose({
    open,
})

</script>

<style lang="scss">
.du-modal {

  &-container {

  }

  &-loading {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    width: 100%;
    height: 100%;
    background-color: #ffffffee;
    z-index: 2;
    justify-content: center;
    align-items: center;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
