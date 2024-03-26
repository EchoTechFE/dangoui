<template>
  <DuPopup
    :visible="open"
    @update:visible="handleUpdateOpen"
    type="bottom"
    :closable="false"
  >
    <div v-if="type === 'list'" class="du-action-sheet__list">
      <button
        v-for="item in items"
        :key="item.key || item.label"
        @click="handleSelect(item)"
        :open-type="item.openType || ''"
        class="du-action-sheet__list-item-wrapper"
      >
        <div class="du-action-sheet__list-item">{{ item.label }}</div>
        <DuDivider />
      </button>
      <div class="du-action-sheet__list-divider" />
      <div
        class="du-action-sheet__list-item du-action-sheet__list-item--cancel"
        @click="handleCancel"
      >
        取消
      </div>
    </div>
    <div v-else>
      <div class="du-action-sheet__grid-wrapper">
        <div class="du-action-sheet__grid">
          <button
            v-for="item in items"
            class="du-action-sheet__item"
            :open-type="item.openType || ''"
            :key="item.key || item.label"
            @click="handleSelect(item)"
          >
            <div class="du-action-sheet__icon" v-if="item.icon">
              <img
                class="du-action-sheet__icon-img"
                v-if="item.icon === 'wechat-colorful'"
                src="https://cdn.qiandaoapp.com/interior/images/89907468c5b858031ff03ba4492bbdc1.png"
              />
              <DuIcon v-else :name="item.icon" />
            </div>
            <div class="du-action-sheet__text">{{ item.label }}</div>
          </button>
        </div>
        <div class="du-action-sheet__divider">
          <DuDivider />
        </div>
        <div class="du-action-sheet__cacnel" @click="handleCancel">取消</div>
      </div>
    </div>
  </DuPopup>
</template>

<script setup lang="ts">
import DuPopup from '../popup/Popup.vue'
import DuDivider from '../divider/Divider.vue'
import DuIcon from '../icon/Icon.vue'

type ActionSheetItem = {
  key?: string
  label: string
  icon?: string
  /**
   * 小程序按钮的 open-type，比如 share
   */
  openType?: string
}

withDefaults(
  defineProps<{
    /**
     * 列表还是宫格
     */
    type: 'list' | 'grid'
    /**
     * 是否打开分享面板
     */
    open: boolean
    /**
     * 分享面板元素，`icon` 值可以是 `DuIcon` 中的所有图标，或者 `wechat-colorful`（彩色的微信图标）
     */
    items: ActionSheetItem[]
  }>(),
  {
    type: 'list',
    open: false,
  },
)

const emit = defineEmits<{
  /**
   * open 状态变化触发
   */
  (e: 'update:open', open: boolean): void
  (e: 'select', item: ActionSheetItem): void
}>()

function handleUpdateOpen(open: boolean) {
  emit('update:open', open)
}

function handleCancel() {
  emit('update:open', false)
}

function handleSelect(item: ActionSheetItem) {
  emit('select', item)
  emit('update:open', false)
}
</script>
