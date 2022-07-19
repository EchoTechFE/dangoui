import { app } from '@storybook/vue3'
import ScrollView from '../components/ScrollView.vue'
import * as jest from 'jest-mock'
window.jest = jest

app.component('scroll-view', ScrollView)

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
