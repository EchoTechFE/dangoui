# React 组件支持清单

0.2.3 为 Vue `src/index.ts` 中 58 个 `.vue` 组件提供对应导出，另有 DangoProvider、Loading 和 ImagePreview。打包验证自动按 Vue 入口核对名称。此清单描述已实现能力，不代表 Vue 所有 props 或业务页面已逐项等价。

| 组件                                                           | 主要 React API 与支持能力                                                                                                                                                    |
| -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Button、Icon、IconButton                                       | 原生按钮/SVG、loading/disabled、图标独立入口；Button 视觉用 variant，HTML type 保留提交语义；IconButton 必填 label                                                           |
| Input、Textarea、Search、SearchRight                           | string value/defaultValue/onValueChange；也保留 DOM onChange；原生 ref、输入法、清空、prefix/suffix；Textarea autoSize/showCount/maxLength；Search onSearch                  |
| InputNumber                                                    | number value/defaultValue/onValueChange；min/max/step/precision；输入中间文本在 blur/Enter 提交；加减与方向键                                                                |
| Checkbox、CheckboxGroup、Radio、RadioGroup、RadioIcon、Switch  | checked/defaultChecked/onCheckedChange；组使用 value/defaultValue/onValueChange（string 或 number，CheckboxGroup 为数组）；禁用/只读/选择上限/原生键盘；RadioIcon 为装饰图形 |
| Form、FormItem、FormField                                      | 原生 form、横纵布局、必填/提示/错误关联、disabled；FormField 为选择器按钮；业务负责校验与提交，不内置 schema 表单引擎                                                        |
| Select                                                         | options: {label,value,disabled}[]；单选或 mode="multiple"；filterable、withConfirm、草稿与确认；可控 open/onOpenChange                                                       |
| Picker、PickerView                                             | columns: {label,value,disabled}[][]；string[] value；PickerView 提供触摸/滚轮步进及键盘可访问列；Picker 确认前隔离草稿                                                                       |
| Cascader                                                       | options 递归 children，string[] 路径；逐层选择与 showSearch；禁用祖先的叶子不可搜索选中                                                                                      |
| Calendar                                                       | single/multiple/range；YYYY-MM-DD string 或数组；min/max/disabledDate/selectableCount；showTimePicker 使用 PickerView 的小时/分钟滚轮（YYYY-MM-DDTHH:mm），支持 timeStep=1/5/10 |
| Upload                                                         | UploadFile[]，稳定 uid/status/percent；upload/chooseFiles adapter、beforeUpload、maxCount/maxSize；ref.addFiles/retry/cancel/remove；sessionKey 失效保护                     |
| Tabs、Tab、TabPane、TabsRight                                  | string value/defaultValue/onValueChange；Tab name 与 TabPane name 关联；自动/手动键盘激活，跳过禁用项、指示条与滚动                                                          |
| Card、Divider、Tag、TagsPanel                                  | 卡片标题/内容/折叠；分隔线；语义色标签/移除；标签列表/收起/添加                                                                                                              |
| Image、Avatar、AvatarGroup                                     | 加载/失败处理，图片源更换恢复；裁切/宽度自适应；头像尺寸与组堆叠/上限                                                                                                        |
| Steps、Empty、Badge                                            | steps/activeIndex/status、空态/操作、徽标数值/上限/圆点                                                                                                                      |
| Skeleton、SkeletonParagraph、SkeletonAvatar、SkeletonRectangle | loading/fallback、段落/头像/矩形骨架；非加载时渲染业务内容                                                                                                                   |
| Popup、Dialog、ActionSheet                                     | 同文档 Portal、主题、焦点、滚动锁、嵌套；Dialog 异步确认/失败重试；ActionSheet items/onSelect/禁用/危险操作                                                                  |
| ToastProvider、Snackbar、NoticeBar                             | ToastProvider 为 DangoProvider 别名，useToast 为 useFeedback；Snackbar 超时与关闭；NoticeBar 关闭与链接事件                                                                  |
| Dropdown                                                       | options 配置字段与分组、单选/多选；value 为字段映射，确认前隔离草稿，取消不提交                                                                                              |
| Rate、Tooltip                                                  | 原生 radio 评分、半星/只读；悬浮/焦点提示、延迟、Escape、Portal 及位置更新                                                                                                   |
| Swiper、SwiperItem                                             | 切页/循环、键盘/横划、指示器；autoplay 在悬浮/焦点/后台/减弱动画偏好时暂停                                                                                                   |
| NavigationBar、NavigationBarRight、ActionButton                | 显式 onBack/onShare、固定/占位/安全区、滚动透明度；不直接操作宿主桥或历史栈                                                                                                  |
| Sticky、Transition、Theme                                      | CSS sticky；show/presence/过渡回调与计时器清理；Theme 为 DangoProvider 别名                                                                                                  |

