# Dangoui React

面向 React 19.2+ 的 Web/H5 组件。已为 Vue 公开的 58 个组件提供 React 对应实现，并补充 ImagePreview。复用原有色板、主题、UnoCSS 和图标资产。组件存在不等于所有 Vue props、视觉和宿主行为已等价；差异和 API 见 [组件清单](./COMPONENTS.md)。

0.2.0/0.2.1 补齐商家反馈中的 Input、Textarea、选择控件、Form、Tabs、Upload、Tag、Empty 等缺口，提供本地组件交互示例与 tarball 消费验证。商家项目实际消费 React 19.2.7 / Vite 8 / Tailwind；App 和真实业务验收另行完成。

0.2.1 修复 Upload 的 Form/FormItem 禁用、标签、必填与错误关联；异步选图返回时读取最新的禁用状态和文件限制。Select、Picker、PickerView 和 Cascader 的面板也继承表单禁用状态，内部搜索不再与业务字段重复 ID 或继承必填/错误状态。

0.2.2 修复 review 中的重渲染丢草稿、Tabs 纵向跳动、选择组回调、InputNumber/Calendar 表单语义及生命周期问题；补充 Swiper 滑动动画、主题化容器导航、visualViewport 软键盘适配、移动输入字号和安全区。H5 支持与 Vue/JSON Schema 映射见 [COMPONENTS.md](./COMPONENTS.md)。

0.2.3 修复 H5 复查中的滚动祖先误识别、Swiper 首尾倒带和自定义 Portal 容器视口覆盖；导航恢复 Vue 44px 基准，保留触屏 44px 点击区域；Calendar 时间输入使用 16px 字号，打开会话在绘制前初始化草稿。

## 安装与发布

```bash
pnpm add dangoui-react react@^19.2.0 react-dom@^19.2.0
```

使用仓库已有的 Changesets 流程发布到 npm：组件变更连同 `.changeset/*.md` 合入 main 后，Release workflow 自动创建 Version Packages PR；该 PR 合并后执行 `pnpm release`，发布包并推送 `dangoui-react@<version>` tag。首次公开发布的 patch changeset 基于本地验证版 0.2.3 生成 0.2.4。后续版本以 package.json 和 CHANGELOG.md 为准。

GitHub 操作使用已授权的登录态；npm 发布使用 Actions 的 NPM_TOKEN secret。无需在源码中存储凭据或手工推送发布 tag。公开 npm 分发与企业 Nexus 镜像是独立流程。

## 开发与验证

仓库仍使用 pnpm 8.6.1、Vite 5、Vitest 1、TypeScript 5。Vitest 由根工作区提供，避免不同依赖快照导致两个测试运行时混用。

```bash
pnpm install --filter dangoui-react... --frozen-lockfile --ignore-scripts
pnpm --filter dangoui-design-token build
pnpm --filter unocss-preset-echo build
pnpm --filter dangoui-react check
pnpm --filter dangoui-react test
pnpm --filter dangoui-react build
pnpm --filter dangoui-react build:example
pnpm --filter dangoui-react test:package
pnpm --filter dangoui-react dev
```

`dev` 先构建 React 包，再启动寄仓与组件交互示例；示例通过 dist 引用实际 JS/CSS，修改组件后需重新构建。Vite 5 不支持包内自引用解析，因此示例只对 **dist** 设置 alias。`test:package` 另外在系统临时目录打包、安装 tarball，执行独立类型检查、生产构建、SSR、图标导出、CSS 保留、tree shaking 和 React 单实例检查，消费者不使用 alias，也不访问源码。成功后自动清理临时 consumer，失败时保留路径用于排查。

根目录 `pnpm test` 自动发现 React 测试。现有 `vite-plugin-dangoui` 的 `combineVars` 用例与实现对变量名前缀的约定不一致，会失败；React 实现未修改该插件。

## 使用

