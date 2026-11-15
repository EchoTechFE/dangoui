import * as Primitive from '@radix-ui/react-dialog'
import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
  type CSSProperties,
} from 'react'
import { useDangoConfig } from './provider'
import { cx } from './internal'

const AncestorReady = createContext(true)

export type PopupCloseReason =
  | 'escape'
  | 'overlay'
  | 'close-button'
  | 'confirm'
  | 'cancel'
export interface PopupProps
  extends Omit<
    ComponentPropsWithoutRef<typeof Primitive.Content>,
    'title' | 'onOpenChange'
  > {
  open: boolean
  onOpenChange?: (open: boolean, reason: PopupCloseReason) => void
  title?: ReactNode
  description?: ReactNode
  position?: 'top' | 'bottom' | 'center'
  closable?: boolean
  closeOnOverlay?: boolean
  closeOnEscape?: boolean
  safeArea?: boolean
  container?: HTMLElement | null
  overlayClassName?: string
}

export const Popup = forwardRef<HTMLDivElement, PopupProps>(function Popup(
  {
    open,
    onOpenChange,
    title,
    description,
    position = 'center',
    closable = true,
    closeOnOverlay = true,
    closeOnEscape = true,
    safeArea = true,
    container,
    overlayClassName,
    children,
    className,
    style,
    onEscapeKeyDown,
    onPointerDownOutside,
    onInteractOutside,
    onCloseAutoFocus,
    ...props
  },
  ref,
) {
  const config = useDangoConfig()
  const target =
    container ?? config.portalContainer ?? config.element?.ownerDocument.body
  const followsViewport = Boolean(
    target && target === target.ownerDocument.body,
  )
  const ancestorReady = useContext(AncestorReady)
  const [ready, setReady] = useState(false)
  // Parent focus/aria scopes must register before an initially open child layer.
  useEffect(() => {
    setReady(open && Boolean(target) && ancestorReady)
  }, [open, target, ancestorReady])
  const reason = useRef<PopupCloseReason>('close-button')
  const restoreFocus = useRef<HTMLElement | null>(null)
  const content = useRef<HTMLDivElement | null>(null)
  const [viewport, setViewport] = useState<{
    height: number
    width: number
    top: number
    left: number
  } | null>(null)
  useEffect(() => {
    const win = target?.ownerDocument.defaultView,
      visual = win?.visualViewport
    if (!open || !visual || !followsViewport) {
      setViewport(null)
      return
    }
    const update = () => {
      // Page pinch zoom remains a browser concern; this handles keyboard/browser chrome resizing.
      if (visual.scale !== 1) return
      const next = {
        height: visual.height,
        width: visual.width,
        top: visual.offsetTop,
        left: visual.offsetLeft,
      }
      setViewport((previous) =>
        previous &&
        Object.keys(next).every(
          (key) =>
            previous[key as keyof typeof next] ===
            next[key as keyof typeof next],
        )
          ? previous
          : next,
      )
    }
    update()
    visual.addEventListener('resize', update)
    visual.addEventListener('scroll', update)
    return () => {
      visual.removeEventListener('resize', update)
      visual.removeEventListener('scroll', update)
    }
  }, [open, target, followsViewport])
  useLayoutEffect(() => {
    const node = content.current,
      focused = target?.ownerDocument.activeElement
    if (
      !followsViewport ||
      !viewport ||
      !node ||
      !focused ||
      !node.contains(focused)
    )
      return
    const rect = focused.getBoundingClientRect(),
      box = node.getBoundingClientRect()
    const bottom = Math.min(box.bottom, viewport.top + viewport.height) - 12,
      top = Math.max(box.top, viewport.top) + 12
    if (rect.bottom > bottom) node.scrollTop += rect.bottom - bottom
    else if (rect.top < top) node.scrollTop -= top - rect.top
  }, [viewport, target, followsViewport])
  return (
    <Primitive.Root
      open={open}
      onOpenChange={(next) => onOpenChange?.(next, reason.current)}
    >
      {target && ancestorReady && (
        <Primitive.Portal container={target}>
          <Primitive.Overlay
            className={cx(
              'du-react',
              `du-theme-${config.theme}`,
              'du-react-layer',
              'du-react-overlay',
              overlayClassName,
            )}
            style={{
              ...config.tokens,
              ...(followsViewport && viewport
                ? ({
                    top: viewport.top,
                    left: viewport.left,
                    width: viewport.width,
                    height: viewport.height,
                    right: 'auto',
                    bottom: 'auto',
                    '--du-viewport-height': `${viewport.height}px`,
                  } as CSSProperties)
                : {}),
            }}
          >
            <Primitive.Content
              {...props}
              ref={(node) => {
                content.current = node
                if (typeof ref === 'function') ref(node)
                else if (ref) ref.current = node
              }}
              {...(description
                ? {}
                : { 'aria-describedby': props['aria-describedby'] })}
              className={cx(
                'du-react',
                `du-theme-${config.theme}`,
                'du-react-popup',
                `du-react-popup--${position}`,
                safeArea && 'du-react-popup--safe',
                className,
              )}
              style={{ ...config.tokens, ...style }}
              onOpenAutoFocus={(event) => {
                restoreFocus.current = target.ownerDocument
                  .activeElement as HTMLElement | null
                props.onOpenAutoFocus?.(event)
              }}
              onCloseAutoFocus={(event) => {
                onCloseAutoFocus?.(event)
                if (!event.defaultPrevented) {
                  event.preventDefault()
                  if (restoreFocus.current?.isConnected)
                    restoreFocus.current.focus()
                }
              }}
              onEscapeKeyDown={(event) => {
                reason.current = 'escape'
                onEscapeKeyDown?.(event)
                if (!closeOnEscape) event.preventDefault()
              }}
              onPointerDownOutside={(event) => {
                reason.current = 'overlay'
                onPointerDownOutside?.(event)
                if (!closeOnOverlay) event.preventDefault()
              }}
              onInteractOutside={(event) => {
                onInteractOutside?.(event)
                if (!closeOnOverlay) event.preventDefault()
              }}
            >
              {title ? (
                <Primitive.Title className="du-react-popup__title">
                  {title}
                </Primitive.Title>
              ) : (
                <Primitive.Title className="du-react-sr-only">
                  {props['aria-label'] ?? '弹出层'}
                </Primitive.Title>
              )}
              {description && (
                <Primitive.Description className="du-react-popup__description">
                  {description}
                </Primitive.Description>
              )}
              {closable && (
                <Primitive.Close
                  className="du-react-popup__close"
                  aria-label="关闭"
                  onClick={() => {
                    reason.current = 'close-button'
                  }}
                >
                  ×
                </Primitive.Close>
              )}
              <AncestorReady.Provider value={ready}>
                {children}
              </AncestorReady.Provider>
            </Primitive.Content>
          </Primitive.Overlay>
        </Primitive.Portal>
      )}
    </Primitive.Root>
  )
})
