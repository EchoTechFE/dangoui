const SIZE_MAP = {
  mini: 24,
  small: 32,
  normal: 32,
  medium: 48,
  large: 56,
}

export function getWidth(size: 'mini' | 'small' | 'normal' | 'medium' | 'large') {
  return SIZE_MAP[size]
}