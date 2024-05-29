<template>
  <DuPopup v-model:visible="_visible">

  </DuPopup>
</template>
<script lang="ts" setup>
import DuPopup from '../popup/Popup.vue'
import { ref } from 'vue'

const _visible = ref(false)

</script>
