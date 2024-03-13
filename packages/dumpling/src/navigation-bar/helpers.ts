import { ref } from 'vue'
import { Ref } from 'vue'

const heightByPage = new WeakMap<object, Ref<number>>()
const height = ref(0)

function getHeightByPage(page: object) {
  if (!heightByPage.has(page)) {
    heightByPage.set(page, ref(0))
  }
  return heightByPage.get(page)!
}

export function setHeightByPage(value: number, page?: object) {
  if (__WEB__) {
    height.value = value
  }
  if (__UNI_PLATFORM__ !== 'h5') {
    if (getHeightByPage(page!).value !== value) {
      getHeightByPage(page!).value = value
    }
  }
}

export function useNavigationBarHeight(page?: object) {
  if (__WEB__) {
    return height
  }
  return getHeightByPage(page!)
}
