<template>
  <div class="flex justify-between items-center" :class="color === 'white' ? 'text-white' : 'text-black'">
    <!-- Left: Time -->
    <div class="text-[15px] font-semibold tracking-[-0.3px]">
      {{ displayTime }}
    </div>

    <!-- Right: Signal + WiFi + Battery -->
    <div class="flex items-center gap-1">
      <!-- Signal Bars (all models) -->
      <div class="flex items-end gap-[2px]" :class="type === 'iPhone14pro' ? 'h-[11px]' : 'h-[17px]'">
        <div class="w-[3px] h-[4px] rounded-[1px] bg-current opacity-40" />
        <div class="w-[3px] h-[6px] rounded-[1px] bg-current opacity-60" />
        <div class="w-[3px] h-[8px] rounded-[1px] bg-current opacity-100" />
        <div class="w-[3px] h-[11px] rounded-[1px] bg-current opacity-100" />
      </div>

      <!-- WiFi (only for 14pro) -->
      <svg v-if="type === 'iPhone14pro'" width="15" height="11" viewBox="0 0 15 11" fill="currentColor">
        <path d="M7.5 10L11.5 6H3.5L7.5 10Z" fill-opacity="0.4" />
        <circle cx="7.5" cy="10.5" r="1" />
      </svg>

      <!-- Carrier (only for non-14pro models) -->
      <span v-if="type !== 'iPhone14pro'" class="text-[12px] font-medium leading-[18px]">{{ carrier }}</span>

      <!-- Battery (only for non-14pro models) -->
      <template v-if="type !== 'iPhone14pro'">
        <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor">
          <path d="M8.5 10L13 5.5H4L8.5 10Z" fill-opacity="0.4" />
          <circle cx="8.5" cy="10.5" r="1" />
        </svg>
        <div class="flex items-center gap-[2px]">
          <div class="relative w-[22px] h-[10px] rounded-[2px] border" :class="color === 'white' ? 'border-white/35' : 'border-black/35'">
            <div class="absolute inset-[1px] rounded-[1px] bg-current" :style="{ width: `${batteryLevel * 0.18}px` }"></div>
          </div>
          <div class="w-[2px] h-[4px] rounded-[1px] bg-current"></div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  time?: string
  carrier?: string
  batteryLevel?: number
  color?: 'default' | 'white'
  type?: 'iPhone5s' | 'iPhoneX' | 'iPhone14pro'
}>(), {
  time: '9:41',
  carrier: '中国移动',
  batteryLevel: 100,
  color: 'default',
  type: 'iPhone14pro',
})

const displayTime = computed(() => props.time)
</script>
