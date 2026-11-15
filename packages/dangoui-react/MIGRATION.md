# 迁移指南评估与本轮实施记录

依据《Dangoui React 版迁移指南》v1.0（2026-11-15）及仓库 HEAD `59505dd5899ffd270943f506622af799d07a7868`。

## 评估

总体合理，可以实施。共享设计语义、框架各自实现状态、UI 与宿主/业务分离、按真实流程分批覆盖、从 tarball 验证消费，这些方向与现有仓库相符。React 组件无须沿用小程序编译链，也不需要升级整个 monorepo。

实施时收敛以下事项：

1. “阶段 0”中的业务覆盖、发布维护与真机基准不能凭组件源码代替。先冻结可验证的 UI API 与场景；Cherry 的引用数量和实际 props 覆盖没有重新扫描，不把静态矩阵当作业务验收。
2. 共享层应包括现有 `unocss-preset-echo`、token 和纯 TS 色板映射。它们本来与 React/Vue 无关，不建设 React 专用 UnoCSS preset，也不复制一份颜色 JSON。Vue 包内的纯 TS/SCSS 暂由构建配置直接读取，消费者不依赖这些源码路径。
3. 图标以 `dangoui-icon-config` 已生成的 Web 数据为准。原始 icons 目录部分 fill 值与 Web 产物不同，直接把原始 SVG 搬进 React 会破坏 currentColor。构建期生成 React SVG，并按实例改写 definition ID。
4. 使用 Radix Dialog 1.1.15 作为首批 Popup/Dialog primitive，锁定版本。它覆盖 focus scope、dismissable layer、portal、presence 和滚动锁；仍须独立验证目标 WebView/真机，不能把采用 primitive 等同于业务验收。嵌套默认打开时额外保证父 scope 先注册。
5. 支持基线为 React/React DOM 19.2（包内开发与干净消费使用 19.2.0；商家消费使用 19.2.7）；peer 为 ^19.2.0，不声明 React 18。ESM 优先，JSX runtime external；不提供未经验证的 CJS。
6. 同页 Vue/React 使用独立组件 class 和作用域主题，无全局 reset。初版单一 CSS 入口、九套主题；明确 tokens 通过 Portal 的继承契约。
7. 服务通过 Provider/controller 提供，不增加全局单例。取消 resolve 明确结果，每实例可独立关闭；卸载结算，迟到调用不会留下实例。
8. 示例放在 React 包内，不改变 workspace 范围；消费 dist，并通过额外 tarball 检查覆盖独立安装。保留仓库现有 pnpm/Vite/Vitest/TypeScript 和原有依赖快照；新增包先 private，发布方案不在本轮擅自确定。

## 本轮范围

| 指南阶段 | 本轮结果                                                            | 未完成验收                               |
| -------- | ------------------------------------------------------------------- | ---------------------------------------- |
| 0        | UI API、支持基线、primitive、样式与服务契约                         | 商家覆盖扫描、设计签收、发布维护决策     |
| 1        | 独立 React 包、ESM/d.ts/CSS/exports、示例、tarball 消费检查         | 正式 Registry 分发                       |
| 2        | 同源主题/色板/按钮 SCSS/279 图标，UnoCSS preset 复用                | 设计基准与页面级视觉签收                 |
| 3 / A    | 基础与反馈组件、嵌套弹层、模拟寄仓案例                              | 商家完整寄仓联调、App/Workbench/真机验收 |
| B/C      | 表单、选择器、Tabs、Upload、展示与其他组件，覆盖 58 个 Vue 公开名称 | 完整 Vue props 与页面分支等价验收        |
| D        | 本地 0.2.0 tarball 消费                                             | 稳定发布与 Nexus                         |

## 0.1.0 验证记录（历史）

