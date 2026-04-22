<script setup lang="ts">
// IslandsQuickEntry - 快捷入口网格容器组件
// 支持多种类型：图标+价格、倒计时、标签、纯文字等
</script>

<template>
  <!-- figma-node: 14205:618296 -->
  <div class="flex flex-col gap-8 items-center">
    <!-- 第一行：3个快捷入口 -->
    <div class="flex gap-8 flex-wrap">
      <slot name="row1" />
    </div>

    <!-- 第二行及以后：更多快捷入口 -->
    <div class="flex gap-8 flex-wrap">
      <slot />
    </div>
  </div>
</template>
