import type { Locale } from '../index'

const locale: Locale = {
  global: {
    close: 'Close',
    cancel: 'Cancel',
    confirm: 'Confirm',
    select: 'Select',
  },
  Calendar: {
    clear: 'Clear',
    selectDate: 'Select Date',
    selectDateRange: (maxRange: number) =>
      maxRange > 1
        ? `Select Date (up to ${maxRange} days)`
        : `Select Date (up to ${maxRange} day)`,
    today: 'Today',
    startEnd: 'Start/End',
    start: 'Start',
    end: 'End',
    startTime: 'Start Time',
    endTime: 'End Time',
    hour: 'h',
    minute: 'm',
    selected: 'Selected',
    toBeSet: 'To be set',
    startShouldBeforeEnd: 'Start should be before end',
    missingEndTime: 'Missing end time',
    maxDays: (maxRange: number) =>
      maxRange > 1 ? `Up to ${maxRange} days` : `Up to ${maxRange} day`,
    selectedDates: (count: number) =>
      count > 1 ? `${count} dates` : `${count} date`,
    weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  },
  FormItem: {
    edited: 'Modified',
  },
  TagsPanel: {
    fold: 'Collapse',
    expand: 'Expand',
  },
  Upload: {
    uploading: 'Uploading...',
    image: 'Image',
    video: 'Video',
    maxCount: (maxCount: number) =>
      maxCount > 1
        ? `Upload up to ${maxCount} files`
        : `Upload up to ${maxCount} file`,
  },
}

export default locale
