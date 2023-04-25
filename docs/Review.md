# 如何 Review 组件的代码

- 阅读组件的 README.md，检查组件的设计，思考设计、命名是否合理
- 对比组件源码中的实现与 README.md 中的设计是否有差异
- 检查组件目录下 __test__ 文件中的测试用例，运行 rush test 是否能通过测试
- 拉取对应分支，进入 apps/du-ui/ 目录，运行 pnpm run storybook 启动 storybook 检查组件的 UI
