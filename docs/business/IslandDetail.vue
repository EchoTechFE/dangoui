<script setup lang="ts">
// island-detail - 岛详情页面
// figma-node: 14202:599741
import { ref } from 'vue'
import { DuTag, DuButton, DuIcon, DuAvatar, DuDivider, DuBadge } from 'dangoui'

// 引入子组件
import IslandsPin from './IslandsPin.vue'
import IslandsPinBasic from './IslandsPinBasic.vue'
import IslandsHeader from './IslandsHeader.vue'
import StatusBar from './StatusBar.vue'
import NavigationBar from './NavigationBar.vue'
import IconIslands from './IconIslands.vue'
import SearchBar from './SearchBar.vue'
import ButtonIcon from './ButtonIcon.vue'
import IslandsGrid from './IslandsGrid.vue'
import IslandsGridBasic from './IslandsGridBasic.vue'
import IslandsSlide from './IslandsSlide.vue'
import IslandsSlideBasic from './IslandsSlideBasic.vue'
import IslandsQuickEntry from './IslandsQuickEntry.vue'
import IslandsQuickEntryTitle from './IslandsQuickEntryTitle.vue'
import IslandsQuickEntryInfo from './IslandsQuickEntryInfo.vue'
import IslandsFeed from './IslandsFeed.vue'
import TabsBasic from './TabsBasic.vue'
import IslandsFeedAd from './IslandsFeedAd.vue'
import FeedPost from './FeedPost.vue'
import UserIsland from './UserIsland.vue'
import SPUBasic from './SPUBasic.vue'
import SPU from './SPU.vue'
import PhoneMockup from '~/components/content/PhoneMockup.vue'
import HomeIndicator from '~/components/content/HomeIndicator.vue'

// 顶部类目数据
const gridItems = ref([
  { id: 'tujian', name: '图鉴', iconType: 'emoji' as const },
  { id: 'juesen', name: '角色', iconType: 'image' as const },
  { id: 'chaowan', name: '潮玩系列', iconType: 'spu' as const },
  { id: 'chaowan2', name: '潮玩', iconType: 'spu' as const },
])

// 横向滑动商品数据
const slideItems = ref([
  { id: '1', name: '最新款式', type: 'slide', images: ['', '', ''], tag: '+36', tagColor: 'danger', wantCount: '' },
  { id: '2', name: 'Spu Name', type: 'spu', image: '', tag: 'NEW', tagColor: 'primary', wantCount: '{n}' },
  { id: '3', name: 'Spu Name', type: 'spu', image: '', wantCount: '{n}' },
  { id: '4', name: 'Spu Name', type: 'spu', image: '', wantCount: '{n}' },
  { id: '5', name: 'Spu Name', type: 'spu', image: '', wantCount: '{n}' },
  { id: '6', name: 'Spu Name', type: 'spu', image: '', wantCount: '{n}' },
  { id: '7', name: 'Spu Name', type: 'spu', image: '', wantCount: '{n}' },
])

// 快捷入口数据
const quickEntryItems = ref([
  { id: '1', title: 'Mega宇航员', price: '59', priceUnit: '.99', tag: '领券', image: '' },
  { id: '2', title: 'Mega宇航员', price: '59', tag: '0.8%', image: '' },
  { id: '3', title: '剩22时30分', price: '59', priceUnit: '.99', image: '' },
  { id: '4', title: '剩22/99款', price: '59', priceUnit: '.99', image: '' },
  { id: '5', title: '共999款', price: '59', priceUnit: '.99', image: '' },
  { id: '6', title: '缺2人 2.4', price: '', image: '' },
  { id: '7', title: 'Mega宇航员', price: '59', priceUnit: '.99', tag: '领券', image: '' },
  { id: '8', title: 'Mega宇航员', price: '59', priceUnit: '.99', image: '' },
])

// Feed 流数据
const feedTabs = ref(['推荐', '最新', '未选', '未选', '未选'])
const activeTab = ref(0)
const feedPosts = ref([
  { id: '1', content: '留作纪念！', username: 'JocelynTong✨', avatar: '', likeCount: 784, image: '', isVideo: true, tag: '' },
  { id: '2', content: '留作纪念！', username: 'JocelynTong✨', avatar: '', likeCount: 784, image: '', isVideo: true, tag: '首发' },
  { id: '3', content: '留作纪念！', username: 'JocelynTong✨', avatar: '', likeCount: 8493, image: '', isVideo: false, tag: '', isVote: true },
])

// TabBar 数据
const tabBars = ref([
  { id: 'home', name: '首页', icon: 'home' },
  { id: 'discovery', name: '发现' },
  { id: 'publish', name: '发布' },
  { id: 'message', name: '消息' },
  { id: 'mine', name: '我的' },
])
const activeTabBar = ref('home')

// 方法
const handleGridClick = (item: any) => {
  // TODO: 实现类目点击
  console.log('grid item click:', item)
}

