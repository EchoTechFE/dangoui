import { useState } from 'react'
import { Popup, type PopupProps } from './popup'
import { Button } from './button'
import {
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  type ChoiceValue,
} from './choice'
import type { SelectOption } from './select'
import { useControllable, useOnOpen } from './internal'

export interface FilterField {
  label: string
  value: string
  multiple?: boolean
  options?: readonly SelectOption[]
  groups?: readonly { label: string; options: readonly SelectOption[] }[]
}
export type SelectedValue = Record<string, ChoiceValue | readonly ChoiceValue[]>
export interface DropdownProps
  extends Omit<PopupProps, 'children' | 'defaultValue'> {
  options: readonly FilterField[]
  value?: SelectedValue
  defaultValue?: SelectedValue
  onValueChange?: (value: SelectedValue) => void
  onConfirm?: (value: SelectedValue) => void
  cancelText?: string
  confirmText?: string
  showFooter?: boolean
  layout?: 'tag' | 'list'
}
export function Dropdown({
  options,
  value,
  defaultValue = {},
  onValueChange,
  onConfirm,
  cancelText = '取消',
  confirmText = '确定',
  showFooter = true,
  layout = 'tag',
  onOpenChange,
  open,
  title = '筛选',
  ...props
}: DropdownProps) {
  const [selected, setSelected] = useControllable(
      value,
      defaultValue,
      onValueChange,
    ),
    [draft, setDraft] = useState(selected)
  useOnOpen(open, () => setDraft(selected))
  function change(key: string, next: ChoiceValue | readonly ChoiceValue[]) {
    const result = { ...draft, [key]: next }
    setDraft(result)
    if (!showFooter) setSelected(result)
  }
  return (
    <Popup
      {...props}
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      position="top"
    >
      <div className="du-react-dropdown" data-layout={layout}>
        {options.map((field) => (
          <fieldset key={field.value}>
            <legend>{field.label}</legend>
            {(
              field.groups ?? [{ label: '', options: field.options ?? [] }]
            ).map((group, index) => (
              <div key={index}>
                {group.label && <h4>{group.label}</h4>}
                {field.multiple ? (
                  <CheckboxGroup
                    aria-label={group.label || field.label}
                    value={
                      Array.isArray(draft[field.value])
                        ? (draft[field.value] as readonly ChoiceValue[])
                        : []
                    }
                    onValueChange={(next) => change(field.value, next)}
                    inline={layout === 'tag'}
                    shape={layout === 'tag' ? 'card' : 'square'}
                  >
                    {group.options.map((item) => (
                      <Checkbox
                        key={item.value}
                        value={item.value}
                        disabled={item.disabled}
                      >
                        {item.label}
                      </Checkbox>
                    ))}
                  </CheckboxGroup>
                ) : (
                  <RadioGroup
                    aria-label={group.label || field.label}
                    value={(draft[field.value] as ChoiceValue) ?? ''}
                    onValueChange={(next) => change(field.value, next)}
                    inline={layout === 'tag'}
                    shape={layout === 'tag' ? 'button' : 'round'}
                  >
                    {group.options.map((item) => (
                      <Radio
                        key={item.value}
                        value={item.value}
                        disabled={item.disabled}
                      >
                        {item.label}
                      </Radio>
                    ))}
                  </RadioGroup>
                )}
              </div>
            ))}
          </fieldset>
        ))}
      </div>
      {showFooter && (
        <div className="du-react-actions">
          <Button
            variant="secondary"
            onClick={() => onOpenChange?.(false, 'cancel')}
          >
            {cancelText}
          </Button>
          <Button
            onClick={() => {
              setSelected(draft)
              onConfirm?.(draft)
              onOpenChange?.(false, 'confirm')
            }}
          >
            {confirmText}
          </Button>
        </div>
      )}
    </Popup>
  )
}
