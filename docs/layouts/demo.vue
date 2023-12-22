<template>
  <div v-if="isHydrated" class="du-theme-qd">
    <slot />
  </div>
  <div
    v-else
    class="h-screen flex items-center justify-center text-16px text-gray-600"
  >
    加载中...
  </div>
</template>

<script setup lang="ts"></script>
