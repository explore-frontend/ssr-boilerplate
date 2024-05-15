<script setup lang="ts">
import { getCurrentInstance, onBeforeUnmount, onMounted } from 'vue'

import { LogParams } from '../../logs'

const props = defineProps<{
  log: LogParams
}>()
const instance = getCurrentInstance()

function sendClick() {
  console.log('发送了一个click埋点， 埋点参数是', props.log)
}

let clickElement: HTMLElement | null = null
// TODO还差v-if之类的处理

function getContentElements(el: Comment) {
  const elements: Array<ChildNode> = []
  let sibling = el.nextSibling
  while (true) {
    if (!sibling || (sibling.nodeType === 8 && (sibling as Comment).data === 'ClickLog End')) {
      break
    }
    elements.push(sibling)
    sibling = sibling.nextSibling
  }

  return elements.filter((el) => el.nodeType === 1) as HTMLElement[]
}

onMounted(() => {
  const elements = getContentElements(instance!.proxy!.$el)

  if (elements.length > 1) {
    console.error('The ClickLog component can only have one child element.')
    return
  }

  clickElement = elements[0]
  clickElement.addEventListener('click', sendClick)
})

onBeforeUnmount(() => {
  clickElement?.removeEventListener('click', sendClick)
})
</script>

<template>
  <!--ClickLog Start-->
  <slot />
  <!--ClickLog End-->
</template>
