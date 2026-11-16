<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '~/lib/utils'

interface SkeletonProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<SkeletonProps>()
</script>

<template>
  <div
    :class="cn('animate-pulse rounded-md bg-black/10 dark:bg-white/15', props.class)"
    aria-hidden="true"
  />
</template>
