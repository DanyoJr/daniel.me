<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '~/lib/utils'

interface Props {
  as?: string
  tint?: 'default' | 'sunny' | 'rainy' | 'purple' | 'subtle'
  interactive?: boolean
  rounded?: string
  padding?: string
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  as: 'div',
  tint: 'default',
  interactive: false,
  rounded: 'rounded-2xl',
  padding: '',
  className: ''
})

const tintClasses = computed(() => {
  switch (props.tint) {
    case 'sunny':
      return 'bg-[#FFFFFF]/85 dark:bg-[#0A0A0A]/85 shadow-sm border-black/15 dark:border-white/15'
    case 'rainy':
      return 'bg-[#FFFFFF]/80 dark:bg-[#0A0A0A]/85 shadow-sm border-black/15 dark:border-white/15'
    case 'purple':
      return 'bg-[#FE5101] hover:bg-[#FE5101]/90 text-[#FFFFFF] border-[#FE5101]'
    case 'subtle':
      return 'bg-[#FFFFFF]/70 dark:bg-[#0A0A0A]/75 shadow-sm border-black/10 dark:border-white/15'
    default:
      return 'bg-[#FFFFFF]/80 dark:bg-[#0A0A0A]/80 shadow-sm border-black/12 dark:border-white/15'
  }
})
</script>

<template>
  <component
    :is="as"
    :class="
      cn(
        'liquid-glass-surface relative overflow-hidden border transition-all duration-300',
        rounded,
        padding,
        tintClasses,
        interactive ? 'cursor-pointer' : '',
        className
      )
    "
  >
    <!-- Conteúdo interno -->
    <div class="relative z-10 h-full w-full">
      <slot />
    </div>
  </component>
</template>
