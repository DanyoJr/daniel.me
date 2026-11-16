<script setup lang="ts">
import AppBackground from '~/components/layout/AppBackground.vue'
import TopRightControls from '~/components/layout/TopRightControls.vue'
import { useTheme } from '~/composables/useTheme'

// Inicializa o tema (Dark / Light)
useTheme()
</script>

<template>
  <div class="relative min-h-screen w-full text-[#000000] dark:text-[#FFFFFF]">
    <!-- Fundo Mesh / Ondas adaptável ao tema -->
    <AppBackground />

    <!-- Barra Superior (Mobile: Clima + Dock + Tema alinhados | Desktop: Dock lateral/topo + Clima/Tema à direita) -->
    <TopRightControls />

    <!-- Conteúdo das Páginas -->
    <main class="relative z-10 w-full">
      <slot />
    </main>
  </div>
</template>
