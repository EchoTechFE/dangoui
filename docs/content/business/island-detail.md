---
title: 社区首页
---

# 社区首页

社区首页是千岛 App 的主入口，集成类目入口、商品滑动、快捷入口和内容 Feed 流。

## 示例

::demo
---
title: 示例
path: content:business:island-detail
idx: 1
---

#snippet
```vue
// docs/pages/demos/business/island-detail/snippet1.vue
<script setup lang="ts">
import { ref } from 'vue'
import {
  DuNavigationBar,
  DuSearch,
  DuButton,
  DuIcon,
  DuTabs,
  DuTab,
  DuTag,
} from 'dangoui'
import StatusBar from '~/components/content/StatusBar.vue'
import PhoneMockup from '~/components/content/PhoneMockup.vue'
import HomeIndicator from '~/components/content/HomeIndicator.vue'
import IslandsGrid from '~/business/IslandsGrid.vue'
import IslandsGridBasic from '~/business/IslandsGridBasic.vue'
import IslandsSlide from '~/business/IslandsSlide.vue'
import IslandsSlideBasic from '~/business/IslandsSlideBasic.vue'
import IslandsQuickEntryTitle from '~/business/IslandsQuickEntryTitle.vue'
import IslandsFeed from '~/business/IslandsFeed.vue'
import IslandsFeedAd from '~/business/IslandsFeedAd.vue'
import FeedPost from '~/business/FeedPost.vue'
import IslandsPin from '~/business/IslandsPin.vue'

const gridItems = ref([
  { id: 'tujian', name: '图鉴' },
  { id: 'juesen', name: '角色' },
  { id: 'chaowan', name: '潮玩系列' },
  { id: 'chaowan2', name: '潮玩' },
])

const slideItems = ref([
  { id: '1', name: '最新款式', tag: '+36' },
  { id: '2', name: 'Spu Name', tag: 'NEW' },
  { id: '3', name: 'Spu Name', tag: '' },
  { id: '4', name: 'Spu Name', tag: '' },
])

const quickEntryItems = ref([
  { id: '1', title: 'Mega宇航员', price: '59', unit: '.99', tag: '领券' },
  { id: '2', title: 'Mega宇航员', price: '59', unit: '', tag: '' },
  { id: '3', title: '剩余22时', price: '59', unit: '.99', tag: '' },
  { id: '4', title: '共999款', price: '59', unit: '.99', tag: '' },
])

const feedTabs = ref(['推荐', '最新', '未选'])
const activeTab = ref(0)

const ads = ref([
  { id: 'ad1' },
])

const feedPosts = ref([
  { id: '1', content: '留作纪念！', username: 'JocelynTong✨', likeCount: 784 },
  { id: '2', content: '留作纪念！', username: 'JocelynTong✨', likeCount: 784 },
  { id: '3', content: '留作纪念！', username: 'JocelynTong✨', likeCount: 784 },
  { id: '4', content: '留作纪念！', username: 'JocelynTong✨', likeCount: 784 },
])

const pinTabs = ref([
  { id: 'home', name: '首页', icon: 'home' },
  { id: 'labubu', name: 'Labubu', icon: 'labubu', badge: 6 },
  { id: 'juben', name: '剧本杀', icon: 'juben', badge: 41 },
  { id: 'panshen', name: '潘神', icon: 'panshen', badge: '999+' },
  { id: 'biqi', name: '毕奇', icon: 'biqi', badge: 6 },
  { id: 'island', name: '我加入的岛', icon: 'island' },
])
</script>

<template>
  <PhoneMockup :has-dynamic-island="false">
    <!-- Header Area: Dark purple background -->
    <div class="bg-gray-900">
      <!-- Status Bar -->
      <div class="px-8 pt-3 pb-2">
        <StatusBar time="9:41" color="white" type="iPhoneX" />
      </div>

      <!-- Navigation Bar with DuNavigationBar -->
      <DuNavigationBar :back="false" color="transparent" :share="false">
        <template #left>
          <div class="w-8 h-8 bg-white/20 rounded flex items-center justify-center">
            <DuIcon name="logo" :size="16" color="white" />
          </div>
        </template>
        <div class="flex-auto w-0">
          <DuSearch
            bg="white/20"
            :placeholder="['Labubu泰坦']"
            :readonly="true"
          >
            <template #right>
              <DuIcon name="camera" :size="16" color="white" />
              <span class="text-white text-[12px] ml-1">识物</span>
            </template>
          </DuSearch>
        </div>
        <template #right>
          <DuButton type="text" size="small" color="white">
            发现岛
          </DuButton>
        </template>
      </DuNavigationBar>
    </div>

    <!-- Main Content Area: White background with rounded top -->
    <div class="bg-white rounded-t-[12px] px-3 pt-3 pb-0 flex flex-col gap-2">
      <!-- Category Grid -->
      <IslandsGrid>
        <IslandsGridBasic
          v-for="item in gridItems"
          :key="item.id"
          :name="item.name"
          iconType="emoji"
        />
      </IslandsGrid>

      <!-- Product Slide -->
      <IslandsSlide>
        <IslandsSlideBasic
          v-for="item in slideItems"
          :key="item.id"
          :name="item.name"
          :tag="item.tag"
        />
      </IslandsSlide>

      <!-- Quick Entry Grid -->
      <div class="grid grid-cols-4 gap-2">
        <div
          v-for="item in quickEntryItems"
          :key="item.id"
          class="bg-gray-100 rounded-[8px] p-2 h-[62px] flex flex-col justify-between relative"
        >
          <IslandsQuickEntryTitle :title="item.title" />
          <div>
            <div class="text-[10px] text-[rgba(0,0,0,0.4)]">{{ item.title }}</div>
            <div class="text-[12px] font-medium text-red-600">¥{{ item.price }}{{ item.unit }}</div>
          </div>
          <DuTag v-if="item.tag" color="danger" size="small" round class="absolute bottom-1 right-1">
            {{ item.tag }}
          </DuTag>
        </div>
      </div>

      <!-- Feed Section with DuTabs -->
      <div class="px-2 pt-2 pb-4 bg-gray-100">
        <DuTabs v-model:value="activeTab" size="large" type="segment">
          <DuTab v-for="(tab, index) in feedTabs" :key="index" :name="index">
            {{ tab }}
          </DuTab>
        </DuTabs>

        <IslandsFeed class="mt-3">
          <IslandsFeedAd v-for="ad in ads" :key="ad.id" />
          <FeedPost
            v-for="post in feedPosts"
            :key="post.id"
            :content="post.content"
            :username="post.username"
            :likeCount="post.likeCount"
          />
        </IslandsFeed>
      </div>
    </div>

    <!-- IslandsPin -->
    <IslandsPin :tabs="pinTabs" />

    <!-- Home Indicator -->
    <div class="absolute bottom-2 left-0 right-0 flex justify-center">
      <HomeIndicator theme="dark" />
    </div>
  </PhoneMockup>
</template>
```
::

