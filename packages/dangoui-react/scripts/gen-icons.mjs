import {
  readFile,
  readdir,
  mkdir,
  writeFile,
  rename,
  rm,
} from 'node:fs/promises'
import { transform } from '@svgr/core'
import jsx from '@svgr/plugin-jsx'
import ts from 'typescript'

// Only repository-owned SVG assets enter the package. No HTML-string runtime API.
const source = new URL(
  '../../dangoui-icon-config/src/index.ts',
  import.meta.url,
)
const sourceText = await readFile(source, 'utf8')
const filenames = new Map(
  [...sourceText.matchAll(/let (\w+) = \{ _: '([^']+)' \}/g)].map((match) => [
    match[1],
    match[2],
  ]),
)
const { outputText } = ts.transpileModule(
  `const __WEB__ = true;\n${sourceText}`,
  {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2020,
    },
  },
)
const assets = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`
)
const target = new URL('../src/icons/', import.meta.url)
await mkdir(target, { recursive: true })
const exports = []
const generatedFiles = new Set(['index.ts'])
async function writeGenerated(file, code) {
  const destination = new URL(file, target)
  const previous = await readFile(destination, 'utf8').catch((error) => {
    if (error.code === 'ENOENT') return null
    throw error
  })
  if (previous === code) return
  const temporary = new URL(`${file}.${process.pid}.tmp`, target)
  await writeFile(temporary, code)
  await rename(temporary, destination)
}
for (const [exportName, asset] of Object.entries(assets).sort(([a], [b]) =>
  a.localeCompare(b),
)) {
  const name = filenames.get(exportName)
  if (!name || typeof asset._ !== 'string' || !asset._.startsWith('<svg'))
    throw new Error(`Invalid shared icon: ${exportName}`)
  const componentName = exportName.replace(/^icon/, 'Icon')
  const svg = asset._
  if (
    /<script|<foreignObject|\son\w+=|(?:href|src)=["'](?:https?:|javascript:)/i.test(
      svg,
    )
  ) {
    throw new Error(`Unsupported active SVG asset: ${name}`)
  }
  let code = await transform(
    svg,
    {
      plugins: [jsx],
      typescript: true,
      jsxRuntime: 'automatic',
      dimensions: false,
      expandProps: false,
      template: ({ componentName, jsx }, { tpl }) => tpl`
      import { useId, createElement } from 'react';
      import { Icon, type IconProps } from '../icon';
      export default function ${componentName}(props: Omit<IconProps, 'children'>) {
        const id = useId();
        void id;
        return createElement(Icon, { ...props, children: ${jsx} });
      }
    `,
    },
    { componentName, filePath: `${name}.svg` },
  )
  // SVG definitions must be unique even when the same icon appears twice.
  code = code
    .replace(/id="([^"]+)"/g, 'id={`${id}-$1`}')
    .replace(/="url\(#([^\)]+)\)"/g, '={`url(#${id}-$1)`}')
    .replace(/(?:xlinkHref|href)="#([^"]+)"/g, 'href={`#${id}-$1`}')
  generatedFiles.add(`${name}.tsx`)
  await writeGenerated(`${name}.tsx`, code)
  exports.push(`export { default as ${componentName} } from './${name}'`)
}
await writeGenerated('index.ts', exports.join('\n') + '\n')
for (const file of await readdir(target)) {
  if (/\.tsx?$/.test(file) && !generatedFiles.has(file))
    await rm(new URL(file, target))
}
console.log(`Generated ${exports.length} React icons from shared SVG assets`)
