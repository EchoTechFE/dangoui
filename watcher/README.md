# 开发监听工具 (实验中)

## 介绍
用于监听 packages 里的修改并打包（热重载），让 docs 自动更新提升工作效率。在当前模式下，只能有一个修改在打包进行中。打包途中如果有修改，系统会记录最新一次修改并在本次打包完成后自动执行下一次任务。如果有对多个文件的修改，会执行对所有 packages 的打包。

## 开始

```bash
npm i
```

## 运行

```bash
npm run dev
```

## 热重载工作流

```bash
cd watcher && npm run dev
cd ../docs && pnpm run dev
```