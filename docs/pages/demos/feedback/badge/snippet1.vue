<template>
  <PreviewBlock title="简单">
    <DuBadge :value="10" dot>
      <div class="w-50px h-50px bg-gray-200 rounded-4px" />
    </DuBadge>
    <DuBadge :value="10">
      <div class="w-50px h-50px bg-gray-200 rounded-4px" />
    </DuBadge>
  </PreviewBlock>
  <PreviewBlock title="文字">
    <div class="flex flex-col gap-y-16px">
      <DuBadge value="热门">
        <div class="w-50px h-50px bg-gray-200 rounded-4px" />
      </DuBadge>
      <DuBadge value="拼团9.9">
        <div class="w-50px h-50px bg-gray-200 rounded-4px" />
      </DuBadge>
    </div>
  </PreviewBlock>
  <PreviewBlock title="总是显示">
    <DuBadge dot always-show>
      <div class="w-50px h-50px bg-gray-200 rounded-4px" />
    </DuBadge>
    <DuBadge :value="0" always-show>
      <div class="w-50px h-50px bg-gray-200 rounded-4px" />
    </DuBadge>
  </PreviewBlock>
  <PreviewBlock title="不同颜色（色板）">
    <DuBadge dot always-show color="primary">
      <div class="w-50px h-50px bg-gray-200 rounded-4px" />
    </DuBadge>
    <DuBadge dot always-show color="secondary">
      <div class="w-50px h-50px bg-gray-200 rounded-4px" />
    </DuBadge>
    <DuBadge dot always-show color="success">
      <div class="w-50px h-50px bg-gray-200 rounded-4px" />
    </DuBadge>
    <DuBadge dot always-show color="warning">
      <div class="w-50px h-50px bg-gray-200 rounded-4px" />
    </DuBadge>
    <DuBadge dot always-show color="error">
      <div class="w-50px h-50px bg-gray-200 rounded-4px" />
    </DuBadge>
  </PreviewBlock>
  <PreviewBlock title="直接指定 hex 颜色">
    <DuBadge dot always-show color="#ed64a5">
      <div class="w-50px h-50px bg-gray-200 rounded-4px" />
    </DuBadge>
  </PreviewBlock>
</template>

<script setup lang="ts">
import { DuBadge } from 'dangoui'
</script>
