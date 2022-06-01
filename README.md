
## Install

```bash
npm install @frontend/dumpling
```

## Usage

```javascript
// vue.config.js
export default {
  chainWebpack: (config) => {
    config.module
      .rule('dumpling')
      .test(/\.vue$/)
      .use('uniapp-import-loader')
      .loader('uniapp-import-loader')
      .tap(() => {
        return {
          name: '@frontend/dumpling',
          path: (name) => {
            const files = fs.readdirSync(path.resolve(__dirname, './node_modules/@frontend'))
            let pkgName = name.replace(/\B([A-Z])/g, '-$1').toLowerCase()
            if (!pkgName.startsWith('du')) pkgName = 'du-' + pkgName
            let pkg = ''
            pkg = files.find((file) => file === pkgName)
            if (!pkg) {
              pkg = files.find((file) => pkgName.startsWith(file))
            }

            return `@frontend/${pkg}/src/${name.replace('Du', '')}`
          },
        }
      })
  },
}
```

```javascript
//main.js
import '@frontend/du-styles/styles/index.scss'
```

```javascript
// in your components
import { DuButton, DuInput } from '@frontend/dumpling'
```

## Develop

1. 克隆仓库到本地
2. 全局安装 rush
3. rush update

rush 文档 <https://rushjs.io/pages/intro/welcome/>

### 给自己的组件安装依赖

```bash
# 例子：给 du-button 组件库安装 vue 依赖
$ cd ./apps/du-button
$ rush add --package vue
```

### 添加一个新组件（临时）

```bash
# 例子：假设创建一个叫 du-hello 的组件
$ mkdir ./apps/du-hello
# 把 du-button 中必要的文件复制一份到 du-hello 里面
# __tests__, src, typings, .browserslistrc,
# babel.config.js, package.json, postcss.config.js, vue.config.js
# 修改 package.json 的 name 字段为 @frontend/du-hello，修改 build 命令中的 --name 字段
```

操作完之后目录结构大概是这样

```
.
├── README.md
├── __tests__
├── babel.config.js
├── package.json
├── postcss.config.js
├── src
│   ├── Hello.vue
│   └── index.js
└── vue.config.js
```

修改 rush.json，projects 字段下增加包：

```json
{
  "packageName": "@frontend/du-hello",
  "projectFolder": "apps/du-hello",
  "shouldPublish": true,
  "versionPolicyName": "du"
}
```

然后执行

```bash
rush update
```

此时新组件目录会多 node_modules 和 .rush 文件夹

接着，你就可以在 du-ui/stories 增加对应的组件 demo，在 src/index.js 中引入导出 du-hello，在 du-ui/package.json 中的 dependencies 下面增加 @frontend/du-hello 的依赖

查看自己开发的组件：

```bash
# 然后在 du-ui 目录下执行
pnpm run storybook
```

**依赖有问题的时候就跑一下 rush update 重新更新一下依赖**

更多信息请好好阅读一下 rush 的文档：<https://rushjs.io/pages/intro/welcome/>

### 编写组件的须知

> !非常重要

- extClass，extStyle 应在每个组件做保留属性或实现
- 组件需要使用 vue-composition-api 的写法，页面使用 H5 标签，应同时考虑 Uniapp 和 h5 的使用，严禁使用 Uniapp 的 view 等组件
  .js 文件导出
- 注意小程序与浏览器的差异，比如浏览器中没有 scroll-view，开发时可以在 stories 中注册为浏览器编写的模拟 scroll-view 组件：<https://github.com/echoingtech/dumpling/blob/master/apps/du-ui/stories/DuPopup.stories.js#L11>

### 更新图标文件

我们在 https://iconpark.oceanengine.com/projects/7443/detail 上管理图标，当图标发生变化后，重新生成链接，然后选择 SVG Symbol 链接，更改 `apps/du-icon/scripts/genicon.js` 中给 `gen` 函数的传参为最新的 URL，然后运行 `npm run genicon`。提交更改，然后发新版。

### 提交

组件开发完以后，应当完善 storybook，以 storybook 来做初步的文档、示例、手动测试

### Review

对于 RFC

- 创建 PR 后需要经过至少两位参与讨论的同事 + 一位其它同事 review

其它

- 创建 PR 后需要经过至少两位同事 review

### publish

在根目录下创建`.alioss.json`文件，并配置（用于icon图标上传）

```json
{
  "accessKeyId": "",
  "accessKeySecret": ""
}

```

- `rush change`
- `rush version --bump` or `rush version --override-bump BUMPTYPE`
- `rush publish --include-all -t TAG -p`

## 为什么使用 rush + pnpm

- lerna 和 yarn 有两套命令
- pnpm 本身的优势
- 依赖问题(todo: 搞明白解释)
