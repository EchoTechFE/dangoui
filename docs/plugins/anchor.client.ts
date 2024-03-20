export default defineNuxtPlugin(() => {
  window.addEventListener('click', (e): void => {
    if (e.target instanceof HTMLAnchorElement) {
      const href = e.target.getAttribute('href')
      if (href?.startsWith('#')) {
        e.preventDefault()
        const el = document.getElementById(href.slice(1))!
        const offset = el.getBoundingClientRect().top + window.scrollY
        window.scrollTo({
          top: offset - 64,
          behavior: 'smooth',
        })
      }
    }
  })
})
