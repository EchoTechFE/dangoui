
<template>
  <div class="min-h-screen bg-white">
    <div class="mb-16px">
      <DuNavigationBar share @share="handleShare">
        标题
        <template #right>
          <DuButton size="small" type="info">按钮</DuButton>
        </template>
      </DuNavigationBar>
    </div>
    <div class="mb-16px">
      <DuNavigationBar share @share="handleShare">
        <div>标题</div>
          <div class="flex-auto w-0">
            <DuSearch bg="white" :placeholder="placeholders" readonly>
              <template #right>
                <DuIcon name="camera" />
                <DuDivider />
                <DuIcon name="scanning" />
              </template>
            </DuSearch>
          </div>
      </DuNavigationBar>
    </div>
    <div class="mb-16px">
      <DuNavigationBar share color="secondary" :back="false" @share="handleShare">
          <div>标题</div>
          <div class="flex-auto w-0">
          <DuSearch bg="white" placeholder="Labubu">
            <template #right>
              <DuIcon name="camera" />
              <DuDivider />
              <DuIcon name="scanning" />
            </template>
          </DuSearch>
          </div>
      </DuNavigationBar>
    </div>
    <div class="mb-16px">
      <DuNavigationBar share color="primary" :back="false" @share="handleShare">
          <div>标题</div>
          <div class="flex-auto w-0">
          <DuSearch bg="white" placeholder="Labubu">
            <template #right>
              <DuIcon name="camera" />
              <DuDivider />
              <DuIcon name="scanning" />
            </template>
          </DuSearch>
          </div>
      </DuNavigationBar>
    </div>
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
