
<template>
  <DuNavigationBar share fixed :appear-threshold="100" always-show-content color="white" @share="handleShare">
    <div class="flex items-center text-12px font-medium gap-x-4px">
      <div class="w-16px h-16px rd-full overflow-hidden">
        <DuImage src="https://cdn.qiandaoapp.com/interior/images/ce1765477a674788b0f6286d0aba6d9f.jpg" />
      </div>
      <span>千岛观影团</span>
      <DuIcon name="arrow-heavy-right" :size="8" />
    </div>
  </DuNavigationBar>
  <div class="w-full h-200px bg-red-200 flex justify-center items-center text-48px">
    1
  </div>
  <div class="w-full h-200px bg-orange-200 flex justify-center items-center text-48px">
    2
  </div>
  <div class="w-full h-200px bg-yellow-200 flex justify-center items-center text-48px">
    3
  </div>
  <div class="w-full h-200px bg-green-200 flex justify-center items-center text-48px">
    4
  </div>
  <div class="w-full h-200px bg-blue-200 flex justify-center items-center text-48px">
    5
  </div>
</template>

<script setup lang="ts">
import { DuNavigationBar, DuButton, DuSearch, DuIcon, DuDivider, DuImage } from 'dangoui'

const placeholders = [
  'Molly',
  'Labubu',
  'Skullpanda'
]

function handleShare() {
  console.log('[demo] share')
}
</script>
