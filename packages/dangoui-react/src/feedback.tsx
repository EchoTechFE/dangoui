import { useEffect, useSyncExternalStore, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Dialog, type DialogProps } from './dialog'
import { ImagePreview, type ImagePreviewProps } from './image-preview'
import { Loading } from './loading'
import { useDangoConfig } from './provider'
import { cx } from './internal'

export type FeedbackReason =
  | 'confirm'
  | 'cancel'
  | 'close'
  | 'timeout'
  | 'unmount'
export interface FeedbackResult {
  reason: FeedbackReason
}
export interface FeedbackHandle {
  readonly id: number
  close(): void
  readonly result: Promise<FeedbackResult>
}
export interface ToastOptions {
  message: ReactNode
  duration?: number
  loading?: boolean
}
export type DialogOptions = Omit<
  DialogProps,
  'open' | 'onOpenChange' | 'onConfirmed' | 'onCancel'
>
export type ImagePreviewOptions = Omit<
  ImagePreviewProps,
  'open' | 'onOpenChange'
>
type Entry = { id: number; settle: (result: FeedbackResult) => void } & (
  | { kind: 'toast'; options: ToastOptions }
  | { kind: 'dialog'; options: DialogOptions }
  | { kind: 'preview'; options: ImagePreviewOptions }
)

/** One controller per Provider; usable by non-React services without a global root. */
export function createFeedback() {
  let entries: readonly Entry[] = []
  let nextId = 0
  let attachments = 0
  let disposed = false
  const listeners = new Set<() => void>()
  function emit() {
    listeners.forEach((listener) => listener())
  }
  function close(id: number, reason: FeedbackReason = 'close') {
    const entry = entries.find((entry) => entry.id === id)
    if (!entry) return
    entries = entries.filter((entry) => entry.id !== id)
    entry.settle({ reason })
    emit()
  }
  function closeAll(reason: FeedbackReason = 'close') {
    const previous = entries
    entries = []
    previous.forEach((entry) => entry.settle({ reason }))
    emit()
  }
  function add(
    item:
      | Omit<Extract<Entry, { kind: 'toast' }>, 'id' | 'settle'>
      | Omit<Extract<Entry, { kind: 'dialog' }>, 'id' | 'settle'>
      | Omit<Extract<Entry, { kind: 'preview' }>, 'id' | 'settle'>,
  ): FeedbackHandle {
    const id = ++nextId
    let settle!: (value: FeedbackResult) => void
    const result = new Promise<FeedbackResult>((resolve) => {
      settle = resolve
    })
    if (disposed) {
      settle({ reason: 'unmount' })
      return { id, close: () => {}, result }
    }
    entries = [...entries, { ...item, id, settle }]
    emit()
    return { id, close: () => close(id), result }
  }
  return {
    showToast: (options: ToastOptions | string) =>
      add({
        kind: 'toast',
        options: typeof options === 'string' ? { message: options } : options,
      }),
    showLoadingToast: (
      options: Omit<ToastOptions, 'loading'> | string = '加载中',
    ) =>
      add({
        kind: 'toast',
        options: {
          ...(typeof options === 'string' ? { message: options } : options),
          loading: true,
          duration: 0,
        },
      }),
    showDialog: (options: DialogOptions) => add({ kind: 'dialog', options }),
    showConfirmDialog: (options: DialogOptions) =>
      add({ kind: 'dialog', options: { ...options, showCancel: true } }),
    showImagePreview: (options: ImagePreviewOptions) =>
      add({ kind: 'preview', options }),
    close,
    closeAll,
    getSnapshot: () => entries,
    subscribe: (listener: () => void) => {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    attach: () => {
      if (attachments)
        throw new Error(
          'A feedback controller can only belong to one mounted DangoProvider',
        )
      attachments++
      disposed = false
      return () => {
        attachments--
        // StrictMode's synchronous detach/attach cycle must not destroy feedback.
        queueMicrotask(() => {
          if (!attachments) {
            disposed = true
            closeAll('unmount')
          }
        })
      }
    },
  }
}
export type FeedbackController = ReturnType<typeof createFeedback>

function Toast({
  entry,
  close,
}: {
  entry: Extract<Entry, { kind: 'toast' }>
  close: FeedbackController['close']
}) {
  const duration = entry.options.duration ?? 2000
  useEffect(() => {
    if (duration <= 0) return
    const timer = setTimeout(() => close(entry.id, 'timeout'), duration)
    return () => clearTimeout(timer)
  }, [duration, close, entry.id])
  return (
    <div className="du-react-toast" role="status" aria-live="polite">
      {entry.options.loading && <Loading />}
      {entry.options.message}
    </div>
  )
}

export function FeedbackHost({
  controller,
}: {
  controller: FeedbackController
}) {
  const config = useDangoConfig()
  const target = config.portalContainer ?? config.element?.ownerDocument.body
  const entries = useSyncExternalStore(
    controller.subscribe,
    controller.getSnapshot,
    controller.getSnapshot,
  )
  return (
    <>
      {target &&
        createPortal(
          <div
            className={cx(
              'du-react',
              `du-theme-${config.theme}`,
              'du-react-toast-region',
            )}
            style={config.tokens}
            aria-live="polite"
          >
            {entries.map(
              (entry) =>
                entry.kind === 'toast' && (
                  <Toast
                    key={entry.id}
                    entry={entry}
                    close={controller.close}
                  />
                ),
            )}
          </div>,
          target,
        )}
      {entries.map((entry) => {
        if (entry.kind === 'toast') return null
        if (entry.kind === 'preview')
          return (
            <ImagePreview
              key={entry.id}
              {...entry.options}
              open
              onOpenChange={() => controller.close(entry.id)}
            />
          )
        return (
          <Dialog
            key={entry.id}
            {...entry.options}
            open
            onConfirmed={() => controller.close(entry.id, 'confirm')}
            onCancel={() => controller.close(entry.id, 'cancel')}
            onOpenChange={(_open, reason) =>
              controller.close(
                entry.id,
                reason === 'cancel' ? 'cancel' : 'close',
              )
            }
          />
        )
      })}
    </>
  )
}
