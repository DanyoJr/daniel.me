<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '~/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <p :class="cn('text-sm leading-relaxed text-[#000000]/80 dark:text-[#FFFFFF]/80', props.class)">
    <slot />
  </p>
</template>
