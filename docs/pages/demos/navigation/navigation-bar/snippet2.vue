
<template>
  <DuNavigationBar share fixed placeholder @share="handleShare">
    标题
    <template #right>
      <div class="flex-auto">
        <DuSearch bg="white" :placeholder="placeholders" readonly>
          <template #right>
            <DuIcon name="camera" />
            <DuDivider />
            <DuIcon name="scanning" />
          </template>
        </DuSearch>
      </div>
    </template>
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
import { DuNavigationBar, DuButton, DuSearch, DuIcon, DuDivider } from '@frontend/dumpling'

const placeholders = [
  'Molly',
  'Labubu',
  'Skullpanda'
]

function handleShare() {
  console.log('[demo] share')
}
</script>
