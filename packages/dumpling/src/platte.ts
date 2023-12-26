import { fromPlatte as fromButtonPlatte } from './button/platte'
import { fromPlatte as fromSwitchPlatte } from './switch/platte'
import { fromPlatte as fromRadioIconPlatte } from './radio/RadioIconPlatte'
import { fromPlatte as fromCheckboxPlatte } from './checkbox/CheckboxPlatte'

type FromPlatteFn = (color: string) => {
  name: string
  vars: Record<string, string>
}

const fromPlatte: Record<string, FromPlatteFn> = {
  Button: fromButtonPlatte,
  Switch: fromSwitchPlatte,
  RadioIcon: fromRadioIconPlatte,
  CheckboxIcon: fromCheckboxPlatte,
}

export default fromPlatte
