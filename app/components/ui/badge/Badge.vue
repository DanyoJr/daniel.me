<script setup lang="ts">
import type { HTMLAttributes, Component } from 'vue'
import { Primitive } from 'reka-ui'
import { cn } from '~/lib/utils'
import { badgeVariants, type BadgeVariants } from '.'

interface Props {
  as?: string | Component
  asChild?: boolean
  variant?: BadgeVariants['variant']
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  as: 'span',
  asChild: false,
  variant: 'default'
})
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :class="cn(badgeVariants({ variant }), props.class)"
  >
    <slot />
  </Primitive>
</template>
