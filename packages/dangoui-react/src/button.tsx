import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Loading } from './loading'
import { cx } from './internal'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Native type keeps its HTML meaning; Vue's visual type becomes variant. */
  variant?: 'primary' | 'secondary' | 'outline' | 'text'
  size?: 'mini' | 'small' | 'normal' | 'medium' | 'large'
  color?: string
  loading?: boolean
  disabledType?: 'default' | 'temp'
  full?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      type = 'button',
      variant = 'primary',
      size = 'normal',
      color = 'primary',
      loading = false,
      disabled = false,
      disabledType = 'default',
      full,
      icon,
      iconPosition = 'left',
      className,
      children,
      ...props
    },
    ref,
  ) {
    const contentIcon = loading ? <Loading size="1em" /> : icon
    const iconElement = contentIcon && (
      <span
        className={cx(
          'du-react-button__icon',
          `du-react-button__icon--${size}`,
          !loading &&
            iconPosition === 'right' &&
            `du-react-button__icon--${size}-right`,
          !children && 'du-react-button__icon--only',
        )}
      >
        {contentIcon}
      </span>
    )
    const visualVariant =
      disabled && disabledType === 'default' && variant === 'primary'
        ? 'secondary'
        : variant
    return (
      <button
        {...props}
        ref={ref}
        type={type}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        data-color={disabled && disabledType === 'default' ? 'default' : color}
        className={cx(
          'du-react-button',
          `du-react-button--${size}`,
          `du-react-button--${visualVariant}`,
          disabled && `du-react-button--${visualVariant}-disabled-temp`,
          full && 'du-react-button--full',
          loading && 'du-react-button--loading',
          className,
        )}
      >
        {(loading || iconPosition === 'left') && iconElement}
        {children}
        {!loading && iconPosition === 'right' && iconElement}
      </button>
    )
  },
)
