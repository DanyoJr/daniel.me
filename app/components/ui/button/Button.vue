<script setup lang="ts">
import type { HTMLAttributes, Component } from 'vue'
import { Primitive } from 'reka-ui'
import { cn } from '~/lib/utils'
import { buttonVariants, type ButtonVariants } from '.'

interface Props {
  as?: string | Component
  asChild?: boolean
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  class?: HTMLAttributes['class']
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
  asChild: false,
  variant: 'glass',
  size: 'default',
  type: 'button',
  disabled: false
})
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :type="as === 'button' ? type : undefined"
    :disabled="disabled"
    :class="cn(buttonVariants({ variant, size }), props.class)"
  >
    <slot />
  </Primitive>
</template>
