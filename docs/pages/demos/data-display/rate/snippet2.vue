
<template>
  <PreviewBlock title="medium Size" >
    <du-rate 
      size="medium"
    />
  </PreviewBlock>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DuRate, DuIcon } from '@frontend/dumpling'

const selectedTab = ref('all')
</script>
