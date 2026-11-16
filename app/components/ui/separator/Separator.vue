<script setup lang="ts">
import type { HTMLAttributes, Component } from 'vue'
import { Separator } from 'reka-ui'
import { cn } from '~/lib/utils'

interface Props {
  as?: string | Component
  asChild?: boolean
  orientation?: 'horizontal' | 'vertical'
  decorative?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  orientation: 'horizontal',
  decorative: true
})
</script>

<template>
  <Separator
    :as="props.as"
    :as-child="props.asChild"
    :orientation="props.orientation"
    :decorative="props.decorative"
    :class="
      cn(
        'shrink-0 bg-black/10 dark:bg-white/15',
        props.orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        props.class
      )
    "
  />
</template>
