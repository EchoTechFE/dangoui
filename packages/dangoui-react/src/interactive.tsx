import {
  Children,
  forwardRef,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { useDangoConfig } from './provider'
import { colorStyle, cx, useControllable } from './internal'

export interface StickyProps extends HTMLAttributes<HTMLDivElement> {
  top?: number | string
  z?: number
}
export const Sticky = forwardRef<HTMLDivElement, StickyProps>(function Sticky(
  { top = 0, z = 99, style, className, ...props },
  ref,
) {
  return (
    <div
      {...props}
      ref={ref}
      className={cx('du-react-sticky', className)}
      style={{ position: 'sticky', top, zIndex: z, ...style }}
    />
  )
})
export interface TransitionProps extends HTMLAttributes<HTMLDivElement> {
  show?: boolean
  name?: 'fadeInUp' | 'fade'
  duration?: number
  unmountOnExit?: boolean
  onAfterEnter?: () => void
  onAfterLeave?: () => void
}
export function Transition({
  show = true,
  name = 'fadeInUp',
  duration = 200,
  unmountOnExit = true,
  onAfterEnter,
  onAfterLeave,
  className,
  style,
  children,
  ...props
}: TransitionProps) {
  const wasVisible = useRef(show)
  const [present, setPresent] = useState(show),
    callbacks = useRef({ onAfterEnter, onAfterLeave })
  callbacks.current = { onAfterEnter, onAfterLeave }
  useEffect(() => {
    if (show) {
      wasVisible.current = true
      setPresent(true)
    } else if (!wasVisible.current) return
    const timer = setTimeout(
      () => {
        if (show) callbacks.current.onAfterEnter?.()
        else {
          wasVisible.current = false
          setPresent(false)
          callbacks.current.onAfterLeave?.()
        }
      },
      Math.max(0, duration),
    )
    return () => clearTimeout(timer)
  }, [show, duration])
  if (!present && !show && unmountOnExit) return null
  return (
    <div
      {...props}
      hidden={!show && !present}
      className={cx('du-react-transition', className)}
      data-name={name}
      data-state={show ? 'open' : 'closed'}
      style={
        {
          '--du-transition-duration': `${Math.max(0, duration)}ms`,
          ...style,
        } as CSSProperties
      }
    >
      {children}
    </div>
  )
}
export interface NavigationBarProps extends HTMLAttributes<HTMLElement> {
  title?: string
  back?: boolean
  backIcon?: ReactNode
  onBack?: () => void
  share?: boolean
  onShare?: () => void
  right?: ReactNode
  fixed?: boolean
  placeholder?: boolean
  center?: boolean
  transparent?: boolean
  transparentFrontColor?: 'white' | 'black'
  appearThreshold?: number
  alwaysShowContent?: boolean
  color?: string
  /** Defaults to the nearest ancestor with vertical scrolling, then ownerWindow. */
  scrollTarget?:
    | HTMLElement
    | Window
    | null
    | (() => HTMLElement | Window | null)
}
export function NavigationBar({
  title,
  back = true,
  backIcon = '‹',
  onBack,
  share,
  onShare,
  right,
  fixed,
  placeholder = true,
  center,
  transparent,
  transparentFrontColor,
  appearThreshold = 100,
  alwaysShowContent,
  color,
  scrollTarget,
  children,
  className,
  style,
  ...props
}: NavigationBarProps) {
  const element = useRef<HTMLElement>(null),
    [progress, setProgress] = useState(0)
  useEffect(() => {
    if (!transparent) return
    const node = element.current,
      win = node?.ownerDocument.defaultView
    if (!node || !win) return
    const target =
      typeof scrollTarget === 'function' ? scrollTarget() : scrollTarget
    const source = () => {
      if (target) return target
      let ancestor = node.parentElement
      while (ancestor && ancestor !== node.ownerDocument.body) {
        if (
          /(auto|scroll|overlay)/.test(
            win.getComputedStyle(ancestor).overflowY,
          ) &&
          ancestor.scrollHeight > ancestor.clientHeight
        ) {
          return ancestor
        }
        ancestor = ancestor.parentElement
      }
      return win
    }
    const update = () => {
      const current = source()
      const offset = 'document' in current ? current.scrollY : current.scrollTop
      setProgress(
        Math.max(0, Math.min(1, offset / Math.max(1, appearThreshold))),
      )
    }
    update()
    // Capture ancestor scrolls too, so content becoming scrollable after mount works.
    const listener = target ?? win
    listener.addEventListener('scroll', update, {
      passive: true,
      capture: !target,
    })
    win.addEventListener('resize', update)
    return () => {
      listener.removeEventListener('scroll', update, !target)
      win.removeEventListener('resize', update)
    }
  }, [transparent, appearThreshold, scrollTarget])

  return (
    <>
      {fixed && placeholder && (
        <div
          className="du-react-navigation-bar__placeholder"
          aria-hidden="true"
        />
      )}
      <nav
        {...props}
        ref={element}
        aria-label={props['aria-label'] ?? '页面导航'}
        className={cx('du-react-navigation-bar', className)}
        data-fixed={fixed}
        data-center={center}
        data-transparent={transparent || undefined}
        style={{
          ...colorStyle(color),
          ...(transparent
            ? ({
                '--du-nav-opacity': progress,
                ...(transparentFrontColor && progress < 1
                  ? { color: transparentFrontColor }
                  : {}),
              } as CSSProperties)
            : {}),
          ...style,
        }}
      >
        {back && (
          <button type="button" aria-label="返回" onClick={onBack}>
            {backIcon}
          </button>
        )}
        <div
          className="du-react-navigation-bar__title"
          style={{ opacity: transparent && !alwaysShowContent ? progress : 1 }}
        >
          {children ?? title}
        </div>
        {right}
        {share && (
          <button type="button" aria-label="分享" onClick={onShare}>
            ↗
          </button>
        )}
      </nav>
    </>
  )
}
export interface RateProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  count?: number
  half?: boolean
  disabled?: boolean
  readOnly?: boolean
  clickable?: boolean
  size?: 'mini' | 'small' | 'normal' | 'medium' | 'large'
  color?: string
  icon?: ReactNode
  withText?: boolean
  textList?: readonly string[]
}
export function Rate({
  value,
  defaultValue = 0,
  onValueChange,
  count = 5,
  half,
  disabled,
  readOnly,
  clickable = true,
  size = 'normal',
  color = 'warning',
  icon = '★',
  withText,
  textList,
  className,
  style,
  ...props
}: RateProps) {
  const [current, setCurrent] = useControllable(
      value,
      defaultValue,
      onValueChange,
    ),
    name = useId(),
    step = half ? 0.5 : 1,
    total = Math.max(0, Math.floor(count))
  return (
    <div
      {...props}
      role="radiogroup"
      aria-label={props['aria-label'] ?? '评分'}
      className={cx('du-react-rate', className)}
      data-size={size}
      style={{ ...colorStyle(color), ...style }}
    >
      {Array.from({ length: total }, (_, index) => (
        <span key={index} className="du-react-rate__star">
          <span className="du-react-rate__empty" aria-hidden="true">
            {icon}
          </span>
          <span
            className="du-react-rate__fill"
            aria-hidden="true"
            style={{
              width: `${Math.max(0, Math.min(1, current - index)) * 100}%`,
            }}
          >
            {icon}
          </span>
          {Array.from({ length: half ? 2 : 1 }, (_, part) => {
            const score = index + (part + 1) * step
            return (
              <input
                key={score}
                type="radio"
                name={name}
                aria-label={`${score} 分`}
                checked={current === score}
                disabled={disabled}
                aria-readonly={readOnly || !clickable || undefined}
                value={score}
                style={{
                  left: half ? `${part * 50}%` : 0,
                  width: half ? '50%' : '100%',
                }}
                onClick={(event) => {
                  if (readOnly || !clickable) event.preventDefault()
                }}
                onChange={() => {
                  if (!readOnly && clickable) setCurrent(score)
                }}
              />
            )
          })}
        </span>
      ))}
      {withText && (
        <span>
          {(current > 0 ? textList?.[Math.ceil(current) - 1] : undefined) ??
            `${current} 分`}
        </span>
      )}
    </div>
  )
}
export interface TooltipProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'title' | 'content'> {
  title?: ReactNode
  content?: ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  placement?: 'top' | 'bottom'
  delay?: number
}
export function Tooltip({
  title,
  content,
  open,
  defaultOpen = false,
  onOpenChange,
  placement = 'top',
  delay = 150,
  children,
  className,
  ...props
}: TooltipProps) {
  const config = useDangoConfig(),
    [visible, setVisible] = useControllable(open, defaultOpen, onOpenChange),
    id = useId(),
    anchor = useRef<HTMLSpanElement>(null),
    timer = useRef<ReturnType<typeof setTimeout> | null>(null),
    [position, setPosition] = useState({ left: 0, top: 0 })
  const latest = useRef(setVisible)
  latest.current = setVisible
  function clear() {
    if (timer.current) clearTimeout(timer.current)
  }
  function close() {
    clear()
    latest.current(false)
  }
  function enter() {
    clear()
    timer.current = setTimeout(() => latest.current(true), delay)
  }
  useEffect(() => () => clear(), [])
  useEffect(() => {
    if (!visible || !anchor.current) return
    const win = anchor.current.ownerDocument.defaultView
    function update() {
      const rect = anchor.current?.getBoundingClientRect()
      if (rect)
        setPosition({
          left: rect.left + rect.width / 2,
          top: placement === 'top' ? rect.top - 8 : rect.bottom + 8,
        })
    }
    function escape(event: KeyboardEvent) {
      if (event.key === 'Escape') close()
    }
    update()
    win?.addEventListener('resize', update)
    win?.addEventListener('scroll', update, true)
    win?.addEventListener('keydown', escape)
    return () => {
      win?.removeEventListener('resize', update)
      win?.removeEventListener('scroll', update, true)
      win?.removeEventListener('keydown', escape)
    }
  }, [visible, placement])
  const target = config.portalContainer ?? config.element?.ownerDocument.body
  return (
    <>
      <span
        {...props}
        ref={anchor}
        tabIndex={props.tabIndex ?? 0}
        aria-describedby={visible ? id : undefined}
        className={cx('du-react-tooltip-trigger', className)}
        onMouseEnter={(e) => {
          props.onMouseEnter?.(e)
          enter()
        }}
        onMouseLeave={(e) => {
          props.onMouseLeave?.(e)
          close()
        }}
        onFocus={(e) => {
          props.onFocus?.(e)
          enter()
        }}
        onBlur={(e) => {
          props.onBlur?.(e)
          if (!e.currentTarget.contains(e.relatedTarget as Node)) close()
        }}
      >
        {children}
      </span>
      {visible &&
        target &&
        createPortal(
          <div
            id={id}
            role="tooltip"
            className={cx(
              'du-react',
              `du-theme-${config.theme}`,
              'du-react-tooltip',
            )}
            data-placement={placement}
            style={{ ...config.tokens, ...position }}
          >
            {content ?? title}
          </div>,
          target,
        )}
    </>
  )
}
export interface SwiperProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  autoplay?: boolean
  interval?: number
  loop?: boolean
  indicatorType?: 'bar-full' | 'bar' | 'number'
  label?: string
  duration?: number
}
function slideOffset(
  index: number,
  current: number,
  count: number,
  loop: boolean,
  direction: number,
) {
  const offset = index - current
  if (!loop || count < 2) return offset
  const forward = (offset + count) % count
  if (forward > count / 2 || (forward === count / 2 && direction < 0))
    return forward - count
  return forward
}
export function Swiper({
  value,
  defaultValue = 0,
  onValueChange,
  autoplay,
  interval = 3000,
  loop = true,
  indicatorType = 'bar',
  label = '轮播',
  duration = 250,
  children,
  className,
  style,
  ...props
}: SwiperProps) {
  const slides = Children.toArray(children),
    [selected, setSelected] = useControllable(
      value,
      defaultValue,
      onValueChange,
    ),
    [paused, setPaused] = useState(false),
    [reduced, setReduced] = useState(false),
    [interacting, setInteracting] = useState(false),
    track = useRef<HTMLDivElement>(null),
    touch = useRef<{
      id: number
      x: number
      y: number
      horizontal: boolean
    } | null>(null),
    [drag, setDrag] = useState(0)
  const requested = useRef<{ from: number; to: number; step: number } | null>(
    null,
  )
  const current = Math.max(0, Math.min(selected, slides.length - 1)),
    move = (next: number) => {
      if (!slides.length) return
      const direction = Math.sign(next - current) || 1
      const destination = loop
        ? (next + slides.length) % slides.length
        : Math.max(0, Math.min(slides.length - 1, next))
      requested.current = {
        from: current,
        to: destination,
        step: direction,
      }
      setSelected(destination)
    }
  const motion = useRef({
    current,
    drag: 0,
    direction: 1,
    count: slides.length,
    loop,
  })
  useLayoutEffect(() => {
    const nodes = track.current?.querySelectorAll<HTMLElement>(
      ':scope > .du-react-swiper__viewport > .du-react-swiper__slide',
    )
    if (!nodes) return
    const previous = motion.current
    const topologyChanged =
      previous.count !== slides.length || previous.loop !== loop
    let step = current - previous.current
    // Duration/motion preference updates must not rebase resting offscreen pages through the viewport.
    if (!step && !drag && !previous.drag && !topologyChanged) return
    if (loop && !topologyChanged && slides.length > 1 && step) {
      // Adjacent first/last navigation must keep its requested direction, including two slides.
      if (
        slides.length === 2 &&
        requested.current?.from === previous.current &&
        requested.current.to === current
      )
        step = requested.current.step
      else if (Math.abs(step) > slides.length / 2)
        step -= Math.sign(step) * slides.length
    }
    const facing = step
      ? Math.sign(step)
      : drag
        ? -Math.sign(drag)
        : previous.direction
    const offset = (index: number) =>
      slideOffset(index, previous.current, slides.length, loop, facing)
    if (step && !topologyChanged && !reduced) {
      // Reposition only offscreen slides before the animation. Each child stays mounted once,
      // avoiding cloned form fields, IDs and local state at the circular seam.
      nodes.forEach((node, index) => {
        node.style.transitionDuration = '0ms'
        node.style.transform = `translateX(calc(${offset(index) * 100}% + ${
          previous.drag
        }px))`
      })
      // Commit the offscreen positions before transitioning the outgoing/incoming neighbours.
      void track.current?.offsetWidth
    }
    nodes.forEach((node, index) => {
      const position =
        step && !topologyChanged
          ? offset(index) - step
          : slideOffset(index, current, slides.length, loop, facing)
      node.style.transform = `translateX(calc(${position * 100}% + ${drag}px))`
      node.style.transitionDuration =
        drag || reduced || topologyChanged
          ? '0ms'
          : `${Math.max(0, duration)}ms`
    })
    motion.current = {
      current,
      drag,
      direction: facing,
      count: slides.length,
      loop,
    }
  }, [current, drag, slides.length, loop, duration, reduced])
  const tick = useRef(() => move(current + 1))
  tick.current = () => move(current + 1)
  useEffect(() => {
    const media = track.current?.ownerDocument.defaultView?.matchMedia(
      '(prefers-reduced-motion: reduce)',
    )
    const update = () => setReduced(media?.matches ?? false)
    update()
    media?.addEventListener('change', update)
    return () => media?.removeEventListener('change', update)
  }, [])
  useEffect(() => {
    if (!autoplay || paused || interacting || reduced || slides.length < 2)
      return
    const timer = setInterval(
      () => {
        if (!track.current?.ownerDocument.hidden) tick.current()
      },
      Math.max(100, interval),
    )
    return () => clearInterval(timer)
  }, [autoplay, paused, interacting, reduced, slides.length, interval])
  return (
    <div
      {...props}
      ref={track}
      role="region"
      aria-roledescription="轮播"
      aria-label={label}
      className={cx('du-react-swiper', className)}
      style={style}
      onMouseEnter={(e) => {
        props.onMouseEnter?.(e)
        setPaused(true)
      }}
      onMouseLeave={(e) => {
        props.onMouseLeave?.(e)
        setPaused(false)
      }}
      onFocus={(e) => {
        props.onFocus?.(e)
        setPaused(true)
      }}
      onBlur={(e) => {
        props.onBlur?.(e)
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false)
      }}
      onKeyDown={(e) => {
        props.onKeyDown?.(e)
        if (
          !e.defaultPrevented &&
          !(e.target as HTMLElement).closest(
            'input, textarea, select, [contenteditable="true"]',
          ) &&
          ['ArrowLeft', 'ArrowRight'].includes(e.key)
        ) {
          e.preventDefault()
          move(current + (e.key === 'ArrowRight' ? 1 : -1))
        }
      }}
      onPointerDown={(e) => {
        props.onPointerDown?.(e)
        if (touch.current) {
          touch.current = null
          setInteracting(false)
          setDrag(0)
          return
        }
        if (
          e.pointerType !== 'mouse' &&
          !e.defaultPrevented &&
          (e.target as HTMLElement).closest('.du-react-swiper__viewport')
        ) {
          setInteracting(true)
          touch.current = {
            id: e.pointerId,
            x: e.clientX,
            y: e.clientY,
            horizontal: false,
          }
        }
      }}
      onPointerMove={(e) => {
        props.onPointerMove?.(e)
        const start = touch.current
        if (!start || start.id !== e.pointerId || e.defaultPrevented) return
        const dx = e.clientX - start.x,
          dy = e.clientY - start.y
        if (
          !start.horizontal &&
          Math.abs(dy) > 10 &&
          Math.abs(dy) > Math.abs(dx)
        ) {
          touch.current = null
          setInteracting(false)
          return
        }
        if (
          start.horizontal ||
          (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy) * 1.5)
        ) {
          start.horizontal = true
          e.currentTarget.setPointerCapture?.(e.pointerId)
          e.preventDefault()
          setDrag(
            !loop &&
              ((current === 0 && dx > 0) ||
                (current === slides.length - 1 && dx < 0))
              ? dx * 0.25
              : dx,
          )
        }
      }}
      onPointerCancel={(e) => {
        props.onPointerCancel?.(e)
        touch.current = null
        setInteracting(false)
        setDrag(0)
      }}
      onLostPointerCapture={(e) => {
        props.onLostPointerCapture?.(e)
        // Touch pointers initially capture the child implicitly. Ignore its
        // bubbling loss when transferring capture to the swiper itself.
        if (e.target !== e.currentTarget) return
        touch.current = null
        setInteracting(false)
        setDrag(0)
      }}
      onPointerUp={(e) => {
        props.onPointerUp?.(e)
        const start = touch.current
        if (start?.id === e.pointerId && !e.defaultPrevented) {
          const dx = e.clientX - start.x,
            dy = e.clientY - start.y
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5)
            move(current + (dx < 0 ? 1 : -1))
        }
        touch.current = null
        setInteracting(false)
        setDrag(0)
      }}
    >
      <div
        className="du-react-swiper__viewport"
        aria-live={autoplay && !paused ? 'off' : 'polite'}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className="du-react-swiper__slide"
            role="group"
            aria-roledescription="幻灯片"
            aria-label={`${index + 1} / ${slides.length}`}
            aria-hidden={index !== current}
            inert={index !== current}
            style={{
              transform: `translateX(calc(${
                slideOffset(index, current, slides.length, loop, 1) * 100
              }% + ${drag}px))`,
              transitionDuration:
                drag || reduced ? '0ms' : `${Math.max(0, duration)}ms`,
            }}
          >
            {slide}
          </div>
        ))}
      </div>
      {slides.length > 1 && (
        <div className="du-react-swiper__controls">
          <button
            type="button"
            aria-label="上一页"
            disabled={!loop && current === 0}
            onClick={() => move(current - 1)}
          >
            ‹
          </button>
          {indicatorType === 'number' ? (
            <span>
              {current + 1} / {slides.length}
            </span>
          ) : (
            <div
              className="du-react-swiper__indicators"
              data-type={indicatorType}
            >
              {slides.map((_, index) => (
                <button
                  type="button"
                  key={index}
                  aria-label={`转到第 ${index + 1} 页`}
                  aria-current={index === current ? 'true' : undefined}
                  onClick={() => move(index)}
                />
              ))}
            </div>
          )}
          <button
            type="button"
            aria-label="下一页"
            disabled={!loop && current === slides.length - 1}
            onClick={() => move(current + 1)}
          >
            ›
          </button>
        </div>
      )}
    </div>
  )
}
export function SwiperItem({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cx('du-react-swiper-item', className)} />
}
