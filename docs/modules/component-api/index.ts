// `nuxt/kit` is a helper subpath import you can use when defining local modules
// that means you do not need to add `@nuxt/kit` to your project's dependencies
import {
  createResolver,
  defineNuxtModule,
  addServerHandler,
  extendPages,
  addVitePlugin,
  addTemplate,
} from '@nuxt/kit'

import type { ComponentMeta } from 'vue-component-meta'
import { createComponentMetaChecker } from 'vue-component-meta'

import path from 'path'

const checkerOptions = {
  forceUseTs: true,
  schema: { ignore: ['MyIgnoredNestedProps'] },
  printer: { newLine: 1 },
}

const tsConfigChecker = createComponentMetaChecker(
  path.resolve(process.cwd(), '../tsconfig.json'),
  checkerOptions,
)

export default defineNuxtModule({
  meta: {
    name: 'component-api',
  },
  setup() {
    const { resolve } = createResolver(import.meta.url)

    addVitePlugin(() => {
      return {
        enforce: 'pre',
        name: 'vite-plugin-demo-page',
        load(id) {
          if (id.includes('.md')) {
            // console.log(id)
          }
        },
      }
    })
  },
})
