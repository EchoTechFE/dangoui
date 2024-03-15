
<template>
  <DuProvider :themes="themes">
    <div></div>
  </DuProvider>
</template>

<script setup lang="ts">
import { DuProvider } from '@frontend/dumpling'

const themes = [
  {
    name: 'linjie',
    colors: {
      primary: {
        solidBg: '#fff',
        button: {
          solidBg: '#fff'
        }
      },
      secondary: {
        solidBg: '#000',
        button: {
          solidBg: '#000'
        }
      }
    }
  }
]
</script>
