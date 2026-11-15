import { useId, useState, type HTMLAttributes, type ReactNode } from 'react'
import { Popup, type PopupProps } from './popup'
import { Button } from './button'
import { Input } from './input'
import { FormField, useField } from './form'
import { useControllable, useOnOpen, cx } from './internal'
import type { ChoiceValue } from './choice'

export interface SelectOption {
  label: string
  value: ChoiceValue
  disabled?: boolean
  description?: ReactNode
}
export type SelectValue = ChoiceValue | readonly ChoiceValue[]
export interface SelectProps
  extends Omit<
    PopupProps,
    'open' | 'onOpenChange' | 'defaultValue' | 'children'
  > {
  options: readonly SelectOption[]
  value?: SelectValue
  defaultValue?: SelectValue
  onValueChange?: (value: SelectValue) => void
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  mode?: 'multiple'
  filterable?: boolean
  filterPlaceholder?: string
  withConfirm?: boolean
  confirmText?: string
  placeholder?: string
  disabled?: boolean
  trigger?: ReactNode
}
export function Select({
  options,
  value,
  defaultValue = '',
  onValueChange,
  open,
  defaultOpen = false,
  onOpenChange,
  mode,
  filterable,
  filterPlaceholder = '输入关键词搜索',
  withConfirm = false,
  confirmText = '确认',
  placeholder = '请选择',
  disabled,
  trigger,
  title = '请选择',
  ...props
}: SelectProps) {
  const field = useField()
  const inactive = disabled ?? field.disabled
  const searchId = useId()
  const [selected, setSelected] = useControllable<SelectValue>(
      value,
      defaultValue,
      onValueChange,
    ),
    [visible, setVisible] = useControllable(open, defaultOpen, onOpenChange)
  const [draft, setDraft] = useState<SelectValue>(selected),
    [query, setQuery] = useState('')
  useOnOpen(visible, () => {
    setDraft(selected)
    setQuery('')
  })
  const working = withConfirm ? draft : selected
  const values: readonly ChoiceValue[] = Array.isArray(working)
    ? working
    : working === ''
      ? []
      : [working as ChoiceValue]
  const selectedValues: readonly ChoiceValue[] = Array.isArray(selected)
    ? selected
    : [selected as ChoiceValue]
  function choose(item: SelectOption) {
    if (inactive || item.disabled) return
    const next =
      mode === 'multiple'
        ? values.includes(item.value)
          ? values.filter((v) => v !== item.value)
          : [...values, item.value]
        : item.value
    if (withConfirm) setDraft(next)
    else {
      setSelected(next)
      if (mode !== 'multiple') setVisible(false)
    }
  }
  return (
    <>
      {open === undefined && (
        <FormField
          text={
            trigger ??
            (options
              .filter((item) => selectedValues.includes(item.value))
              .map((item) => item.label)
              .join('、') ||
              undefined)
          }
          placeholder={placeholder}
          disabled={inactive}
          onClick={() => setVisible(true)}
        />
      )}
      <Popup
        {...props}
        title={title}
        position="bottom"
        open={visible}
        onOpenChange={setVisible}
      >
        {filterable && (
          <Input
            id={searchId}
            aria-label={filterPlaceholder}
            aria-describedby={undefined}
            aria-invalid={undefined}
            required={false}
            placeholder={filterPlaceholder}
            value={query}
            onValueChange={setQuery}
            disabled={inactive}
            allowClear
          />
        )}
        <div
          role="listbox"
          aria-label={typeof title === 'string' ? title : '选项'}
          aria-multiselectable={mode === 'multiple' || undefined}
          className="du-react-option-list"
          onKeyDown={(event) => {
            if (!['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key))
              return
            const buttons = Array.from(
              event.currentTarget.querySelectorAll<HTMLButtonElement>(
                '[role="option"]',
              ),
            ).filter((button) => !button.disabled)
            if (!buttons.length) return
            event.preventDefault()
            const index = buttons.indexOf(event.target as HTMLButtonElement)
            const next =
              event.key === 'Home'
                ? 0
                : event.key === 'End'
                  ? buttons.length - 1
                  : (index +
                      (event.key === 'ArrowDown' ? 1 : -1) +
                      buttons.length) %
                    buttons.length
            buttons[next].focus()
          }}
        >
          {options
            .filter((item) =>
              item.label
                .toLocaleLowerCase()
                .includes(query.toLocaleLowerCase()),
            )
            .map((item) => (
              <button
                type="button"
                key={`${typeof item.value}-${item.value}`}
                role="option"
                aria-selected={values.includes(item.value)}
                disabled={inactive || item.disabled}
                onClick={() => choose(item)}
              >
                <span>
                  {item.label}
                  {item.description && <small>{item.description}</small>}
                </span>
                {values.includes(item.value) && (
                  <span aria-hidden="true">✓</span>
                )}
              </button>
            ))}
          {!options.some((item) =>
            item.label.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
          ) && <p role="status">暂无匹配选项</p>}
        </div>
        {withConfirm && (
          <Button
            full
            disabled={inactive}
            onClick={() => {
              setSelected(draft)
              setVisible(false)
            }}
          >
            {confirmText}
          </Button>
        )}
      </Popup>
    </>
  )
}
export interface PickerOption {
  label: string
  value: string
  disabled?: boolean
}
export interface PickerViewProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  columns: readonly (readonly PickerOption[])[]
  value?: readonly string[]
  defaultValue?: readonly string[]
  onValueChange?: (value: string[]) => void
  disabled?: boolean
  columnLabels?: readonly string[]
}
export function PickerView({
  columns,
  value,
  defaultValue,
  onValueChange,
  disabled,
  columnLabels,
  className,
  ...props
}: PickerViewProps) {
  const field = useField()
  const inactive = disabled ?? field.disabled
  const [selected, setSelected] = useControllable<readonly string[]>(
    value,
    defaultValue ??
      columns.map((col) => col.find((item) => !item.disabled)?.value ?? ''),
    onValueChange as (v: readonly string[]) => void,
  )
  return (
    <div {...props} className={cx('du-react-picker-view', className)}>
      {columns.map((column, index) => (
        <select
          key={index}
          aria-label={columnLabels?.[index] ?? `第 ${index + 1} 列`}
          disabled={inactive || !column.length}
          value={selected[index] ?? ''}
          size={Math.max(2, Math.min(5, column.length))}
          onChange={(event) => {
            const next = [...selected]
            next[index] = event.target.value
            setSelected(next)
          }}
        >
          {column.map((item) => (
            <option
              key={item.value}
              value={item.value}
              disabled={inactive || item.disabled}
            >
              {item.label}
            </option>
          ))}
        </select>
      ))}
    </div>
  )
}
export interface PickerProps
  extends Omit<
      PopupProps,
      'open' | 'onOpenChange' | 'defaultValue' | 'children'
    >,
    Pick<PickerViewProps, 'columns' | 'columnLabels'> {
  value?: readonly string[]
  defaultValue?: readonly string[]
  onValueChange?: (value: string[]) => void
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onConfirm?: (value: string[]) => void
  disabled?: boolean
  placeholder?: string
}
export function Picker({
  columns,
  columnLabels,
  value,
  defaultValue = [],
  onValueChange,
  open,
  defaultOpen = false,
  onOpenChange,
  onConfirm,
  disabled,
  placeholder = '请选择',
  title = '请选择',
  ...props
}: PickerProps) {
  const field = useField()
  const inactive = disabled ?? field.disabled
  const [selected, setSelected] = useControllable<readonly string[]>(
      value,
      defaultValue,
      onValueChange as (v: readonly string[]) => void,
    ),
    [visible, setVisible] = useControllable(open, defaultOpen, onOpenChange)
  const [draft, setDraft] = useState<string[]>([])
  useOnOpen(visible, () => {
    setDraft(
      columns.map((col, index) =>
        col.some((opt) => opt.value === selected[index] && !opt.disabled)
          ? selected[index]
          : col.find((opt) => !opt.disabled)?.value ?? '',
      ),
    )
  })
  return (
    <>
      {open === undefined && (
        <FormField
          placeholder={placeholder}
          disabled={inactive}
          text={
            selected.length
              ? columns
                  .map(
                    (col, i) => col.find((o) => o.value === selected[i])?.label,
                  )
                  .filter(Boolean)
                  .join(' / ')
              : undefined
          }
          onClick={() => setVisible(true)}
        />
      )}
      <Popup
        {...props}
        title={title}
        position="bottom"
        open={visible}
        onOpenChange={setVisible}
      >
        <PickerView
          columns={columns}
          columnLabels={columnLabels}
          value={draft}
          onValueChange={setDraft}
          disabled={inactive}
        />
        <div className="du-react-actions">
          <Button variant="secondary" onClick={() => setVisible(false)}>
            取消
          </Button>
          <Button
            disabled={
              inactive ||
              columns.some(
                (col, i) =>
                  !col.some((o) => o.value === draft[i] && !o.disabled),
              )
            }
            onClick={() => {
              setSelected(draft)
              onConfirm?.(draft)
              setVisible(false)
            }}
          >
            确定
          </Button>
        </div>
      </Popup>
    </>
  )
}
export interface CascaderOption {
  label: string
  value: string
  disabled?: boolean
  children?: readonly CascaderOption[]
}
export interface CascaderProps
  extends Omit<
    PopupProps,
    'open' | 'onOpenChange' | 'defaultValue' | 'children'
  > {
  options: readonly CascaderOption[]
  value?: readonly string[]
  defaultValue?: readonly string[]
  onValueChange?: (value: string[]) => void
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  showSearch?: boolean
  placeholder?: string
  disabled?: boolean
}
export function Cascader({
  options,
  value,
  defaultValue = [],
  onValueChange,
  open,
  defaultOpen = false,
  onOpenChange,
  showSearch,
  placeholder = '请选择',
  disabled,
  title = '请选择',
  ...props
}: CascaderProps) {
  const field = useField()
  const inactive = disabled ?? field.disabled
  const searchId = useId()
  const [selected, setSelected] = useControllable<readonly string[]>(
      value,
      defaultValue,
      onValueChange as (v: readonly string[]) => void,
    ),
    [visible, setVisible] = useControllable(open, defaultOpen, onOpenChange)
  const [path, setPath] = useState<readonly string[]>(selected),
    [query, setQuery] = useState('')
  useOnOpen(visible, () => {
    setPath(selected)
    setQuery('')
  })
  let level = options
  const labels: string[] = [],
    levels: (readonly CascaderOption[])[] = [options]
  for (const token of path) {
    const item = level.find((item) => item.value === token)
    if (!item) break
    labels.push(item.label)
    level = item.children ?? []
    if (level.length) levels.push(level)
  }
  function finish(next: string[]) {
    setSelected(next)
    setVisible(false)
  }
  function flatten(
    items: readonly CascaderOption[],
    p: string[] = [],
    names: string[] = [],
    blocked = false,
  ): { path: string[]; label: string; disabled: boolean }[] {
    return items.flatMap((item) =>
      item.children?.length
        ? flatten(
            item.children,
            [...p, item.value],
            [...names, item.label],
            blocked || !!item.disabled,
          )
        : [
            {
              path: [...p, item.value],
              label: [...names, item.label].join(' / '),
              disabled: blocked || !!item.disabled,
            },
          ],
    )
  }
  const leaves = flatten(options),
    selectedLabel = leaves.find(
      (leaf) => leaf.path.join('\0') === selected.join('\0'),
    )?.label
  return (
    <>
      {open === undefined && (
        <FormField
          placeholder={placeholder}
          text={selectedLabel}
          disabled={inactive}
          onClick={() => setVisible(true)}
        />
      )}
      <Popup
        {...props}
        title={title}
        position="bottom"
        open={visible}
        onOpenChange={setVisible}
      >
        {showSearch && (
          <Input
            id={searchId}
            placeholder="搜索选项"
            aria-label="搜索选项"
            aria-describedby={undefined}
            aria-invalid={undefined}
            required={false}
            value={query}
            onValueChange={setQuery}
            disabled={inactive}
            allowClear
          />
        )}
        {query ? (
          <div className="du-react-option-list">
            {leaves
              .filter((leaf) =>
                leaf.label
                  .toLocaleLowerCase()
                  .includes(query.toLocaleLowerCase()),
              )
              .map((leaf) => (
                <button
                  key={leaf.path.join('\0')}
                  type="button"
                  disabled={inactive || leaf.disabled}
                  onClick={() => finish(leaf.path)}
                >
                  {leaf.label}
                </button>
              ))}
          </div>
        ) : (
          <div className="du-react-cascader">
            {levels.map((items, index) => (
              <div
                key={index}
                className="du-react-option-list"
                role="group"
                aria-label={`第 ${index + 1} 级`}
              >
                {items.map((item) => (
                  <button
                    type="button"
                    key={item.value}
                    disabled={inactive || item.disabled}
                    aria-pressed={path[index] === item.value}
                    onClick={() => {
                      const next = [...path.slice(0, index), item.value]
                      setPath(next)
                      if (!item.children?.length) finish(next)
                    }}
                  >
                    {item.label}
                    {item.children?.length ? ' ›' : ''}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </Popup>
    </>
  )
}
