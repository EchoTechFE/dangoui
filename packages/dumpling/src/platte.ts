import { fromPlatte as fromButtonPlatte } from './button/platte'

type FromPlatteFn = (color: string) => {
  name: string
  vars: Record<string, string>
}

const fromPlatte: Record<string, FromPlatteFn> = {
  Button: fromButtonPlatte,
}

export default fromPlatte
