import { fromPlatte as fromButtonPlatte } from './button/platte'
import { fromPlatte as fromSwitchPlatte } from './switch/platte'
import { fromPlatte as fromRadioIconPlatte } from './radio/RadioIconPlatte'
import { fromPlatte as fromCheckboxPlatte } from './checkbox/CheckboxPlatte'
import { fromPlatte as fromInputNumberPlatte } from './input-number/platte'

type FromPlatteFn = (
  color: string,
  ctx?: Record<string, { vars: Record<string, string> }>,
) => {
  name: string
  vars: Record<string, string | string[]>
}

const fromPlatte: Record<string, FromPlatteFn> = {
  Button: fromButtonPlatte,
  Switch: fromSwitchPlatte,
  RadioIcon: fromRadioIconPlatte,
  CheckboxIcon: fromCheckboxPlatte,
  InputNumber: fromInputNumberPlatte,
}

export default fromPlatte
