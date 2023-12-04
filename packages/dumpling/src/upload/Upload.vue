<template></template>

<script setup lang="ts">
type UploadFile = {
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
   * 除了文件字段外，其他上传表单中的字段
   */
  formData: Record<string, string>
}

function useUpload(
  files: UploadFile[],
  opts: { name: string; onUpdateValue: (files: UploadFile[]) => void },
) {
  function chooseMedia() {}

  return {
    onUpldateValue: files,
  }
}

const props = defineProps<{
  value: { url: string; identifier: string }[]
  name: string
  headers: Record<string, string>
  data: Record<string, string>
  scene: string
}>()

type Opts = {
  upload: {
    beforeUpload: (file: UploadFile, scene: string) => Promise<string>
  }
}
</script>
