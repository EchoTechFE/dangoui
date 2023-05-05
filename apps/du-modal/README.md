## @frontend/du-modal

### 使用方式

#### 普通方式

```vue

<template>
  <Modal
      v-model:visible="visible"
      @close="handleClose"
      :modal-loading="modalLoading"
      titleAlign="center"
      :btnLoading="btnLoading"
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
</template>


<script setup>
import {Modal} from "@frontend/du-modal";

const visible = ref(false)
const modalLoading = ref(false)
const btnLoading = ref(false)
const showCloseButton = ref(true)
const showCancelButton = ref(true)
const showConfirmButton = ref(true)
const confirmButtonDisabled = ref(false)
const cancelButtonDisabled = ref(false)
const closeOnClickOverlay = ref(true)
const destroyWhenClosed = ref(false)
const content = ref('kdsjhfkjshfjksavbdfsvbjkdassvbdsavbdsvbadsfbvbasvbasdklbjkdafvjkdfbvjkebdffvkaskbvcjkbjkvcjksbkjkdsjhfkjshfjksavbdfsvbjkdassvbdsavbdsvbadsfbvbasvbasdklbjkdafvjkdfbvjkebdffvkaskbvcjkbjkvcjksbkjkdsjhfkjshfjksavbdfsvbjkdassvbdsavbdsvbadsfbvbasvbasdklbjkdafvjkdfbvjkebdffvkaskbvcjkbjkvcjksbkj')


const handleClick = () => {
  visible.value = true
}

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
</script>
```

#### API模式调用

> 支持链式调用，对应三个方法 - confirm 点击确认按钮 - cancel 点击取消按钮 - close 关闭时

```vue	
<template>
 <Modal ref="modalRef"/>
 <du-button @click="handleOpenModalByAPI">点击显示弹窗</du-button> 
</template>
<script setup>
 import {Modal} from "@frontend/du-modal";
const modalRef = ref(null)
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
                confirmButtonText: '确认按钮 '
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
</script>

```

### API

#### props

- modalLoading - 显示整个对话框中的加载
- btnLoading - 确认按钮加载中
- visible - 控制对话框显示与隐藏
- showCloseButton - 控制是否显示对话框右上角关闭 Icon
- showCancelButton - 是否展示取消按钮
- showConfirmButton - 是否展示确认按钮
- confirmButtonDisabled - 是否禁用确认按钮
- cancelButtonDisabled - 是否禁用取消按钮
- closeOnClickOverlay - 当点击弹层的时候是否关闭 Modal
- destroyWhenClosed - 关闭对话框时销毁对话框中的内容
- cancelButtonText - 取消按钮文案
- confirmButtonText - 确认按钮文案
- width - 弹框宽度（百分比）
- title - 弹窗标题
- titleAlign - 标题文本对齐方式 （left | center）

#### emits

- confirm - 点击确认按钮的时候触发

- close - 关闭弹框时触发，包括：点击右上角按钮、点击遮罩时

- cancel - 点击取消按钮的时候触发

- open - 当对话框打开时触发

- update:visible - v-model 语法糖

  
#### 还有的问题

`destroyWhenClosed` 在小程序中不生效，但是在网页端是可以生效的。这个是利用 `v-if` 和 `v-show` 的区别实现的，该属性为 `true` 时，采用 `v-if` 控制，否则使用 `v-show` 。
查看小程序编译后的代码:

```wxml
<view class="{{['du-transition', c]}}" style="{{'transition:' + d + ';' + ('z-index:' + e)}}">
    <view wx:if="{{a}}" class="du-transition__content--destroy">
        <slot></slot>
    </view>
    <view hidden="{{!b}}" class="du-transition__content--undestroy">
        <slot></slot>
    </view>
</view>
```

目前还没有找到问题所在
