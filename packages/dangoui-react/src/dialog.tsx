import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Popup, type PopupProps } from './popup'
import { Button } from './button'

export interface DialogProps extends PopupProps {
  message?: ReactNode
  confirmText?: string
  cancelText?: string
  showCancel?: boolean
  /** Return false to keep open; rejected errors use confirmErrorMessage. */
  onConfirm?: () => void | boolean | Promise<void | boolean>
  onConfirmed?: () => void
  onCancel?: () => void
  onConfirmError?: (error: unknown) => void
  confirmErrorMessage?: string
}

export function Dialog({
  message,
  children,
  confirmText = '确定',
  cancelText = '取消',
  showCancel = false,
  onConfirm,
  onConfirmed,
  onCancel,
  onConfirmError,
  confirmErrorMessage = '操作失败，请重试',
  open,
  onOpenChange,
  ...props
}: DialogProps) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const busy = useRef(false)
  const generation = useRef(0)
  useEffect(() => {
    generation.current++
    busy.current = false
    setPending(false)
    setError('')
    return () => {
      generation.current++
    }
  }, [open])
  async function confirm() {
    if (busy.current) return
    busy.current = true
    const current = generation.current
    setPending(true)
    setError('')
    try {
      const result = await onConfirm?.()
      if (current === generation.current && result !== false) {
        onConfirmed?.()
        onOpenChange?.(false, 'confirm')
      }
    } catch (err) {
      if (current === generation.current) {
        setError(confirmErrorMessage)
        onConfirmError?.(err)
      }
    } finally {
      if (current === generation.current) {
        busy.current = false
        setPending(false)
      }
    }
  }
  return (
    <Popup
      {...props}
      className={`du-react-dialog ${props.className ?? ''}`.trim()}
      open={open}
      position="center"
      closable={false}
      closeOnOverlay={props.closeOnOverlay ?? false}
      onOpenChange={(next, reason) => {
        if (!busy.current) onOpenChange?.(next, reason)
      }}
    >
      <div className="du-react-dialog__body">
        {message}
        {children}
        {error && <p role="alert">{error}</p>}
      </div>
      <div className="du-react-dialog__actions">
        {showCancel && (
          <Button
            full
            variant="secondary"
            disabled={pending}
            onClick={() => {
              onCancel?.()
              onOpenChange?.(false, 'cancel')
            }}
          >
            {cancelText}
          </Button>
        )}
        <Button full loading={pending} onClick={confirm}>
          {confirmText}
        </Button>
      </div>
    </Popup>
  )
}
