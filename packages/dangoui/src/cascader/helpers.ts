export type CascaderOption = {
  label: string
  value: string
  disabled?: boolean
  children?: CascaderOption[]
  extra?: any
}
export type FlatOption = {
  option: CascaderOption
  path: string[]
  labels: string[]
}

export type TextPart = {
  text: string
  highlight: boolean
}

export type SearchResultSegment = {
  parts: TextPart[]
}

export type SearchResult = {
  path: string[]
  labels: string[]
  segments: SearchResultSegment[]
}


export function flattenOptions(
  options: CascaderOption[],
  path: string[] = [],
  labels: string[] = [],
): FlatOption[] {
  const result: FlatOption[] = []

  for (const option of options) {
    const currentPath = [...path, option.value]
    const currentLabels = [...labels, option.label]

    if (option.children && option.children.length > 0) {
      result.push(
        ...flattenOptions(option.children, currentPath, currentLabels),
      )
    } else {
      result.push({
        option,
        path: currentPath,
        labels: currentLabels,
      })
    }
  }

  return result
}

export function highlightText(text: string, keyword: string): TextPart[] {
  if (!keyword?.trim()) {
    return [{ text, highlight: false }]
  }

  const parts: TextPart[] = []
  const lowerText = text.toLowerCase()
  const lowerKeyword = keyword.toLowerCase()
  let lastIndex = 0

  let index = lowerText.indexOf(lowerKeyword, lastIndex)
  while (index !== -1) {
    if (index > lastIndex) {
      parts.push({
        text: text.substring(lastIndex, index),
        highlight: false,
      })
    }

    parts.push({
      text: text.substring(index, index + keyword.length),
      highlight: true,
    })

    lastIndex = index + keyword.length
    index = lowerText.indexOf(lowerKeyword, lastIndex)
  }

  if (lastIndex < text.length) {
    parts.push({
      text: text.substring(lastIndex),
      highlight: false,
    })
  }

  return parts
}