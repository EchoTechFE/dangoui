import Button from './button/cssvars'
import Empty from './empty/cssvars'
import Input from './input/cssvars'
import Snackbar from './snackbar/cssvars'
import Steps from './steps/cssvars'
import Calendar from './calendar/cssvars'

export default {
  Button,
  Empty,
  Input,
  Snackbar,
  Steps,
  Calendar,
  Global: {
    '--du-color-main-rgb': '124, 102, 255',
    '--du-color-main': 'rgb(var(--du-color-main-rgb))',
    '--du-color-main-opacity': 'rgba(var(--du-color-main-rgb), 0.2)',
    '--du-c-primary': 'rgb(124,102,255)',
    '--du-c-2': '#1a1866',
    '--du-c-secondary': '#1a1866',
    '--du-c-warning': '#fc7e22',
    '--du-c-success': '#52ba5c',
    '--du-c-error': '#d94a4e',
    '--du-c-text-primary': '#000',
    '--du-c-text-2': 'rgba(0,0,0,0.64)',
    '--du-c-text-3': 'rgba(0,0,0,0.4)',
    '--du-c-text-disable': 'rgba(0,0,0,0.16)',
    '--du-c-b-primary': 'rgba(0,0,0,0.3)',
    '--du-c-b-2': 'rgba(0,0,0,0.1)',
    '--du-c-b-3': 'rgba(0,0,0,0.05)',
    '--du-c-bg-primary': '#f2f0ff',
    '--du-c-bg-2': '#f7f7f9',
    '--du-c-bg-3': '#fff',
    '--du-c-bg-4': '#ededf2',
    '--du-c-bg-success': '#e2f7e3',
    '--du-c-bg-warning': '#fff0e6',
    '--du-c-bg-error': '#ffebe9',
    '--du-c-mask-primary': 'rgba(0,0,0,0.88)',
    '--du-c-mask-2': 'rgba(0,0,0,0.64)',
    '--du-c-mask-3': 'rgba(0,0,0,0.24)',
  },
} as Record<string, Record<string, string>>
