import { DumplingUIComponent } from '@frontend/du-types'
import DuButton from '@frontend/du-button/typings'

export declare class DuSnackbar extends DumplingUIComponent {
    offset: number
    duration: number
    content: string
    show: boolean
    showClose: boolean
    buttonProps: DuButton
}
