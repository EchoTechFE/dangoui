<script setup lang="ts">
// IslandDetail - 岛详情页面
// figma-node: 14202:599741
import { ref } from 'vue'
import { DuTag, DuIcon } from 'dangoui'

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
import SPU from './SPU.vue'

// 顶部类目数据
const gridItems = ref([
  { id: 'tujian', name: '图鉴', iconType: 'emoji' as const },
  { id: 'juesen', name: '角色', iconType: 'image' as const },
  { id: 'chaowan', name: '潮玩系列', iconType: 'spu' as const },
  { id: 'chaowan2', name: '潮玩', iconType: 'spu' as const },
])

// 横向滑动商品数据
const slideItems = ref([
  { id: '1', name: '最新款式', type: 'slide', images: ['', '', ''], tag: '+36', tagColor: 'danger' },
  { id: '2', name: 'Spu Name', type: 'spu', image: '', tag: 'NEW', tagColor: 'primary', wantCount: '{n}' },
  { id: '3', name: 'Spu Name', type: 'spu', image: '', wantCount: '{n}' },
  { id: '4', name: 'Spu Name', type: 'spu', image: '', wantCount: '{n}' },
  { id: '5', name: 'Spu Name', type: 'spu', image: '', wantCount: '{n}' },
])

// 快捷入口数据
const quickEntryItems = ref([
  { id: '1', title: 'Mega宇航员', price: '59', unit: '.99', tag: '领券' },
  { id: '2', title: 'Mega宇航员', price: '59', tag: '0.8%' },
  { id: '3', title: '剩22时30分', price: '59', unit: '.99' },
  { id: '4', title: '剩22/99款', price: '59', unit: '.99' },
])

// Feed 流数据
const feedTabs = ref(['推荐', '最新', '未选'])
const activeTab = ref(0)
const feedPosts = ref([
  { id: '1', content: '留作纪念！', username: 'JocelynTong✨', likeCount: 784, isVideo: true },
  { id: '2', content: '留作纪念！', username: 'JocelynTong✨', likeCount: 784, isVideo: true, tag: '首发' },
  { id: '3', content: '留作纪念！', username: 'JocelynTong✨', likeCount: 8493, isVideo: false },
])

// TabBar 数据
const tabBars = ref([
  { id: 'home', name: '首页', icon: 'home' },
  { id: 'discovery', name: '发现', icon: 'compass' },
  { id: 'publish', name: '发布', icon: 'plus' },
  { id: 'message', name: '消息', icon: 'message' },
  { id: 'mine', name: '我的', icon: 'user' },
])
const activeTabBar = ref('home')

// 方法
const handleGridClick = (item: any) => {
  console.log('grid item click:', item)
}

const handleQuickEntryClick = (item: any) => {
  console.log('quick entry click:', item)
}

const handlePostClick = (post: any) => {
  console.log('post click:', post)
}

const handleLike = (post: any) => {
  console.log('like:', post.id)
}

const handleSearch = () => {
  console.log('search')
}

const handleTabBarClick = (tab: any) => {
  activeTabBar.value = tab.id
}
</script>

<template>
  <!-- figma-node: 14202:599741 - island-detail -->
  <div class="bg-[#2b263b] w-full min-h-screen flex flex-col">

    <!-- 顶部导航栏 -->
    <IslandsHeader>
      <StatusBar time="9:41" color="white" />
      <NavigationBar>
        <IconIslands />
        <SearchBar placeholder="Labubu泰坦" class="flex-1" @click="handleSearch">
          <template #left>
            <DuIcon name="search" :size="16" color="white/40" />
          </template>
          <template #right>
            <DuIcon name="camera" :size="16" color="white" />
            <span class="text-white text-[12px] ml-1">识物</span>
          </template>
        </SearchBar>
        <ButtonIcon label="发现岛" />
      </NavigationBar>
    </IslandsHeader>

    <!-- 内容区域 -->
    <div class="bg-white rounded-t-[12px] flex-1 flex flex-col gap-[8px] px-[12px] pt-[12px] pb-[12px] overflow-auto">

      <!-- 顶部类目入口 -->
      <IslandsGrid>
        <IslandsGridBasic
          v-for="item in gridItems"
          :key="item.id"
          :name="item.name"
          :iconType="item.iconType"
          @click="handleGridClick(item)"
        />
      </IslandsGrid>

      <!-- 横向滑动商品 -->
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

      <!-- 快捷入口网格 -->
      <IslandsQuickEntry>
        <div class="flex gap-[8px] flex-wrap">
          <div
            v-for="item in quickEntryItems"
            :key="item.id"
            class="bg-[#f7f7f9] rounded-[8px] flex justify-between pt-[8px] pb-[4px] pl-[8px] pr-[6px] w-[105px] h-[62px]"
            @click="handleQuickEntryClick(item)"
          >
            <div class="flex flex-col gap-[6px] justify-center flex-1">
              <IslandsQuickEntryTitle />
              <IslandsQuickEntryInfo
                :subtitle="item.title"
                :price="item.price"
                :unit="item.unit"
              />
            </div>
            <div class="rounded-[4px] w-[33px] h-[44px] bg-hex-cccccc" />
            <DuTag v-if="item.tag && item.tag.includes('%')" color="primary" size="small" round class="ml-1">
              {{ item.tag }}
            </DuTag>
            <DuTag v-else-if="item.tag" color="danger" size="small" round class="ml-1">
              {{ item.tag }}
            </DuTag>
          </div>
        </div>
      </IslandsQuickEntry>

      <!-- Feed 流 -->
      <IslandsFeed>
        <div class="flex gap-[8px]">
          <TabsBasic
            v-for="(tab, index) in feedTabs"
            :key="index"
            :active="index === activeTab"
            @click="activeTab = index"
          >
            {{ tab }}
          </TabsBasic>
        </div>

        <div class="flex gap-[8px] mt-[12px]">
          <div class="flex flex-col gap-[8px] w-full">
            <IslandsFeedAd />
            <FeedPost
              v-for="post in feedPosts"
              :key="post.id"
              :content="post.content"
              :username="post.username"
              :likeCount="post.likeCount"
              :isVideo="post.isVideo"
              :tag="post.tag"
              @click="handlePostClick(post)"
              @like="handleLike(post)"
            />
          </div>
        </div>
      </IslandsFeed>
    </div>

    <!-- 底部 TabBar -->
    <IslandsPin>
      <IslandsPinBasic
        v-for="tab in tabBars"
        :key="tab.id"
        :name="tab.name"
        :icon="tab.icon"
        :active="activeTabBar === tab.id"
        @click="handleTabBarClick(tab)"
      />
    </IslandsPin>
  </div>
</template>
