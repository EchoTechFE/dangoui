
<template>
  <div class="min-h-screen bg-white">
    <div class="mb-16px">
      <DuNavigationBar share @share="handleShare">
        标题
        <template #right>
          <DuButton size="small" type="outline" color="default">按钮</DuButton>
        </template>
      </DuNavigationBar>
    </div>
    <div class="mb-16px">
      <DuNavigationBar share @share="handleShare">
        标题
        <template #right>
          <DuActionButton name="refresh" />
        </template>
      </DuNavigationBar>
    </div>
    <div class="mb-16px">
      <DuNavigationBar back-icon="room" @share="handleShare">
        左边是首页按钮
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
    <div class="mb-16px">
      <DuNavigationBar center>
        <DuTabs size="large" v-model:value="tab">
          <DuTab name="discovery">发现岛</DuTab>
          <DuTab name="joined">我的岛</DuTab>
        </DuTabs>
      </DuNavigationBar>
    </div>
    <div class="mb-16px">
      <DuNavigationBar center color="white">
        <DuTabs size="large" v-model:value="tab">
          <DuTab name="discovery">发现岛</DuTab>
          <DuTab name="joined">我的岛</DuTab>
        </DuTabs>
      </DuNavigationBar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DuNavigationBar, DuButton, DuSearch, DuIcon, DuDivider, DuTabs, DuTab, DuActionButton } from 'dangoui'

const placeholders = [
  'Molly',
  'Labubu',
  'Skullpanda'
]

const tab = ref('discovery')

function handleShare() {
  console.log('[demo] share')
}
</script>
