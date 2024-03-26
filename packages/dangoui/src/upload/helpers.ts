export type UploadFile = {
  /**
   * 自动生成的 ID
   */
  uid: number
  /**
   * 资源下载
   */
  url: string
  /**
   * 缩略图链接，默认与 url 一致
   */
  thumbUrl: string
  /**
   * 代表上传后代表文件的唯一标识
   * 默认为上传后的 URL，你可以根据自己的场景来定义
   * 比如可以是文件的 path，或者你们自己的抽象的 xxx
   */
  identifier: string
  /**
   * 状态
   */
  status: 'uploading' | 'done' | 'error'
  /**
   * 上传百分比
   */
  percent: number
  /**
   * 上传文件对应的字段
   */
  name: string
  /**
   * 文件路径（小程序）
   */
  filePath: string
  /**
   * 文件（浏览器）
   */
  file?: File
  /**
   * headers
   */
  headers?: Record<string, string>
  /**
   * 除了文件字段外，其他上传表单中的字段
   */
  formData?: Record<string, string>
  /**
   * statusCode
   */
  statusCode?: number
  /**
   * responseText
   */
  responseText?: string
  /**
   * 是否进一步交给下一个处理函数（全局函数）处理
   */
  chain?: boolean
  /**
   * 场景值
   */
  scene: string
  /**
   * action
   */
  action: string
}

let idx = 1

export function getNextUid() {
  return idx++
}
