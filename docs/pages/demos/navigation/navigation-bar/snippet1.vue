
<template>
  <div class="min-h-screen bg-white">
    <div class="mb-16px">
      <DuNavigationBar share>
        标题
        <template #right>
          <DuButton size="small" type="info" >按钮</DuButton>
        </template>
      </DuNavigationBar>
    </div>
    <div class="mb-8px">
      <DuNavigationBar share>
        标题
        <template #right>
          <div class="flex-auto">
            <DuSearch bg="white" placeholder="Labubu">
              <template #right>
                <DuIcon name="camera" />
                <DuDivider />
                <DuIcon name="scanning" />
              </template>
            </DuSearch>
          </div>
        </template>
      </DuNavigationBar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DuNavigationBar, DuButton, DuSearch, DuIcon, DuDivider } from '@frontend/dumpling'
</script>
