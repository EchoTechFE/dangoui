<template>
  <OverlayScrollbarsComponent
    :options="{
      scrollbars: { autoHide: 'leave', autoHideDelay: 100 },
      overflow: { x: 'scroll', y: 'scroll' },
    }"
  >
    <table class="w-full !table">
      <thead>
        <tr class="text-left">
          <th>变量名</th>
          <th>默认值</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in kvs" :key="item[0]">
          <td>{{ item[0] }}</td>
          <td>{{ item[1] }}</td>
        </tr>
      </tbody>
    </table>
  </OverlayScrollbarsComponent>
</template>

<script setup lang="ts">
import cssvars from 'dangoui/cssvars'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue'

const props = defineProps<{
  component?: string
}>()

const vars = props.component ? cssvars[props.component] : undefined

const kvs = Object.entries(vars ?? {})
</script>
