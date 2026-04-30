<template>
  <div class="min-h-screen bg-[#2b263b] flex justify-center">
    <!-- 手机模拟器框架 -->
    <div class="w-[375px] flex-shrink-0">
      <IslandDetail />
    </div>
  </div>
</template>

<script setup lang="ts">
import IslandDetail from '../business/IslandDetail.vue'

definePageMeta({
  layout: 'demo',
})
</script>
