<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import {
  TooltipContent,
  TooltipPortal,
  useForwardPropsEmits
} from 'reka-ui'
import { cn } from '~/lib/utils'

defineOptions({
  inheritAttrs: false
})

interface Props {
  side?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number
  align?: 'start' | 'center' | 'end'
  alignOffset?: number
  avoidCollisions?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  sideOffset: 10
})

const emits = defineEmits<{
  escapeKeyDown: [event: KeyboardEvent]
  pointerDownOutside: [event: Event]
}>()
const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <TooltipPortal>
    <TooltipContent
      v-bind="{ ...forwarded, ...$attrs }"
      :class="
        cn(
          'z-50 overflow-hidden whitespace-nowrap rounded-xl border border-white/15 bg-[#000000]/95 px-2.5 py-1 text-xs font-medium text-[#FFFFFF] shadow-lg backdrop-blur-md transition-opacity duration-200',
          props.class
        )
      "
    >
      <slot />
    </TooltipContent>
  </TooltipPortal>
</template>
