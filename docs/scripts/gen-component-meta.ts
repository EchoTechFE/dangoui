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
  noDeclarations: true,
}

const tsconfigChecker = createComponentMetaChecker(
  resolve(__dirname, '../../tsconfig.json'),
  checkerOptions,
)

const filterMeta = (meta: ComponentMeta): ComponentApi => {
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

let metas: Record<string, ComponentApi> = {}

console.log('start generating component meta...')

const metaDirPath = resolve(__dirname, '../assets/component-meta')

const metaJsonFilePath = join(metaDirPath, `meta.json`)

// Generate component meta
components.forEach((componentPath) => {
  const componentName = parse(componentPath).name

  const meta = filterMeta(tsconfigChecker.getComponentMeta(componentPath))

  metas[componentName] = meta

  if (!existsSync(metaDirPath)) mkdirSync(metaDirPath)

  console.log(`${componentName} meta generated`)
})

metas = JSON.parse(JSON.stringify(metas))

Object.entries(metas).forEach(([name, meta]) => {
  meta.events.forEach((e) => {
    e.declarations = []
    e.schema.forEach((s) => {
      if (typeof s !== 'string') {
      }
    })
  })
  meta.slots.forEach((s) => {
    s.declarations = []
  })
})

fs.writeFileSync(metaJsonFilePath, JSON.stringify(metas, null, 4))

console.log(`All component meta generated`)
