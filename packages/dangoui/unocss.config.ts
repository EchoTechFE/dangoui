import { defineConfig } from 'unocss'
import presetEcho from 'unocss-preset-echo'

export default defineConfig({
  presets: [
    {
      ...presetEcho(),
      prefix: 'du-',
    },
  ],
  separators: ['-'],
})
