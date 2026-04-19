# 项目 Figma 规范 - DangoUI

> 基于 dangoui@3.6.14 自动生成，可手动补充修改。

---

## 组件库

**包名**：`dangoui`
**前缀**：`Du`（`<DuButton>` 和 `<Button>` 均可，统一用 `Du` 前缀）

### 组件引入

按需引入，在 `<script setup>` 顶部添加 import，**只引入当前文件实际用到的组件**：

```ts
// 示例：按需引入，不要全量引入
import { DuButton, DuInput, DuIcon, DuSelect, DuDivider } from 'dangoui'
import { DuForm, DuFormItem, DuPopup, DuTag, DuSwitch, DuTextarea, DuUpload } from 'dangoui'
```

---

## 业务组件映射

<!--
骨架中未识别的 INSTANCE 节点会附带 <!-- figma-node: xxx --> 注释。
翻译时按本表决策，三种情况：
  1. 文件路径为 "-"  → 已知基础组件，直接使用，不递归
  2. 文件路径有值    → 已生成的业务组件，直接 import，不递归
  3. 未匹配          → 询问用户是否生成、保存在哪里，确认后递归拉取该 figma-node 生成子组件文件，完成后补充本表
-->

| Figma 组件名（模糊匹配） | 项目组件 | 文件路径 | 备注 |
|---|---|---|---|
| icon/* / Icon* / Arrow* / Chevron* / Close* | `DuIcon` | - | 基础组件 |
| Button* / Btn* / Submit* | `DuButton` | - | 基础组件 |
| Input* / InputFrame* / TextField* | `DuInput` | - | 基础组件 |
| Textarea* | `DuTextarea` | - | 基础组件 |
| FormItem* | `DuFormItem` | - | 基础组件 |
| Picker* / DatePicker* / Select* / Dropdown* | `DuSelect` | - | 基础组件 |
| Divider* / Line* / Separator* | `DuDivider` | - | 基础组件 |
| Popup* / Sheet* / BottomSheet* | `DuPopup` | - | 基础组件 |
| Tag* | `DuTag` | - | 基础组件 |
| Switch* | `DuSwitch` | - | 基础组件 |
| Upload* | `DuUpload` | - | 基础组件 |

<!-- 每次递归生成新组件后，在此补充一行，例如：
| ProductCard | `ProductCard` | src/components/ProductCard.vue | 已生成 |
-->

---

## 组件映射规则

Figma 骨架中识别到 INSTANCE 节点时，按以下规则映射到 DangoUI 组件。

### 图标

| Figma 节点名含 | 组件 | 用法 |
|---|---|---|
| `Icon` / `Arrow` / `Chevron` / `Close` / `Search` | `<DuIcon>` | `<DuIcon name="arrow-right" :size="16" />` |

- `name`：从节点名推断（如 `IconArrowRight` → `arrow-right`，转为 kebab-case）
- `size`：从骨架的 `w-[Npx]` 读取数字
- `color`：若骨架有颜色，转为 dangoui 色板名或直接用 hex

```html
<DuIcon name="arrow-right" :size="12" />
<!-- color 可用色板名或 CSS 颜色值 -->
<DuIcon name="close" :size="20" color="primary" />
<DuIcon name="search" :size="20" extClass="custom-icon" />
```

**DuIcon props**：
- `name`：图标名（iconfont 名或图片链接）
- `size`：string | number
- `color`：色板颜色名或 CSS 颜色值
- `extClass`：自定义 class

### 按钮

| Figma 节点名含 | 组件 | 用法 |
|---|---|---|
| `Button` / `Btn` / `Submit` | `<DuButton>` | 见下方 |

```html
<!-- 主按钮，全宽 -->
<DuButton color="primary" type="primary" size="large" full @click="handleSubmit">提交</DuButton>

<!-- 描边按钮 -->
<DuButton type="outline" color="primary" @click="fn">取消</DuButton>

<!-- 文字按钮 -->
<DuButton type="text" color="primary" @click="fn">查看详情</DuButton>

<!-- 带图标 -->
<DuButton color="primary" icon="arrow-right" iconPosition="right" @click="fn">下一步</DuButton>

<!-- 加载中 -->
<DuButton color="primary" :loading="submitting" full @click="handleSubmit">提交</DuButton>
```

**DuButton props**：
- `color`：色板颜色名（primary / danger / warning 等）
- `type`：`'text'` | `'primary'` | `'secondary'` | `'outline'`
- `size`：`'small'` | `'mini'` | `'normal'` | `'medium'` | `'large'`
- `full`：boolean，全宽
- `loading`：boolean
- `disabled`：boolean
- `icon`：图标名
- `iconPosition`：`'left'` | `'right'`
- `arrowRight`：boolean
- `extClass`：自定义 class

### 输入框

| Figma 节点名含 | 组件 | 用法 |
|---|---|---|
| `Input` / `InputFrame` / `TextField` | `<DuInput>` | 见下方 |
| `FormItem` 且变体为 `Type=Input_frame`（无 label） | `<DuInput>` | 直接用，不套 DuForm |
| `FormItem` 且有 label 文字 | `<DuFormItem>` + `<DuInput>` | 套 DuForm |
| `Textarea` | `<DuTextarea>` | 见下方 |

```html
<!-- 外边框样式（bordered），适合独立输入框场景 -->
<DuInput v-model:value="form.name" placeholder="请输入" bordered />

<!-- 隐藏底部分割线（withoutBorder），适合自定义布局 -->
<DuInput v-model:value="form.name" placeholder="请输入" withoutBorder />

<!-- 默认样式（有底部分割线，不加 bordered / withoutBorder） -->
<DuInput v-model:value="form.name" placeholder="请输入" />

<!-- 带前缀文本 -->
<DuInput v-model:value="form.phone" placeholder="请输入手机号" prefix="+86" />

<!-- 带后缀文本 -->
<DuInput v-model:value="form.amount" placeholder="请输入金额" suffix="元" />

<!-- 带右侧图标 + 清除按钮 -->
<DuInput v-model:value="form.search" placeholder="搜索" rightIcon="search" allowClear />

<!-- 密码输入 -->
<DuInput v-model:value="form.password" type="password" placeholder="请输入密码" />

<!-- 多行文本 -->
<DuTextarea v-model:value="form.desc" placeholder="请输入" :maxlength="200" showCount />

<!-- 多行文本，带外边框 -->
<DuTextarea v-model:value="form.desc" placeholder="请输入" bordered :maxlength="-1" />
```

**DuInput props**：
- `v-model:value`
- `type`：`'text'` | `'number'` | `'idcard'` | `'digit'` | `'password'`
- `placeholder`
- `bordered`：boolean，外边框样式（适合独立输入框）
- `withoutBorder`：boolean，隐藏底部分割线
- `disabled`
- `maxlength`
- `inputAlign`：文字对齐
- `allowClear`：boolean，显示清除按钮
- `rightIcon`：右侧图标名
- `prefix`：前缀文本
- `suffix`：后缀文本
- `extClass`

**DuTextarea props**：
- `v-model:value`
- `placeholder`
- `bordered`：boolean
- `showCount`：boolean
- `maxlength`：number（-1 为无限制）

### 选择器

| Figma 节点名含 | 组件 | 用法 |
|---|---|---|
| `Picker` / `DatePicker` / `Select` / `Dropdown` | `<DuSelect>` | 见下方 |

```html
<!-- 基础选择器 -->
<DuSelect
  v-model:value="form.year"
  v-model:open="yearPickerOpen"
  :options="YEAR_OPTIONS"
  title="选择年份"
/>

<!-- 多选 + 可搜索 -->
<DuSelect
  v-model:value="form.tags"
  v-model:open="tagsOpen"
  :options="TAG_OPTIONS"
  title="选择标签"
  mode="multiple"
  filterable
  withConfirm
/>

<!-- 在 DuFormItem 中使用，自动显示表单项样式 -->
<DuSelect
  v-model:value="form.bank"
  v-model:open="bankOpen"
  :options="BANK_OPTIONS"
  title="选择银行"
  formItem
/>
```

**DuSelect props**：
- `v-model:value`
- `v-model:open`
- `options`：`SelectOption[]`（`{ label, value, disabled? }`）
- `title`：placeholder 兼弹出层标题
- `mode`：`'multiple'`，多选
- `filterable`：boolean，可搜索
- `withConfirm`：boolean，带确认按钮
- `formItem`：boolean，在 DuFormItem 中时自动显示表单项样式

### 分割线

| Figma 节点名含 | 组件 | 用法 |
|---|---|---|
| `Divider` / `Line` / `Separator` | `<DuDivider>` | `<DuDivider />` |

```html
<DuDivider />

<!-- 垂直分割线 -->
<DuDivider type="vertical" />

<!-- 带颜色和长度 -->
<DuDivider color="primary" length="80%" />

<!-- 带间距 -->
<DuDivider class="my-16" />
```

**DuDivider props**：
- `color`
- `type`：`'horizontal'` | `'vertical'`
- `length`

### 弹窗

| Figma 节点名含 | 组件 | 用法 |
|---|---|---|
| `Popup` / `Sheet` / `BottomSheet` | `<DuPopup>` | 见下方 |

```html
<!-- 底部弹出，带标题栏和关闭按钮 -->
<DuPopup
  v-model:visible="popupVisible"
  title="选择选项"
  type="bottom"
  headerVisible
  closable
  maskClick
  safeArea
>
  <!-- 内容 -->
</DuPopup>

<!-- 居中弹出，标题居中 -->
<DuPopup
  v-model:visible="centerPopupVisible"
  title="提示"
  type="center"
  titleAlign="center"
  headerVisible
  closable
>
  <!-- 内容 -->
</DuPopup>

<!-- 顶部弹出，不显示内置头部（自定义头部） -->
<DuPopup
  v-model:visible="topPopupVisible"
  type="top"
  :headerVisible="false"
  :maskClick="false"
>
  <!-- 自定义头部 + 内容 -->
</DuPopup>
```

**DuPopup props**：
- `v-model:visible`
- `title`
- `titleAlign`：`'center'` | `'default'`（default 左对齐）
- `headerVisible`：boolean，显示内置头部栏
- `type`：`'center'` | `'top'` | `'bottom'`
- `maskClick`：boolean，点击遮罩关闭
- `closable`：boolean，显示关闭按钮（需同时开启 `headerVisible`）
- `safeArea`：boolean，自带 safe area
- `extClass`

### 标签

```html
<!-- 基础标签 -->
<DuTag color="primary">标签文字</DuTag>

<!-- ghost 样式（描边） -->
<DuTag color="primary" bg="ghost" round>标签</DuTag>

<!-- solid 样式（实色背景） -->
<DuTag color="danger" bg="solid" :bordered="false">错误</DuTag>

<!-- 可关闭标签 -->
<DuTag color="primary" bg="soft" closeable @close="onClose">可关闭</DuTag>

<!-- 自定义颜色 -->
<DuTag :color="{ border: '#FF6B00', text: '#FF6B00', background: '#FFF3E8' }">自定义</DuTag>
```

**DuTag props**：
- `color`：颜色名或 `{ border, text, background }`
- `bg`：`'ghost'` | `'solid'` | `'soft'`
- `size`
- `round`：boolean
- `bordered`：boolean
- `closeable`：boolean
- `icon`

### 开关

```html
<DuSwitch v-model:on="form.enabled" />
<DuSwitch v-model:on="form.notify" color="primary" />
<DuSwitch v-model:on="form.auto" disabled />
```

**DuSwitch props**：
- `v-model:on`
- `color`
- `disabled`

### 上传

```html
<!-- 基础图片上传 -->
<DuUpload
  v-model:value="fileList"
  action="/api/upload"
  :maxCount="9"
  uploadText="上传图片"
/>

<!-- 带徽标的大尺寸上传 -->
<DuUpload
  v-model:value="fileList"
  action="/api/upload"
  size="large"
  badge="封面"
  :mediaType="['image']"
  :beforeUpload="handleBeforeUpload"
/>
```

**DuUpload props**：
- `v-model:value`：`UploadFile[]`
- `action`：上传地址
- `maxCount`：最大数量
- `uploadText`：上传按钮文案
- `size`：`'large'` | `'normal'`
- `badge`：第一张图标签
- `disabled`
- `beforeUpload`：上传前处理函数
- `mediaType`：`('image' | 'video')[]`

### 表单

**展示行 vs 输入框判断规则：**

> **只有单个输入框、或没有 label 的输入框，直接用 `DuInput`，禁止套 `DuForm`。**

连续多个「label + 输入框」行，且 label 宽度视觉一致时，才用 `DuForm` + `DuFormItem` 包裹。

**DuForm props**：
- `model`：表单数据对象（`:model`）
- `labelSize`：label 固定宽度 px 字符串，如 `"80"`
- `labelAlign`：`'left'` | `'right'`
- `layout`：`'horizontal'` | `'vertical'`
- **注意：DuForm 没有 `border` prop**，分割线通过 DuFormItem 的 `showBorder` 控制

**DuFormItem props**：
- `label`：左侧标签文字
- `labelSize`
- `labelAlign`
- `layout`：`'horizontal'` | `'vertical'`
- `showBorder`：boolean，显示底部边框分割线
- `required`：boolean
- `tips`：提示文本
- `justify`：`'end'` | `'start'`，内容水平对齐
- `items`：`'center'` | `'start'`，内容垂直对齐（horizontal 模式）
- `extClass`

```html
<!-- 标准表单：showBorder 控制分割线，horizontal 布局 -->
<DuForm :model="form" labelSize="80" labelAlign="right" layout="horizontal">
  <DuFormItem label="银行卡号" showBorder>
    <DuInput v-model:value="form.bankCard" placeholder="请输入" />
  </DuFormItem>
  <DuFormItem label="开户银行" showBorder>
    <DuSelect
      v-model:value="form.bank"
      v-model:open="bankOpen"
      :options="BANK_OPTIONS"
      title="请选择银行"
      formItem
    />
  </DuFormItem>
  <DuFormItem label="手机号">
    <DuInput v-model:value="form.phone" placeholder="请输入手机号" type="number" />
  </DuFormItem>
</DuForm>

<!-- 垂直布局表单 -->
<DuForm :model="form" layout="vertical">
  <DuFormItem label="备注" layout="vertical" required tips="最多200字">
    <DuTextarea v-model:value="form.remark" placeholder="请输入" :maxlength="200" showCount />
  </DuFormItem>
</DuForm>
```

---

## UnoCSS 配置

<!--
⚠ 根据实际项目配置修改此部分
dangoui 使用 unocss-preset-echo，间距单位需确认
-->

**间距单位**：1unit = 1px（请根据 uno.config.ts 确认）

换算示例（1unit = 1px 时）：
- 骨架 `gap-2`（标准 8px）→ 项目写 `gap-8`
- 骨架 `px-3.75`（15px）→ 项目写 `px-15`
- 骨架 `py-4`（16px）→ 项目写 `py-16`

---

## 设计 Token

<!--
⚠ 以下为参考值，根据实际项目的 uno.config.ts / theme.css 填写
-->

### 文字样式

| 骨架输出 | 项目 class |
|---|---|
| `text-[18px] font-medium` | `text-h3 fw-500` |
| `text-base font-medium` / `text-[16px] font-medium` | `text-h4 fw-500` |
| `text-base font-normal` / `text-[16px]` | `text-b4` |
| `text-sm font-normal` / `text-[14px]` | `text-b5` |
| `text-[12px]` | `text-b6` |

### 颜色 Token

| 骨架输出 | 项目 class |
|---|---|
| `text-[rgba(0,0,0,0.64)]` | `c-text-2` |
| `text-[rgba(0,0,0,0.4)]` / `text-[#999]` | `c-text-3` |
| `bg-[#F7F7F9]` / `bg-[#f5f5f5]` | `bg-page` |
| `text-black` / `text-[#000]` | `c-text-1` |

---

## 页面结构模板

```html
<template>
  <div class="flex flex-col min-h-screen bg-page">

    <!-- 内容卡片 -->
    <div class="bg-white px-15 py-16 mt-8">
      <div class="text-h4 fw-500 mb-16">标题</div>
      <!-- 内容 -->
    </div>

    <!-- 弹性占位 -->
    <div class="flex-1" />

    <!-- 底部按钮（若有） -->
    <div class="px-15 py-12 safe-area-bottom bg-white b-t-1 b-t-solid b-hex-E5E5E5">
      <DuButton color="primary" size="large" full @click="handleSubmit">
        提交
      </DuButton>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// TODO: 按需补充
</script>
```

---

## 生成规则

1. **宽度不写死**：容器统一用 `w-full`，只有图标、头像等固定尺寸元素保留 `w-[Npx]`
2. **颜色用 token**：优先用上方 token 表；找不到对应 token 时，用 UnoCSS hex 短语法替代（`text-[#f96464]` → `c-hex-f96464`，`bg-[#f96464]` → `bg-hex-f96464`，`border-[#f96464]` → `b-hex-f96464`），不要保留 `text-[#xxxxxx]` 写法
3. **动态内容**：静态文字改为 `{{ variable }}`，在 script 中声明对应 `ref`
4. **交互占位**：所有 `@click`、`@change` 加 `// TODO: 实现` 注释的方法
5. **图标名称**：从骨架 INSTANCE 名中提取，转为 kebab-case（`IconArrowRight` → `arrow-right`）
6. **extClass**：需要额外样式时用 `extClass` prop 而不是直接加 class
7. **单输入框禁止套 DuForm**：只有单个输入框或无 label 的输入框直接用 `DuInput`，不要包裹 `DuForm`
8. **DuForm 无 border prop**：行间分割线通过 `DuFormItem` 的 `showBorder` 控制，不要在 `DuForm` 上加 `border`
