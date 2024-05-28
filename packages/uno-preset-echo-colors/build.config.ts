import { defineBuildConfig } from 'unbuild'
import { isWindows } from 'std-env'

export default defineBuildConfig({
  entries: ['src/index'],
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: true,
    dts: {
      respectExternal: false,
    },
  },
  failOnWarn: !isWindows,
})
