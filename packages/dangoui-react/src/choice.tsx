import {
  createContext,
  forwardRef,
  useContext,
  useId,
  useRef,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type CSSProperties,
} from 'react'
import { colorStyle, cx, useControllable } from './internal'
import { useField } from './form'

export type ChoiceValue = string | number
interface GroupConfig {
  values?: readonly ChoiceValue[]
  value?: ChoiceValue
  setValue?: (value: ChoiceValue) => boolean
  disabled?: boolean
  readOnly?: boolean
  name?: string
  color?: string
  shape?: string
  position?: 'left' | 'right'
}
const CheckboxContext = createContext<GroupConfig | null>(null),
  RadioContext = createContext<GroupConfig | null>(null)
interface GroupProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  disabled?: boolean
  readOnly?: boolean
  name?: string
  color?: string
  inline?: boolean
  shape?: 'round' | 'square' | 'card' | 'button'
  position?: 'left' | 'right'
}
export interface CheckboxGroupProps extends GroupProps {
  value?: readonly ChoiceValue[]
  defaultValue?: readonly ChoiceValue[]
  onValueChange?: (value: ChoiceValue[]) => void
  max?: number
}
export function CheckboxGroup({
  value,
  defaultValue = [],
  onValueChange,
  max,
  disabled,
  readOnly,
  name,
  color = 'primary',
  inline,
  shape,
  position,
  children,
  className,
  ...props
}: CheckboxGroupProps) {
  const [selected, setSelected] = useControllable<readonly ChoiceValue[]>(
    value,
    defaultValue,
    onValueChange as (v: readonly ChoiceValue[]) => void,
  )
  const field = useField()
  return (
    <CheckboxContext.Provider
      value={{
        values: selected,
        setValue: (item) => {
          if (readOnly) return false
          if (selected.includes(item))
            setSelected(selected.filter((v) => v !== item))
          else if (max == null || selected.length < max)
            setSelected([...selected, item])
          else return false
          return true
        },
        disabled: disabled ?? field.disabled,
        readOnly,
        name,
        color,
        shape,
        position,
      }}
    >
      <div
        id={field.id}
        role="group"
        aria-describedby={field.describedBy}
        aria-labelledby={field.labelledBy}
        {...props}
        className={cx(
          'du-react-choice-group',
          inline && 'du-react-choice-group--inline',
          className,
        )}
      >
        {children}
      </div>
    </CheckboxContext.Provider>
  )
}
export interface RadioGroupProps extends GroupProps {
  value?: ChoiceValue
  defaultValue?: ChoiceValue
  onValueChange?: (value: ChoiceValue) => void
}
export function RadioGroup({
  value,
  defaultValue = '',
  onValueChange,
  disabled,
  readOnly,
  name,
  color = 'primary',
  inline,
  shape,
  position,
  children,
  className,
  ...props
}: RadioGroupProps) {
  const [selected, setSelected] = useControllable(
      value,
      defaultValue,
      onValueChange,
    ),
    autoName = useId(),
    field = useField()
  return (
    <RadioContext.Provider
      value={{
        value: selected,
        setValue: (v) => {
          if (readOnly) return false
          setSelected(v)
          return true
        },
        disabled: disabled ?? field.disabled,
        readOnly,
        name: name ?? autoName,
        color,
        shape,
        position,
      }}
    >
      <div
        id={field.id}
        role="radiogroup"
        aria-labelledby={field.labelledBy}
        aria-describedby={field.describedBy}
        {...props}
        className={cx(
          'du-react-choice-group',
          inline && 'du-react-choice-group--inline',
          className,
        )}
      >
        {children}
      </div>
    </RadioContext.Provider>
  )
}
export interface ChoiceProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type' | 'value' | 'defaultValue' | 'size' | 'prefix'
  > {
  value?: ChoiceValue
  label?: string
  color?: string
  shape?: 'round' | 'square' | 'card' | 'button'
  position?: 'left' | 'right'
  indeterminate?: boolean
  inline?: boolean
  size?: string | number
  onCheckedChange?: (checked: boolean) => void
}
function makeChoice(type: 'checkbox' | 'radio' | 'switch') {
  return forwardRef<HTMLInputElement, ChoiceProps>(function Choice(
    {
      checked,
      defaultChecked = false,
      onChange,
      onCheckedChange,
      value,
      label,
      children,
      disabled,
      readOnly,
      color,
      shape,
      position,
      indeterminate,
      inline,
      size = 20,
      className,
      style,
      name,
      id,
      onKeyDown,
      onClick,
      ...props
    },
    ref,
  ) {
    const context = useContext(
      type === 'checkbox' ? CheckboxContext : RadioContext,
    )
    const group = type === 'switch' ? null : context
    const field = useField(),
      autoId = useId(),
      inputRef = useRef<HTMLInputElement | null>(null)
    const [own, setOwn] = useControllable(checked, defaultChecked)
    const selected =
      group && value !== undefined
        ? type === 'checkbox'
          ? group.values!.includes(value)
          : group.value === value
        : own
    const inactive = disabled || group?.disabled || field.disabled,
      readonly = readOnly || group?.readOnly
    const actualShape =
      shape ?? group?.shape ?? (type === 'checkbox' ? 'square' : 'round')
    return (
      <label
        className={cx(
          'du-react-choice',
          type === 'switch' && 'du-react-switch',
          inline && 'du-react-choice--inline',
          className,
        )}
        data-shape={actualShape}
        data-checked={Boolean(selected)}
        data-disabled={Boolean(inactive)}
        data-position={position ?? group?.position}
        style={
          {
            ...colorStyle(color ?? group?.color),
            '--du-choice-size': typeof size === 'number' ? `${size}px` : size,
            ...style,
          } as CSSProperties
        }
      >
        <input
          {...props}
          id={id ?? (group ? undefined : field.id) ?? autoId}
          ref={(el) => {
            inputRef.current = el
            if (el) el.indeterminate = Boolean(indeterminate)
            if (typeof ref === 'function') ref(el)
            else if (ref) ref.current = el
          }}
          type={type === 'switch' ? 'checkbox' : type}
          role={type === 'switch' ? 'switch' : undefined}
          aria-checked={indeterminate ? 'mixed' : Boolean(selected)}
          aria-describedby={field.describedBy}
          aria-invalid={field.invalid || undefined}
          name={name ?? group?.name}
          value={value}
          checked={Boolean(selected)}
          disabled={inactive}
          readOnly={readonly}
          onClick={(event) => {
            onClick?.(event)
            if (readonly) event.preventDefault()
          }}
          onKeyDown={onKeyDown}
          onChange={(event) => {
            if (readonly || inactive) return
            onChange?.(event)
            if (event.defaultPrevented) return
            if (group && value !== undefined) {
              if (!group.setValue?.(value)) return
            } else setOwn(event.target.checked)
            onCheckedChange?.(event.target.checked)
          }}
        />
        <span className="du-react-choice__mark" aria-hidden="true">
          {type === 'checkbox'
            ? indeterminate
              ? '−'
              : selected
                ? '✓'
                : ''
            : ''}
        </span>
        {(children ?? label) && <span>{children ?? label}</span>}
      </label>
    )
  })
}
// Semantic callback accompanies the standard typed DOM event.
export const Checkbox = makeChoice('checkbox'),
  Radio = makeChoice('radio'),
  Switch = makeChoice('switch')
export interface RadioIconProps extends HTMLAttributes<HTMLSpanElement> {
  checked?: boolean
  disabled?: boolean
  size?: string | number
  color?: string
}
export function RadioIcon({
  checked = false,
  disabled,
  size = 20,
  color,
  className,
  style,
  ...props
}: RadioIconProps) {
  return (
    <span
      {...props}
      aria-hidden="true"
      className={cx('du-react-radio-icon', className)}
      data-checked={checked}
      data-disabled={disabled}
      style={{ width: size, height: size, ...colorStyle(color), ...style }}
    />
  )
}
