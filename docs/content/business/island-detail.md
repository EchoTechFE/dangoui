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

### 业务组件

| 组件 | 文件路径 | 说明 |
|------|---------|------|
| `IslandDetail` | `business/IslandDetail.vue` | 岛详情主页面 |
| `IslandsGrid` | `business/IslandsGrid.vue` | 类目入口网格容器 |
| `IslandsGridBasic` | `business/IslandsGridBasic.vue` | 类目入口单项 |
| `IslandsSlide` | `business/IslandsSlide.vue` | 横向滑动商品容器 |
| `IslandsSlideBasic` | `business/IslandsSlideBasic.vue` | 横向滑动商品单项 |
| `IslandsQuickEntry` | `business/IslandsQuickEntry.vue` | 快捷入口网格容器 |
| `IslandsQuickEntryTitle` | `business/IslandsQuickEntryTitle.vue` | 快捷入口标题/图标 |
| `IslandsQuickEntryInfo` | `business/IslandsQuickEntryInfo.vue` | 快捷入口价格信息 |
| `IslandsFeed` | `business/IslandsFeed.vue` | 内容 Feed 流容器 |
| `IslandsFeedAd` | `business/IslandsFeedAd.vue` | Feed 广告卡片 |
| `FeedPost` | `business/FeedPost.vue` | Feed 帖子卡片 |
| `IslandsPin` | `business/IslandsPin.vue` | 底部 TabBar 容器 |
| `IslandsPinBasic` | `business/IslandsPinBasic.vue` | TabBar 单项 |
| `IslandsHeader` | `business/IslandsHeader.vue` | 顶部导航栏容器 |
| `SPU` | `business/SPU.vue` | 商品卡片 |
| `SPUBasic` | `business/SPUBasic.vue` | 商品图片叠层 |

### 公共组件

| 组件 | 文件路径 | 说明 |
|------|---------|------|
| `StatusBar` | `business/StatusBar.vue` | 状态栏 |
| `NavigationBar` | `business/NavigationBar.vue` | 导航栏 |
| `SearchBar` | `business/SearchBar.vue` | 搜索栏 |
| `ButtonIcon` | `business/ButtonIcon.vue` | 图标按钮 |
| `IconIslands` | `business/IconIslands.vue` | 岛屿 Logo |
| `HomeIndicator` | `business/HomeIndicator.vue` | 主页指示器 |
| `TabsBasic` | `business/TabsBasic.vue` | Tab 标签 |
| `UserIsland` | `business/UserIsland.vue` | 用户岛屿信息 |