- React 交互与 SSR 测试：按钮原生提交、loading/disabled、图标名称/ID、Portal tokens、自定义容器、受控关闭、嵌套默认打开、StrictMode、滚动锁清理、焦点恢复、反馈隔离/卸载/超时、异步确认失败重试/重复点击/迟到结果、图片切换/失败重试/原图查看。
- React、Vue Button/Popup、token 相关回归测试通过。根工作区能够发现 React 项目，使用同一个 Vitest 运行时。
- 现有 `vite-plugin-dangoui/src/index.test.ts` 的 combineVars 断言期待自动加 `--`，现有实现直接拼接，业务调用者已传入前缀；本轮未修改其实现或测试。全仓测试应单独记录这项既有失败。
- `test:package` 在临时目录安装 tarball：类型、exports、SSR、CSS 产出、未用图标摇除、React 单实例通过；无 Vue/uni-app 运行时。该脚本可在 CI 复跑。
- 相关测试共 22 项通过（React 15 项、Vue 6 项、token 1 项）。
- 生产示例浏览器检查通过：移动宽度浅色/暗色、Portal 主题、嵌套 Escape、确认/取消/模拟提交、图片切换/原图查看、滚动锁恢复；iframe 内主题正确，滚动锁仅作用于 iframe 文档，关闭后恢复。浏览器无错误或警告。真实业务/目标 App 和真机未验收。

可复跑命令见 README。交付源码与构建/验证能力，不创建分支、不提交、不推送、不发布。

## 0.2.0 迁移反馈修复（2026-11-15）

商家项目固定 0.1.0 的组件缺口属实，现补充完整公开名称清单，具体支持范围见 COMPONENTS.md。新增组件沿用 React 受控值和原生事件，不引入 Vue 或业务请求。Upload 使用 UID、AbortSignal 和 sessionKey 处理并发、删除、重试、切店与迟到结果；Input 保留中文输入法与金额中间文本。ImagePreview 增加图片级双指缩放、拖动与复位。

新增交互用例覆盖表单关联/错误/禁用、输入法、受控值、选择组限制、Tabs 键盘与面板、Select/Picker/Cascader/Dropdown 草稿、日期范围和跨月焦点、Upload 取消/删除/重试/切店/卸载/对象 URL 清理、展示与反馈、评分、轮播及手势。独立 tarball 脚本按 Vue 入口自动核对 58 个名称，并编译实际使用表单/Tabs/Upload 的消费者，继续检查 CSS、图标摇除与 React 单实例。原 0.1.0 记录保留为历史，不作为新功能的验收结论。

商家项目以不可变文件名接入 vendor/dangoui-react-0.2.0.tgz，商品/抽选公共输入、文本域和开关接入包产物，保留原有数值校验和业务媒体 adapter。消费者 React 19.2.7 / Vite 8 / Tailwind 的 check/build 与 mock 交互单独记录于该项目 docs/dangoui-review.md。宿主、真实业务及正式发布仍待验收。

0.2.0 实跑：React 54 项测试及 Vue/token 7 项回归全部通过；check、库构建、示例构建、独立 tarball 消费通过。移动宽度浏览器验证表单/开关、Tabs/半星、Select 搜索、Picker/Cascader、操作菜单、上传/删除、暗色/商家主题、无横向溢出；通过 Chrome touch events 验证图片双指缩放 2 倍、复位、切图与 Escape。浏览器无错误/警告。浏览器检查发现并修正了选择控件装饰层遮挡、Tabs 标签栏被面板挤压、纵向表单宽度和示例暗色背景。

## 0.2.2 review 修复与 H5 补强（2026-11-15）

review 的行为问题已复核成立并修复：Tabs 不再调用 scrollIntoView，选择器只在打开时初始化草稿；实时多选保留搜索；Calendar 补齐 Form 禁用/标签/错误、范围超限提示和跳过禁用日期的键盘导航；CheckboxGroup 拒绝超限操作不再报告成功；InputNumber 空白 Enter 与 blur 一致并传递 required；Transition 初始隐藏不报告离场，Rate 零分不借用第一档文本。

Button 接入复用 SCSS 的图标尺寸/边距类；NavigationBar 背景使用主题变量，支持滚动祖先自动发现及显式 scrollTarget；Swiper 改为 transform 动画/手指拖动和松手归位，非当前页 inert。Dialog 使用安全错误文案，原错误仅经回调传出；Upload 进度与 live 状态拆分；打包脚本成功自动清理临时 consumer。Vue/JSON Schema props 映射与 H5 场景矩阵见 COMPONENTS.md。

