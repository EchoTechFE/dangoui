import { useEffect, type HTMLAttributes, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Button } from './button'
import { Popup, type PopupProps } from './popup'
import { DangoProvider, useDangoConfig, useFeedback } from './provider'
import { colorStyle, cx, useControllable } from './internal'

export interface ActionSheetItem {
  label: string
  value?: string | number
  disabled?: boolean
  danger?: boolean
  icon?: ReactNode
  description?: string
}
export interface ActionSheetProps
  extends Omit<PopupProps, 'children' | 'onSelect'> {
  items: readonly ActionSheetItem[]
  type?: 'list' | 'grid'
  onSelect?: (item: ActionSheetItem, index: number) => void
  closeOnSelect?: boolean
  cancelText?: string
}
export function ActionSheet({
  items,
  type = 'list',
  onSelect,
  closeOnSelect = true,
  cancelText = '取消',
  onOpenChange,
  title = '请选择操作',
  ...props
}: ActionSheetProps) {
  return (
    <Popup
      {...props}
      title={title}
      position="bottom"
      onOpenChange={onOpenChange}
    >
      <div className="du-react-action-sheet" data-type={type}>
        {items.map((item, index) => (
          <button
            type="button"
            key={item.value ?? index}
            disabled={item.disabled}
            data-danger={item.danger}
            onClick={() => {
              onSelect?.(item, index)
              if (closeOnSelect) onOpenChange?.(false, 'confirm')
            }}
          >
            {item.icon}
            <span>
              {item.label}
              {item.description && <small>{item.description}</small>}
            </span>
          </button>
        ))}
      </div>
      <Button
        full
        variant="secondary"
        onClick={() => onOpenChange?.(false, 'cancel')}
      >
        {cancelText}
      </Button>
    </Popup>
  )
}
export interface NoticeBarProps extends HTMLAttributes<HTMLDivElement> {
  text?: ReactNode
  icon?: ReactNode
  linkText?: string
  onLink?: () => void
  closable?: boolean
  onClose?: () => void
  color?: string
  type?: 'primary' | 'secondary'
  layout?: 'horizontal' | 'vertical'
  ellipsis?: boolean
}
export function NoticeBar({
  text,
  icon,
  linkText,
  onLink,
  closable,
  onClose,
  color = 'primary',
  type = 'secondary',
  layout = 'horizontal',
  ellipsis,
  className,
  style,
  children,
  ...props
}: NoticeBarProps) {
  const [open, setOpen] = useControllable<boolean>(undefined, true)
  return open ? (
    <div
      {...props}
      role="status"
      className={cx('du-react-notice-bar', className)}
      data-type={type}
      data-layout={layout}
      style={{ ...colorStyle(color), ...style }}
    >
      {icon}
      <div className="du-react-notice-bar__text" data-ellipsis={ellipsis}>
        {children ?? text}
      </div>
      {linkText && (
        <button type="button" onClick={onLink}>
          {linkText}
        </button>
      )}
      {closable && (
        <button
          type="button"
          aria-label="关闭通知"
          onClick={() => {
            setOpen(false)
            onClose?.()
          }}
        >
          ×
        </button>
      )}
    </div>
  ) : null
}
export interface SnackbarProps extends HTMLAttributes<HTMLDivElement> {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  duration?: number
  offset?: number
  offsetPosition?: 'top' | 'bottom'
  showClose?: boolean
  action?: ReactNode
  icon?: ReactNode
}
export function Snackbar({
  open,
  defaultOpen = true,
  onOpenChange,
  duration = 0,
  offset = 16,
  offsetPosition = 'bottom',
  showClose,
  action,
  icon,
  className,
  style,
  children,
  ...props
}: SnackbarProps) {
  const [visible, setVisible] = useControllable(
      open,
      defaultOpen,
      onOpenChange,
    ),
    config = useDangoConfig()
  useEffect(() => {
    if (!visible || duration <= 0) return
    const timer = setTimeout(() => setVisible(false), duration)
    return () => clearTimeout(timer)
  }, [visible, duration])
  const target = config.portalContainer ?? config.element?.ownerDocument.body
  return visible && target
    ? createPortal(
        <div
          {...props}
          role="status"
          className={cx(
            'du-react',
            `du-theme-${config.theme}`,
            'du-react-snackbar',
            className,
          )}
          style={{
            ...config.tokens,
            [offsetPosition]: `calc(${offset}px + env(safe-area-inset-${offsetPosition}, 0px))`,
            ...style,
          }}
        >
          {icon}
          <span>{children}</span>
          {action}
          {showClose && (
            <button
              type="button"
              aria-label="关闭提示"
              onClick={() => setVisible(false)}
            >
              ×
            </button>
          )}
        </div>,
        target,
      )
    : null
}
export { DangoProvider as ToastProvider }
export const useToast = useFeedback
