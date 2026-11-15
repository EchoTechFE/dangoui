import {
  createContext,
  forwardRef,
  useContext,
  useId,
  type CSSProperties,
  type FormHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { cx } from './internal'

export interface FormLayout {
  layout?: 'horizontal' | 'vertical'
  labelSize?: number | string
  labelAlign?: 'left' | 'right'
  disabled?: boolean
}
const FormContext = createContext<FormLayout>({})
const FieldContext = createContext<{
  id?: string
  describedBy?: string
  invalid?: boolean
  required?: boolean
  disabled?: boolean
  labelledBy?: string
}>({})
export function useField() {
  const field = useContext(FieldContext),
    form = useContext(FormContext)
  return { ...field, disabled: field.disabled ?? form.disabled }
}
export interface FormProps
  extends FormHTMLAttributes<HTMLFormElement>,
    FormLayout {}
export const Form = forwardRef<HTMLFormElement, FormProps>(function Form(
  {
    layout = 'horizontal',
    labelSize = 80,
    labelAlign = 'left',
    disabled,
    className,
    children,
    ...props
  },
  ref,
) {
  return (
    <FormContext.Provider value={{ layout, labelSize, labelAlign, disabled }}>
      <form {...props} ref={ref} className={cx('du-react-form', className)}>
        {children}
      </form>
    </FormContext.Provider>
  )
})
export interface FormItemProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'prefix'>,
    FormLayout {
  label?: ReactNode
  htmlFor?: string
  required?: boolean
  tips?: ReactNode
  info?: ReactNode
  error?: ReactNode
  showBorder?: boolean
}
export function FormItem({
  label,
  htmlFor,
  required,
  tips,
  info,
  error,
  layout,
  labelSize,
  labelAlign,
  showBorder = true,
  className,
  children,
  style,
  disabled,
  ...props
}: FormItemProps) {
  const parent = useContext(FormContext)
  const autoId = useId(),
    id = htmlFor ?? autoId,
    helpId = `${autoId}-help`
  const help = error || tips || info
  return (
    <div
      {...props}
      className={cx(
        'du-react-form-item',
        showBorder && 'du-react-form-item--border',
        className,
      )}
      data-layout={layout ?? parent.layout ?? 'horizontal'}
      style={
        {
          '--du-label-width':
            typeof (labelSize ?? parent.labelSize) === 'number'
              ? `${labelSize ?? parent.labelSize}px`
              : labelSize ?? parent.labelSize ?? '80px',
          '--du-label-align': labelAlign ?? parent.labelAlign ?? 'left',
          ...style,
        } as CSSProperties
      }
    >
      {label && (
        <label
          id={`${autoId}-label`}
          htmlFor={id}
          className="du-react-form-item__label"
        >
          {required && (
            <span aria-hidden="true" className="du-react-required">
              *
            </span>
          )}
          {label}
        </label>
      )}
      <div className="du-react-form-item__content">
        <FieldContext.Provider
          value={{
            id,
            describedBy: help ? helpId : undefined,
            invalid: Boolean(error),
            required,
            disabled: disabled ?? parent.disabled,
            labelledBy: label ? `${autoId}-label` : undefined,
          }}
        >
          {children}
        </FieldContext.Provider>
        {help && (
          <div
            id={helpId}
            className={cx(
              'du-react-form-item__help',
              Boolean(error) && 'du-react-error',
            )}
            role={error ? 'alert' : undefined}
          >
            {help}
          </div>
        )}
      </div>
    </div>
  )
}
export interface FormFieldProps extends HTMLAttributes<HTMLButtonElement> {
  text?: ReactNode
  placeholder?: string
  arrowRight?: boolean
  disabled?: boolean
}
export const FormField = forwardRef<HTMLButtonElement, FormFieldProps>(
  function FormField(
    {
      text,
      placeholder,
      arrowRight = true,
      disabled,
      children,
      className,
      ...props
    },
    ref,
  ) {
    const field = useField()
    return (
      <button
        id={field.id}
        aria-describedby={field.describedBy}
        aria-invalid={field.invalid || undefined}
        {...props}
        ref={ref}
        type="button"
        disabled={disabled ?? field.disabled}
        className={cx('du-react-form-field', className)}
      >
        <span>
          {children ?? text ?? (
            <span className="du-react-muted">{placeholder}</span>
          )}
        </span>
        {arrowRight && <span aria-hidden="true">›</span>}
      </button>
    )
  },
)
