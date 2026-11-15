import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
  type ReactNode,
  type CSSProperties,
} from 'react'
import { cx, useControllable, colorStyle } from './internal'
import { useField } from './form'

export interface InputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'value' | 'defaultValue' | 'prefix' | 'size'
  > {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  prefix?: ReactNode
  suffix?: ReactNode
  allowClear?: boolean
  bordered?: boolean
  inputAlign?: CSSProperties['textAlign']
  onClear?: () => void
  onConfirm?: (value: string) => void
}
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    value,
    defaultValue = '',
    onValueChange,
    prefix,
    suffix,
    allowClear,
    bordered,
    inputAlign,
    onClear,
    onConfirm,
    className,
    style,
    onChange,
    onKeyDown,
    disabled,
    readOnly,
    id,
    ...props
  },
  ref,
) {
  const [current, setCurrent] = useControllable(
    value,
    defaultValue,
    onValueChange,
  )
  const element = useRef<HTMLInputElement>(null),
    field = useField()
  useImperativeHandle(ref, () => element.current!)
  const inactive = disabled ?? field.disabled
  return (
    <div
      className={cx(
        'du-react-input',
        bordered && 'du-react-input--bordered',
        className,
      )}
      style={style}
      data-disabled={inactive || undefined}
    >
      {prefix && <span className="du-react-input__prefix">{prefix}</span>}
      <input
        id={id ?? field.id}
        aria-describedby={field.describedBy}
        aria-invalid={field.invalid || undefined}
        required={field.required}
        {...props}
        ref={element}
        disabled={inactive}
        readOnly={readOnly}
        value={current ?? ''}
        style={{ textAlign: inputAlign }}
        onChange={(event) => {
          onChange?.(event)
          if (!event.defaultPrevented) setCurrent(event.target.value)
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event)
          if (
            !event.defaultPrevented &&
            event.key === 'Enter' &&
            !event.nativeEvent.isComposing
          )
            onConfirm?.(event.currentTarget.value)
        }}
      />
      {allowClear && current && !inactive && !readOnly && (
        <button
          type="button"
          className="du-react-input__clear"
          aria-label="清空"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            setCurrent('')
            onClear?.()
            element.current?.focus()
          }}
        >
          ×
        </button>
      )}
      {suffix}
    </div>
  )
})
export interface TextareaProps
  extends Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    'value' | 'defaultValue'
  > {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  showCount?: boolean
  bordered?: boolean
  autoSize?: boolean | { minRows?: number; maxRows?: number }
}
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      value,
      defaultValue = '',
      onValueChange,
      showCount,
      bordered,
      autoSize,
      rows = 3,
      maxLength,
      disabled,
      id,
      className,
      style,
      onChange,
      ...props
    },
    ref,
  ) {
    const [current, setCurrent] = useControllable(
      value,
      defaultValue,
      onValueChange,
    )
    const element = useRef<HTMLTextAreaElement>(null),
      field = useField()
    useImperativeHandle(ref, () => element.current!)
    useEffect(() => {
      const el = element.current
      if (!autoSize || !el) return
      const resize = () => {
        const config = typeof autoSize === 'object' ? autoSize : {}
        const computed = el.ownerDocument.defaultView?.getComputedStyle(el)
        const lineHeight = parseFloat(computed?.lineHeight ?? '') || 22
        const padding =
          (parseFloat(computed?.paddingTop ?? '') || 0) +
          (parseFloat(computed?.paddingBottom ?? '') || 0)
        el.style.height = 'auto'
        const height = Math.max(
          (config.minRows ?? rows) * lineHeight + padding,
          el.scrollHeight,
        )
        const max = (config.maxRows ?? Infinity) * lineHeight + padding
        el.style.height = `${Math.min(height, max)}px`
        el.style.overflowY = height > max ? 'auto' : 'hidden'
      }
      resize()
      const observer =
        typeof ResizeObserver === 'undefined'
          ? null
          : new ResizeObserver(resize)
      observer?.observe(el)
      return () => observer?.disconnect()
    }, [current, autoSize, rows])
    return (
      <div
        className={cx(
          'du-react-textarea',
          bordered && 'du-react-input--bordered',
          className,
        )}
        style={style}
      >
        <textarea
          id={id ?? field.id}
          aria-describedby={field.describedBy}
          aria-invalid={field.invalid || undefined}
          required={field.required}
          {...props}
          ref={element}
          disabled={disabled ?? field.disabled}
          value={current ?? ''}
          rows={rows}
          maxLength={maxLength}
          onChange={(event) => {
            onChange?.(event)
            if (!event.defaultPrevented) setCurrent(event.target.value)
          }}
        />
        {showCount && (
          <span className="du-react-textarea__count">
            {current.length}
            {maxLength != null && maxLength >= 0 ? ` / ${maxLength}` : ''}
          </span>
        )}
      </div>
    )
  },
)

