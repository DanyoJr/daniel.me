<script setup lang="ts">
import LiquidGlass from '~/components/glass/LiquidGlass.vue'

interface Props {
  tint?: 'default' | 'sunny' | 'rainy' | 'purple' | 'subtle'
  interactive?: boolean
  rounded?: string
  className?: string
}

withDefaults(defineProps<Props>(), {
  tint: 'default',
  interactive: false,
  rounded: 'rounded-3xl',
  className: ''
})
</script>

<template>
  <LiquidGlass
    :tint="tint"
    :interactive="interactive"
    :rounded="rounded"
    :class-name="className"
  >
    <slot />
  </LiquidGlass>
</template>
