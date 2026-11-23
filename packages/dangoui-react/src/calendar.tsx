import { useEffect, useRef, useState } from 'react'
import { Popup, type PopupProps } from './popup'
import { Button } from './button'
import { cx, useControllable, useOnOpen } from './internal'
import { FormField, useField } from './form'
import { PickerView, type PickerOption } from './select'

export type CalendarValue = string | readonly string[]
export interface CalendarProps
  extends Omit<
    PopupProps,
    'open' | 'onOpenChange' | 'defaultValue' | 'children'
  > {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  value?: CalendarValue
  defaultValue?: CalendarValue
  onValueChange?: (value: CalendarValue) => void
  onConfirm?: (value: CalendarValue) => void
  type?: 'single' | 'multiple' | 'range'
  min?: string
  max?: string
  selectableCount?: number
  weekStart?: number
  confirmText?: string
  clearText?: string
  onClear?: () => void
  immediateText?: string
  onImmediate?: () => void
  disabledDate?: (date: string) => boolean
  showTimePicker?: boolean
  timeStep?: 1 | 5 | 10
  disabled?: boolean
}
function parseDay(value: string) {
  const [y, m, d] = value.slice(0, 10).split('-').map(Number)
  return new Date(y, m - 1, d, 12)
}
function dayString(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    '0',
  )}-${String(date.getDate()).padStart(2, '0')}`
}
function readTime(
  value: string | undefined,
  fallback: string[],
  step: 1 | 5 | 10,
) {
  const match = value?.slice(11, 16).match(/^(\d{2}):(\d{2})$/)
  if (!match) return fallback
  const hour = Math.min(23, Number(match[1]))
  const minute = Math.min(59, Number(match[2]))
  return [String(hour), String(Math.floor(minute / step) * step)]
}
function timeValue([hour, minute]: readonly string[]) {
  return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`
}
export function Calendar({
  open,
  defaultOpen = false,
  onOpenChange,
  value,
  defaultValue = [],
  onValueChange,
  onConfirm,
  type = 'single',
  min,
  max,
  selectableCount = 30,
  weekStart = 0,
  confirmText = '确定',
  clearText = '清除',
  onClear,
  immediateText,
  onImmediate,
  disabledDate,
  showTimePicker,
  timeStep = 5,
  title = '选择日期',
  disabled,
  ...props
}: CalendarProps) {
  const field = useField(),
    inactive = disabled ?? field.disabled
  const [selected, setSelected] = useControllable<CalendarValue>(
      value,
      defaultValue,
      onValueChange,
    ),
    [visible, setVisible] = useControllable(open, defaultOpen, onOpenChange)
  const [draft, setDraft] = useState<string[]>([]),
    [month, setMonth] = useState(() => parseDay(min ?? dayString(new Date()))),
    [startTime, setStartTime] = useState(['8', '0']),
    [endTime, setEndTime] = useState(['20', '0']),
    [selectionError, setSelectionError] = useState('')
  const daysRef = useRef<HTMLDivElement>(null),
    focusDate = useRef<string | null>(null)
  useEffect(() => {
    if (focusDate.current) {
      daysRef.current
        ?.querySelector<HTMLButtonElement>(`[data-date="${focusDate.current}"]`)
        ?.focus()
      focusDate.current = null
    }
  }, [month])
  useOnOpen(visible, () => {
    setSelectionError('')
    const dates =
      typeof selected === 'string'
        ? selected
          ? [selected]
          : []
        : [...selected]
    setDraft(dates.map((date) => date.slice(0, 10)))
    const anchor = dates[0] ?? min ?? dayString(new Date())
    const date = parseDay(anchor)
    if (!Number.isNaN(date.getTime()))
      setMonth(new Date(date.getFullYear(), date.getMonth(), 1, 12))
    setStartTime(readTime(dates[0], ['8', '0'], timeStep))
    setEndTime(readTime(dates[1], ['20', '0'], timeStep))
  })
  const year = month.getFullYear(),
    m = month.getMonth(),
    week = ((weekStart % 7) + 7) % 7
  const first = new Date(year, m, 1, 12),
    count = new Date(year, m + 1, 0, 12).getDate(),
    pad = (first.getDay() - week + 7) % 7
  const blocked = (date: string) =>
    Boolean(
      (min && date < min.slice(0, 10)) ||
        (max && date > max.slice(0, 10)) ||
        disabledDate?.(date),
    )
  function select(date: string) {
    if (inactive || blocked(date)) return
    setSelectionError('')
    if (type === 'single') setDraft([date])
    else if (type === 'multiple')
      setDraft((prev) =>
        prev.includes(date)
          ? prev.filter((item) => item !== date)
          : prev.length < selectableCount
            ? [...prev, date].sort()
            : prev,
      )
    else if (draft.length !== 1) setDraft([date])
    else {
      const [start, end] = [draft[0], date].sort(),
        cursor = parseDay(start)
      let days = 0
      while (dayString(cursor) <= end) {
        if (blocked(dayString(cursor))) {
          setSelectionError('所选范围包含不可选日期')
          return
        }
        if (++days > selectableCount) {
          setSelectionError(`最多 ${selectableCount} 天`)
          return
        }
        cursor.setDate(cursor.getDate() + 1)
      }
      setDraft([start, end])
    }
  }
  const previousEnd = dayString(new Date(year, m, 0, 12)),
    nextStart = dayString(new Date(year, m + 1, 1, 12))
  const timeColumns: readonly (readonly PickerOption[])[] = [
    Array.from({ length: 24 }, (_, value) => ({
      label: `${String(value).padStart(2, '0')}时`,
      value: String(value),
    })),
    Array.from({ length: 60 / timeStep }, (_, index) => {
      const value = index * timeStep
      return {
        label: `${String(value).padStart(2, '0')}分`,
        value: String(value),
      }
    }),
  ]
  const invalidTimeRange =
    showTimePicker &&
    type === 'range' &&
    draft.length === 2 &&
    draft[0] === draft[1] &&
    timeValue(startTime) >= timeValue(endTime)
  const timeError = invalidTimeRange ? '开始应早于结束' : ''
  return (
    <>
      {open === undefined && (
        <FormField
          disabled={inactive}
          onClick={() => setVisible(true)}
          placeholder="选择日期"
          text={
            typeof selected === 'string'
              ? selected || undefined
              : selected.join(' ~ ') || undefined
          }
        />
      )}
      <Popup
        {...props}
        className={cx('du-react-calendar', props.className)}
        open={visible}
        onOpenChange={setVisible}
        title={title}
        position="bottom"
      >
        <div className="du-react-calendar__header">
          {onClear ? (
            <button
              type="button"
              className="du-react-calendar__action"
              disabled={inactive}
              onClick={() => {
                onClear()
                setVisible(false)
              }}
            >
              {clearText}
            </button>
          ) : (
            <span
              className="du-react-calendar__action-placeholder"
              aria-hidden="true"
            />
          )}
          <div className="du-react-calendar__header-nav">
            <button
              type="button"
              aria-label="上个月"
              disabled={
                inactive || Boolean(min && previousEnd < min.slice(0, 10))
              }
              onClick={() => setMonth(new Date(year, m - 1, 1, 12))}
            >
              ‹
            </button>
            <strong aria-live="polite">
              {year}年{m + 1}月
            </strong>
            <button
              type="button"
              aria-label="下个月"
              disabled={
                inactive || Boolean(max && nextStart > max.slice(0, 10))
              }
              onClick={() => setMonth(new Date(year, m + 1, 1, 12))}
            >
              ›
            </button>
          </div>
          {onImmediate ? (
            <button
              type="button"
              className="du-react-calendar__action"
              disabled={inactive}
              onClick={() => {
                onImmediate()
                setVisible(false)
              }}
            >
              {immediateText ?? '立即开始'}
            </button>
          ) : (
            <span
              className="du-react-calendar__action-placeholder"
              aria-hidden="true"
            />
          )}
        </div>
        <div className="du-react-calendar__week" aria-hidden="true">
          {Array.from({ length: 7 }, (_, i) => (
            <span key={i}>{'日一二三四五六'[(i + week) % 7]}</span>
          ))}
        </div>
        <div
          ref={daysRef}
          className="du-react-calendar__days"
          role="group"
          aria-label={`${year}年${m + 1}月日期`}
          onKeyDown={(event) => {
            const shift = {
              ArrowLeft: -1,
              ArrowRight: 1,
              ArrowUp: -7,
              ArrowDown: 7,
            }[event.key]
            if (
              inactive ||
              shift === undefined ||
              !(event.target instanceof HTMLElement)
            )
              return
            const date = event.target.dataset.date
            if (!date) return
            event.preventDefault()
            const next = parseDay(date)
            let token = date
            // Bound the search when a disabledDate predicate rejects every day.
            for (let attempt = 0; attempt < 3660; attempt++) {
              next.setDate(next.getDate() + shift)
              token = dayString(next)
              if (
                (min && token < min.slice(0, 10)) ||
                (max && token > max.slice(0, 10))
              )
                return
              if (!blocked(token)) break
            }
            if (!blocked(token)) {
              if (next.getMonth() !== m) {
                focusDate.current = token
                setMonth(new Date(next.getFullYear(), next.getMonth(), 1, 12))
              } else
                event.currentTarget
                  .querySelector<HTMLButtonElement>(`[data-date="${token}"]`)
                  ?.focus()
            }
          }}
        >
          {Array.from({ length: pad }, (_, i) => (
            <span key={`pad-${i}`} />
          ))}
          {Array.from({ length: count }, (_, i) => {
            const date = dayString(new Date(year, m, i + 1, 12)),
              active = draft.includes(date),
              inRange =
                type === 'range' &&
                draft.length === 2 &&
                date > draft[0] &&
                date < draft[1]
            return (
              <button
                key={date}
                type="button"
                data-date={date}
                aria-label={date}
                aria-pressed={active}
                aria-current={
                  date === dayString(new Date()) ? 'date' : undefined
                }
                disabled={inactive || blocked(date)}
                data-in-range={inRange}
                onClick={() => select(date)}
              >
                {i + 1}
              </button>
            )
          })}
        </div>
        {showTimePicker && (
          <div className="du-react-calendar__time">
            {type === 'range' && (
              <div className="du-react-calendar__time-header">
                <span>开始时间</span>
                <span aria-hidden="true">→</span>
                <span>结束时间</span>
              </div>
            )}
            <div className="du-react-calendar__time-pickers">
              <PickerView
                appearance="wheel"
                columns={timeColumns}
                columnLabels={
                  type === 'range' ? ['开始小时', '开始分钟'] : ['小时', '分钟']
                }
                value={startTime}
                onValueChange={setStartTime}
                disabled={inactive}
              />
              {type === 'range' && (
                <PickerView
                  appearance="wheel"
                  columns={timeColumns}
                  columnLabels={['结束小时', '结束分钟']}
                  value={endTime}
                  onValueChange={setEndTime}
                  disabled={inactive}
                />
              )}
            </div>
          </div>
        )}
        <Button
          full
          disabled={
            inactive ||
            Boolean(selectionError) ||
            Boolean(timeError) ||
            !draft.length ||
            (type === 'range' && draft.length !== 2) ||
            draft.some(blocked)
          }
          onClick={() => {
            let result: CalendarValue
            if (!showTimePicker)
              result = type === 'single' ? draft[0] : [...draft]
            else if (type === 'single')
              result = `${draft[0]}T${timeValue(startTime)}`
            else if (type === 'range')
              result = draft.map(
                (date, index) =>
                  `${date}T${timeValue(index === 0 ? startTime : endTime)}`,
              )
            else result = draft.map((date) => `${date}T${timeValue(startTime)}`)
            setSelected(result)
            onConfirm?.(result)
            setVisible(false)
          }}
        >
          {selectionError || timeError || confirmText}
        </Button>
        {(selectionError || timeError) && (
          <p role="status" className="du-react-error">
            {selectionError || timeError}
          </p>
        )}
      </Popup>
    </>
  )
}
