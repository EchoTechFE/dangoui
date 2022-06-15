import { DumplingUIComponent } from '@frontend/du-types'

export type DuCheckboxShape = 'round' | 'square'

export type DuCheckboxSize = 'large' | 'medium' | 'normal' | 'small' | 'mini'

export type DuCheckboxPosition = 'left' | 'right'

export interface DuCheckboxGroupOption {
  label?: string | number
  value: string | number | boolean
  disabled?: boolean
}

export declare class DuCheckbox extends DumplingUIComponent {
  label: string
  value: string

  shape: DuCheckboxShape
  inline:boolean
  disabled: boolean
  custom: boolean
  position: DuCheckboxPosition

}

export declare class DuCheckboxGroup extends DumplingUIComponent {
  options: DuCheckboxGroupOption[]
  shape: DuCheckboxShape
  inline:boolean
  position: DuCheckboxPosition
}
