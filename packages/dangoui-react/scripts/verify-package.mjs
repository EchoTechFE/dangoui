import {
  mkdtemp,
  readFile,
  writeFile,
  readdir,
  access,
  rm,
} from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const consumer = await mkdtemp(join(tmpdir(), 'dangoui-react-consumer-'))
function run(command, args, cwd = consumer) {
  return execFileSync(command, args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  })
}
let succeeded = false
try {
  await access(join(root, 'dist/index.d.ts'))
  run('pnpm', ['pack', '--pack-destination', consumer], root)
  const archive = (await readdir(consumer)).find((name) =>
    name.endsWith('.tgz'),
  )
  const vueComponents = Array.from(
    (await readFile(join(root, '../dangoui/src/index.ts'), 'utf8')).matchAll(
      /^import (\w+) from ['"].+\.vue['"]/gm,
    ),
    (match) => match[1],
  )
  const manifest = JSON.parse(
    await readFile(join(root, 'package.json'), 'utf8'),
  )
  await writeFile(
    join(consumer, 'package.json'),
    JSON.stringify({
      private: true,
      type: 'module',
      dependencies: {
        'dangoui-react': `file:./${archive}`,
        react: '19.2.0',
        'react-dom': '19.2.0',
      },
      devDependencies: {
        typescript: '5.3.2',
        vite: '5.0.2',
        '@types/react': '19.2.0',
        '@types/react-dom': '19.2.0',
      },
    }),
  )
  run('npm', [
    'install',
    '--ignore-scripts',
    '--no-audit',
    '--no-fund',
    '--prefer-offline',
  ])
  await writeFile(
    join(consumer, 'index.html'),
    '<div id="root"></div><script type="module" src="/main.tsx"></script>',
  )
  await writeFile(
    join(consumer, 'main.tsx'),
    `
import { createRoot } from 'react-dom/client'
import { Button, DangoProvider, Popup, Input, Form, FormItem, Switch, Upload, Tabs, Tab, TabPane, useFeedback, type ThemeTokens } from 'dangoui-react'
import IconClose from 'dangoui-react/icons/close'
import 'dangoui-react/style.css'
const tokens: ThemeTokens = { '--du-primary-color': '#123456' }
function App() {
  const feedback = useFeedback()
  return <><Button icon={<IconClose label="关闭" />} onClick={() => feedback.showToast('已安装')}>独立消费者</Button><Form><FormItem label="名称"><Input defaultValue="商品" /></FormItem><Switch label="启用" /></Form><Tabs defaultValue="a"><Tab name="a">详情</Tab><TabPane name="a">内容</TabPane></Tabs><Upload maxCount={3} /></>
}
createRoot(document.getElementById('root')!).render(<DangoProvider tokens={tokens}><App /><Popup open={false} /></DangoProvider>)
`,
  )
  await writeFile(
    join(consumer, 'tsconfig.json'),
    JSON.stringify({
      compilerOptions: {
        target: 'ES2020',
        module: 'ESNext',
        moduleResolution: 'Bundler',
        jsx: 'react-jsx',
        strict: true,
        skipLibCheck: true,
        lib: ['ES2020', 'DOM'],
        noEmit: true,
      },
      include: ['main.tsx'],
    }),
  )
  await writeFile(
    join(consumer, 'vite.config.mjs'),
    "export default { esbuild: { jsx: 'automatic' } }",
  )
  run('node', ['node_modules/typescript/bin/tsc'])
  run('node', ['node_modules/vite/bin/vite.js', 'build'])
  run('node', [
    '--input-type=module',
    '-e',
    `
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { Button, DangoProvider } from 'dangoui-react';
import * as components from 'dangoui-react';
const expected = ${JSON.stringify(vueComponents)};
for (const name of expected) if (!components[name]) throw new Error('Missing React component: ' + name);
import IconClose from 'dangoui-react/icons/close';
import * as icons from 'dangoui-react/icons';
if (Object.keys(icons).length !== 279) throw new Error('Incomplete icon export');
const html = renderToString(createElement(DangoProvider, null, createElement(Button, null, createElement(IconClose), 'SSR consumer')));
if (!html.includes('SSR consumer')) throw new Error('SSR failed');
`,
  ])
  const packageRoot = join(consumer, 'node_modules/dangoui-react')
  for (const entry of [
    'index',
    ...Object.keys(manifest.exports)
      .filter((key) => key.startsWith('./icons') && !key.includes('*'))
      .map((key) => key.slice(2) + '/index'),
  ]) {
    await access(join(packageRoot, 'dist', `${entry}.js`))
    await access(join(packageRoot, 'dist', `${entry}.d.ts`))
  }
  const assets = await readdir(join(consumer, 'dist/assets'))
  if (!assets.some((name) => name.endsWith('.css')))
    throw new Error('CSS was dropped')
  const bundle = (
    await Promise.all(
      assets
        .filter((name) => name.endsWith('.js'))
        .map((name) => readFile(join(consumer, 'dist/assets', name), 'utf8')),
    )
  ).join('\n')
  if (/1608aa__a|LogoIslands|__UNI_PLATFORM__|createVNode/.test(bundle))
    throw new Error('Unused icons or Vue runtime leaked into the consumer')
  const dependencyTree = JSON.parse(
    run('npm', ['ls', 'react', '--all', '--json']),
  )
  const versions = new Set()
  function visit(tree) {
    for (const [name, dep] of Object.entries(tree.dependencies ?? {})) {
      if (name === 'react') versions.add(dep.version)
      visit(dep)
    }
  }
  visit(dependencyTree)
  if (versions.size !== 1 || !versions.has('19.2.0'))
    throw new Error('Duplicate React versions')
  succeeded = true
  console.log(
    `Package smoke passed: clean install, types, ${vueComponents.length} component exports, SSR, CSS, tree shaking, React 19.2.0. Temporary consumer removed after success.`,
  )
} catch (error) {
  console.error(error.stdout?.toString() ?? '')
  console.error(error.stderr?.toString() ?? '')
  console.error(`Consumer retained for inspection: ${consumer}`)
  throw error
} finally {
  if (succeeded) await rm(consumer, { recursive: true, force: true })
}
