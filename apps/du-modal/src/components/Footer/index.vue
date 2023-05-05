<template>
    <div class="du-footer">
        <DuButton class="du-footer-button__cancel" type="recommend" full @click="handleCancel"
                  :disabled="cancelButtonDisabled || modalLoading || confirmButtonLoading" v-if="showCancelButton">
            {{ cancelButtonText }}
        </DuButton>
        <DuButton class="du-footer-button__confirm" @click="handleConfirm"
                  :disabled="confirmButtonDisabled || modalLoading " :loading="confirmButtonLoading" full
                  v-if="showConfirmButton">
            {{ confirmButtonText }}
        </DuButton>
    </div>
</template>
<script setup>
import DuButton from '@frontend/du-button/src/Button.vue'
import {computed} from "vue";

const props = defineProps({
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
    }
})

const emits = defineEmits(['confirm', 'cancel'])

const handleCancel = function () {
    emits('cancel')
}

const handleConfirm = function () {
    emits('confirm')
}

</script>
<style lang="scss">
.du-footer {
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 18rpx;
}
</style>
