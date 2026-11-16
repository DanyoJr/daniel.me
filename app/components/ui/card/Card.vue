<script setup lang="ts">
import type { HTMLAttributes, Component } from 'vue'
import { Primitive } from 'reka-ui'
import LiquidGlass from '~/components/glass/LiquidGlass.vue'
import { cn } from '~/lib/utils'

interface Props {
  as?: string | Component
  asChild?: boolean
  tint?: 'default' | 'sunny' | 'rainy' | 'purple' | 'subtle' | 'solid'
  interactive?: boolean
  rounded?: string
  className?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  as: 'div',
  asChild: false,
  tint: 'default',
  interactive: false,
  rounded: 'rounded-xl',
  className: ''
})
</script>

<template>
  <Primitive
    v-if="tint === 'solid'"
    :as="as"
    :as-child="asChild"
    :class="cn('w-full rounded-xl border border-black/15 bg-[#FFFFFF] shadow-2xl dark:border-white/15 dark:bg-[#0A0A0A]', rounded, className, props.class)"
  >
    <slot />
  </Primitive>
  <LiquidGlass
    v-else
    :as="as as string"
    :tint="tint"
    :interactive="interactive"
    :rounded="rounded"
    :class-name="cn(className, props.class)"
  >
    <slot />
  </LiquidGlass>
</template>
