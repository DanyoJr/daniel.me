<script setup lang="ts">
import type { Component } from 'vue'
import { TooltipTrigger } from 'reka-ui'

interface Props {
  as?: string | Component
  asChild?: boolean
}

const props = defineProps<Props>()
</script>

<template>
  <TooltipTrigger v-bind="props">
    <slot />
  </TooltipTrigger>
</template>
