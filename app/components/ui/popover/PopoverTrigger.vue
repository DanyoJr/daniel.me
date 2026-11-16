<script setup lang="ts">
import type { Component } from 'vue'
import { PopoverTrigger } from 'reka-ui'

interface Props {
  as?: string | Component
  asChild?: boolean
}

const props = defineProps<Props>()
</script>

<template>
  <PopoverTrigger v-bind="props">
    <slot />
  </PopoverTrigger>
</template>
