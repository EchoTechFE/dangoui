## Usage

// TODO:

```

```

## Develop

1、克隆仓库到本地
2、全局安装 rush
3、rush update

rush 文档 https://rushjs.io/pages/intro/welcome/

### 编写组件的须知

> !非常重要

- extClass，extStyle 应在每个组件做保留属性或实现
- 组件需要使用 vue-composition-api 的写法，页面使用 H5 标签，应同时考虑 Uniapp 和 h5 的使用，严禁使用 Uniapp 的 view 等组件
  .js 文件导出

### 提交

组件开发完以后，应当完善 storybook，以 storybook 来做初步的文档、示例、手动测试

### Review

对于 RFC

- 创建 PR 后需要经过至少两位参与讨论的同事 + 一位其它同事 review

其它

- 创建 PR 后需要经过至少两位同事 review

### publish

- `rush change`
- `rush version --bump` or `rush version --override-bump BUMPTYPE`
- `rush publish --include-all -t TAG -p`

## 为什么使用 rush + pnpm

- lerna 和 yarn 有两套命令
- pnpm 本身的优势
- 依赖问题(todo: 搞明白解释)
