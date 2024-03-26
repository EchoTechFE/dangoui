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
import glob from 'fast-glob'
import path from 'path'
import fs from 'fs'

export default defineNuxtModule({
  meta: {
    name: 'hello',
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    nuxt.hook('builder:watch', (event, filename) => {
      filename = relative(nuxt.options.srcDir, resolve(nuxt.options.srcDir, filename))
      if (!filename.endsWith('.md')) {
        return
      }

      const files = glob.sync('**/*.md', {
        absolute: true,
        cwd: path.resolve(process.cwd(), './content'),
      })
      for (const file of files) {
        const content = fs.readFileSync(file, 'utf-8')
        const matches = content.matchAll(/#snippet[\s]+```vue([\s\S]*?)```/gm)

        const pathMatch = file.match(/(\d+)\.(.+)\/(\d+)\.(.+)\.md$/)
        let p = ''
        if (pathMatch) {
          p = pathMatch[2] + '/' + pathMatch[4]
        }

        let i = 1
        for (const match of matches) {
          const snippet = match[1]
          const snippetFile = path.resolve(
            process.cwd(),
            `./pages/demos/${p}/snippet${i++}.vue`,
          )

          // console.log(snippetFile, 'write')

          // console.log('write', snippetFile)

          fs.mkdirSync(path.dirname(snippetFile), { recursive: true })
          fs.writeFileSync(snippetFile, snippet)
        }
      }
    })

    // extendPages((pages) => {
    //   console.log('extend pages')
    //   pages.unshift({
    //     name: 'test-preview',
    //     path: '/test-preview',
    //     file: resolve('runtime/preview.vue'),
    //   })
    // })

    // addVitePlugin(() => {
    //   return {
    //     enforce: 'pre',
    //     name: 'vite-plugin-demo-page',
    //     resolveId(source) {
    //       if (source.includes('demos/') || source.includes('preview')) {
    //         return source
    //       }
    //     },
    //     load(id) {
    //       // console.log(id, 'hello')
    //       if (id.includes('demos') || id.includes('preview')) {
    //         console.log(id)
    //         return `<template><div>${id}</div></template>`
    //       }
    //     },
    //   }
    // })
  },
})
