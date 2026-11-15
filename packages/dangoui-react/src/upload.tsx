import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { Button } from './button'
import { Image } from './display'
import { cx } from './internal'
import { useField } from './form'

export type UploadStatus =
  | 'pending'
  | 'uploading'
  | 'success'
  | 'failed'
  | 'cancelled'
export interface UploadFile {
  uid: string
  name: string
  url?: string
  thumbUrl?: string
  file?: File
  status: UploadStatus
  percent?: number
  error?: string
  type?: string
}
export interface UploadResult {
  url: string
  thumbUrl?: string
}
export interface UploadContext {
  signal: AbortSignal
  onProgress: (percent: number) => void
}
export type UploadAdapter = (
  file: UploadFile,
  context: UploadContext,
) => Promise<UploadResult>
export interface UploadHandle {
  addFiles(files: readonly File[]): void
  retry(uid: string): void
  cancel(uid: string): void
  remove(uid: string): void
}
export interface UploadProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  value?: readonly UploadFile[]
  defaultValue?: readonly UploadFile[]
  onValueChange?: (files: UploadFile[]) => void
  upload?: UploadAdapter
  chooseFiles?: (options: {
    signal: AbortSignal
    remaining: number
    accept?: string
  }) => Promise<readonly File[] | null>
  beforeUpload?: (file: File) => boolean | Promise<boolean>
  onUploadError?: (error: unknown, file?: UploadFile) => void
  maxCount?: number
  maxSize?: number
  accept?: string
  multiple?: boolean
  disabled?: boolean
  readOnly?: boolean
  uploadText?: ReactNode
  badge?: string
  size?: 'normal' | 'large'
  onPreview?: (file: UploadFile) => void
  /** Changing this key invalidates all in-flight results, e.g. after switching shops. */
  sessionKey?: string | number
}
let nextUid = 0
export const Upload = forwardRef<UploadHandle, UploadProps>(function Upload(
  {
    value,
    defaultValue = [],
    onValueChange,
    upload,
    chooseFiles,
    beforeUpload,
    onUploadError,
    maxCount = Infinity,
    maxSize = Infinity,
    accept = 'image/*',
    multiple = true,
    disabled,
    readOnly,
    uploadText = '上传',
    badge,
    size = 'normal',
    onPreview,
    sessionKey,
    className,
    id,
    ...props
  },
  ref,
) {
  const field = useField()
  const inactive = disabled ?? field.disabled
  const controlled = useRef(value !== undefined).current
  const [inner, setInner] = useState<readonly UploadFile[]>(defaultValue)
  const current = controlled ? value ?? [] : inner
  const latest = useRef(current),
    input = useRef<HTMLInputElement>(null),
    mounted = useRef(false),
    epoch = useRef(0)
  const jobs = useRef(new Map<string, AbortController>()),
    chooser = useRef<AbortController | null>(null),
    nativeChoiceEpoch = useRef<number | null>(null),
    ownedUrls = useRef(new Map<string, string>())
  const [choosing, setChoosing] = useState(false)
  const settings = useRef({ inactive, readOnly, maxCount, maxSize })
  settings.current = { inactive, readOnly, maxCount, maxSize }
  const callbacks = useRef({
    onValueChange,
    onUploadError,
    upload,
    beforeUpload,
  })
  callbacks.current = { onValueChange, onUploadError, upload, beforeUpload }
  function release(uid: string) {
    const url = ownedUrls.current.get(uid)
    if (url) {
      URL.revokeObjectURL(url)
      ownedUrls.current.delete(uid)
    }
  }
  function commit(next: readonly UploadFile[]) {
    if (!mounted.current) return
    latest.current = next
    if (!controlled) setInner(next)
    callbacks.current.onValueChange?.([...next])
  }
  function update(uid: string, patch: Partial<UploadFile>) {
    if (latest.current.some((item) => item.uid === uid))
      commit(
        latest.current.map((item) =>
          item.uid === uid ? { ...item, ...patch, uid } : item,
        ),
      )
  }
  useLayoutEffect(() => {
    latest.current = current
    for (const [uid, controller] of jobs.current)
      if (!current.some((f) => f.uid === uid)) {
        controller.abort()
        jobs.current.delete(uid)
      }
    for (const uid of ownedUrls.current.keys()) {
      const item = current.find((f) => f.uid === uid),
        url = ownedUrls.current.get(uid)
      if (!item || (item.url !== url && item.thumbUrl !== url)) release(uid)
    }
  }, [current])
  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      epoch.current++
      chooser.current?.abort()
      for (const controller of jobs.current.values()) controller.abort()
      jobs.current.clear()
      for (const uid of ownedUrls.current.keys()) release(uid)
    }
  }, [])
  const previousSession = useRef(sessionKey)
  useLayoutEffect(() => {
    if (previousSession.current === sessionKey) return
    previousSession.current = sessionKey
    epoch.current++
    chooser.current?.abort()
    chooser.current = null
    setChoosing(false)
    for (const controller of jobs.current.values()) controller.abort()
    jobs.current.clear()
    for (const uid of ownedUrls.current.keys()) release(uid)
    commit([])
  }, [sessionKey])
  async function start(file: UploadFile) {
    const old = jobs.current.get(file.uid)
    old?.abort()
    const controller = new AbortController(),
      generation = epoch.current
    jobs.current.set(file.uid, controller)
    const valid = () =>
      mounted.current &&
      generation === epoch.current &&
      !controller.signal.aborted &&
      jobs.current.get(file.uid) === controller &&
      latest.current.some((item) => item.uid === file.uid)
    update(file.uid, { status: 'pending', error: undefined, percent: 0 })
    try {
      if (
        file.file &&
        callbacks.current.beforeUpload &&
        !(await callbacks.current.beforeUpload(file.file))
      ) {
        if (valid()) update(file.uid, { status: 'cancelled' })
        return
      }
      if (!valid()) return
      if (!callbacks.current.upload) return // Local selection mode; host may upload later.
      update(file.uid, { status: 'uploading' })
      const result = await callbacks.current.upload(file, {
        signal: controller.signal,
        onProgress: (percent) => {
          if (valid())
            update(file.uid, { percent: Math.max(0, Math.min(100, percent)) })
        },
      })
      if (valid()) {
        if (!result.url) throw new Error('上传接口未返回 URL')
        update(file.uid, {
          url: result.url,
          thumbUrl: result.thumbUrl ?? file.thumbUrl,
          status: 'success',
          percent: 100,
        })
      }
    } catch (error) {
      if (valid()) {
        update(file.uid, {
          status: 'failed',
          error: error instanceof Error ? error.message : '上传失败',
        })
        callbacks.current.onUploadError?.(error, file)
      }
    } finally {
      if (jobs.current.get(file.uid) === controller)
        jobs.current.delete(file.uid)
    }
  }
  function addFiles(files: readonly File[]) {
    const options = settings.current
    if (!mounted.current || options.inactive || options.readOnly) return
    if (files.length + latest.current.length > options.maxCount) {
      callbacks.current.onUploadError?.(
        new Error(`最多上传 ${options.maxCount} 个文件`),
      )
      return
    }
    const oversized = files.find((f) => f.size > options.maxSize)
    if (oversized) {
      callbacks.current.onUploadError?.(
        new Error(`${oversized.name} 超过文件大小限制`),
      )
      return
    }
    const entries = files.map((file): UploadFile => {
      const uid = `du-upload-${Date.now().toString(36)}-${++nextUid}`
      const preview =
        file.type.startsWith('image/') &&
        typeof URL.createObjectURL === 'function'
          ? URL.createObjectURL(file)
          : undefined
      if (preview) ownedUrls.current.set(uid, preview)
      return {
        uid,
        file,
        name: file.name,
        type: file.type,
        thumbUrl: preview,
        status: 'pending',
        percent: 0,
      }
    })
    commit([...latest.current, ...entries])
    entries.forEach((file) => {
      void start(file)
    })
  }
  function cancel(uid: string) {
    jobs.current.get(uid)?.abort()
    jobs.current.delete(uid)
    update(uid, { status: 'cancelled' })
  }
  function remove(uid: string) {
    jobs.current.get(uid)?.abort()
    jobs.current.delete(uid)
    release(uid)
    commit(latest.current.filter((file) => file.uid !== uid))
  }
  function retry(uid: string) {
    const item = latest.current.find((f) => f.uid === uid)
    if (item && !settings.current.inactive && !settings.current.readOnly)
      void start(item)
  }
  useImperativeHandle(ref, () => ({ addFiles, retry, cancel, remove }))
  async function choose() {
    if (
      settings.current.inactive ||
      settings.current.readOnly ||
      chooser.current
    )
      return
    if (!chooseFiles) {
      nativeChoiceEpoch.current = epoch.current
      input.current?.click()
      return
    }
    const controller = new AbortController(),
      generation = epoch.current
    chooser.current = controller
    setChoosing(true)
    try {
      const files = await chooseFiles({
        signal: controller.signal,
        remaining: maxCount - latest.current.length,
        accept,
      })
      if (
        mounted.current &&
        generation === epoch.current &&
        !controller.signal.aborted &&
        files
      )
        addFiles(files)
    } catch (error) {
      if (
        mounted.current &&
        generation === epoch.current &&
        !controller.signal.aborted &&
        !(error instanceof Error && error.name === 'AbortError')
      )
        callbacks.current.onUploadError?.(error)
    } finally {
      if (chooser.current === controller) {
        chooser.current = null
        if (mounted.current) setChoosing(false)
      }
    }
  }
  return (
    <div
      role="group"
      aria-labelledby={field.labelledBy}
      aria-describedby={field.describedBy}
      aria-invalid={field.invalid || undefined}
      {...props}
      className={cx('du-react-upload', className)}
      data-size={size}
    >
      {current.map((file, index) => (
        <div
          key={file.uid}
          className="du-react-upload__item"
          data-status={file.status}
        >
          <button
            type="button"
            className="du-react-upload__preview"
            aria-label={`预览 ${file.name}`}
            disabled={!onPreview}
            onClick={() => onPreview?.(file)}
          >
            {file.thumbUrl ? (
              <Image src={file.thumbUrl} alt={file.name} />
            ) : (
              <span>{file.name}</span>
            )}
          </button>
          {badge && index === 0 && (
            <span className="du-react-upload__badge">{badge}</span>
          )}
          <span role="status" aria-atomic="true">
            <span className="du-react-sr-only">{file.name}：</span>
            {file.status === 'uploading'
              ? '上传中'
              : file.status === 'failed'
                ? file.error ?? '上传失败'
                : file.status === 'cancelled'
                  ? '已取消'
                  : file.status === 'pending'
                    ? '待上传'
                    : '已上传'}
          </span>
          {file.status === 'uploading' && (
            <span
              role="progressbar"
              aria-label={`${file.name} 上传进度`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(file.percent ?? 0)}
            >
              {Math.round(file.percent ?? 0)}%
            </span>
          )}
          {!inactive && !readOnly && (
            <div className="du-react-upload__actions">
              <button
                type="button"
                aria-label={`删除 ${file.name}`}
                onClick={() => remove(file.uid)}
              >
                删除
              </button>
              {(file.status === 'uploading' || file.status === 'pending') &&
                upload && (
                  <button
                    type="button"
                    aria-label={`取消 ${file.name}`}
                    onClick={() => cancel(file.uid)}
                  >
                    取消
                  </button>
                )}
              {['failed', 'cancelled'].includes(file.status) && upload && (
                <button
                  type="button"
                  aria-label={`重试 ${file.name}`}
                  onClick={() => retry(file.uid)}
                >
                  重试
                </button>
              )}
            </div>
          )}
        </div>
      ))}
      {!readOnly && current.length < maxCount && (
        <Button
          variant="outline"
          disabled={inactive}
          loading={choosing}
          onClick={choose}
        >
          {uploadText}
        </Button>
      )}
      <input
        ref={input}
        id={id ?? field.id}
        type="file"
        aria-label={field.labelledBy ? undefined : '选择上传文件'}
        aria-labelledby={field.labelledBy}
        aria-describedby={field.describedBy}
        aria-invalid={field.invalid || undefined}
        aria-required={field.required || undefined}
        required={field.required && current.length === 0}
        className="du-react-sr-only"
        tabIndex={-1}
        accept={accept}
        multiple={multiple}
        disabled={inactive || readOnly}
        onClick={(event) => {
          if (chooseFiles) {
            event.preventDefault()
            void choose()
          } else nativeChoiceEpoch.current = epoch.current
        }}
        onChange={(event) => {
          if (
            nativeChoiceEpoch.current === null ||
            nativeChoiceEpoch.current === epoch.current
          )
            addFiles(Array.from(event.currentTarget.files ?? []))
          nativeChoiceEpoch.current = null
          event.currentTarget.value = ''
        }}
      />
    </div>
  )
})
