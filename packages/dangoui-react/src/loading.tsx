import type { HTMLAttributes } from 'react'
import { cx } from './internal'

export interface LoadingProps extends HTMLAttributes<HTMLSpanElement> {
  size?: number | string
  label?: string
}

export function Loading({
  size = 20,
  label = '加载中',
  className,
  style,
  ...props
}: LoadingProps) {
  return (
    <span
      {...props}
      className={cx('du-react-loading', className)}
      role="status"
      aria-label={label}
      style={{ width: size, height: size, ...style }}
    />
  )
}