## 使用约定

```tsx
<Form onSubmit={submit}>
  <FormItem label="商品名称" required error={error}>
    <Input value={name} onValueChange={setName} allowClear />
  </FormItem>
  <Switch label="启用" checked={enabled} onCheckedChange={setEnabled} />
  <Button type="submit">保存</Button>
</Form>
```

FormItem 自动给一个库控件分配 id、必填与错误描述。组合多个输入时分别使用 FormItem；原生控件自行提供 id，并用 FormItem htmlFor 关联。选择组通过 aria-labelledby 获得组名。Tabs 的 TabPane 放在 Tabs 的直接子级；不要将面板包进 Fragment 或其他组件。

首次渲染决定受控/非受控模式，后续不要切换。选项值使用稳定的 string/number，不隐式转型。原生事件继续是事件对象；语义回调 onValueChange/onCheckedChange 直接传值。Date、文件、上传与返回的接口不直接复制 uni-app 协议。

## Vue / JSON Schema 到 React 的映射

figma-to-code 应先保留框架无关设计字段，再在框架输出阶段执行下表映射；不要直接把 Vue props spread 到 React DOM。当前保留 React 原生语义，不增加与 HTML type/onChange 冲突的别名。

| Vue / 设计字段                               | React 输出                                          | 说明                                                                                                              |
| -------------------------------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Button type="primary/secondary/outline/text" | variant="…"                                         | React type 仅为 button/submit/reset，默认 button                                                                  |
| Button text 或默认 slot                      | children                                            | `<Button>提交</Button>`                                                                                           |
| Button icon="close"                          | icon={<IconClose />}                                | 从 dangoui-react/icons/close 静态导入；动态 schema 使用显式图标映射表，未知图标报错；根包不加载图标全集           |
| Button iconPosition                          | iconPosition                                        | 同为 left/right                                                                                                   |
| Button arrowRight                            | 在 children 末尾传箭头 SVG，或 iconPosition="right" | 无同名布尔别名；同时需要左右图标时组合 children                                                                   |
| Button press / pressBackground               | 业务 className + CSS :active                        | 不复制 uni-app 的按压计时器；交互回调使用原生 onPointerDown/onPointerUp                                           |
| value / v-model:value / update:value         | value + onValueChange                               | Input/Textarea 为 string，InputNumber 为 number；组/选择器按组件约定                                              |
| checked / update:checked（单独勾选控件）     | checked + onCheckedChange                           | Checkbox/Radio/Switch 语义回调；CheckboxGroup 使用 value 数组                                                     |
| open / update:open                           | open + onOpenChange                                 | Popup 仍由调用方更新受控值，关闭原因另传；选择器也支持 defaultOpen                                                |
| @click、@input、@change                      | onClick、onChange                                   | 原生 DOM 事件对象；直接取值使用 onValueChange/onCheckedChange                                                     |
| extClass / extStyle                          | className / style                                   | React style 使用对象；跨 Portal 的定制变量由 Provider tokens 传递                                                 |
| maxlength / autofocus / confirmType          | maxLength / autoFocus / enterKeyHint                | password 对应 Input type="password"；键盘用 inputMode/type；uni-app cursorSpacing/adjustPosition 无直接浏览器等价 |
| FormItem label / required / error            | 同名 props                                          | 库控件自动关联标签、帮助和禁用；原生控件提供 id + htmlFor                                                         |
| Theme、ToastProvider、useToast               | DangoProvider、useFeedback                          | 兼容导出前述名称，但无 Vue 全局插件配置                                                                           |
| Calendar 日期、Upload 临时路径               | 日期字符串、File/UploadFile + adapter               | 不是 uni-app Date/临时文件协议透传；身份、原生桥接和业务 API 放在外部                                             |

确认型 Select/Picker/Cascader/Calendar/Dropdown 的编辑会话在打开时、浏览器绘制前从当前值初始化。编辑期间父组件重渲染、内联数组或外部选中值变化不覆盖草稿；需要切换编辑对象时先关闭再打开，或更换 key。关闭后再次打开使用最新 props。非确认多选 Select 实时更新已选值，搜索词保留到下次打开。

## H5 支持

React 包直接运行在浏览器 DOM，覆盖移动浏览器、App 内 H5 WebView 和桌面响应式页面。无需 uni-app 或另一份 H5 构建，使用同一个 ESM/CSS 入口。建议现代 Chromium/Android WebView、Safari/iOS WebView，要求 Pointer Events、CSS 变量、动态视口与 inert 等能力；本轮自动浏览器验证为 Chromium 移动仿真，目标 App/iOS 真机仍需验收。

