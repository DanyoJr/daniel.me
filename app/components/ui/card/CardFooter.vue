<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '~/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div :class="cn('mt-6 border-t border-black/15 pt-4 dark:border-white/15', props.class)">
    <slot />
  </div>
</template>