const handleQuickEntryClick = (item: any) => {
  // TODO: 实现快捷入口点击
  console.log('quick entry click:', item)
}

const handlePostClick = (post: any) => {
  // TODO: 实现帖子点击
  console.log('post click:', post)
}

const handleLike = (post: any) => {
  // TODO: 实现点赞
  console.log('like:', post.id)
}

const handleSearch = () => {
  // TODO: 实现搜索
  console.log('search')
}

const handleTabBarClick = (tab: any) => {
  // TODO: 实现 TabBar 切换
  activeTabBar.value = tab.id
}
</script>

<template>
  <PhoneMockup :has-dynamic-island="false">
    <!-- Header Area: Dark purple background -->
    <div class="bg-[#2b263b]">
      <!-- Status Bar -->
      <div class="px-8 pt-3 pb-2">
        <StatusBar time="9:41" color="white" type="iPhoneX" />
      </div>

      <!-- Navigation Bar -->
      <div class="px-3 pb-2 flex items-center gap-2">
        <!-- Logo -->
        <div class="w-8 h-8 bg-white/20 rounded flex items-center justify-center">
          <IconIslands />
        </div>

        <!-- Search Bar -->
        <SearchBar placeholder="Labubu泰坦" class="flex-1" @click="handleSearch">
          <template #left>
            <DuIcon name="search" :size="16" color="white/40" />
          </template>
          <template #right>
            <DuIcon name="camera" :size="16" color="white" />
            <span class="text-white text-b5 ml-1">识物</span>
          </template>
        </SearchBar>

        <!-- 发现岛按钮 -->
        <ButtonIcon label="发现岛" />
      </div>
    </div>

    <!-- Main Content Area: White background with rounded top -->
    <div class="bg-white rounded-t-[12px] px-3 pt-3 pb-0 flex flex-col gap-2">

      <!-- Category Grid -->
      <IslandsGrid>
        <IslandsGridBasic
          v-for="item in gridItems"
          :key="item.id"
          :name="item.name"
          :iconType="item.iconType"
          @click="handleGridClick(item)"
        />
      </IslandsGrid>

      <!-- Product Slide -->
      <IslandsSlide>
        <template v-for="item in slideItems" :key="item.id">
          <IslandsSlideBasic
            v-if="item.type === 'slide'"
            :name="item.name"
            :images="item.images"
            :tag="item.tag"
            :tagColor="item.tagColor"
            size="small"
          />
          <SPU
            v-else
            :name="item.name"
            :image="item.image"
            :tag="item.tag"
            :tagColor="item.tagColor"
            :wantCount="item.wantCount"
          />
        </template>
      </IslandsSlide>

      <!-- Quick Entry Grid -->
      <IslandsQuickEntry>
        <div class="flex gap-2 flex-wrap">
          <div
            v-for="item in quickEntryItems"
            :key="item.id"
            class="bg-[#f7f7f9] rounded-[8px] flex justify-between pt-2 pb-1 pl-2 pr-1.5 w-[105px] h-[62px]"
            @click="handleQuickEntryClick(item)"
          >
            <div class="flex flex-col gap-1.5 justify-center flex-1">
              <IslandsQuickEntryTitle />
              <IslandsQuickEntryInfo
                :subtitle="item.title"
                :price="item.price"
                :unit="item.priceUnit"
              />
            </div>
            <div class="rounded-[4px] w-[33px] h-[44px] bg-hex-cccccc" />
            <DuTag v-if="item.tag && item.tag.includes('%')" color="primary" size="small" round class="ml-0.5">
              {{ item.tag }}
            </DuTag>
            <DuTag v-else-if="item.tag" color="danger" size="small" round class="ml-0.5">
              {{ item.tag }}
            </DuTag>
          </div>
        </div>
      </IslandsQuickEntry>

      <!-- Feed Section -->
      <div class="px-2 pt-2 pb-4 bg-[#f7f7f9]">
        <div class="flex gap-2">
          <TabsBasic
            v-for="(tab, index) in feedTabs"
            :key="index"
            :active="index === activeTab"
            @click="activeTab = index"
          >
            {{ tab }}
          </TabsBasic>
        </div>

        <IslandsFeed class="mt-3">
          <IslandsFeedAd />
          <FeedPost
            v-for="post in feedPosts"
            :key="post.id"
            :content="post.content"
            :username="post.username"
            :avatar="post.avatar"
            :likeCount="post.likeCount"
            :image="post.image"
            :isVideo="post.isVideo"
            :tag="post.tag"
            @click="handlePostClick(post)"
            @like="handleLike(post)"
          />
        </IslandsFeed>
      </div>
    </div>

    <!-- IslandsPin -->
    <IslandsPin :tabs="tabBars" />

    <!-- Home Indicator - absolute at bottom of Screen -->
    <div class="absolute bottom-2 left-0 right-0 flex justify-center">
      <HomeIndicator theme="dark" />
    </div>
  </PhoneMockup>
</template>
