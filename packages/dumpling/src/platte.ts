import { fromPlatte as fromButtonPlatte } from './button/platte'
import { fromPlatte as fromSwitchPlatte } from './switch/platte'
import { fromPlatte as fromRadioIconPlatte } from './radio/RadioIconPlatte'

type FromPlatteFn = (color: string) => {
  name: string
  vars: Record<string, string>
}

const fromPlatte: Record<string, FromPlatteFn> = {
  Button: fromButtonPlatte,
  Switch: fromSwitchPlatte,
  RadioIcon: fromRadioIconPlatte,
}

export default fromPlatte
