import DuButton from '../button/Button.vue'

type Dialog = {
  /**
   * 是否展示弹窗
   */
  visible?: boolean
  /**
   * 是否展示内置的头部栏
   */
  headerVisible?: boolean
  /**
   * 点击遮罩层是否关闭
   */
  maskClick?: boolean
  /**
   * 是否展示关闭按钮（当内置头部栏展示时有效）
   */
  closable?: boolean
  /**
   * 禁止将 Popup 渲染到根节点
   */
  disablePortal?: boolean
  /**
   * 弹窗标题
   */
  title?: string
  /**
   * 标题对齐方式，default 为左对齐
   */
  titleAlign?: 'default' | 'center' | undefined
  /**
   * maskClass
   */
  maskClass?: string | string[] | Record<string, boolean>
  /**
   * maskStyle
   */
  maskStyle?: string | { [x: string]: string | number; }
  /**
   * extClass
   */
  extClass?: string | string[] | Record<string, boolean>
  /**
   * extStyle
   */
  extStyle?:
  | string
  | {
    [x: string]: string | number
  }
  /**
   * 底部按钮配置，类型参考Button的属性
   */
  actions?: (InstanceType<typeof DuButton>['$props'] & { onClick: () => void, key: string | number })[]
  /**
   * 按钮排列方式：水平或者垂直
   */
  actionLayout?: 'horizontal' | 'vertical'
  /**
   * Dialog 内容，若不为空，则优先显示该字段，忽略插槽
   */
  content?: string
  /**
   * showOk，是否展示确定按钮
   */
  showOk?: boolean
  /**
   * showCancel，是否展示取消按钮
   */
  showCancel?: boolean
  /**
   * okText，确定按钮的文字
   */
  okText?: string
  /**
   * cancelText，取消按钮的文字
   */
  cancelText?: string
  /**
   * 点击确定时
   */
  onConfirm?: () => void
  /**
   * 点击取消时
   */
  onCancel?: () => void

}

export {
  type Dialog
}