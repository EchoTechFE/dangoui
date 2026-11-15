import {
  Children,
  isValidElement,
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { colorStyle, cx, useControllable } from './internal'

interface TabsConfig {
  value: string
  setValue: (value: string) => void
  id: string
  activation: 'automatic' | 'manual'
}
const TabsContext = createContext<TabsConfig | null>(null)
export interface TabsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  type?: 'default' | 'tag' | 'text'
  size?: 'normal' | 'large'
  color?: string
  right?: ReactNode
  activation?: 'automatic' | 'manual'
}
export function Tabs({
  value,
  defaultValue = '',
  onValueChange,
  type = 'default',
  size = 'normal',
  color,
  right,
  activation = 'automatic',
  children,
  className,
  style,
  ...props
}: TabsProps) {
  const [selected, setSelected] = useControllable(
      value,
      defaultValue,
      onValueChange,
    ),
    id = useId()
  const list = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (value === undefined && !selected)
      Array.from(
        list.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? [],
      )
        .find((tab) => !tab.disabled)
        ?.click()
  }, [value, selected])
  const items = Children.toArray(children),
    panels = items.filter(
      (item) => isValidElement(item) && item.type === TabPane,
    ),
    tabs = items.filter((item) => !panels.includes(item))
  useEffect(() => {
    const el = list.current
    if (!el) return
    const update = () => {
      const tab = el.querySelector<HTMLElement>('[aria-selected="true"]')
      if (!tab) {
        el.style.setProperty('--du-tab-width', '0px')
        return
      }
      el.style.setProperty('--du-tab-left', `${tab.offsetLeft}px`)
      el.style.setProperty('--du-tab-width', `${tab.offsetWidth}px`)
    }
    update()
    const observer =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update)
    observer?.observe(el)
    Array.from(el.children).forEach((tab) => observer?.observe(tab))
    el.ownerDocument.defaultView?.addEventListener('resize', update)
    return () => {
      observer?.disconnect()
      el.ownerDocument.defaultView?.removeEventListener('resize', update)
    }
  }, [selected, children, size, type])
  useEffect(() => {
    const el = list.current,
      active = el?.querySelector<HTMLElement>('[aria-selected="true"]')
    if (!el || !active) return
    const listRect = el.getBoundingClientRect(),
      tabRect = active.getBoundingClientRect()
    // Only scroll the tab strip; never move the page or a parent form.
    const delta =
      tabRect.left < listRect.left
        ? tabRect.left - listRect.left
        : tabRect.right > listRect.right
          ? tabRect.right - listRect.right
          : 0
    if (delta) el.scrollLeft += delta
  }, [selected, size, type])
  const config = useMemo(
    () => ({ value: selected, setValue: setSelected, id, activation }),
    [selected, id, activation, setSelected],
  )
  return (
    <TabsContext.Provider value={config}>
      <div
        className={cx('du-react-tabs-wrapper', className)}
        style={{ ...colorStyle(color), ...style }}
      >
        <div className="du-react-tabs__header">
          <div
            {...props}
            ref={list}
            role="tablist"
            className="du-react-tabs"
            data-type={type}
            data-size={size}
            onKeyDown={(event) => {
              props.onKeyDown?.(event)
              if (
                event.defaultPrevented ||
                !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)
              )
                return
              const tabs = Array.from(
                event.currentTarget.querySelectorAll<HTMLButtonElement>(
                  '[role="tab"]',
                ),
              ).filter((tab) => !tab.disabled)
              const index = tabs.indexOf(event.target as HTMLButtonElement)
              if (index < 0 || !tabs.length) return
              event.preventDefault()
              const rtl =
                event.currentTarget.ownerDocument.defaultView?.getComputedStyle(
                  event.currentTarget,
                ).direction === 'rtl'
              const step =
                event.key === 'ArrowRight' ? (rtl ? -1 : 1) : rtl ? 1 : -1
              const next =
                event.key === 'Home'
                  ? tabs[0]
                  : event.key === 'End'
                    ? tabs[tabs.length - 1]
                    : tabs[(index + step + tabs.length) % tabs.length]
              next.focus({ preventScroll: true })
              if (activation === 'automatic') next.click()
            }}
          >
            {tabs}
            <span className="du-react-tabs__indicator" aria-hidden="true" />
          </div>
          {right}
        </div>
        {panels}
      </div>
    </TabsContext.Provider>
  )
}
export interface TabProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  name: string
}
export const Tab = forwardRef<HTMLButtonElement, TabProps>(function Tab(
  { name, className, onClick, ...props },
  ref,
) {
  const context = useContext(TabsContext)
  if (!context) throw new Error('Tab requires Tabs')
  const selected = context.value === name,
    token = encodeURIComponent(name)
  return (
    <button
      {...props}
      ref={ref}
      type="button"
      role="tab"
      id={`${context.id}-tab-${token}`}
      aria-controls={`${context.id}-panel-${token}`}
      aria-selected={selected}
      tabIndex={!props.disabled && (selected || !context.value) ? 0 : -1}
      className={cx('du-react-tab', className)}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) context.setValue(name)
      }}
    />
  )
})
export interface TabPaneProps extends HTMLAttributes<HTMLDivElement> {
  name: string
  forceMount?: boolean
}
export function TabPane({
  name,
  forceMount,
  children,
  ...props
}: TabPaneProps) {
  const context = useContext(TabsContext)
  if (!context) throw new Error('TabPane requires Tabs')
  const selected = context.value === name,
    token = encodeURIComponent(name)
  return (
    <div
      {...props}
      id={`${context.id}-panel-${token}`}
      role="tabpanel"
      aria-labelledby={`${context.id}-tab-${token}`}
      hidden={!selected}
      tabIndex={0}
    >
      {(selected || forceMount) && children}
    </div>
  )
}