## Mockup 规范

iPhone X/11 Pro/12 mini/13 mini 模拟器规范：

| 元素 | 尺寸 | 说明 |
|------|------|------|
| Frame | 396×838px | 圆角 56px |
| Screen | 375×812px | 圆角 46px |
| Status Bar | 高度 54px | 含时间、信号、WiFi、电量图标 |
| Home Indicator | 134×5px | 底部居中，渐变背景 |

渲染内容应放在 Screen 内，使用 `overflow-hidden` 裁剪超出部分。

## 组件说明

### 公共组件

| 组件 | 文件路径 | 说明 |
|------|---------|------|
| `StatusBar` | `components/content/StatusBar.vue` | 状态栏 |
| `HomeIndicator` | `components/content/HomeIndicator.vue` | 主页指示器 |

### 业务组件

| 组件 | 文件路径 | 说明 |
|------|---------|------|
| `IslandsGrid` | `business/IslandsGrid.vue` | 类目入口网格容器 |
| `IslandsGridBasic` | `business/IslandsGridBasic.vue` | 类目入口单项 |
| `IslandsSlide` | `business/IslandsSlide.vue` | 横向滑动商品容器 |
| `IslandsSlideBasic` | `business/IslandsSlideBasic.vue` | 横向滑动商品单项 |
| `IslandsQuickEntry` | `business/IslandsQuickEntry.vue` | 快捷入口网格容器 |
| `IslandsQuickEntryTitle` | `business/IslandsQuickEntryTitle.vue` | 快捷入口标题/图标 |
| `IslandsFeed` | `business/IslandsFeed.vue` | 内容 Feed 流容器 |
| `FeedPost` | `business/FeedPost.vue` | Feed 帖子卡片 |
| `IslandsPin` | `business/IslandsPin.vue` | 底部 TabBar 容器 |
| `IslandsPinBasic` | `business/IslandsPinBasic.vue` | TabBar 单项 |
| `IslandsHeader` | `business/IslandsHeader.vue` | 顶部导航栏（含状态栏+导航+搜索） |
