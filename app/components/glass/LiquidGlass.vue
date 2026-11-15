<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  as?: string
  tint?: 'default' | 'sunny' | 'rainy' | 'purple' | 'subtle'
  interactive?: boolean
  rounded?: string
  padding?: string
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  as: 'div',
  tint: 'default',
  interactive: false,
  rounded: 'rounded-2xl',
  padding: '',
  className: ''
})

const mouseX = ref(50)
const mouseY = ref(50)
const isHovered = ref(false)

function handleMouseMove(e: MouseEvent) {
  if (!props.interactive) return
  const target = e.currentTarget as HTMLElement
  if (!target) return
  const rect = target.getBoundingClientRect()
  mouseX.value = ((e.clientX - rect.left) / rect.width) * 100
  mouseY.value = ((e.clientY - rect.top) / rect.height) * 100
}

const tintClasses = computed(() => {
  switch (props.tint) {
    case 'sunny':
      return 'bg-gradient-to-br from-amber-300/35 via-yellow-400/20 to-orange-400/25 dark:from-amber-400/25 dark:via-yellow-500/15 dark:to-orange-500/20 shadow-[0_8px_32px_rgba(245,158,11,0.22)] border-amber-300/40 dark:border-amber-300/30'
    case 'rainy':
      return 'bg-gradient-to-br from-slate-400/35 via-zinc-500/25 to-slate-600/30 dark:from-slate-700/45 dark:via-zinc-800/35 dark:to-slate-900/45 shadow-[0_8px_32px_rgba(71,85,105,0.28)] border-slate-300/35 dark:border-slate-500/30'
    case 'purple':
      return 'bg-gradient-to-r from-violet-600/80 via-purple-600/75 to-indigo-600/80 hover:from-violet-500/90 hover:to-indigo-500/90 text-white shadow-[0_8px_28px_rgba(124,58,237,0.38)] border-purple-300/35'
    case 'subtle':
      return 'bg-white/40 dark:bg-slate-900/45 shadow-[0_4px_24px_rgba(0,0,0,0.12)] border-white/30 dark:border-white/10'
    default:
      return 'bg-white/55 dark:bg-slate-900/50 shadow-[0_12px_40px_rgba(0,0,0,0.18)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.42)] border-white/40 dark:border-white/15'
  }
})

const spotlightStyle = computed(() => {
  if (!props.interactive || !isHovered.value) return { opacity: 0 }
  return {
    opacity: 1,
    background: `radial-gradient(280px circle at ${mouseX.value}% ${mouseY.value}%, rgba(255, 255, 255, 0.22), transparent 70%)`
  }
})
</script>

<template>
  <component
    :is="as"
    class="liquid-glass-surface relative overflow-hidden border transition-all duration-300"
    :class="[rounded, padding, tintClasses, interactive ? 'cursor-pointer' : '', className]"
    @mousemove="handleMouseMove"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- Camada de refração especular superior estilo Liquid Glass -->
    <div
      class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 dark:via-white/35 to-transparent"
    />

    <!-- Brilho dinâmico acompanhando o cursor quando interativo -->
    <div
      v-if="interactive"
      class="pointer-events-none absolute inset-0 transition-opacity duration-300"
      :style="spotlightStyle"
    />

    <!-- Conteúdo interno -->
    <div class="relative z-10 h-full w-full">
      <slot />
    </div>
  </component>
</template>
