
<template>
  <PreviewBlock title="bar full + autoplay">
    <DuSwiper class="w-173px h-231px rd-8px" indicator-type="bar-full" autoplay>
      <DuSwiperItem>
        <div class="w-full h-full bg-red flex items-center justify-center">1</div>
      </DuSwiperItem>
      <DuSwiperItem>
        <div class="w-full h-full bg-blue flex items-center justify-center">2</div>
      </DuSwiperItem>
      <DuSwiperItem>
        <div class="w-full h-full bg-green flex items-center justify-center">3</div>
      </DuSwiperItem>
    </DuSwiper>
  </PreviewBlock>

  <PreviewBlock title="bar">
    <DuSwiper class="w-300px h-70px rd-8px" indicator-type="bar">
      <DuSwiperItem>
        <div class="w-full h-full bg-red flex items-center justify-center">1</div>
      </DuSwiperItem>
      <DuSwiperItem>
        <div class="w-full h-full bg-blue flex items-center justify-center">2</div>
      </DuSwiperItem>
      <DuSwiperItem>
        <div class="w-full h-full bg-green flex items-center justify-center">3</div>
      </DuSwiperItem>
    </DuSwiper>
  </PreviewBlock>

  <PreviewBlock title="number">
    <DuSwiper class="w-173px h-231px rd-8px" indicator-type="number">
      <DuSwiperItem>
        <div class="w-full h-full bg-red flex items-center justify-center">1</div>
      </DuSwiperItem>
      <DuSwiperItem>
        <div class="w-full h-full bg-blue flex items-center justify-center">2</div>
      </DuSwiperItem>
      <DuSwiperItem>
        <div class="w-full h-full bg-green flex items-center justify-center">3</div>
      </DuSwiperItem>
    </DuSwiper>
  </PreviewBlock>
</template>

<script setup lang="ts">
import { DuSwiper, DuSwiperItem } from '@echotechfe/dumpling'
</script>
