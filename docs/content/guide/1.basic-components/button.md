---
title: 按钮
description: 用于触发操作
---

# 按钮 Button

按钮用于触发操作。千岛小程序提供多种按钮类型。

## 类型

### 主要按钮
用于主要操作，每个区域最多使用一次。

<PhoneMockup>
  <div class="p-16px bg-white min-h-full">
    <div class="flex gap-12px items-center">
      <button class="du-button du-button--primary">主要按钮</button>
    </div>
  </div>
</PhoneMockup>

### 次要按钮
用于次要操作，可多个共存。

<PhoneMockup>
  <div class="p-16px bg-white min-h-full">
    <div class="flex gap-12px items-center">
      <button class="du-button">次要按钮</button>
      <button class="du-button">次要按钮</button>
    </div>
  </div>
</PhoneMockup>

### 文字按钮
用于低强调操作，如「取消」「跳过」。

<PhoneMockup>
  <div class="p-16px bg-white min-h-full">
    <div class="flex gap-12px items-center">
      <button class="du-button du-button--text">文字按钮</button>
    </div>
  </div>
</PhoneMockup>

## 尺寸

- 大按钮：高度 48px，用于主要操作
- 中按钮：高度 40px，用于一般操作
- 小按钮：高度 32px，用于工具栏或紧凑布局

## 使用原则

1. **层次分明**：每个页面只用一个主要按钮
2. **对齐方式**：左对齐或右对齐，不要居中
3. **状态反馈**：加载中时显示 loading 态，禁止点击时显示 disabled 态