| 场景                 | 实现与边界                                                                                                                                                                                                           |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 触摸横划与动画       | Swiper 支持手指跟随、松手滑动、首尾无缝循环、取消复位；各页仅挂载一次，保留纵向滚动/页面缩放；非当前页 aria-hidden + inert，减弱动画偏好关闭动效，触摸期间暂停 autoplay                                              |
| 图片手势             | ImagePreview 图片级 1–5 倍双指缩放、放大拖动和复位，缩放不切页；图片区域接管手势，其他区域保留页面浏览器行为                                                                                                         |
| 页面/容器滚动        | Tabs 只修改自身 scrollLeft；NavigationBar 自动选有实际纵向溢出的最近滚动祖先，随滚动/窗口尺寸重新判断；可用 scrollTarget（元素/window/返回目标的函数）覆盖；透明背景来自当前主题                                     |
| 软键盘与浏览器地址栏 | Popup 挂载 ownerDocument.body 时监听该文档 visualViewport resize/scroll，在 scale=1 时跟随高度/偏移并滚动到内部焦点；自定义 container/portalContainer 保留 inset: 0，不覆盖容器尺寸；无此 API 回退 vh/dvh            |
| 输入法和触摸目标     | 原生 input/textarea、inputMode/enterKeyHint/autocomplete；中文输入 Enter 不提前确认；Calendar 时间使用 PickerView 滚轮，coarse pointer 下输入文字 16px，关闭/导航触摸目标至少 44px；导航内容及占位保持 Vue 44px 基准，另加顶部安全区 |
| 刘海/横屏/底部安全区 | 示例 viewport-fit=cover；Popup 和 NavigationBar 使用 env(safe-area-inset-\*)，页面底部操作区由业务布局负责                                                                                                           |
| 文件/照片            | Upload 原生 input type=file + accept/multiple；选择、上传可注入 adapter，取消/切店/卸载隔离；需要原生相册/相机返回、上传签名时由宿主 adapter 对接                                                                    |
| 返回与嵌入           | Portal、焦点和滚动锁绑定 ownerDocument，可在 iframe 中运行；NavigationBar onBack/onShare 和 Popup onOpenChange 由应用对接宿主返回协议，不自动修改浏览器历史                                                          |

移动页需配置 `<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">`，不要禁止用户缩放。输入内容不会因为窗口缩小重新初始化。真实系统键盘弹出策略、原生返回拦截、相机权限和 App WebView 版本不能用移动仿真代替验收。包内示例提供容器滚动导航、触摸轮播及底部 H5 表单，可运行 `pnpm --filter dangoui-react dev` 复核。

Dialog 确认失败默认显示“操作失败，请重试”，原错误仅交给 onConfirmError。业务确认可公开的文案通过 confirmErrorMessage 显式传入。Upload 状态只在阶段变化时播报，百分比使用非 live 的 progressbar。

## 上传边界

```tsx
<Upload
  value={files}
  onValueChange={setFiles}
  sessionKey={shopScope}
  maxCount={9}
  upload={async (file, { signal, onProgress }) => {
    return uploadInBusinessLayer(file.file!, { signal, onProgress })
  }}
/>
```

upload 返回 `{url,thumbUrl?}`；删除、取消、切换 sessionKey 或卸载后忽略旧进度与结果，并中止 signal。chooseFiles 可注入浏览器/宿主选图转换后的 File[]，null 表示用户取消。不传 upload 时为本地选择模式，状态保留 pending。组件仅回收自身创建的 blob URL。外部受控列表必须更新；业务请求、签名、权限和宿主临时路径转换均在 adapter 中完成。sessionKey 变化清空列表，父级应接受该变更或替换 value。

Upload 继承 Form/FormItem 的 disabled、标签和错误说明。FormItem required 检查列表非空；上传是否成功仍由业务校验。点击字段标签使用相同的选图 adapter。accept/multiple 为原生选择器提示，自定义 chooseFiles 应遵守业务的文件类型和单次数量约束，必要时用 beforeUpload 校验。

## 待验收差异

- 58 个名称有实现和类型，不表示完整 Vue props、所有尺寸视觉与动画完全等价。
- PickerView 使用按钮列和触摸/滚轮步进，支持键盘可访问的隐藏原生列。Calendar 使用日期字符串，范围按日计算，时间值按 `timeStep` 对齐。
- Popup/Dialog/Select 等需 DangoProvider；Portal 的自定义主题使用 tokens 显式传递。
- 手势基于 Pointer Events；真实 App 返回优先级、WebView 软键盘、安全区、相册和原生上传仍需宿主验收。
- 示例使用本地模拟。正式 Nexus 发布、最小权限安装和业务页面视觉签收尚未完成。
