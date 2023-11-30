import fs from 'fs'
import path from 'path'
import vueDocs from 'vue-docgen-api'
import type { ComponentMeta } from 'vue-component-meta'

// const checkerOptions = {
//   forceUseTs: true,
//   schema: { ignore: ['MyIgnoredNestedProps'] },
//   printer: { newLine: 1 },
// }

// const tsConfigChecker = createChecker(
//   path.resolve(process.cwd(), '../tsconfig.json'),
//   checkerOptions,
// )

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('content:file:beforeParse', async (file) => {
    if (file._id.endsWith('.md')) {
      // console.log(file)
      let idx = 0
      file.body = file.body.replaceAll(/::demo/g, () => {
        return `::demo{:idx="${++idx}" path="${file._id}"}`
      })
      // console.log(file.body)
      // const matches = file.body.matchAll(/::api{component="(.+)"}/g)
      // const docMap = new Map<string, ComponentMeta>()
      // for (const match of matches) {
      //   const name = match[1]
      //   const componentName = name.split('/')[1]
      //   const filePath = path.resolve(
      //     process.cwd(),
      //     `./assets/component-meta/${componentName}.json`,
      //   )
      //   const json = fs.readFileSync(filePath, 'utf-8')
      //   // console.log('filePath', filePath)
      //   // const meta = tsConfigChecker.getComponentMeta(filePath)
      //   // console.log('meta get')
      //   console.log(json)
      //   docMap.set(name, JSON.parse(json))
      // }

      // file.body = file.body.replaceAll(
      //   /::api{component="(.+)"}/g,
      //   (_: any, name: string) => {
      //     return `::api\n---\ncomponent: ${name}\ndoc: ${JSON.stringify(
      //       docMap.get(name),
      //     )}\n---\n`
      //   },
      // )
    }
  })
})
