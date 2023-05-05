<template>
    <div :style="`width: ${width}%;${style}`" @click.stop :class="className">
        <div class="du-modal-box__header">
            <div :class="{
        'du-modal-box__header__title--left': titleAlign === 'left',
        'du-modal-box__header__title--center': titleAlign === 'center',
      }">
                {{ title }}
            </div>
            <div class="du-modal-box__header__close-btn" v-if="showCloseButton">
                <DuIcon name="close" @click="handleCloseButton"/>
            </div>
        </div>
        <div class="du-modal-box__body">
            <slot></slot>
        </div>
        <Footer
                :show-confirm-button="showConfirmButton"
                :show-cancel-button="showCancelButton"
                :confirm-button-text="confirmButtonText"
                :confirm-button-disabled="confirmButtonDisabled"
                :cancel-button-text="cancelButtonText"
                :cancel-button-disabled="cancelButtonDisabled"
                :modal-loading="modalLoading"
                :confirmButtonLoading="confirmButtonLoading"
                @cancel="handleCancel"
                @confirm="handleConfirm"
        />
    </div>
</template>
<script setup>
import {computed, toRefs} from "vue";
import Footer from "../Footer/index.vue"
import DuIcon from '@frontend/du-icon/src/Icon.vue'
import classNames from "classnames";
import styleToCss from "style-object-to-css-string";

const props = defineProps({
    extClass: {
        type: [String, Array, Object],
        default: '',
    },
    extStyle: {
        type: [String, Object],
        default: '',
    },
    // 标题文本对齐方式
    titleAlign: {
        type: String,
        default: 'left'
    },
    // 弹窗标题
    title: {
        type: String,
        default: '弹窗'
    },
    width: {
        type: Number,
        default: 70
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
    // Modal 确认按钮的 loading
    confirmButtonLoading: {
        type: Boolean,
        default: false
    },
    modalLoading: {
        type: Boolean,
        default: false
    },
    showCloseButton: {
        type: Boolean,
        default: false
    }
})

const {extClass, extStyle} = toRefs(props)

const emits = defineEmits(['confirm', 'close', 'cancel'])
const config = computed(() => {
    return {
        extStyle: extStyle.value,
        extClass: extClass.value,
    }
})

const className = computed(() => {
    const {extClass} = config.value
    return classNames('du-modal-box', extClass)
})

const style = computed(() => {
    const {extStyle} = config.value
    return typeof extStyle === 'string'
        ? extStyle
        : styleToCss({
            ...extStyle,
        })
})


const handleCloseButton = function () {
    emits('close')
}
const handleCancel = function () {
    emits('cancel')
}

const handleConfirm = function () {
    emits('confirm')
}

</script>
<style lang="scss">
.du-modal-box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: fit-content;
  background-color: #fff;
  min-height: 100rpx;
  min-width: 50%;
  border-radius: 8rpx;
  padding: 26.6rpx;

  &__body {
    min-height: 100rpx;
    width: 100%;
    word-break: break-all;
    margin-bottom: 32rpx;
    white-space: pre-wrap;
  }

  &__header {
    height: 64rpx;
    position: relative;

    &__title--left,
    &__title--center {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-weight: 500;
      font-size: 32rpx;
      line-height: 48rpx;
    }

    &__title--center {
      justify-content: center;
    }

    &__close-btn {
      position: absolute;
      right: 0;
      top: 0;
    }
  }
}
</style>
