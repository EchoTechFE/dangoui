import { useSize } from '../composables/useSize'

const SIZE_MAP = {
  mini: 16,
  small: 24,
  normal: 32,
  medium: 48,
  large: 56,
}

export function getWidth(size: 'mini' | 'small' | 'normal' | 'medium' | 'large') {
  return useSize(SIZE_MAP[size]).value
}