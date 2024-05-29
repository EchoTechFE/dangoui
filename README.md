<div align="center"><a name="readme-top"></a>

<img height="166" src="https://cdn.qiandaoapp.com/interior/images/928db35e88a094cd3bd77f03d5c01867.svg">

<h1>Dango UI</h1>

<a href="https://www.npmjs.org/package/dangoui">
  <img src="https://img.shields.io/npm/v/dangoui.svg" />
</a>
<a href="https://github.com/EchoTechFE/dangoui">
  <img src="https://img.shields.io/github/license/EchoTechFE/dangoui" />
</a>
<br>

一套适用于 uni-app 小程序和 Web 的 Vue 3 移动端组件库

</div>

## 🚧🚧 This repo is under heavy development 🚧🚧

## 特性

- 多平台兼容，uni-app、Web 都可以使用
- 默认就很好看，业务上久经考验
- 🚧 易于扩展主题，满足定制需求（开发中）

## 安装

```bash
npm install dangoui

yarn add dangoui

pnpm add dangoui
```

## 开发

```bash
# 编译组件库
pnpm run build

# 文档站 dev 模式
cd docs
# 在 run dev 前，要编译组件库，要查看最新组件库更改，也要编译组件库
pnpm run dev
```

## 链接

- [Dango UI 文档](https://dumpling.echo.tech/)

## 发布

### 发布 packages

1. 做出更改后，`git add`，然后执行 `npx changeset`，并把变更提交到仓库
2. 发布
   1. 手动发布（不推荐）,`npx changest version`、`pnpm run build`、`npx changeset publish`
   2. 自动发布（GitHub Action），提交/合并到 main 的代码，如果含有 changeset 文件，会更新版本并提交一个 PR，合并 PR 后，会进行版本发布

:bulb: **npx changeset 的使用**  
使用空格键确认，使用回车键跳过。在选版本提升时（bump）通过回车键跳过来切换 major，minor，patch 版本。

### 发布文档站

在 GitHub Actions 中，选择 Doc，并点 Run workflow

## 同步到 npmmirror

因为我们的项目用的 npmmirror 镜像，当我们想立刻使用最新版本的时候，可以执行 `pnpm run sync`

## 活动

![Alt](https://repobeats.axiom.co/api/embed/aaf46fe1722cdeeffdf18619e14c1fa43ac66863.svg "Repobeats analytics image")
