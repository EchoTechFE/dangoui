import { DumplingUIComponent } from '@frontend/du-types'
export declare class DuCalendar extends DumplingUIComponent {
    visible: boolean
    type: string
    title: string
    confirmText: string
    selectedDate: Date
    minDate: Date
    maxDate: Date
    selectableCount: number | string
}
