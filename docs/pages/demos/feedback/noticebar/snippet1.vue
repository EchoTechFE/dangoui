
<template>
  <PreviewBlock title="简单">
    <div class="flex-auto">
      <DuNoticeBar text="购买后会暂存商家寄存柜" />
    </div>
  </PreviewBlock>
  <PreviewBlock title="带链接">
    <div class="flex-auto">
      <DuNoticeBar
        text="购买后会暂存商家寄存柜"
        link-text="如何发货"
        link-icon="question-circle-filled"
        @link-click="handleLinkClick"
      />
    </div>
  </PreviewBlock>
  <PreviewBlock title="只带链接">
    <div class="flex-auto">
      <DuNoticeBar
        link-text="打开通知权限，及时获取下单通知"
        link-icon="remind"
        @link-click="handleLinkClick"
      />
    </div>
  </PreviewBlock>
  <PreviewBlock title="可关闭">
    <div class="flex-auto">
      <DuNoticeBar
        text="购买后暂存商家寄存柜，可累计发货省运费"
        link-text="如何发货"
        link-icon="question-circle-filled"
        closeable
        @close="handleClose"
        @link-click="handleLinkClick"
      />
    </div>
  </PreviewBlock>
  <PreviewBlock title="垂直">
    <div class="flex-auto">
      <DuNoticeBar
        text="该商品属于个人卖家，请警惕诈骗风险；平台禁止一切虚拟商品，一经发现平台有权下架追责，欢迎玩家监督举报"
        link-text="如何发货"
        link-icon="question-circle-filled"
        layout="vertical"
        closeable
        @close="handleClose"
        @link-click="handleLinkClick"
      />
    </div>
  </PreviewBlock>
</template>

<script setup lang="ts">
import { DuNoticeBar } from '@echofe/dumpling'

function handleClose() {
  console.log('[demo] close')
}

function handleLinkClick() {
  console.log('[demo] link click')
}
</script>
