
<template>
  <DuNavigationBar fixed color="white" @share="handleShare" transparent-front-color="white" transparent>
    始终透明
    <template #right>
      <DuActionButton name="refresh" />
    </template>
  </DuNavigationBar>
  <div class="w-full h-200px bg-black bg-op-80 flex justify-center items-center text-48px c-white">
    1
  </div>
  <div class="w-full h-200px bg-orange flex justify-center items-center text-48px c-white">
    2
  </div>
  <div class="w-full h-200px bg-yellow flex justify-center items-center text-48px c-white">
    3
  </div>
  <div class="w-full h-200px bg-green flex justify-center items-center text-48px c-white">
    4
  </div>
  <div class="w-full h-200px bg-blue flex justify-center items-center text-48px c-white">
    5
  </div>
</template>

<script setup lang="ts">
import { DuNavigationBar, DuButton, DuSearch, DuIcon, DuDivider, DuImage, DuActionButton } from '@echofe/dumpling'

const placeholders = [
  'Molly',
  'Labubu',
  'Skullpanda'
]

function handleShare() {
  console.log('[demo] share')
}
</script>
