import '@frontend/du-styles/styles/index.scss'
import {Modal} from "@frontend/du-modal";
import {DuButton} from "@frontend/du-button";
import {onMounted, ref, watch} from 'vue'
import {DuInput} from '@frontend/du-input'

export default {
    title: 'Modal',
    component: Modal,
    argTypes: {
        onClose: {
            action: 'close',
        },
    },
}

const Template = (args) => ({
    components: {
        Modal,
        DuButton,
        DuInput
    },
    setup: () => {
        const visible = ref(false)
        const modalLoading = ref(false)
        const btnLoading = ref(false)
        const showCloseButton = ref(true)
        const showCancelButton = ref(true)
        const showConfirmButton = ref(true)
        const confirmButtonDisabled = ref(false)
        const cancelButtonDisabled = ref(false)
        const closeOnClickOverlay = ref(true)
        const destroyWhenClosed = ref(true)
        const content = ref('kdsjhfkjshfjksavbdfsvbjkdassvbdsavbdsvbadsfbvbasvbasdklbjkdafvjkdfbvjkebdffvkaskbvcjkbjkvcjksbkjkdsjhfkjshfjksavbdfsvbjkdassvbdsavbdsvbadsfbvbasvbasdklbjkdafvjkdfbvjkebdffvkaskbvcjkbjkvcjksbkjkdsjhfkjshfjksavbdfsvbjkdassvbdsavbdsvbadsfbvbasvbasdklbjkdafvjkdfbvjkebdffvkaskbvcjkbjkvcjksbkj')

        const modalRef = ref(null)
        const handleClick = () => {
            visible.value = true
        }

        onMounted(() => {
            console.log(visible.value, modalLoading.value, 'visible.value, modalLoading.value')
        })

        const handleClose = () => {
            console.log('handleClose')
            visible.value = false
        }

        const handleCancel = () => {
            handleClose()
        }

        const handleModalLoading = () => {
            modalLoading.value = true
            let timerB = setTimeout(() => {
                clearTimeout(timerB)
                modalLoading.value = false
            }, 4000)
        }

        const handleOpen = function () {
            console.log('handleOpen')
        }

        const handleConfirm = function () {
            console.log('handleConfirm')
        }

        const handleOpenModalByAPI = function () {
            modalRef.value.open({
                showCloseButton: true,
                content: 'ajkidsfhsijkahgfckjsdbcvvjkdsbckjbd',
                title: '测试弹窗',
                titleAlign: 'center',
                width: 60,
                showCancelButton: true,
                showConfirmButton: true,
                closeOnClickOverlay:true,
                cancelButtonText: '取消按钮',
                confirmButtonText: '确认按钮 ',
            }).confirm(() => {
                console.log('confirm 1')
            }).confirm(() => {
                console.log('confirm 2')
            }).cancel(() => {
                console.log('cancel 1')
            }).cancel(() => {
                console.log('cancel 2')
            }).close(() => {
                console.log('close 1')
            }).close(() => {
                console.log('close 2')
            })
        }

        return {
            visible,
            handleClick,
            handleClose,
            modalLoading,
            handleCancel,
            handleModalLoading,
            btnLoading,
            showCloseButton,
            showCancelButton,
            showConfirmButton,
            confirmButtonDisabled,
            cancelButtonDisabled,
            closeOnClickOverlay,
            destroyWhenClosed,
            handleOpen,
            handleConfirm,
            content,
            modalRef,
            handleOpenModalByAPI
        }
    },
    template: `
      <h2>普通使用</h2>
      <div>
      <Modal
          :extStyle="{width: '80%'}"
          :visible="visible"
          @close="handleClose"
          :modal-loading="modalLoading"
          titleAlign="center"
          :confirmButtonLoading="btnLoading"
          :showCancelButton="showCancelButton"
          :showConfirmButton="showConfirmButton"
          :confirmButtonDisabled="confirmButtonDisabled"
          :cancelButtonDisabled="cancelButtonDisabled"
          :closeOnClickOverlay="closeOnClickOverlay"
          :destroyWhenClosed="destroyWhenClosed"
          :showCloseButton="showCloseButton"
          :content="content"
          @cancel="handleCancel"
          @open="handleOpen"
          @confirm="handleConfirm"
      >
        点击显示Modal加载中点击显示Modal加载中点击显示Modal加载中点击显示Modal加载中点击显示Modal加载中点击显示Modal加载中点击显示Modal加载中点击显示Modal加载中点击显示Modal加载中点击显示Modal加载中点击显示Modal加载中点击显示Modal加载中点击显示Modal加载中点击显示Modal加载中点击显示Modal加载中点击显示Modal加载中点击显示Modal加载中点击显示Modal加载中点击显示Modal加载中点击显示Modal加载中 
        <du-input/>
        <div>
          <du-button @click="handleModalLoading">点击显示Modal加载中</du-button>
        </div>
        <du-button @click="btnLoading = !btnLoading">点击{{ btnLoading ? '隐藏' : '显示' }}按钮加载中</du-button>
      </Modal>
      <div style="display: flex; gap: 10px; flex-wrap: wrap">

        <du-button @click="showCloseButton = !showCloseButton">{{ showCloseButton ? '隐藏' : '显示' }}关闭按钮
        </du-button>
        <du-button @click="showCancelButton = !showCancelButton">
          {{ showCancelButton ? '隐藏' : '显示' }}取消按钮
        </du-button>
        <du-button @click="showConfirmButton = !showConfirmButton">
          {{ showConfirmButton ? '隐藏' : '显示' }}确认按钮
        </du-button>
        <du-button @click="confirmButtonDisabled = !confirmButtonDisabled">
          {{ confirmButtonDisabled ? '启用' : '禁用' }}确认按钮
        </du-button>
        <du-button @click="cancelButtonDisabled = !cancelButtonDisabled">
          {{ cancelButtonDisabled ? '启用' : '禁用' }}取消按钮
        </du-button>
        <du-button @click="destroyWhenClosed = !destroyWhenClosed">
          关闭时{{ destroyWhenClosed ? '不' : '' }}销毁Modal中的内容
        </du-button>
        <du-button @click="closeOnClickOverlay = !closeOnClickOverlay">
          点击遮罩时{{ closeOnClickOverlay ? '不' : '' }}关闭Modal
        </du-button>
        <du-button @click="handleClick">点击显示弹窗</du-button>
      </div>
      </div>
      <h2>API 方式使用</h2>
      <Modal ref="modalRef"/>
      <du-button @click="handleOpenModalByAPI">点击显示弹窗</du-button> 
    `
})

export const Default = Template.bind({})

Default.args = {}