export interface InputNumberProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'value' | 'defaultValue' | 'size' | 'onChange' | 'type'
  > {
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  precision?: number
  input?: boolean
  compact?: boolean
  color?: string
  size?: 'mini' | 'small' | 'normal' | 'medium' | 'large'
}
export const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(
  function InputNumber(
    {
      value,
      defaultValue = 0,
      onValueChange,
      min = 0,
      max = Infinity,
      step = 1,
      precision,
      input = true,
      compact,
      color,
      size = 'normal',
      disabled,
      readOnly,
      className,
      style,
      onBlur,
      onKeyDown,
      ...props
    },
    ref,
  ) {
    const [current, setCurrent] = useControllable(
      value,
      defaultValue,
      onValueChange,
    )
    const controlled = useRef(value !== undefined).current
    const [draft, setDraft] = useState(String(current))
    const field = useField(),
      inactive = disabled ?? field.disabled
    useEffect(() => setDraft(String(current)), [current])
    function commit(next: number) {
      if (!Number.isFinite(next) || min > max) {
        setDraft(String(current))
        return
      }
      const digits =
        precision ??
        Math.min(
          12,
          Math.max(
            ...[step, current, next].map(
              (v) => String(v).split('.')[1]?.length ?? 0,
            ),
          ),
        )
      const bounded = Math.min(max, Math.max(min, Number(next.toFixed(digits))))
      setCurrent(bounded)
      setDraft(String(controlled ? current : bounded))
    }
    return (
      <div
        className={cx(
          'du-react-input-number',
          compact && 'du-react-input-number--compact',
          className,
        )}
        data-size={size}
        style={{ ...colorStyle(color), ...style }}
      >
        <button
          type="button"
          aria-label="减少"
          disabled={inactive || readOnly || current <= min || step <= 0}
          onClick={() => commit(current - step)}
        >
          −
        </button>
        <input
          id={field.id}
          aria-describedby={field.describedBy}
          aria-invalid={field.invalid || undefined}
          required={field.required}
          {...props}
          ref={ref}
          role="spinbutton"
          aria-valuemin={Number.isFinite(min) ? min : undefined}
          aria-valuemax={Number.isFinite(max) ? max : undefined}
          aria-valuenow={current}
          inputMode="decimal"
          value={draft}
          disabled={inactive}
          readOnly={readOnly || !input}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={(event) => {
            commit(draft.trim() ? Number(draft) : current)
            onBlur?.(event)
          }}
          onKeyDown={(event) => {
            onKeyDown?.(event)
            if (
              event.defaultPrevented ||
              event.nativeEvent.isComposing ||
              inactive ||
              readOnly
            )
              return
            if (event.key === 'Enter')
              commit(draft.trim() ? Number(draft) : current)
            if (step > 0 && ['ArrowUp', 'ArrowDown'].includes(event.key)) {
              event.preventDefault()
              commit(current + (event.key === 'ArrowUp' ? step : -step))
            }
          }}
        />
        <button
          type="button"
          aria-label="增加"
          disabled={inactive || readOnly || current >= max || step <= 0}
          onClick={() => commit(current + step)}
        >
          +
        </button>
      </div>
    )
  },
)
export interface SearchProps extends Omit<InputProps, 'type'> {
  onSearch?: (value: string) => void
  action?: ReactNode
  bg?: string
}
export const Search = forwardRef<HTMLInputElement, SearchProps>(function Search(
  { onSearch, action, bg, className, style, ...props },
  ref,
) {
  return (
    <div
      role="search"
      className={cx('du-react-search', className)}
      style={{ background: bg, ...style }}
    >
      <span aria-hidden="true">⌕</span>
      <Input
        {...props}
        ref={ref}
        type="search"
        onConfirm={(v) => {
          props.onConfirm?.(v)
          onSearch?.(v)
        }}
      />
      {action}
    </div>
  )
})
