import { fromPlatte as fromButtonPlatte } from './button/platte'
import { fromPlatte as fromSwitchPlatte } from './switch/platte'

type FromPlatteFn = (color: string) => {
  name: string
  vars: Record<string, string>
}

const fromPlatte: Record<string, FromPlatteFn> = {
  Button: fromButtonPlatte,
  Switch: fromSwitchPlatte,
}

export default fromPlatte
