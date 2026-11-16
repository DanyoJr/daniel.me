<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import {
  PopoverContent,
  PopoverPortal,
  useForwardPropsEmits
} from 'reka-ui'
import LiquidGlass from '~/components/glass/LiquidGlass.vue'
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
  align: 'end',
  sideOffset: 10
})

const emits = defineEmits<{
  escapeKeyDown: [event: KeyboardEvent]
  pointerDownOutside: [event: Event]
  focusOutside: [event: Event]
  interactOutside: [event: Event]
}>()
const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <PopoverPortal>
    <PopoverContent
      v-bind="{ ...forwarded, ...$attrs }"
      :class="cn('z-50 w-64 outline-none', props.class)"
    >
      <LiquidGlass
        rounded="rounded-2xl"
        class-name="p-3.5 text-[#000000] dark:text-[#FFFFFF]"
      >
        <slot />
      </LiquidGlass>
    </PopoverContent>
  </PopoverPortal>
</template>
