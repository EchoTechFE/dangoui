import {
  cloneElement,
  forwardRef,
  useId,
  type ReactElement,
  type SVGProps,
} from 'react'
import { cx } from './internal'

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  children: ReactElement<SVGProps<SVGSVGElement>>
  size?: string | number
  /** Omit for a decorative icon. */
  label?: string
}

export const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
  { children, size = '1em', label, className, style, ...props },
  ref,
) {
  const titleId = useId()
  return cloneElement(children, {
    ...props,
    ref,
    width: size,
    height: size,
    className: cx('du-react-icon', className),
    style: { ...children.props.style, ...style },
    focusable: false,
    role: label ? 'img' : undefined,
    'aria-hidden': label ? undefined : true,
    'aria-labelledby': label ? titleId : undefined,
    children: (
      <>
        {label && <title id={titleId}>{label}</title>}
        {children.props.children}
      </>
    ),
  } as SVGProps<SVGSVGElement>)
})
