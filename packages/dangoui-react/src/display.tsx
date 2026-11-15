import {
  forwardRef,
  useId,
  useState,
  type HTMLAttributes,
  type ImgHTMLAttributes,
  type ReactNode,
  type CSSProperties,
  type ButtonHTMLAttributes,
} from 'react'
import { Button, type ButtonProps } from './button'
import { colorStyle, cx, useControllable } from './internal'
import { Loading } from './loading'

export interface IconButtonProps extends ButtonProps {
  label: string
  text?: string
}
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    { label, text, children, className, variant = 'text', ...props },
    ref,
  ) {
    return (
      <Button
        {...props}
        ref={ref}
        variant={variant}
        aria-label={label}
        className={cx('du-react-icon-button', className)}
      >
        {children ?? text}
      </Button>
    )
  },
)
export interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  mode?: 'aspectFit' | 'aspectFill' | 'widthFix'
  radius?: number | string
  fallback?: ReactNode
  placeholder?: ReactNode
}
export const Image = forwardRef<HTMLImageElement, ImageProps>(function Image(
  {
    src,
    alt = '',
    mode = 'aspectFill',
    radius,
    fallback,
    placeholder,
    className,
    style,
    width,
    height,
    onLoad,
    onError,
    ...props
  },
  ref,
) {
  const [state, setState] = useState<{ src?: string; status: string }>({
    src,
    status: 'loading',
  })
  const status = state.src === src ? state.status : 'loading'
  return (
    <span
      className={cx('du-react-image', className)}
      data-status={status}
      style={{
        width,
        height: mode === 'widthFix' ? undefined : height,
        borderRadius: radius,
        ...style,
      }}
    >
      {status === 'loading' && placeholder}
      {status === 'error' ? (
        fallback ?? (
          <span
            role="img"
            aria-label={alt || '图片加载失败'}
            className="du-react-image__fallback"
          >
            图片加载失败
          </span>
        )
      ) : (
        <img
          {...props}
          src={src}
          alt={alt}
          ref={ref}
          width={width}
          height={height}
          style={{
            objectFit: mode === 'aspectFit' ? 'contain' : 'cover',
            height: mode === 'widthFix' ? 'auto' : '100%',
          }}
          onLoad={(event) => {
            setState({ src, status: 'loaded' })
            onLoad?.(event)
          }}
          onError={(event) => {
            setState({ src, status: 'error' })
            onError?.(event)
          }}
        />
      )}
    </span>
  )
})
export type ComponentSize = 'mini' | 'small' | 'normal' | 'medium' | 'large'
export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  src?: string
  alt?: string
  size?: ComponentSize | number
  color?: string
  bordered?: boolean
  icon?: ReactNode
}
const avatarSizes = { mini: 20, small: 28, normal: 36, medium: 48, large: 64 }
export function Avatar({
  src,
  alt = '',
  size = 'normal',
  color = 'default',
  bordered,
  icon,
  children,
  className,
  style,
  ...props
}: AvatarProps) {
  const pixels = typeof size === 'number' ? size : avatarSizes[size]
  return (
    <span
      {...props}
      className={cx(
        'du-react-avatar',
        bordered && 'du-react-avatar--bordered',
        className,
      )}
      style={{
        width: pixels,
        height: pixels,
        fontSize: pixels / 2,
        ...colorStyle(color),
        ...style,
      }}
    >
      {src ? (
        <Image
          key={src}
          src={src}
          alt={alt}
          fallback={children ?? icon ?? alt.slice(0, 1)}
        />
      ) : (
        children ?? icon ?? alt.slice(0, 1)
      )}
    </span>
  )
}
export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  avatars: readonly (string | AvatarProps)[]
  size?: ComponentSize | number
  bordered?: boolean
  gap?: number
  reverse?: boolean
  limit?: number
}
export function AvatarGroup({
  avatars,
  size = 'normal',
  bordered = true,
  gap = -8,
  reverse,
  limit = 0,
  className,
  style,
  ...props
}: AvatarGroupProps) {
  const visible = limit > 0 ? avatars.slice(0, limit) : avatars
  return (
    <div
      {...props}
      className={cx('du-react-avatar-group', className)}
      style={{ flexDirection: reverse ? 'row-reverse' : 'row', ...style }}
    >
      {visible.map((avatar, i) => (
        <Avatar
          key={i}
          size={size}
          bordered={bordered}
          {...(typeof avatar === 'string' ? { src: avatar } : avatar)}
          style={{ marginInlineStart: i ? gap : 0 }}
        />
      ))}
      {limit > 0 && avatars.length > limit && (
        <Avatar size={size} style={{ marginInlineStart: gap }}>
          +{avatars.length - limit}
        </Avatar>
      )}
    </div>
  )
}
export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title?: ReactNode
  subtitle?: ReactNode
  guideText?: string
  infoText?: string
  action?: ReactNode
  onAction?: () => void
  mode?: 'normal' | 'collapse'
  size?: 'normal' | 'large'
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  showHeader?: boolean
  contentStyle?: CSSProperties
}
export function Card({
  title,
  subtitle,
  guideText,
  infoText,
  action,
  onAction,
  mode = 'normal',
  size = 'normal',
  open,
  defaultOpen = true,
  onOpenChange,
  showHeader = true,
  contentStyle,
  children,
  className,
  ...props
}: CardProps) {
  const [expanded, setExpanded] = useControllable(
      open,
      defaultOpen,
      onOpenChange,
    ),
    id = useId()
  return (
    <section
      {...props}
      className={cx('du-react-card', className)}
      data-size={size}
    >
      {showHeader && (
        <header className="du-react-card__header">
          {mode === 'collapse' ? (
            <button
              type="button"
              aria-expanded={expanded}
              aria-controls={id}
              onClick={() => setExpanded(!expanded)}
            >
              <strong>{title}</strong>
              <span aria-hidden="true">{expanded ? '−' : '+'}</span>
            </button>
          ) : (
            <strong>{title}</strong>
          )}
          {subtitle && <small>{subtitle}</small>}
          {infoText && <span>{infoText}</span>}
          {action ??
            (guideText && (
              <Button variant="text" onClick={onAction}>
                {guideText}
              </Button>
            ))}
        </header>
      )}
      <div
        id={id}
        hidden={mode === 'collapse' && !expanded}
        className="du-react-card__body"
        style={contentStyle}
      >
        {children}
      </div>
    </section>
  )
}
export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  color?: string
  type?: 'horizontal' | 'vertical'
  length?: number | string
}
export function Divider({
  color,
  type = 'horizontal',
  length,
  className,
  style,
  children,
  ...props
}: DividerProps) {
  return (
    <div
      {...props}
      role="separator"
      aria-orientation={type}
      className={cx('du-react-divider', className)}
      data-orientation={type}
      style={{
        borderColor: color,
        [type === 'horizontal' ? 'width' : 'height']: length,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
export interface TagProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'> {
  color?: string | { border: string; text: string; background: string }
  bg?: 'solid' | 'soft' | 'ghost'
  size?: ComponentSize
  round?: boolean
  bordered?: boolean
  closable?: boolean
  onClose?: () => void
  icon?: ReactNode
  weight?: 'light' | 'normal'
}
export function Tag({
  color = 'primary',
  bg = 'soft',
  size = 'normal',
  round,
  bordered,
  closable,
  onClose,
  icon,
  weight = 'normal',
  className,
  style,
  children,
  ...props
}: TagProps) {
  const vars =
    typeof color === 'string'
      ? {
          ...colorStyle(color),
          '--du-tag-solid-bg': `var(--du-${color}-solid-bg)`,
          '--du-tag-solid-color': `var(--du-${color}-solid-color)`,
        }
      : {
          color: color.text,
          background: color.background,
          borderColor: color.border,
        }
  return (
    <span
      {...props}
      className={cx('du-react-tag', className)}
      data-bg={bg}
      data-size={size}
      data-round={round}
      data-bordered={bordered || bg === 'ghost'}
      data-weight={weight}
      style={{ ...vars, ...style } as CSSProperties}
    >
      {icon}
      {children}
      {closable && (
        <button
          type="button"
          aria-label="移除标签"
          onClick={(event) => {
            event.stopPropagation()
            onClose?.()
          }}
        >
          ×
        </button>
      )}
    </span>
  )
}
export interface TagsPanelProps extends HTMLAttributes<HTMLDivElement> {
  tags: readonly { text: string; value: string | number; canRemove?: boolean }[]
  addText?: string
  onAdd?: () => void
  onRemove?: (value: string | number) => void
  canToggle?: boolean
  collapseCount?: number
}
export function TagsPanel({
  tags,
  addText = '添加',
  onAdd,
  onRemove,
  canToggle,
  collapseCount = 10,
  className,
  ...props
}: TagsPanelProps) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div {...props} className={cx('du-react-tags-panel', className)}>
      {(canToggle && !expanded
        ? tags.slice(0, Math.max(0, collapseCount))
        : tags
      ).map((tag) => (
        <Tag
          key={tag.value}
          closable={tag.canRemove !== false}
          onClose={() => onRemove?.(tag.value)}
        >
          {tag.text}
        </Tag>
      ))}
      {canToggle && tags.length > collapseCount && (
        <Button
          variant="text"
          aria-expanded={expanded}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? '收起' : `展开 ${tags.length - collapseCount} 项`}
        </Button>
      )}
      {onAdd && (
        <Button variant="text" onClick={onAdd}>
          + {addText}
        </Button>
      )}
    </div>
  )
}
export interface EmptyProps extends HTMLAttributes<HTMLDivElement> {
  image?: string | ReactNode
  text?: ReactNode
  buttonText?: string
  onAction?: () => void
}
export function Empty({
  image,
  text = '暂无内容',
  buttonText,
  onAction,
  children,
  className,
  ...props
}: EmptyProps) {
  return (
    <div {...props} className={cx('du-react-empty', className)}>
      {typeof image === 'string' ? <img src={image} alt="" /> : image}
      <div className="du-react-muted">{text}</div>
      {children}
      {buttonText && <Button onClick={onAction}>{buttonText}</Button>}
    </div>
  )
}
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  value?: string | number
  max?: number
  dot?: boolean
  alwaysShow?: boolean
  color?: string
}
export function Badge({
  value = '',
  max,
  dot,
  alwaysShow,
  color = 'error',
  className,
  children,
  style,
  ...props
}: BadgeProps) {
  const visible = dot || alwaysShow || (value !== '' && value !== 0)
  return (
    <span
      {...props}
      className={cx('du-react-badge', className)}
      style={{ ...colorStyle(color), ...style }}
    >
      {children}
      {visible && (
        <sup
          className="du-react-badge__value"
          data-dot={dot}
          aria-label={dot ? '新通知' : String(value)}
        >
          {!dot &&
            (typeof value === 'number' && max != null && value > max
              ? `${max}+`
              : value)}
        </sup>
      )}
    </span>
  )
}
export interface Step {
  title: ReactNode
  description?: ReactNode
  icon?: ReactNode
  status?: 'process' | 'success' | 'error' | 'wait'
}
export interface StepsProps extends HTMLAttributes<HTMLOListElement> {
  steps: readonly Step[]
  activeIndex?: number
  status?: 'process' | 'success' | 'error'
  type?: 'default' | 'ghost'
  color?: string
  direction?: 'horizontal' | 'vertical'
}
export function Steps({
  steps,
  activeIndex = 0,
  status = 'process',
  type = 'default',
  color,
  direction = 'horizontal',
  className,
  style,
  ...props
}: StepsProps) {
  return (
    <ol
      {...props}
      className={cx('du-react-steps', className)}
      data-direction={direction}
      data-type={type}
      style={{ ...colorStyle(color), ...style }}
    >
      {steps.map((step, i) => (
        <li
          key={i}
          aria-current={i === activeIndex ? 'step' : undefined}
          data-status={
            step.status ??
            (i < activeIndex ? 'success' : i === activeIndex ? status : 'wait')
          }
        >
          <span className="du-react-steps__mark">
            {step.icon ??
              (i < activeIndex || (i === activeIndex && status === 'success')
                ? '✓'
                : i + 1)}
          </span>
          <div>
            {step.title}
            {step.description && <small>{step.description}</small>}
          </div>
        </li>
      ))}
    </ol>
  )
}
export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  loading?: boolean
  fallback?: ReactNode
}
export function Skeleton({
  loading = true,
  fallback,
  children,
  className,
  ...props
}: SkeletonProps) {
  return loading ? (
    <div
      {...props}
      role="status"
      aria-label="加载中"
      aria-busy="true"
      className={cx('du-react-skeleton', className)}
    >
      {fallback ?? <SkeletonParagraph rows={3} />}
    </div>
  ) : (
    <>{children}</>
  )
}
export interface SkeletonParagraphProps extends HTMLAttributes<HTMLDivElement> {
  rows?: number
  rowWidth?: CSSProperties['width']
  rowHeight?: number | string
  gap?: number | string
}
export function SkeletonParagraph({
  rows = 3,
  rowWidth = '100%',
  rowHeight = 16,
  gap = 8,
  style,
  ...props
}: SkeletonParagraphProps) {
  return (
    <div
      {...props}
      aria-hidden="true"
      style={{ display: 'grid', gap, ...style }}
    >
      {Array.from({ length: Math.max(0, rows) }, (_, i) => (
        <div
          key={i}
          className="du-react-skeleton__block"
          style={{
            width: i === rows - 1 ? '60%' : rowWidth,
            height: rowHeight,
          }}
        />
      ))}
    </div>
  )
}
export interface SkeletonAvatarProps extends HTMLAttributes<HTMLDivElement> {
  size?: string | number
}
export function SkeletonAvatar({
  size = 56,
  className,
  style,
  ...props
}: SkeletonAvatarProps) {
  return (
    <div
      {...props}
      aria-hidden="true"
      className={cx('du-react-skeleton__block', className)}
      style={{ width: size, height: size, borderRadius: '50%', ...style }}
    />
  )
}
export interface SkeletonRectangleProps extends HTMLAttributes<HTMLDivElement> {
  width?: number | string
  aspectRatio?: number
}
export function SkeletonRectangle({
  width = 120,
  aspectRatio = 1,
  className,
  style,
  ...props
}: SkeletonRectangleProps) {
  return (
    <div
      {...props}
      aria-hidden="true"
      className={cx('du-react-skeleton__block', className)}
      style={{ width, aspectRatio, ...style }}
    />
  )
}

function slot(className: string) {
  return function Slot({
    className: extra,
    ...props
  }: HTMLAttributes<HTMLDivElement>) {
    return <div {...props} className={cx(className, extra)} />
  }
}
export const SearchRight = slot('du-react-search-right'),
  NavigationBarRight = slot('du-react-navigation-bar-right'),
  TabsRight = slot('du-react-tabs-right')
export interface ActionButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode
  color?: 'black' | 'white'
  label: string
}
export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  function ActionButton(
    { icon, color, label, children, style, ...props },
    ref,
  ) {
    return (
      <button
        {...props}
        ref={ref}
        type="button"
        aria-label={label}
        className={cx('du-react-action-button', props.className)}
        style={{ color, ...style }}
      >
        {icon}
        {children}
      </button>
    )
  },
)
export { Loading }
