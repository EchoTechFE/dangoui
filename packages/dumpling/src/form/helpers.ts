import { InjectionKey } from 'vue'

export const listenFormItemClickInjectionKey = Symbol(
  'listenFormItemClick',
) as InjectionKey<(callback: () => void) => void>

export const formLabelSizeInjectionKey = Symbol(
  'formLabelSize',
) as InjectionKey<string>

export const formLabelAlignInjectionKey = Symbol(
  'formLabelAlign',
) as InjectionKey<'left' | 'right'>

export const formItemLayoutInjectionKey = Symbol(
  'formItemLayout',
) as InjectionKey<'horizontal' | 'vertical'>