```tsx
import { Button, DangoProvider, useFeedback } from 'dangoui-react'
import IconCompleteCircle from 'dangoui-react/icons/complete-circle'
import 'dangoui-react/style.css'

function Submit() {
  const feedback = useFeedback()
  async function submit() {
    const result = await feedback.showConfirmDialog({
      title: '确认寄仓',
      message: '请检查商品与收货信息。',
      onConfirm: async () => {
        /* 调用业务服务；抛错会保留弹层并展示错误 */
      },
    }).result
    if (result.reason === 'confirm') feedback.showToast('提交成功')
  }
  return (
    <Button icon={<IconCompleteCircle />} onClick={submit}>
      提交
    </Button>
  )
}

export function App() {
  return (
    <DangoProvider theme="qd">
      <Submit />
    </DangoProvider>
  )
}
```

也可 `import { IconClose } from 'dangoui-react/icons'`。根入口不导入图标全集；图标文件名沿用共享图标数据的名称，少数名称保留大写，如 `icons/LogoIslands`。

## 主题、色板与 UnoCSS

| 资产              | 复用来源                                           | React 输出                                   |
| ----------------- | -------------------------------------------------- | -------------------------------------------- |
| 9 套主题及语义色  | `dangoui-design-token/theme.ts` 的 `createThemes`  | `.du-react.du-theme-*` 变量                  |
| 组件/全局默认变量 | `dangoui/src/cssvars.ts`（纯 TS）                  | `.du-react` 默认变量                         |
| 按钮色板映射      | `dangoui/src/button/platte.ts`（纯 TS）            | `data-color` 变量映射                        |
| 按钮尺寸和视觉    | `dangoui/src/button/style.scss`                    | 构建时编译并改为 `.du-react-button*`         |
| SVG 图标          | `dangoui-icon-config/src/index.ts` 的 Web 数据     | 构建期生成原生 React SVG；无 HTML 字符串 API |
| UnoCSS            | `unocss-preset-echo` + token 内 `presetEchoColors` | 示例复用 preset，指定 `unit: 'px'`           |

所有资产复用发生在构建期；React 运行时不依赖 Vue、uni-app、旧 Vite 插件、UnoCSS 或 token 的生成器。消费者只需引入编译后 CSS，可自行选择 UnoCSS/Tailwind。没有复制另一份色板，也没有修改 Vue 的输出。后续可将仍位于 Vue 目录的纯设计资产迁到独立共享目录。

支持 `qd`、`qd-dark`、`qdm`、`mihua`、`mihua-dark`、`qh`、`qh-dark`、`linjie`、`linjie-dark`。Provider 可嵌套，未指定 theme 时继承父级；`tokens` 合并父级覆盖，并同步到 Portal：

```tsx
<DangoProvider theme="qdm" tokens={{ '--du-primary-solid-bg': '#1677ff' }}>
  <Button>商家按钮</Button>
  <DangoProvider theme="qd-dark">局部暗色</DangoProvider>
</DangoProvider>
```

从按 375px 宽度设计的 H5 页面迁移时，可在 `tokens` 中传入
`'--du-h5-unit': 'calc(100vw / 375)'`。Button 的尺寸和字号以及 Switch 的轨道和滑块会跟随该比例，颜色继续使用当前主题色板。

Portal 默认使用 Provider 所在 `ownerDocument.body`，也可用 `portalContainer` 或 Popup 的 `container` 指定同文档容器。跨 Portal 的定制变量应通过 `tokens` 传入；仅写在外部祖先选择器或 Provider `style` 中的自定义变量不会自动复制。包 CSS 不写 `:root`/`page` 或全局 reset，组件 class 使用 `du-react-*`，支持与现有 Vue `.du-*` 共存。提供一个 CSS 入口，包含九套主题和所有组件样式。

## API

