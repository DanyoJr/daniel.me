<script setup lang="ts">
interface Props {
  variant?: 'default' | 'purple' | 'emerald'
}

withDefaults(defineProps<Props>(), {
  variant: 'default'
})
</script>

<template>
  <span
    class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide transition-colors border"
    :class="{
      'bg-white/40 dark:bg-white/10 text-slate-800 dark:text-slate-200 border-white/40 dark:border-white/15': variant === 'default',
      'bg-purple-600/25 dark:bg-purple-500/25 text-purple-800 dark:text-purple-200 border-purple-400/35': variant === 'purple',
      'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-400/30': variant === 'emerald'
    }"
  >
    <slot />
  </span>
</template>
