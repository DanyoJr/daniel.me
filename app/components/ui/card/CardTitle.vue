<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '~/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <h3 :class="cn('text-xl font-bold leading-none tracking-tight text-[#000000] dark:text-[#FFFFFF]', props.class)">
    <slot />
  </h3>
</template>