| 组件              | 主要 props / ref                                                                                                                                       | 行为                                                                                                |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| `DangoProvider`   | `theme`、`tokens`、`portalContainer`、`feedback`                                                                                                       | 渲染 div；反馈实例随 Provider 清理                                                                  |
| `Button`          | `variant`、`size`、`color`、`full`、`loading`、`disabled`、`disabledType`、`icon`、`iconPosition`；ref 为 button                                       | `type` 保留 HTML 语义，默认 `button`；loading/disabled 阻止点击与提交                               |
| `Icon` / 生成图标 | `size`、`label`、SVG 原生属性；`Icon` ref 为 svg                                                                                                       | 无 label 时为装饰图标；有 label 时为可访问 img；SVG ID 每实例唯一                                   |
| `Loading`         | `size`、`label`、span 原生属性                                                                                                                         | `role=status`；默认 label 为“加载中”                                                                |
| `Popup`           | `open`、`onOpenChange`、`title`、`description`、`position`、`closable`、`closeOnOverlay`、`closeOnEscape`、`safeArea`、`container`；ref 为 content div | 受控；默认 center，可 top/bottom；焦点圈定、恢复、叠层、引用计数滚动锁由 Radix 提供                 |
| `Dialog`          | Popup props，加 `message`、`showCancel`、`confirmText`、`cancelText`、`onConfirm`、`onConfirmed`、`onCancel`、`onConfirmError`、`confirmErrorMessage`  | 默认禁止遮罩关闭；异步确认期间阻止重复提交与取消；返回 false 保留；reject 展示安全文案，可重试      |
| `ImagePreview`    | Popup props，加 `images`、`index`/`defaultIndex`、`onIndexChange`                                                                                      | 图像可为 URL 或 `{src,alt}`；循环切图、左右键、触摸横划、失败重试、图片级双指缩放、放大后拖动与复位 |

Button 的 `variant` 对应 Vue 的视觉 `type`，值为 primary/secondary/outline/text。尺寸沿用 mini/small/normal/medium/large。保留原生 button 事件和 form 属性；业务继续负责请求幂等。

Popup 的 `onOpenChange(false, reason)` 返回 escape/overlay/close-button；Dialog 还会返回 confirm/cancel。它只发出请求，调用者必须更新 open。动画通过 Radix 的 `data-state` 与 CSS animation 管理，快速反转不会留下关闭计时器。需要直接响应动画时，可使用原生 `onAnimationEnd`。服务句柄的 result 在逻辑关闭时结算，不等待退出动画。Popup 无 title 时用 `aria-label` 提供名称，默认“弹出层”。

ImagePreview 的 index 在首次渲染固定为受控或非受控，不能切换。图片边界变动时渲染索引会限制到合法区间。支持 Pointer Events 双指缩放（1–5 倍）、放大后拖动、双击/按钮复位；缩放手势不会误触切图。图片区域使用 touch-action: none，浏览器交互验证不能代替目标 App 的手势和返回验收。空图片数组显示空态。

## 反馈服务与生命周期

通过 `useFeedback()` 使用当前 Provider 的服务；业务 service 层可创建 `createFeedback()` 并传给 Provider。每个 controller 只绑定一个已挂载 Provider，可在重新挂载时复用。没有全局 DOM root 或跨应用的单例。

```tsx
const loading = feedback.showLoadingToast('正在提交')
try {
  await save()
} finally {
  loading.close() // 只关闭这一条
}
```

`showToast(string | {message,duration})` 默认 2000ms，duration <= 0 不自动关闭；`showLoadingToast` 默认一直显示，必须显式关闭。多个 Toast 纵向排列。`showDialog`、`showConfirmDialog`、`showImagePreview` 复用对应组件。

所有服务返回 `{id, close, result}`；`result` 总是 resolve 为 `{reason}`，不会因用户取消产生未捕获的 reject。reason 为 confirm/cancel/close/timeout/unmount。`feedback.close(handle.id)` 精确关闭，`closeAll()` 仅清当前 controller。应用卸载会结算所有句柄；已经卸载的 controller 收到迟到调用时立即返回 unmount，不创建悬挂实例。调用异步 onConfirm 后关闭/卸载会忽略迟到结果。StrictMode 的临时 detach/attach 不会清理存活实例；在 effect 中发起反馈时仍应返回该句柄的 close 作为清理函数。

## 当前边界

本轮交付 58 个对应组件及模拟示例，不代表完整商家流程或 Vue 全部 props 已验收。PickerView 使用原生 select 列，未复制移动端滚轮物理效果。Calendar 使用日期字符串；Upload 接收可取消的外部 adapter，组件不持有身份、凭据或上传签名。React 18、小程序原生渲染、Nexus 分发、真实业务接口、App 返回、真实 WebView 软键盘和真机手势尚未验收。商家页面仍有未替换的原生控件，视觉差异需按页面核对。

评估与实施决策见 [MIGRATION.md](./MIGRATION.md)。
