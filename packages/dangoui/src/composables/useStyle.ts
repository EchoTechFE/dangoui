import { MaybeRefOrGetter, StyleValue } from 'vue'

export function useStyle(...styles: MaybeRefOrGetter<StyleValue>[]) {
  console.log(styles)
}