移动 H5 原已有 DOM/触摸/安全区实现；本轮补上 visualViewport 视口变化与弹层内部焦点滚动、coarse pointer 输入字号/触摸目标、容器导航与触摸轮播。浏览器测试发现并修复了子元素隐式指针捕获转移时冒泡的 lostpointercapture 清空拖动状态，ImagePreview 同步防护。测试覆盖浏览器视口收缩/恢复，不宣称真实 iOS/Android 系统键盘和 App 返回协议已验收。

共享资产仍在构建时读取 Vue 包内纯 TS/SCSS，路径由 CI paths 覆盖。此次不移动旧 Vue 目录；跨框架共享目录重构应单独保持两端输出的等价验证。现有 React 新包及文件尚未提交，未新增分支、push 或发布；仓库要求合并前由 Jocelyn 审核新增文件，保留该要求，不代为宣称已审批。

0.2.2 实跑结果：React 86 项、Vue Button/Popup 与 token 7 项，合计 93 项回归通过；check、库和示例生产构建通过。Chromium 移动触摸仿真验证 320×640、390×844、844×390 无横向溢出；TabPane 受控输入前后 document scrollY 一致；暗色容器滚动导航取主题色；轮播实际 touch 事件切页成功；视口 844→420→844 时弹层/焦点/输入值正确恢复；关闭后滚动锁清理。Button 图标/间距实测 mini/small 为 12/4px，normal/medium 为 16/6px，large 为 20/8px。浏览器无运行时错误或警告。

## 0.2.3 H5 复查修复（2026-11-15）

复查中的滚动容器误识别、循环轮播首尾倒带和自定义 Portal 的可视视口覆盖均成立。NavigationBar 自动发现同时检查纵向溢出与实际可滚动高度，捕获 ownerWindow 的滚动并重查祖先，支持异步内容加载后才出现的滚动容器；显式 scrollTarget 仍优先。Swiper 以相邻环形位置完成首尾动画和边界拖动，只在视口外重排页面，不复制 DOM 或重建表单状态。

Popup 仅在挂载 ownerDocument.body 时跟随 visualViewport；显式 container 和 Provider portalContainer 保留容器自身 inset 布局，切换目标时同步移除窗口尺寸覆盖。导航按现有 Vue NavigationBar.scss 的 44px 内容高度恢复，触屏按钮仍占 44px 并保留安全区。Calendar 时间输入补齐触屏 16px 字号；useOnOpen 使用 layout effect，使重新打开的草稿在绘制前同步。真实 iOS/Android 系统键盘、WebView 与 App 返回仍需真机验收。

实跑：95 项 React 测试及 7 项 Vue/token 回归全部通过，类型检查、库与示例构建通过。Chromium 移动仿真检查了首尾过渡的中间帧：出页 0→-100%、入页 100%→0，中间页没有穿过视口；实际 touch 事件验证第一页向右拖动可见最后一页并切换成功。overflow-x:hidden 的非滚动祖先会被跳过，窗口滚动可正常渐显导航。带 transform 的预览容器遮罩与内容均在容器边界内；Calendar 时间输入实测 16px，320px/390px/横屏导航均 44px 且无水平溢出。body 弹层在 844→420→844 的视口变化下保留输入值，退出动画后释放滚动锁。浏览器无运行时错误或警告。

## GitHub / Changesets 发布准备（2026-11-15）

用户已明确授权 create branch、commit、rebase、push 和发布，更新此前仅本地验证的交付边界。React 包移除 private，指定 npm public registry，并沿用仓库现有 Release workflow 与 NPM_TOKEN secret。patch changeset 从本地 0.2.3 生成首个公开版本 0.2.4，由 Changesets 的版本 PR、npm publish 和自动 tag 完成发布，不手工伪造发布 tag。前文未提交/未发布为各历史验证阶段的状态；实际发布结果以 GitHub Actions 与 npm Registry 为准。真机与业务验收边界保持不变。
