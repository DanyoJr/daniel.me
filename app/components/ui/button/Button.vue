<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'default' | 'glass' | 'purple' | 'ghost' | 'outline'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  as?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'glass',
  size: 'default',
  as: 'button',
  type: 'button',
  disabled: false
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'purple':
      return 'liquid-glass-surface bg-gradient-to-r from-violet-600/85 via-purple-600/80 to-indigo-600/85 hover:from-violet-500/95 hover:to-indigo-500/95 text-white border border-purple-300/35 shadow-[0_8px_28px_rgba(124,58,237,0.38)]'
    case 'outline':
      return 'liquid-glass-surface bg-white/30 dark:bg-white/5 hover:bg-white/50 dark:hover:bg-white/10 text-slate-900 dark:text-slate-100 border border-white/40 dark:border-white/15'
    case 'ghost':
      return 'bg-transparent hover:bg-white/25 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200'
    case 'default':
      return 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200'
    case 'glass':
    default:
      return 'liquid-glass-surface bg-white/55 dark:bg-slate-900/55 hover:bg-white/70 dark:hover:bg-slate-800/65 text-slate-900 dark:text-white border border-white/40 dark:border-white/15 shadow-[0_8px_28px_rgba(0,0,0,0.16)]'
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'h-9 px-3.5 text-xs rounded-xl'
    case 'lg':
      return 'h-12 px-7 text-base rounded-full'
    case 'icon':
      return 'h-11 w-11 rounded-2xl flex items-center justify-center p-0'
    default:
      return 'h-11 px-5 py-2.5 text-sm rounded-2xl'
  }
})
</script>

<template>
  <component
    :is="as"
    :type="as === 'button' ? type : undefined"
    :disabled="disabled"
    class="inline-flex items-center justify-center gap-2 font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 disabled:pointer-events-none disabled:opacity-50"
    :class="[variantClasses, sizeClasses]"
  >
    <slot />
  </component>
</template>
