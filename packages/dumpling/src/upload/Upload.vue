<template>
  <div
    :class="[
      'du-upload',
      {
        'du-upload--disabled': disabled,
      },
    ]"
  >
    <div
      v-for="(file, idx) in value"
      :key="file.uid"
      :class="[
        'du-upload__item',
        {
          'du-upload__item--large': size === 'large',
        },
      ]"
    >
      <DuImage :src="file.thumbUrl" />
      <DuIcon
        v-if="!disabled"
        name="close-circle-filled"
        class="du-upload__item-delete"
        @click="handleDelete(file)"
      />
      <div v-if="badge && idx === 0" class="du-upload__item-label">
        {{ badge }}
      </div>
      <div v-if="file.status === 'uploading'" class="du-upload__loading">
        上传中...
      </div>
    </div>
    <div
      v-if="canAdd"
      :class="[
        'du-upload__item-add',
        {
          'du-upload__item-add--large': size === 'large',
        },
      ]"
      @click="handleAdd"
    >
      <DuIcon name="plus-circle" class="du-upload__item-add-plus" />
      <div class="du-upload__item-add-text">{{ uploadText }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import DuImage from '../image/Image.vue'
import DuIcon from '../icon/Icon.vue'
import { GlobalConfigKey } from '../plugins/globalConfig'
import { UploadFile } from './helpers'

const props = withDefaults(
  defineProps<{
    /**
     * 默认上传地址，在 `beforeUpload` 中可以进行改写
     */
    action?: string
    /**
     * 大小
     */
    size: 'large' | 'normal'
    /**
     * 上传文件列表
     */
    value: UploadFile[]
    /**
     * 默认表单中文件字段名称，在 `beforeUpload` 中可以进行改写
     */
    name: string
    /**
     * 默认请求头，在 `beforeUpload` 中可以进行改写
     */
    headers: Record<string, string>
    /**
     * 默认请求数据，在 `beforeUpload` 中可以进行改写
     */
    data: Record<string, string>
    /**
     * 场景值，在我们实践中，一个项目中可能会有多个上传场景，比如头像上传、商品图片上传等
     *
     * 可以在 `UploadFile` 对象中拿到这个值，我们根据这种场景可以进行不同的上传策略
     *
     * 如果对你来说没有这个需求，可以忽略
     */
    scene: string
    /**
     * 第一张图的标签
     */
    badge: string
    /**
     * 是否禁用
     */
    disabled?: boolean
    /**
     * 最大上传数量
     */
    maxCount?: number
    /**
     * 上传按钮中的文案
     */
    uploadText?:
      | ((params: { value: UploadFile[]; maxCount?: number }) => string)
      | string
    /**
     * 在执行上传之前，可以对 `UploadFile` 对象进行改写
     *
     * @param f
     */
    beforeUpload?: (f: UploadFile) => UploadFile | Promise<UploadFile>
    /**
     * 在上传完成响应返回之后，可以对 `UploadFile` 对象进行改写
     *
     * @param f
     */
    beforeResponse: (f: UploadFile) => UploadFile | Promise<UploadFile>
  }>(),
  {
    size: 'normal',
    value: () => [],
    name: 'file',
    headers: () => ({}),
    data: () => ({}),
    scene: '',
    badge: '',
    uploadText: '上传',
    beforeResponse: (f: UploadFile) => f,
  },
)

const emit = defineEmits<{
  (e: 'update:value', value: UploadFile[]): void
}>()

const globalConfig = inject(GlobalConfigKey)

const fileInputRef = ref<HTMLInputElement>()

const canAdd = computed(() => {
  return (
    !props.disabled && (!props.maxCount || props.value.length < props.maxCount)
  )
})

const uploadText = computed(() => {
  if (typeof props.uploadText === 'string') {
    return props.uploadText
  }
  return props.uploadText({
    value: props.value,
    maxCount: props.maxCount,
  })
})

function getLocalImagePreviewUrl(file: File) {
  return new Promise<string>((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      resolve(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  })
}

async function webUpload(f: UploadFile) {
  const form = new FormData()
  form.append('file', f.file!)
  if (f.formData) {
    Object.keys(f.formData ?? {}).forEach((key) => {
      form.append(key, f.formData![key])
    })
  }
  const res = await fetch(f.action ?? '', {
    method: 'POST',
    headers: props.headers ?? {},
    body: form,
  })
  const text = await res.text()

  const nextFile = await props.beforeResponse({
    ...f,
    statusCode: res.status,
    responseText: text,
    chain: undefined,
  })

  if (globalConfig?.upload?.beforeResponse && nextFile.chain !== false) {
    return globalConfig.upload.beforeResponse(nextFile)
  }

  return nextFile
}

async function uniUpload(f: UploadFile) {
  const res = await new Promise<{ statusCode: number; data: string }>(
    (resolve, reject) => {
      // @ts-ignore
      uni.uploadFile({
        url: f.action,
        filePath: f.filePath,
        name: f.name,
        header: f.headers,
        formData: f.formData,
        async success(res: { statusCode: number; data: string }) {
          resolve(res)
        },
        fail(reason: any) {
          reject(reason)
        },
      })
    },
  )
  const nextFile = await props.beforeResponse({
    ...f,
    statusCode: res.statusCode,
    responseText: res.data,
    chain: undefined,
  })

  if (globalConfig?.upload?.beforeResponse && nextFile.chain !== false) {
    return globalConfig.upload.beforeResponse(nextFile)
  }

  return nextFile
}

function uniAdd() {
  // @ts-ignore
  uni.chooseMedia({
    async success(res: any) {
      const uploadFiles = (res.tempFiles as any[]).map((file: any) => {
        const f: UploadFile = {
          uid: Date.now(),
          url: '',
          thumbUrl: file.thumbTempFilePath || file.tempFilePath,
          identifier: '',
          status: 'uploading',
          percent: 0,
          name: file.name,
          filePath: file.tempFilePath,
          headers: props.headers,
          formData: props.data,
          file,
          scene: props.scene,
          action: props.action ?? '',
        }

        return f
      })

      emit('update:value', props.value.concat(uploadFiles))

      for (let uploadFile of uploadFiles) {
        if (props.beforeUpload) {
          uploadFile = await props.beforeUpload(uploadFile)
        }
        if (uploadFile.chain !== false && globalConfig?.upload?.beforeUpload) {
          uploadFile = await globalConfig.upload.beforeUpload(uploadFile)
        }
        uploadFile = await uniUpload(uploadFile)
        const idx = props.value.findIndex((f) => f.uid === uploadFile.uid)
        if (idx >= 0) {
          emit(
            'update:value',
            props.value.map((f, i) => (i === idx ? uploadFile : f)),
          )
        }
      }
    },
    fail() {},
  })
}

function webAdd() {
  if (!fileInputRef.value) {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.style.display = 'none'
    fileInput.addEventListener('change', async () => {
      const file = fileInput.files?.[0]
      if (file) {
        const url = await getLocalImagePreviewUrl(file)
        let uploadFile: UploadFile = {
          uid: Date.now(),
          url: '',
          thumbUrl: url,
          identifier: '',
          status: 'uploading',
          percent: 0,
          name: 'name',
          filePath: '',
          formData: {},
          file,
          scene: props.scene,
          action: props.action ?? '',
        }
        if (props.beforeUpload) {
          uploadFile = await props.beforeUpload(uploadFile)
        }
        if (uploadFile.chain !== false && globalConfig?.upload?.beforeUpload) {
          uploadFile = await globalConfig.upload.beforeUpload(uploadFile)
        }
        emit('update:value', props.value.concat(uploadFile))
        uploadFile = await webUpload(uploadFile)
        const idx = props.value.findIndex((f) => f.uid === uploadFile.uid)
        if (idx >= 0) {
          emit(
            'update:value',
            props.value.map((f, i) => (i === idx ? uploadFile : f)),
          )
        }
      }
    })
    fileInputRef.value = fileInput
    document.body.appendChild(fileInput)
  }

  fileInputRef.value?.click()
}

function handleAdd() {
  if (props.disabled) {
    return
  }

  // TODO: 编译优化，剔除平台不需要的
  // @ts-ignore
  if (typeof uni === 'undefined') {
    webAdd()
  } else {
    uniAdd()
  }
}

function handleDelete(file: UploadFile) {
  emit(
    'update:value',
    props.value.filter((item) => item.uid !== file.uid),
  )
}
</script>
