export default defineNuxtPlugin(() => {
  const route = useRoute()
  const log = console.log
  console.log = (...args: any[]) => {
    log.apply(console, args)
    if (route.path.startsWith('/demos')) {
      window.parent.postMessage({ type: 'log', message: args.join(' ') }, '*')
    }
  }
})
