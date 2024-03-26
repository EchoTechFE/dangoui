<template>
  <PreviewBlock title="mini Size">
    <du-rate size="mini" />
  </PreviewBlock>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DuRate, DuIcon } from 'dangoui'

const selectedTab = ref('all')
</script>
