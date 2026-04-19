# figma

根据 Figma 链接生成项目可用的 Vue 组件。

## 重要：立即执行以下步骤，不要做任何预检查

**不要查找 token、不要检查环境变量、不要询问用户凭证。** Token 由 CLI 内部处理。

---

## 步骤

**第一步：立即运行命令生成骨架**

将 `$URL` 替换为用户提供的 Figma 链接，直接执行：

```bash
npx figma-to-code $URL --framework=vue --style=unocss
```

如果报错再告知用户，否则继续下一步。

**第二步：读取项目规范**

读取 `.claude/figma-context.md`。若文件不存在，告知用户运行 `figma-to-code init`。

**第三步：翻译骨架为业务组件**

对照 `figma-context.md` 中的规范：

- INSTANCE 标签 → 映射为项目真实组件
- 原始颜色/尺寸 → 替换为项目 token
- 容器宽度 → 改为 `w-full`
- 静态文字 → 改为 `{{ variable }}`，交互元素加 `@click` / `v-model` 占位
- `<script setup>` 中补充对应变量、方法，以及按 `figma-context.md` 的「组件引入」规则添加 import

**布局语义修正**（骨架可能未能完整提取，翻译时按视觉结构判断）：

- 一行内有 2 个子元素，左边是 label 文字、右边是 value / 占位文字 / icon → 使用 `justify-between`
- 子元素需要撑满父容器宽度 → 使用 `w-full` 或 `flex-1`

**展示行 vs 输入框的区分**（核心判断依据是右侧内容类型）：

| 视觉特征 | 右侧内容 | 应生成 |
|---|---|---|
| label + 右侧「请输入xxx」/ 「请选择」灰色 placeholder | 可编辑输入 | `DuFormItem` + `DuInput` / `DuSelect` |
| label + 右侧实际数据值（如「李笑笑」「2025年」）+ 可选箭头 | 只读展示/可点击跳转 | `justify-between` 展示行，整行 `@click` |
| 标题 + 右侧「查看全部 >」 | 操作入口 | `justify-between`，右侧 `@click` |
| 独立不带 label 的输入区域 | 可编辑输入 | 直接 `DuInput` 不套 Form |

**重要**：「请输入」「请选择」是 placeholder 文字，代表这是输入字段，必须用 `DuInput` / `DuSelect`，不能生成为普通 `span`。

**Form 结构识别**：

满足以下条件时，用项目的 Form 组件包裹（具体组件和 props 参考 `figma-context.md`）：
- 连续多个 `label + 输入框` 行，且 label 宽度视觉上一致
- 或节点名中包含 `FormItem` / `Form` 关键词

`DuForm` 自带行间分割线和布局，内部不需要再手动加 `DuDivider`。不满足时（只有 1-2 个零散输入框）直接用 `DuInput`，不强制套 Form。

**第四步：输出主组件**

- 指定了目标路径 → 写入文件
- 未指定 → 输出到对话，由用户确认后保存

**第五步：处理未识别的子组件（递归生成）**

翻译完成后，检查骨架中所有带 `<!-- figma-node: xxx -->` 注释的标签：

1. **对每个未识别的 INSTANCE**（未命中 `figma-context.md` 业务组件映射表的），询问用户：

   > 发现未识别的子组件 `<ComponentName>`（figma-node: xxx），是否需要生成对应文件？如需要，请告知保存路径（如 `src/components/ComponentName.vue`）。

2. **用户确认路径后**：
   - 用该组件的 `figma-node` id 重新执行 CLI：
     ```bash
     npx figma-to-code <原始fileKey对应的url>&node-id=<componentId> --framework=vue --style=unocss
     ```
   - 对新骨架重复第三步的翻译流程
   - 将结果写入用户指定路径
   - 在 `figma-context.md` 的「业务组件映射」表中补充该条记录：
     ```
     | ComponentName | `ComponentName` | src/components/ComponentName.vue | 已生成 |
     ```
   - 回到主组件，将对应标签替换为真实组件，并在 `<script setup>` 中补充 import

3. **用户跳过** → 保留占位标签，不处理

4. 所有子组件处理完毕后，**输出最终完整的主组件代码**（含所有 import）。
