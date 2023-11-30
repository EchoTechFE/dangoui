import fs, { existsSync, mkdirSync } from 'fs'
import { join, parse, resolve } from 'path'

import fg from 'fast-glob'
import type { ComponentMeta, MetaCheckerOptions } from 'vue-component-meta'
import { createComponentMetaChecker } from 'vue-component-meta'

// SECTION Types
export interface ComponentApiProps {
  name: ComponentMeta['props'][number]['name']
  description: ComponentMeta['props'][number]['description']

  required: ComponentMeta['props'][number]['required']
  type: ComponentMeta['props'][number]['type']
  default: ComponentMeta['props'][number]['default']
}

export interface ComponentApi {
  props: ComponentApiProps[]
  events: ComponentMeta['events']
  slots: ComponentMeta['slots']
}

// !SECTION

const checkerOptions: MetaCheckerOptions = {
  forceUseTs: true,
  schema: { ignore: ['MyIgnoredNestedProps'] },
  printer: { newLine: 1 },
}

const tsconfigChecker = createComponentMetaChecker(
  resolve(__dirname, '../../tsconfig.json'),
  checkerOptions,
)

const filterMeta = (meta: ComponentMeta): ComponentApi => {
  console.log('filter meta', meta)
  // const clonedMeta: ComponentMeta = JSON.parse(JSON.stringify(meta))

  // Exclude global props
  const props: ComponentApiProps[] = []
  meta.props.forEach((prop) => {
    if (prop.global) return

    const { name, description, required, type, default: defaultValue } = prop

    props.push({
      name: `${name}`,
      description: description,
      required,
      type: type.replace(/ \| undefined/, ''),
      default: defaultValue || 'unknown',
    })
  })

  return {
    props,
    events: meta.events,
    slots: meta.slots.map((s) => ({
      ...s,
    })),
  }
}

// Collect components
const components = fg.sync(['src/**/*.vue'], {
  cwd: resolve(__dirname, '../../packages/dumpling'),
  absolute: true,
})

console.log(components)

const metas: Record<string, ComponentApi> = {}

// Generate component meta
components.forEach((componentPath) => {
  console.log('before')
  const componentName = parse(componentPath).name

  console.log(componentName)

  const meta = filterMeta(tsconfigChecker.getComponentMeta(componentPath))

  metas[componentName] = meta

  const metaDirPath = resolve(__dirname, '../assets/component-meta')

  if (!existsSync(metaDirPath)) mkdirSync(metaDirPath)

  const metaJsonFilePath = join(metaDirPath, `meta.json`)
  fs.writeFileSync(metaJsonFilePath, JSON.stringify(metas, null, 4))
})
