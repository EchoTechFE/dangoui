import { DumplingUIComponent } from '@frontend/du-types'

export type DuButtonType = 'primary' | 'secondary' | 'recommend' | 'info' | 'text' | 'text-primary'
export type DuButtonSize = 'large' | 'medium' | 'normal' | 'small' | 'mini'

export declare class DuButton extends DumplingUIComponent {
    type: DuButtonType
    ghost: boolean
    size: DuButtonSize
    text: string
    icon: string
    disabled: boolean
    full: boolean
    square: boolean
    loading: boolean
    openType: string
}
